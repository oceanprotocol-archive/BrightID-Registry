const hre = require("hardhat");

const CONTEXT =
  "0x4f6365616e44414f000000000000000000000000000000000000000000000000";
const VERIFIER = "0xb1d71F62bEe34E9Fc349234C201090c33BCdF6DB";

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
