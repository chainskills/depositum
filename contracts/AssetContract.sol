pragma solidity ^0.4.25;

import "./AssetToken.sol";

contract AssetContract is AssetToken {

    //
    // OpenZeppelin specifics
    //
    using SafeMath for uint256;

    //
    // state variables
    //

    // description of an asset item
    struct AssetItem {
        uint256 id;                // id in the list
        address owner;          // asset's owner
        address candidate;      // candidate owner
        string name;
        string description;
        string hashKey;         // hashkey of the asset stored in IPFS
        uint256 price;          // price in Wei
        bool available;         // true if the asset can be sold in the marketplace
    }

    // List of asset
    mapping(uint256 => AssetItem) public assets;

    // Balance of deposits
    mapping(uint256 => uint256) public depositsBalance;

    // number of assets
    uint256 assetCounter;


    //
    // Events
    //
    event NewAsset(uint256 _assetId, address _owner, string _name, string _description, string _hashKey, uint256 _price);
    event UpdateAsset(uint256 _assetId, address _owner, string _name, string _description, string _hashKey, uint256 _price);
    event AssetRemoved(address _owner, uint _assetId);
    event SetMarketplace(uint256 _assetId, address _owner, string _name, string _description, uint256 _price);
    event UnsetMarketplace(uint256 _assetId, address _owner, address _candidate, string _name, string _description, uint256 _price);
    event Deposit(uint256 _assetId, address _owner, address _candidate, uint256 _price);
    event Purchase(uint256 _assetId, address _formerOwner, address _newOwner, uint256 _price);
    event Refund(uint256 _assetId, address _owner, address _candidate, uint256 _price);

    //
    // Implementation
    //

    constructor(uint256 _rate, uint256 _tokens, uint _serviceFee) public {
        require(_rate > 0);
        require(_tokens >= 100);

        // set initial rate
        rate = _rate;

        // set the service fee in token to use the service
        serviceFee = _serviceFee;

        // mint initial tokens
        mint(msg.sender, _tokens);
    }

    // add a new asset
    function addAsset(string _name, string _description, string _hashKey, uint256 _price) public {
        // a name is required
        bytes memory name = bytes(_name);
        require(name.length > 0, "A name is required");

        // a description is required
        bytes memory description = bytes(_description);
        require(description.length > 0, "A description is required");

        // an IPFS hash key is required
        bytes memory hashKey = bytes(_hashKey);
        require(hashKey.length > 0, "A hash key from IPFS is required");

        // pay the service service
        _burn(msg.sender, serviceFee);

        // new asset
        assetCounter = assetCounter.add(1);

        // store the new asset
        assets[assetCounter] = AssetItem(assetCounter, msg.sender, 0x0, _name, _description, _hashKey, _price, false);

        emit NewAsset(assetCounter, msg.sender, _name, _description, _hashKey, _price);
    }

    // update an existing asset
    // only possible for the asset's owner
    function updateAsset(uint256 _assetId, string _name, string _description, string _hashKey, uint256 _price) public {
        AssetItem storage asset = assets[_assetId];

        // is this asset exists?
        if (asset.owner == 0x0) {
            return;
        }

        // only the asset's owner is allowed to update this asset
        require(msg.sender == asset.owner, "Action allowed only to the owner");

        // a name is required
        bytes memory name = bytes(_name);
        require(name.length > 0, "A name is required");

        // a description is required
        bytes memory description = bytes(_description);
        require(description.length > 0, "A description is required");

        // an IPFS hash key is required
        bytes memory hashKey = bytes(_hashKey);
        require(hashKey.length > 0, "A hash key from IPFS is required");

        // update the asset
        asset.name = _name;
        asset.description = _description;
        asset.hashKey = _hashKey;
        asset.price = _price;

        emit UpdateAsset(_assetId, msg.sender, _name, _description, _hashKey, _price);
    }

    // make the asset available in the marketplace
    // only possible for the asset's owner
    function setMarketplace(uint256 _assetId) public {
        AssetItem storage asset = assets[_assetId];

        // is this asset exists?
        if (asset.owner == 0x0) {
            return;
        }

        // only the asset's owner is allowed to update this asset
        require(msg.sender == asset.owner, "Action allowed only to the owner");

        // update the availability of the asset in the marketplace
        asset.available = true;

        emit SetMarketplace(_assetId, msg.sender, asset.name, asset.description, asset.price);
    }

    // remove the asset from the marketplace and refund the candidate buyer
    // only possible for the asset's owner
    function unsetMarketplace(uint256 _assetId) public {
        AssetItem storage asset = assets[_assetId];

        // is this asset exists?
        if (asset.owner == 0x0) {
            return;
        }

        // only the asset's owner is allowed to update this asset
        require(msg.sender == asset.owner, "Action allowed only to the owner");

        // update the availability of the asset in the marketplace
        asset.available = false;

        if (asset.candidate != 0x0) {
            // we need to refund by sending back the deposit to the candidate
            _refund(asset, _assetId);
        } else {
            emit UnsetMarketplace(_assetId, msg.sender, asset.candidate, asset.name, asset.description, asset.price);

        }
    }

    // a candidate buyer deposit the price for the purchase
    // the amount is secured in the contract's balance until the amount is released (sale concluded or refunded)
    function deposit(uint256 _assetId) public payable {
        AssetItem storage asset = assets[_assetId];

        // is this asset exists?
        if (asset.owner == 0x0) {
            return;
        }

        // ensure that the asset is not already reserved
        require(asset.candidate == 0x0, "Asset already reserved to another candidate");

        // ensure that the asset is not already reserved to another candidate buyer
        require(msg.sender != asset.owner, "Deposit not allowed for the owner of the asset");

        // the value to deposit must be equal to price of the asset
        require(msg.value == asset.price, "Price are not the same as expected");

        // keep track of the deposit
        depositsBalance[_assetId] = msg.value;

        // store the address of the purchaser
        asset.candidate = msg.sender;

        emit Deposit(_assetId, asset.owner, msg.sender, asset.price);
    }

    // let the candidate buyer to become the new owner of the asset by executing the purchase
    function purchaseAsset(uint256 _assetId) public {
        AssetItem storage asset = assets[_assetId];

        // is this asset exists?
        if (asset.owner == 0x0) {
            return;
        }

        // ensure that the buyer is the identified candidate
        require(msg.sender == asset.candidate, "Asset already reserved to another candidate");

        // keep the former owner and the price paid by the purchase
        address _owner = asset.owner;
        uint256 _price = depositsBalance[_assetId];

        // move the asset to the buyer and reset its state
        asset.owner = msg.sender;
        asset.candidate = 0x0;
        asset.price = 0;
        asset.available = false;
        delete depositsBalance[_assetId];

        if (_price != 0) {
            // transfer the amount to the former owner
            _owner.transfer(_price);
        }

        emit Purchase(_assetId, asset.owner, msg.sender, _price);
    }

    // let the candidate buyer or the asset owner to cancel the purchase and refunding the candidate
    function refundPurchase(uint256 _assetId) public {
        AssetItem storage asset = assets[_assetId];

        // is this asset exists?
        if (asset.owner == 0x0) {
            return;
        }

        // the sender must be the owner or the candidate
        if ((msg.sender == asset.owner) || (msg.sender == asset.candidate)) {
            // we need to refund by sending back the deposit to the candidate
            _refund(asset, _assetId);
        } else {
            require(false, "Refund not authorised for this account");
        }
    }

    // remove the asset and refund the potiential candidate
    function removeAsset(uint256 _assetId) public {
        AssetItem storage asset = assets[_assetId];

        // is this asset exists?
        if (asset.owner == 0x0) {
            return;
        }

        // only the asset's owner is allowed to remove this asset
        require(msg.sender == asset.owner, "Action allowed only to the owner");

        if (asset.candidate != 0x0) {
            // we need to refund by sending back the deposit to the candidate
            _refund(asset, _assetId);
        }

        // remove the asset
        delete assets[_assetId];

        emit AssetRemoved(msg.sender, _assetId);
    }

    // return asset IDs owned by the function's caller
    function getMyAssets() view public returns (uint[]) {
        if (assetCounter == 0) {
            return new uint[](0);
        }

        // prepare output array
        uint256[] memory assetIDs = new uint[](assetCounter);

        // iterate over assets
        uint256 numberOfAssets = 0;
        for (uint i = 1; i <= assetCounter; i++) {
            // keep the ID of the asset owned by the sender
            if (assets[i].owner == msg.sender) {
                assetIDs[numberOfAssets] = assets[i].id;

                numberOfAssets = numberOfAssets.add(1);
            }
        }

        // copy the asset ID array into a smaller array
        uint256[] memory myAsset = new uint[](numberOfAssets);
        for (uint j = 0; j < numberOfAssets; j++) {
            myAsset[j] = assetIDs[j];
        }

        return myAsset;
    }

    // execute the refund
    function _refund(AssetItem storage _asset, uint256 _assetId) internal {

        if (_asset.candidate == 0x0) {
            return;
        }

        // keep the former owner and the price paid by the purchase
        address _candidate = _asset.candidate;
        uint256 _price = depositsBalance[_assetId];

        // move the asset to the buyer and reset its state
        _asset.candidate = 0x0;
        delete depositsBalance[_assetId];

        if (_price > 0) {
            // transfer back the amount to the candidate
            _candidate.transfer(_price);
        }

        emit Refund(_assetId, _asset.owner, msg.sender, _price);
    }

    // return asset IDs published in the marketplace
    function getMarketplace() view public returns (uint[]) {
        if (assetCounter == 0) {
            return new uint[](0);
        }

        // prepare output array
        uint256[] memory assetIDs = new uint[](assetCounter);

        // iterate over assets
        uint256 numberOfAssets = 0;
        for (uint i = 1; i <= assetCounter; i++) {
            // keep the ID of the asset published in the marketplace
            if (assets[i].available) {
                assetIDs[numberOfAssets] = assets[i].id;

                numberOfAssets = numberOfAssets.add(1);
            }
        }

        // copy the asset ID array into a smaller array
        uint256[] memory myAsset = new uint[](numberOfAssets);
        for (uint j = 0; j < numberOfAssets; j++) {
            myAsset[j] = assetIDs[j];
        }

        return myAsset;
    }

    // Retrieve an asset based on its ID
    function getAsset(uint _assetId) view public returns (
        address _owner,
        address _candidate,
        string _name,
        string _description,
        string _hashKey,
        uint256 _price,
        bool _available) {

        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return (0x0, 0x0, "", "", "", 0, false);
        }

        return (
            asset.owner,
            asset.candidate,
            asset.name,
            asset.description,
            asset.hashKey,
            asset.price,
            asset.available);
    }



    function getOwner(uint _assetId) view public returns (address) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return (0x0);
        }


        return asset.owner;
    }

    function getCandidate(uint _assetId) view public returns (address) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return (0x0);
        }


        return asset.candidate;
    }


    function getName(uint _assetId) view public returns (string) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return ("");
        }


        return asset.name;
    }

    function getDescription(uint _assetId) view public returns (string) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return ("");
        }


        return asset.description;
    }

    function getHashKey(uint _assetId) view public returns (string) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return ("");
        }


        return asset.hashKey;
    }

    function getPrice(uint _assetId) view public returns (uint256) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return (0);
        }


        return asset.price;
    }

    function getAvailability(uint _assetId) view public returns (bool) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to fetch
        if (asset.owner == 0x0) {
            return (false);
        }


        return asset.available;
    }

    function isContractOwner() view public returns (bool) {
        // ensure that we have an asset to fetch
        if (owner() == msg.sender) {
            return (true);
        }

        return false;
    }
}