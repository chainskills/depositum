const AssetContract = artifacts.require("AssetContract");

// test suite
contract("AssetContract", async (accounts) => {
    let contractInstance;
    let tokenBalance;
    const rate = 3000000000000000;
    const initialToken = 10000;
    const serviceFee = 2;
    const boughtToken = 10;
    const assetId = 1
    const name = "My kitten";
    const newName = "My singular cat";
    const description = "My personal and unique kitten";
    const ipfsHashKey = "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ";
    const price = 10000000000000000000;


    before('setup contract for each test', async () => {
        contractInstance = await AssetContract.deployed(rate, initialToken, serviceFee);
        tokenBalance = 0;
    })


    it("should be initialized with empty values", async () => {

        // retrieve the initial rate
        const _rate = await contractInstance.getRate()
        assert.equal(web3.utils.toBN(_rate), rate, "The rate should be " + rate);

        // retrieve the initial number of tokens minted during the creation of the contract
        const _initialToken = await contractInstance.balanceOf(accounts[0])
        assert.equal(web3.utils.toBN(_initialToken), initialToken, "The initial token minted should be " + initialToken);

        // retrieve the service fee
        const _serviceFee = await contractInstance.getServiceFee()
        assert.equal(web3.utils.toBN(_serviceFee), serviceFee, "The service fee should be " + serviceFee);

        // retrieve the balance of the contract
        const balance = await web3.eth.getBalance(contractInstance.address);
        assert.equal(web3.utils.toBN(balance), 0, "The balance of the contract should be 0");
    })


    it("should let us mint 10 tokens", async () => {

        // retrieve the balance of the contract
        const balanceBeforeMint = await web3.eth.getBalance(contractInstance.address);
        assert.equal(web3.utils.toBN(balanceBeforeMint), 0, "The balance of the contract should be 0");

        // buy 10 tokens
        const price = boughtToken * rate;
        await contractInstance.buyTokens({from: accounts[1], value: price});

        // retrieve the number of tokens owned by the account
        tokenBalance = await contractInstance.balanceOf(accounts[1])
        assert.equal(web3.utils.toBN(tokenBalance), boughtToken, "The number of tokens minted should be " + boughtToken);

        // check that the contract's owner earned the value for the tokens bought by the account
        const balanceAfterMint = await web3.eth.getBalance(contractInstance.address);
        assert.equal(web3.utils.toBN(balanceAfterMint), price, "The balance of the contract should be " + price);
    })

    it("should let us add an asset", async () => {

        // balance of tokens before be the usage of the service
        const tokensBeforeAdd = await contractInstance.balanceOf(accounts[1]);
        assert.equal(web3.utils.toBN(tokensBeforeAdd).toNumber(), tokenBalance, "The number of tokens should be " + tokenBalance);

        // add the asset
        const receipt = await contractInstance.addAsset(
            name,
            description,
            ipfsHashKey,
            price, {
                from: accounts[1]
            });

        // check that we have received an event
        assert.equal(receipt.logs.length, 2, "should have received 2 events");
        assert.equal(receipt.logs[1].event, "NewAsset", "event name should be NewAsset");
        assert.equal(receipt.logs[1].args._assetId.toNumber(), 1, "asset id must be 1");
        assert.equal(receipt.logs[1].args._owner, accounts[1], "seller must be " + accounts[1]);
        assert.equal(receipt.logs[1].args._name, name, "asset name must be " + name);
        assert.equal(receipt.logs[1].args._description, description, "asset description must be " + description);
        assert.equal(receipt.logs[1].args._hashKey, ipfsHashKey, "IPFS hash key must be " + ipfsHashKey);
        assert.equal(web3.utils.toBN(receipt.logs[1].args._price), price, "asset price must be " + price);

        // balance of tokens before be the usage of the service
        tokenBalance = await contractInstance.balanceOf(accounts[1]);
        assert.equal(web3.utils.toBN(tokenBalance).toNumber(), tokensBeforeAdd - serviceFee, "The number of tokens should be " + tokensBeforeAdd - serviceFee);
    })


    it("should let us update an asset", async () => {

        // balance of tokens before be the usage of the service
        const tokensBeforeAdd = await contractInstance.balanceOf(accounts[1])
        assert.equal(web3.utils.toBN(tokensBeforeAdd).toNumber(), tokenBalance, "The number of tokens should be " + tokenBalance);

        // add the asset
        const receipt = await contractInstance.updateAsset(
            assetId,
            newName,
            description,
            ipfsHashKey,
            price, {
                from: accounts[1]
            });

        // check that we have received an event
        assert.equal(receipt.logs.length, 1, "should have received 1 event");
        assert.equal(receipt.logs[0].event, "UpdateAsset", "event name should be NewAsset");
        assert.equal(receipt.logs[0].args._assetId.toNumber(), 1, "asset id must be 1");
        assert.equal(receipt.logs[0].args._owner, accounts[1], "seller must be " + accounts[1]);
        assert.equal(receipt.logs[0].args._name, newName, "asset name must be " + newName);
        assert.equal(receipt.logs[0].args._description, description, "asset description must be " + description);
        assert.equal(receipt.logs[0].args._hashKey, ipfsHashKey, "IPFS hash key must be " + ipfsHashKey);
        assert.equal(web3.utils.toBN(receipt.logs[0].args._price), price, "asset price must be " + price);


        // balance of tokens before be the usage of the service
        const tokensAfterAdd = await contractInstance.balanceOf(accounts[1])
        assert.equal(web3.utils.toBN(tokensAfterAdd).toNumber(), 10 - serviceFee, "The number of tokens should be " + 10 - serviceFee);
    })

})