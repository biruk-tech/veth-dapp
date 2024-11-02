async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const VethToken = await ethers.getContractFactory("VethToken");
  const vethToken = await VethToken.deploy();

  await vethToken.waitForDeployment();

  console.log("VethToken deployed to:", await vethToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
