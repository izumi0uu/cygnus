const {
  SwapAggregator,
  Environment,
  NetworkId,
} = require("@kanalabs/aggregator");
const {
  Account,
  AccountAddress,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} = require("@aptos-labs/ts-sdk");
const fs = require("fs");
const path = require("path");
const { ARBITRAGE_CONFIG, APTOS_CONFIG, KANA_CONFIG } = require("./config");

class AdvancedArbitrageBot {
  constructor() {
    this.isRunning = false;
    this.priceHistory = new Map();
    this.tradeHistory = [];
    this.dailyStats = {
      trades: 0,
      profit: 0,
      loss: 0,
      startTime: Date.now(),
    };
    this.riskLimits = {
      dailyLoss: 0,
      positionSize: 0,
    };

    this.initializeProviders();
    this.setupLogging();
  }

  // 初始化提供者和签名器
  initializeProviders() {
    try {
      // 初始化 Aptos 签名器
      this.aptosSigner = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(process.env.APTOS_PRIVATEKEY),
        address: AccountAddress.from(process.env.APTOS_ADDRESS),
        legacy: true,
      });

      // 初始化 Aptos 提供者
      const aptosConfig = new AptosConfig({
        network:
          APTOS_CONFIG.network === "mainnet"
            ? Network.MAINNET
            : Network.TESTNET,
      });
      this.aptosProvider = new Aptos(aptosConfig);

      // 初始化 Kana 聚合器
      this.swapAggregator = new SwapAggregator(
        KANA_CONFIG.environment === "production"
          ? Environment.production
          : Environment.testnet,
        {
          providers: {
            aptos: this.aptosProvider,
          },
          signers: {
            aptos: this.aptosSigner,
          },
        }
      );

