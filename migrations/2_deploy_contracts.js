const renting = artifacts.require("./Renting.sol");

module.exports = function(deployer) {
  deployer.deploy(renting);
};
