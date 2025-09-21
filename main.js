require("dotenv").config();
const { AptosClient, Types } = require("@aptos-labs/ts-sdk");

const NODE_URL = process.env.APTOS_NODE_URL;
if (!NODE_URL) {
  console.error("APTOS_NODE_URL is not set");
  process.exit(1);
}

const client = new AptosClient(NODE_URL);

const MODULE_ADDRESS = "<PERPS_CONTRACT_ADDRESS>";
const MODULE_NAME = "perps";
const FUNCTION_NAME = "get_funding_rate";
const TRADE_PAIR = "APT/USD";

async function main() {
  try {
    const fundingRate = await client.view({
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::${FUNCTION_NAME}`,
      type_arguments: [],
      arguments: [TRADE_PAIR],
    });

    console.log(`${TRADE_PAIR} funding rate:`, fundingRate);
  } catch (err) {
    console.error("view function error:", err);
  }
}

main();