      this.log("info", "✅ 提供者和签名器初始化成功");
    } catch (error) {
      this.log("error", `❌ 初始化失败: ${error.message}`);
      throw error;
    }
  }

  // 设置日志系统
  setupLogging() {
    const logDir = path.dirname(ARBITRAGE_CONFIG.logging.file);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  // 日志记录
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    console.log(logMessage);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }

    // 写入日志文件
    if (
      ARBITRAGE_CONFIG.logging.level === "debug" ||
      level === "error" ||
      level === "warn"
    ) {
      fs.appendFileSync(ARBITRAGE_CONFIG.logging.file, logMessage + "\n");
    }
  }

  // 获取账户余额
  async getAccountBalance(tokenAddress = "0x1::aptos_coin::AptosCoin") {
    try {
      const resources = await this.aptosProvider.getAccountResources({
        accountAddress: this.aptosSigner.accountAddress,
      });

      const coinResource = resources.find((r) => r.type === tokenAddress);

      if (coinResource) {
        return coinResource.data.coin.value;
      }
      return "0";
    } catch (error) {
      this.log("error", `获取余额失败: ${error.message}`);
      return "0";
    }
  }

  // 获取代币价格报价
  async getTokenQuote(inputToken, outputToken, amount) {
    try {
      const quotes = await this.swapAggregator.swapQuotes({
        apiKey: KANA_CONFIG.apiKey,
        inputToken,
        outputToken,
        amountIn: amount,
        slippage: ARBITRAGE_CONFIG.maxSlippage,
        network: NetworkId.aptos,
      });

      if (quotes.data && quotes.data.length > 0) {
        return quotes.data[0]; // 返回最佳报价
      }
      return null;
    } catch (error) {
      this.log(
        "error",
        `获取报价失败 ${inputToken} -> ${outputToken}: ${error.message}`
      );
      return null;
    }
  }

  // 计算套利机会
  calculateArbitrageOpportunity(quote1, quote2, pairInfo) {
    if (!quote1 || !quote2) return null;

    const price1 = parseFloat(quote1.amountOut) / parseFloat(quote1.amountIn);
    const price2 = parseFloat(quote2.amountOut) / parseFloat(quote2.amountIn);

    const priceDifference = Math.abs(price1 - price2);
    const avgPrice = (price1 + price2) / 2;
    const profitPercentage = (priceDifference / avgPrice) * 100;

    // 计算预期利润
    const tradeAmount = parseFloat(pairInfo.testAmount) / 1e8; // 转换为 APT
    const expectedProfit = (profitPercentage / 100) * tradeAmount;

    return {
      price1,
      price2,
      priceDifference,
      profitPercentage,
      expectedProfit,
      profitable: profitPercentage > ARBITRAGE_CONFIG.minProfitThreshold * 100,
      tradeAmount,
      timestamp: Date.now(),
    };
  }

  // 风险检查
  async performRiskCheck(opportunity) {
    // 检查日亏损限制
    if (
      this.riskLimits.dailyLoss >= ARBITRAGE_CONFIG.riskManagement.maxDailyLoss
    ) {
      this.log("warn", "⚠️ 达到日亏损限制，停止交易");
      return false;
    }

    // 检查持仓大小
    const currentBalance = await this.getAccountBalance();
    const balanceInAPT = parseFloat(currentBalance) / 1e8;

    if (balanceInAPT > ARBITRAGE_CONFIG.riskManagement.maxPositionSize) {
      this.log("warn", "⚠️ 持仓过大，跳过交易");
      return false;
    }

    // 检查预期利润是否足够
    if (opportunity.expectedProfit < 0.01) {
      // 最小利润 0.01 APT
      this.log("debug", "利润太小，跳过交易");
      return false;
    }

    return true;
  }

  // 执行套利交易
  async executeArbitrageTrade(quote, pairInfo, opportunity) {
    try {
      // 风险检查
      const riskCheckPassed = await this.performRiskCheck(opportunity);
      if (!riskCheckPassed) {
        return null;
      }

      this.log("info", `🚀 执行套利交易: ${pairInfo.symbol}`);
      this.log(
        "info",
        `预期利润: ${opportunity.expectedProfit.toFixed(
          4
        )} APT (${opportunity.profitPercentage.toFixed(2)}%)`
      );

      const transactionHash = await this.swapAggregator.executeSwapInstruction({
        apiKey: KANA_CONFIG.apiKey,
        quote: quote,
        address: this.aptosSigner.accountAddress.toString(),
      });

      const trade = {
        timestamp: Date.now(),
        pair: pairInfo.symbol,
        hash: transactionHash,
        quote: quote,
        opportunity: opportunity,
        status: "executed",
      };

      this.tradeHistory.push(trade);
      this.dailyStats.trades++;

      this.log("info", `✅ 交易成功执行! 哈希: ${transactionHash}`, trade);
      return transactionHash;
    } catch (error) {
      this.log("error", `❌ 交易执行失败: ${error.message}`);

      const failedTrade = {
        timestamp: Date.now(),
        pair: pairInfo.symbol,
        error: error.message,
        status: "failed",
      };

      this.tradeHistory.push(failedTrade);
      return null;
    }
  }

  // 监控套利机会
  async monitorArbitrageOpportunities() {
    this.log("debug", "🔍 开始监控套利机会...");

    for (const pair of ARBITRAGE_CONFIG.tokenPairs.filter((p) => p.enabled)) {
      try {
        // 获取正向报价 (A -> B)
        const quoteAB = await this.getTokenQuote(
          pair.input,
          pair.output,
          pair.testAmount
        );

        // 获取反向报价 (B -> A)
        const quoteBA = await this.getTokenQuote(
          pair.output,
          pair.input,
          quoteAB ? quoteAB.amountOut : pair.testAmount
        );

        if (quoteAB && quoteBA) {
          const opportunity = this.calculateArbitrageOpportunity(
            quoteAB,
            quoteBA,
            pair
          );

          if (opportunity) {
            this.log("debug", `📊 ${pair.symbol} 价格分析:`, {
              price1: opportunity.price1.toFixed(6),
              price2: opportunity.price2.toFixed(6),
              profitPercentage: `${opportunity.profitPercentage.toFixed(2)}%`,
              expectedProfit: `${opportunity.expectedProfit.toFixed(4)} APT`,
            });

            if (opportunity.profitable) {
              this.log(
                "info",
                `💰 发现套利机会! ${
                  pair.symbol
                } 利润: ${opportunity.profitPercentage.toFixed(2)}%`
              );

              // 选择更好的报价执行交易
              const betterQuote =
                opportunity.price1 > opportunity.price2 ? quoteAB : quoteBA;
              await this.executeArbitrageTrade(betterQuote, pair, opportunity);
            }
          }
        }
      } catch (error) {
        this.log("error", `监控 ${pair.symbol} 时出错: ${error.message}`);
      }
    }
  }

  // 获取机器人状态
  getStatus() {
    return {
      isRunning: this.isRunning,
      dailyStats: this.dailyStats,
      riskLimits: this.riskLimits,
      lastTrades: this.tradeHistory.slice(-5), // 最近5笔交易
      config: ARBITRAGE_CONFIG,
    };
  }

  // 启动机器人
  async start() {
    if (this.isRunning) {
      this.log("warn", "机器人已在运行中");
      return;
    }

    this.isRunning = true;
    this.dailyStats.startTime = Date.now();

    this.log("info", "🤖 Aptos 高级套利机器人启动!");
    this.log(
      "info",
      `配置: 最小利润阈值 ${ARBITRAGE_CONFIG.minProfitThreshold * 100}%`
    );
    this.log("info", `监控间隔: ${ARBITRAGE_CONFIG.monitoringInterval}ms`);
    this.log(
      "info",
      `最大日亏损: ${ARBITRAGE_CONFIG.riskManagement.maxDailyLoss} APT`
    );

    // 获取初始余额
    const initialBalance = await this.getAccountBalance();
    this.log(
      "info",
      `初始 APT 余额: ${(parseFloat(initialBalance) / 1e8).toFixed(4)} APT`
    );

    // 开始监控循环
    const monitor = async () => {
      if (!this.isRunning) return;

      try {
        await this.monitorArbitrageOpportunities();
      } catch (error) {
        this.log("error", `监控循环出错: ${error.message}`);
      }

      setTimeout(monitor, ARBITRAGE_CONFIG.monitoringInterval);
    };

    monitor();
  }

  // 停止机器人
  stop() {
    this.isRunning = false;
    this.log("info", "🛑 套利机器人已停止");

    // 输出日统计
    const runtime = (Date.now() - this.dailyStats.startTime) / 1000 / 60; // 分钟
    this.log("info", `📊 运行统计:`, {
      runtime: `${runtime.toFixed(2)} 分钟`,
      trades: this.dailyStats.trades,
      profit: `${this.dailyStats.profit.toFixed(4)} APT`,
      loss: `${this.dailyStats.loss.toFixed(4)} APT`,
    });
  }
}

module.exports = AdvancedArbitrageBot;
