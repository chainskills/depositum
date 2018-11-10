/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config();

//console.log(process.env.MNEMONIC);
//console.log(process.env.INFURA_API_KEY);

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        ganache: {
            host: "localhost",
            port: 7545,
            network_id: "*" // Match any network id
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY);
            },
            network_id: 3,
            gas: 4500000,
            gasPrice: 10000000000
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
