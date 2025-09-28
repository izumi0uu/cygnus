require("dotenv").config();

const ARBITRAGE_CONFIG = {
  minProfitThreshold: parseFloat(process.env.MIN_PROFIT_THRESHOLD) || 0.02,
  maxSlippage: parseFloat(process.env.MAX_SLIPPAGE) || 1.0,
  maxTradeAmount: parseFloat(process.env.MAX_TRADE_AMOUNT) || 10.0,

  monitoringInterval: parseInt(process.env.MONITORING_INTERVAL) || 5000,
  maxConcurrentTrades: parseInt(process.env.MAX_CONCURRENT_TRADES) || 3,

  tokenPairs: [
    {
      input: "0x1::aptos_coin::AptosCoin", // APT
      output:
        "0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD", // MOD
      symbol: "APT/MOD",
      testAmount: "1000000", // 1 APT (8 decimals)
      enabled: true,
    },
    {
      input: "0x1::aptos_coin::AptosCoin", // APT
      output:
        "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T", // LayerZero T
      symbol: "APT/T",
      testAmount: "1000000", // 1 APT
      enabled: true,
    },
  ],

  riskManagement: {
    maxDailyLoss: parseFloat(process.env.MAX_DAILY_LOSS) || 50.0, // max daily loss (APT)
    maxPositionSize: parseFloat(process.env.MAX_POSITION_SIZE) || 100.0, // max position size (APT)
    stopLossPercentage: parseFloat(process.env.STOP_LOSS_PERCENTAGE) || 5.0, // 止损百分比
  },

  notifications: {
    webhook: process.env.WEBHOOK_URL || null,
    email: process.env.NOTIFICATION_EMAIL || null,
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "arbitrage-bot.log",
    maxSize: process.env.LOG_MAX_SIZE || "10MB",
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
  },
};

const requiredEnvVars = ["APTOS_PRIVATEKEY", "APTOS_ADDRESS", "KANA_API_KEY"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("\nPlease create a .env file and set these variables");
  process.exit(1);
}

const APTOS_CONFIG = {
  network: process.env.APTOS_NETWORK || "mainnet",
  nodeUrl:
    process.env.APTOS_NODE_URL || "https://fullnode.mainnet.aptoslabs.com/v1",
  faucetUrl:
    process.env.APTOS_FAUCET_URL || "https://faucet.mainnet.aptoslabs.com",
};

const KANA_CONFIG = {
  apiKey: process.env.KANA_API_KEY,
  environment: process.env.KANA_ENVIRONMENT || "production", // 'testnet' 或 'production'
  timeout: parseInt(process.env.KANA_TIMEOUT) || 30000, // 30秒超时
};

module.exports = {
  ARBITRAGE_CONFIG,
  APTOS_CONFIG,
  KANA_CONFIG,
};
