const hre = require("hardhat");
const { Wallet } = require("ethers");
const ethers = hre.ethers;
require("dotenv").config();


const CONTEXT =
  "0x4f6365616e44414f000000000000000000000000000000000000000000000000";
const VERIFIER = "0xb1d71F62bEe34E9Fc349234C201090c33BCdF6DB";

async function main() {
  const url = process.env.NETWORK_RPC_URL;
  console.log(url);
  if (!url) {
    console.error("Missing NETWORK_RPC_URL. Aborting..");
    return null;
  }
  const provider = new ethers.providers.JsonRpcProvider(url);
  const network = provider.getNetwork();
  // utils
  const networkDetails = await network;

  let wallet;
  if (process.env.MNEMONIC)
    wallet = new Wallet.fromMnemonic(process.env.MNEMONIC);
  if (process.env.PRIVATE_KEY) wallet = new Wallet(process.env.PRIVATE_KEY);
  if (!wallet) {
    console.error("Missing MNEMONIC or PRIVATE_KEY. Aborting..");
    return null;
  }
  owner = wallet.connect(provider);
  let brightIdUserRegistry = await (
    await ethers.getContractFactory("BrightIdUserRegistry")
  ).connect(owner).deploy(CONTEXT, VERIFIER);

  await brightIdUserRegistry.deployed();

  console.log("Registry deployed to:", brightIdUserRegistry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
