pragma solidity ^0.4.24;

contract TodoList {
    //
    // state variables
    //
    struct TodoItem {
        uint id;
        string title;
        string description;
    }

    struct Todos {
        uint numberTodos;
        mapping(uint => TodoItem) todoItems;
    }

    mapping(address => Todos) userTodos;

    //
    // Events
    //
    event NewTodoEvent(address _owner, uint _id, string _title, string _description);
    event RemovedTodoEvent(address _owner, uint _id);


    //
    // Implementation
    //

    // add a new todo
    function addTodo(string title, string description) public {
        //bytes memory paramTest = bytes(title);
        //require(paramTest.length == 0, "Title is required");

        //paramTest = bytes(description);
        //require(paramTest.length == 0, "Description is required");

        //Rentings storage todos = userTodos[msg.sender];

        userTodos[msg.sender].numberTodos += 1;
        uint numberTodos = userTodos[msg.sender].numberTodos;

        userTodos[msg.sender].todoItems[numberTodos] = TodoItem(numberTodos, title, description);

        emit NewTodoEvent(msg.sender,
            userTodos[msg.sender].todoItems[numberTodos].id,
            userTodos[msg.sender].todoItems[numberTodos].title,
            userTodos[msg.sender].todoItems[numberTodos].description);
    }

    function removeTodo(uint todoId) public {
        Todos storage todos = userTodos[msg.sender];
        delete todos.todoItems[todoId];
        emit RemovedTodoEvent(msg.sender, todoId);
    }

    // get the list of valid Renting IDs (not removed todos)
    function getValidTodoIDs(address owner) view public returns (uint[]) {
        // we check whether there is at least one article
        if (userTodos[owner].numberTodos == 0) {
            return new uint[](0);
        }

        // prepare output arrays
        uint[] memory todoIds = new uint[](userTodos[owner].numberTodos);

        // iterate over todos
        uint nbValidTodos = 0;
        for (uint i = 1; i <= userTodos[owner].numberTodos; i++) {
            TodoItem memory todoItem = userTodos[owner].todoItems[i];

            // keep only the ID for the todo not already removed
            if (todoItem.id != 0x0) {
                todoIds[nbValidTodos] = todoItem.id;
                nbValidTodos++;
            }
        }

        // copy the todo IDs array into the smaller validTodoIds array
        uint[] memory validTodoIds = new uint[](nbValidTodos);
        for (uint j = 0; j < nbValidTodos; j++) {
            validTodoIds[j] = todoIds[j];
        }

        return validTodoIds;
    }


    function getTitle(address owner, uint todoId) view public returns (string) {
        TodoItem memory todoItem = userTodos[owner].todoItems[todoId];
        return todoItem.title;
    }


    function getDescription(address owner, uint todoId) view public returns (string) {
        TodoItem memory todoItem = userTodos[owner].todoItems[todoId];
        return todoItem.description;
    }
}