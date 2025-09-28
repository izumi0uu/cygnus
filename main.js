const AdvancedArbitrageBot = require("./arbitrage-bot");
const { ARBITRAGE_CONFIG } = require("./config");

const arbitrageBot = new AdvancedArbitrageBot();

async function main() {
  try {
    console.log(
      `   - minimum profit threshold: ${
        ARBITRAGE_CONFIG.minProfitThreshold * 100
      }%`
    );
    console.log(`   - maximum slippage: ${ARBITRAGE_CONFIG.maxSlippage}%`);
    console.log(
      `   - monitoring interval: ${ARBITRAGE_CONFIG.monitoringInterval}ms`
    );
    console.log(
      `   - monitoring trading pairs: ${
        ARBITRAGE_CONFIG.tokenPairs.filter((p) => p.enabled).length
      } pairs`
    );
    console.log(
      `   - maximum daily loss: ${ARBITRAGE_CONFIG.riskManagement.maxDailyLoss} APT`
    );

    await arbitrageBot.start();
  } catch (error) {
    console.error("Failed to start arbitrage robot:", error.message);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\n\nReceived shutdown signal...");
  arbitrageBot.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\nReceived termination signal...");
  arbitrageBot.stop();
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("\n\nUncaught exception:", error);
  arbitrageBot.stop();
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n\nUnhandled promise rejection:", reason);
  arbitrageBot.stop();
  process.exit(1);
});

main();
