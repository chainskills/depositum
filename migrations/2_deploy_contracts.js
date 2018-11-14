const assetContract = artifacts.require("./AssetContract.sol");

module.exports = function(deployer) {
  deployer.deploy(assetContract, 3000000000000000, 10000, 2);
};
