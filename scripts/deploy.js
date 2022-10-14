const hre = require("hardhat");

const VRFCoordinator = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
const LINKToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const keyHash =
  "0x4447a51eaaa911ffc387867dc26cf8b8119ac8d00d2cac4512c57a18b0a90d1a";

async function main() {
  const BigBullGamersPosts = await hre.ethers.getContractFactory("BigBullGamersPosts");
  const bigBullGamersposts = await BigBullGamersPosts.deploy();
  await bigBullGamersposts.deployed();
  console.log("Social Address deployed to:", bigBullGamersposts.address); // Social Address

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarket = await NFTMarket.deploy();

  await nftMarket.deployed();

  console.log("Contract NFT Market Contact deployed to:", nftMarket.address);

  const Token = await hre.ethers.getContractFactory("PostToken");
  const token = await Token.deploy(bigBullGamersposts.address);
  await token.deployed();
  console.log("token deployed to:", token.address);

  const BulkMintTokenCon = await hre.ethers.getContractFactory("BulkMint");
  const bulkMintTokenCon = await BulkMintTokenCon.deploy();

  console.log("BulkMint Token contract address:", bulkMintTokenCon.address);

  const MultiSendTokenCon = await hre.ethers.getContractFactory("MultiSend");
  const multiSendTokenCon = await MultiSendTokenCon.deploy();

  console.log("MultiSend Token contract address:", multiSendTokenCon.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
