# Depositum - Deposit your assets on Ethereum
Sample Ethereum Dapp to deposit your assets on Ethereum.

This Dapp illustrates a Dapp using the following technologies:
* Truffle 5
* web3.js 1.0
* React
* Redux
* Drizzle
* ERC-20 (OpenZeppelin implementation)
* IPFS


## Warning
**Depositum is just a PoC from ChainSkills. It might not be the most efficiently coded. It is not usable in production**

## Prerequisites: Install tools and frameworks

To build, deploy and test your Dapp locally, you need to install the following tools and frameworks:
* **node.js and npm**: https://nodejs.org/en/
  * Node.js can be installed from an installation package or through some package managers such as Homebrew on a Mac.

* **Truffle**: https://github.com/trufflesuite/truffle
  * Create and deploy your Dapp with this build framework for Ethereum.
  
  In this sample, we use the beta version of Truffle 5 that you can install in this way:
  ```
  npm uninstall -g truffle
  npm install -g truffle@beta
  ```

* **Ganache**: https://github.com/trufflesuite/ganache
  * Development Ethereum node.

* **Metamask**: https://metamask.io/
  * Chrome extension to use Chrome as a Dapp browser.
  
* **IPFS**: https://docs.ipfs.io/introduction/install/
  * Decentralised and distributed file system.
  * IPFS will be started as a local.

  The folder `scripts` contains a startup script that will run IPFS locally. You can copy the script somewhere in your system such as in `/usr/local/bin` (Linux, macOS).

## Step 1: Start IPFS locally

Open a terminal window and run the script `startipfs.sh` to start IPFS locally.

## Step 2: Ganache

Start Ganache as your development Ethereum node.

## Step 3: Import Ganache accounts

From Metamask, import private keys for at least 2 accounts including the first one.

## Step 4: Configure your project

Open the Depositum project.

Edit your file `truffle-config.js` to set the port number used by Ganache.

## Step 5: Deploy the smart contract

Open a terminal window from your Depositum folder.

Compile and migrate the smart contract (AssetContract) to Ganache:

```
$ truffle migrate --reset --compile-all --network ganache
```

## Step 6: Copy the contract settings

Your Depositum project requires some settings from the deployed smart contract.

Run the following script from the Depositum folder:

```
$ npm run contracts
```

## Step 7: Run Depositum

Run the Dapp from the Depositum folder:

```
$ npm start
```

## What's next?

With Depositim, you can:
* The page Assets show only your assets
* Buy ERC-20 tokens to deposit new assets
* The earnings from the sales of tokens are kept in the contract balance for the contract's owner (by default accounts[0])
* The picture is stored on IPFS. The IPFS hash key is stored in the smart contract.
* Deposit a new asset
* Edit or remove your asset
* Sell your asset. The asset will be visible to all accounts through the Marketplace page.
* You can deposit money to purchase an asset.
* You or the asset's owner can execute a refund.
* As a buyer, you can confirm your purchase. The asset is now yours.

