const AssetContract = artifacts.require("AssetContract");

// test suite
contract("AssetContract", async (accounts) => {
    let contractInstance;
    const rate = 3000000000000000;
    const initialToken = 10000;
    const serviceFee = 2;

    before('setup contract for each test', async () => {
        contractInstance = await AssetContract.deployed(rate, initialToken, serviceFee);
    })

    it("should be initialized with empty values", async () => {
        const _rate = await contractInstance.getRate()
        assert.equal(web3.utils.toBN(_rate), rate, "The rate should be " + rate);

        const _initialToken = await contractInstance.balanceOf(accounts[0])
        assert.equal(web3.utils.toBN(_initialToken), initialToken, "The initial token should be " + initialToken);

        const _serviceFee = await contractInstance.getServiceFee()
        assert.equal(web3.utils.toBN(_serviceFee), serviceFee, "The service fee should be " + serviceFee);
    })


    /*
    // sell a first article
    it("should let us sell a first article", async () => {
        const receipt = await chainListInstance
            .sellArticle(
                articleName1,
                articleDescription1,
                web3.utils.toWei(web3.utils.toBN(articlePrice1).toString(), "ether"), {from: seller})

        assert.equal(receipt.logs.length, 1, "should have received one event");
        assert.equal(receipt.logs[0].event, "LogSellArticle", "event name should be LogSellArticle");
        assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
        assert.equal(receipt.logs[0].args._seller, seller, "seller must be " + seller);
        assert.equal(receipt.logs[0].args._name, articleName1, "article name must be " + articleName1);
        assert.equal(web3.utils.toBN(receipt.logs[0].args._price), web3.utils.toWei(web3.utils.toBN(articlePrice1).toString(), "ether"), "article price must be " + web3.utils.toWei(web3.utils.toBN(articlePrice1).toString(), "ether"))

        const nbArticles = await chainListInstance.getNumberOfArticles()
        assert.equal(web3.utils.toBN(nbArticles), 1, "number of articles must be 1")

        const articlesForSale = await chainListInstance.getArticlesForSale()
        assert.equal(articlesForSale.length, 1, "there must be one article for sale")

        const articles = await chainListInstance.articles(articlesForSale[0])
        assert.equal(web3.utils.toBN(articles[0]), 1, "article id must be 1")
        assert.equal(articles[1], seller, "seller must be " + seller)
        assert.equal(articles[2], 0x0, "buyer must be empty")
        assert.equal(articles[3], articleName1, "article name must be " + articleName1)
        assert.equal(articles[4], articleDescription1, "article description must be " + articleDescription1)
        assert.equal(web3.utils.toBN(articles[5]), web3.utils.toWei(web3.utils.toBN(articlePrice1).toString(), "ether"), "event article price must be " + web3.utils.toWei(web3.utils.toBN(articlePrice1).toString(), "ether"))

    })

    // sell a second article
    it("should let us sell a second article", async () => {
        const receipt = await chainListInstance
            .sellArticle(
                articleName2,
                articleDescription2,
                web3.utils.toWei(web3.utils.toBN(articlePrice2).toString(), "ether"), {from: seller})

        assert.equal(receipt.logs.length, 1, "should have received one event");
        assert.equal(receipt.logs[0].event, "LogSellArticle", "event name should be LogSellArticle");
        assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
        assert.equal(receipt.logs[0].args._seller, seller, "seller must be " + seller);
        assert.equal(receipt.logs[0].args._name, articleName2, "article name must be " + articleName2);
        assert.equal(web3.utils.toBN(receipt.logs[0].args._price), web3.utils.toWei(web3.utils.toBN(articlePrice2).toString(), "ether"), "article price must be " + web3.utils.toWei(web3.utils.toBN(articlePrice2).toString(), "ether"))

        const nbArticles = await chainListInstance.getNumberOfArticles()
        assert.equal(web3.utils.toBN(nbArticles), 2, "number of articles must be 2")

        const articlesForSale = await chainListInstance.getArticlesForSale()
        assert.equal(articlesForSale.length, 2, "there must be two articles for sale")

        const articles = await chainListInstance.articles(articlesForSale[1])
        assert.equal(web3.utils.toBN(articles[0]), 2, "article id must be 2")
        assert.equal(articles[1], seller, "seller must be " + seller)
        assert.equal(articles[2], 0x0, "buyer must be empty")
        assert.equal(articles[3], articleName2, "article name must be " + articleName2)
        assert.equal(articles[4], articleDescription2, "article description must be " + articleDescription2)
        assert.equal(web3.utils.toBN(articles[5]), web3.utils.toWei(web3.utils.toBN(articlePrice2).toString(), "ether"), "event article price must be " + web3.utils.toWei(web3.utils.toBN(articlePrice2).toString(), "ether"))

    })

    // buy the first article
    it("should let us buy the first article", async () => {
        // record balances of seller and buyer before the sale
        let balance = await web3.eth.getBalance(seller)
        sellerBalanceBeforeSale = web3.utils.fromWei(balance, "ether")

        balance = await web3.eth.getBalance(buyer)
        buyerBalanceBeforeSale = web3.utils.fromWei(balance, "ether")

        // buy the article
        let receipt = await chainListInstance
            .buyArticle(1, {
                from: buyer,
                value: web3.utils.toWei(web3.utils.toBN(articlePrice1).toString(), "ether")
            })

        // record balances of seller and buyer after the sale
        balance = await web3.eth.getBalance(seller)
        sellerBalanceAfterSale = web3.utils.fromWei(balance, "ether")

        balance = await web3.eth.getBalance(buyer)
        buyerBalanceAfterSale = web3.utils.fromWei(balance, "ether")

        const articlesForSale = await chainListInstance.getArticlesForSale()
        assert.equal(articlesForSale.length, 1, "there must be one article for sale")

        const nbArticles = await chainListInstance.getNumberOfArticles()
        assert.equal(web3.utils.toBN(nbArticles), 2, "number of articles must be 2")

        const articles = await chainListInstance.articles(articlesForSale[0])
        assert.equal(web3.utils.toBN(articles[0]), 2, "article id must be 2")
        assert.equal(articles[1], seller, "seller must be " + seller)
        assert.equal(articles[2], 0x0, "buyer must be empty")
        assert.equal(articles[3], articleName2, "article name must be " + articleName2)
        assert.equal(articles[4], articleDescription2, "article description must be " + articleDescription2)
        assert.equal(web3.utils.toBN(articles[5]), web3.utils.toWei(web3.utils.toBN(articlePrice2).toString(), "ether"), "event article price must be " + web3.utils.toWei(web3.utils.toBN(articlePrice2).toString(), "ether"))
    })
    */

})