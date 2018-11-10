// Contract to be tested
const TodosContract = artifacts.require("./TodoList.sol");

// Test suite
contract('Rentings', function (accounts) {
    let contractInstance;
    const account1 = accounts[1];
    const account2 = accounts[2];
    const item1Title = "Item 1";
    const item1Description = "Description of the first item";
    const item2Title = "Item 2";
    const item2Description = "Description of the second item";
    const item3Title = "Item 3";
    const item3Description = "Description of the third item";


    it("should be initialized with empty values", function () {
        return TodosContract.deployed().then(function (instance) {
            contractInstance = instance;
            return contractInstance.getValidTodoIDs(account1);
        }).then(function (data) {
            assert.equal(data, 0x0, "number of todos must be zero for account 1");

            return contractInstance.getValidTodoIDs(account2);
        }).then(function (data) {
            assert.equal(data, 0x0, "number of todos must be zero for account 2");
        });
    });


    it("should let us add a first todo's item as account 1", function () {
        let todoId = 0;

        return TodosContract.deployed().then(function (instance) {
            contractInstance = instance;
            // add one item
            return contractInstance.addRentingItem(item1Title, item1Description, {from: account1});
        }).then(function (receipt) {
            //check event
            assert.equal(receipt.logs.length, 1, "should have received 1 event");
            assert.equal(receipt.logs[0].event, "NewTodoEvent", "event name should be NewTodoEvent");
            assert.equal(receipt.logs[0].args._owner, account1, "_owner must be " + account1);
            assert.equal(receipt.logs[0].args._id.toNumber(), 1, "_id must be 1");
            assert.equal(receipt.logs[0].args._title, item1Title, "_title must be " + item1Title);
            assert.equal(receipt.logs[0].args._description, item1Description, "_description must be " + item1Description);

            todoId = receipt.logs[0].args._id.toNumber();

            return contractInstance.getTitle(account1, todoId);
        }).then(function (title) {
            assert.equal(title, item1Title, "title must be: " + item1Title);

            return contractInstance.getDescription(account1, todoId);
        }).then(function (description) {
            assert.equal(description, item1Description, "description must be: " + item1Description);

            return contractInstance.getValidTodoIDs(account1);
        }).then(function (data) {
            assert.equal(data.length, 1, "number of valid todos must be 1");
        });
    });


    it("should let us add a second todo's item as account 1", function () {
        let todoId = 0;

        return TodosContract.deployed().then(function (instance) {
            contractInstance = instance;
            // add one item
            return contractInstance.addRentingItem(item2Title, item2Description, {from: account1});
        }).then(function (receipt) {
            //check event
            assert.equal(receipt.logs.length, 1, "should have received 1 event");
            assert.equal(receipt.logs[0].event, "NewTodoEvent", "event name should be NewTodoEvent");
            assert.equal(receipt.logs[0].args._owner, account1, "_owner must be " + account1);
            assert.equal(receipt.logs[0].args._id.toNumber(), 2, "_id must be 2");
            assert.equal(receipt.logs[0].args._title, item2Title, "_title must be " + item2Title);
            assert.equal(receipt.logs[0].args._description, item2Description, "_description must be " + item2Description);

            todoId = receipt.logs[0].args._id.toNumber();

            return contractInstance.getTitle(account1, todoId);
        }).then(function (title) {
            assert.equal(title, item2Title, "title must be: " + item2Title);

            return contractInstance.getDescription(account1, todoId);
        }).then(function (description) {
            assert.equal(description, item2Description, "description must be: " + item2Description);

            return contractInstance.getValidTodoIDs(account1);
        }).then(function (data) {
            assert.equal(data.length, 2, "number of valid todos must be 2");
        });
    });

    it("should let us add a first todo's item as account 2", function () {
        let todoId = 0;

        return TodosContract.deployed().then(function (instance) {
            contractInstance = instance;
            // add one item
            return contractInstance.addRentingItem(item3Title, item3Description, {from: account2});
        }).then(function (receipt) {
            //check event
            assert.equal(receipt.logs.length, 1, "should have received 1 event");
            assert.equal(receipt.logs[0].event, "NewTodoEvent", "event name should be NewTodoEvent");
            assert.equal(receipt.logs[0].args._owner, account2, "_owner must be " + account2);
            assert.equal(receipt.logs[0].args._id.toNumber(), 1, "_id must be 1");
            assert.equal(receipt.logs[0].args._title, item3Title, "_title must be " + item3Title);
            assert.equal(receipt.logs[0].args._description, item3Description, "_description must be " + item3Description);

            todoId = receipt.logs[0].args._id.toNumber();

            return contractInstance.getTitle(account2, todoId);
        }).then(function (title) {
            assert.equal(title, item3Title, "title must be: " + item3Title);

            return contractInstance.getDescription(account2, todoId);
        }).then(function (description) {
            assert.equal(description, item3Description, "description must be: " + item3Description);

            return contractInstance.getValidTodoIDs(account2);
        }).then(function (data) {
            assert.equal(data.length, 1, "number of valid todos must be 1");
        });
    });


    it("should let us remove the first item of the account 1", function () {
        const todoId = 1;

        return TodosContract.deployed().then(function (instance) {
            contractInstance = instance;
            // add one item
            return contractInstance.removeTodo(todoId, {
                from: account1
            });
        }).then(function (receipt) {
            //check event
            assert.equal(receipt.logs.length, 1, "should have received 1 event");
            assert.equal(receipt.logs[0].event, "RemovedTodoEvent", "event name should be RemovedTodoEvent");
            assert.equal(receipt.logs[0].args._owner, account1, "_owner must be " + account1);
            assert.equal(receipt.logs[0].args._id.toNumber(), todoId, "id must be " + todoId);

            return contractInstance.getTitle(account1, todoId);
        }).then(function (title) {
            assert.equal(title, 0x0, "title must be null");

            return contractInstance.getDescription(account1, todoId);
        }).then(function (description) {
            assert.equal(description, 0x0, "description must be null");

            return contractInstance.getValidTodoIDs(account1);
        }).then(function (data) {
            assert.equal(data.length, 1, "number of valid todos must be 1");
        });
    });


    it("should let us check the first item of account 2", function () {
        const todoId = 1;

        return TodosContract.deployed().then(function (instance) {
            contractInstance = instance;

            return contractInstance.getTitle(account2, todoId);
        }).then(function (title) {
            assert.equal(title, item3Title, "title must be: " + item3Title);

            return contractInstance.getDescription(account2, todoId);
        }).then(function (description) {
            assert.equal(description, item3Description, "description must be: " + item3Description);

            return contractInstance.getValidTodoIDs(account2);
        }).then(function (data) {
            assert.equal(data.length, 1, "number of valid todos must be 1");
        });
    });

});