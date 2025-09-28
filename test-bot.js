const AdvancedArbitrageBot = require("./arbitrage-bot");
const { ARBITRAGE_CONFIG } = require("./config");

async function testArbitrageBot() {
  console.log("🧪 Starting test arbitrage robot...");

  try {
    const bot = new AdvancedArbitrageBot();

    console.log(JSON.stringify(ARBITRAGE_CONFIG, null, 2));

    console.log("\nTesting account balance...");
    const balance = await bot.getAccountBalance();
    console.log(`APT balance: ${(parseFloat(balance) / 1e8).toFixed(4)} APT`);

    console.log("\nTesting token quote...");
    const testPair = ARBITRAGE_CONFIG.tokenPairs[0];

    const quote = await bot.getTokenQuote(
      testPair.input,
      testPair.output,
      testPair.testAmount
    );

    if (quote) {
      console.log(`Successfully got ${testPair.symbol} quote:`);
      console.log(`    input: ${quote.amountIn}`);
      console.log(`    output: ${quote.amountOut}`);
      console.log(
        `    price: ${(
          parseFloat(quote.amountOut) / parseFloat(quote.amountIn)
        ).toFixed(6)}`
      );
    } else {
      console.log("Failed to get quote");
    }

    console.log("\nTesting robot status...");
    const status = bot.getStatus();
    console.log("Robot status:", JSON.stringify(status, null, 2));

    console.log("\nTest completed!");
  } catch (error) {
    console.error("Test failed:", error.message);
    console.error(error.stack);
  }
}

// Run the test
testArbitrageBot();
