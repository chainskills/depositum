const assetContract = artifacts.require("./AssetContract.sol");

module.exports = function(deployer) {
  deployer.deploy(assetContract);
};
