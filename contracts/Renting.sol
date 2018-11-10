pragma solidity ^0.4.25;

contract Renting {
    //
    // state variables
    //
    struct RentItem {
        uint id;
        string title;
        string description;
        string imageHash;
    }

    struct RentItems {
        uint numberRentItems;
        mapping(uint => RentItem) rentItems;
    }

    mapping(address => RentItems) userRentItems;

    //
    // Events
    //
    event NewRentItemEvent(address _owner, uint _id, string _title, string _description);
    event RemovedRentItemEvent(address _owner, uint _id);


    //
    // Implementation
    //

    // add a new item to rent
    function addRentItem(string title, string description, string imageHash) public {
        userRentItems[msg.sender].numberRentItems += 1;
        uint numberRentItems = userRentItems[msg.sender].numberRentItems;

        userRentItems[msg.sender].rentItems[numberRentItems] = RentItem(numberRentItems, title, description, imageHash);

        emit NewRentItemEvent(msg.sender,
            userRentItems[msg.sender].rentItems[numberRentItems].id,
            userRentItems[msg.sender].rentItems[numberRentItems].title,
            userRentItems[msg.sender].rentItems[numberRentItems].description);
    }

    // remove an item to rent
    function removeRentItem(uint rentItemId) public {
        RentItems storage items = userRentItems[msg.sender];
        delete items.rentItems[rentItemId];
        emit RemovedRentItemEvent(msg.sender, rentItemId);
    }

    // get the list of valid rent items IDs
    function getValidRentItemIDs(address owner) view public returns (uint[]) {
        // we check whether there is at least one item to rent
        if (userRentItems[owner].numberRentItems == 0) {
            return new uint[](0);
        }

        // prepare output arrays
        uint[] memory itemsIDs = new uint[](userRentItems[owner].numberRentItems);

        // iterate over items to rent
        uint nbValidItems = 0;
        for (uint i = 1; i <= userRentItems[owner].numberRentItems; i++) {
            RentItem memory rentItem = userRentItems[owner].rentItems[i];

            // keep only the ID for the rent item not already removed
            if (rentItem.id != 0x0) {
                itemsIDs[nbValidItems] = rentItem.id;
                nbValidItems++;
            }
        }

        // copy the rent items IDs array into the smaller validItemIds array
        uint[] memory validItemIds = new uint[](nbValidItems);
        for (uint j = 0; j < nbValidItems; j++) {
            validItemIds[j] = itemsIDs[j];
        }

        return validItemIds;
    }


    function getTitle(address owner, uint rentItemId) view public returns (string) {
        RentItem memory rentItem = userRentItems[owner].rentItems[rentItemId];
        return rentItem.title;
    }


    function getDescription(address owner, uint rentItemId) view public returns (string) {
        RentItem memory rentItem = userRentItems[owner].rentItems[rentItemId];
        return rentItem.description;
    }

    function getImageHash(address owner, uint rentItemId) view public returns (string) {
        RentItem memory rentItem = userRentItems[owner].rentItems[rentItemId];
        return rentItem.imageHash;
    }
}