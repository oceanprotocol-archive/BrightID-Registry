const hre = require("hardhat");

const CONTEXT =
  "0x4f6365616e44414f000000000000000000000000000000000000000000000000";
const VERIFIER = "0x94B805Ab1bd2028A67cD11288042bECb1E2bd531";

async function main() {
  let brightIdUserRegistry = await (
    await ethers.getContractFactory("BrightIdUserRegistry")
  ).deploy(CONTEXT, VERIFIER);

  await brightIdUserRegistry.deployed();

  console.log("Registry deployed to:", brightIdUserRegistry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
