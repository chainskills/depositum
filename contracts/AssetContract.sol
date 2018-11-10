pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract AssetContract is Ownable {

    //
    // OpenZeppeling specifics
    //
    using SafeMath for uint256;

    //
    // state variables
    //

    // description of an asset item
    struct AssetItem {
        uint id;                // id in the list
        address owner;          // asset's owner
        address candidate;      // candidate owner
        string name;
        string description;
        string hashKey;         // hashkey of the asset stored in IPFS
        uint256 price;          // price in Wei
    }

    // List of asset
    mapping(uint => AssetItem) public assets;

    // number of assets
    uint256 assetCounter;


    //
    // Events
    //
    event NewAsset(uint256 _id, address _owner, string _name, string _description, string _hashKey, uint256 _price);
    event AssetRemoved(address _owner, uint _id);


    //
    // Implementation
    //

    // add a new asset
    function addAsset(string _name, string _description, string _hashKey, uint256 _price) public {
        // a name is required
        //bytes memory name = bytes(_name);
        //require(name.length > 0, "A name is required");

        // a description is required
        //bytes memory description = bytes(_description);
        //require(description.length > 0, "A description is required");

        // an IPFS hash key is required
        //bytes memory hashKey = bytes(_hashKey);
        //require(hashKey.length > 0, "A hash key from IPFS is required");

        // new asset
        assetCounter = assetCounter.add(1);

        // store the new asset
        assets[assetCounter] = AssetItem(assetCounter, msg.sender, 0x0, _name, _description, _hashKey, _price);

        emit NewAsset(assetCounter, msg.sender, _name, _description, _hashKey, _price);
    }

    // remove an asset
    function removeAsset(uint _assetId) public {
        AssetItem storage asset = assets[_assetId];

        // ensure that we have an asset to remove
        if (asset.owner == 0x0) {
            return;
        }

        // only the asset's owner is allowed to delete his/her asset
        require(msg.sender == asset.owner, "Action allowed by the owner");

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


    function getOwner(uint _assetId) view public returns (address) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to remove
        if (asset.owner == 0x0) {
            return (0x0);
        }


        return asset.owner;
    }

    function getCandidate(uint _assetId) view public returns (address) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to remove
        if (asset.owner == 0x0) {
            return (0x0);
        }


        return asset.candidate;
    }


    function getName(uint _assetId) view public returns (string) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to remove
        if (asset.owner == 0x0) {
            return ("");
        }


        return asset.name;
    }

    function getDescription(uint _assetId) view public returns (string) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to remove
        if (asset.owner == 0x0) {
            return ("");
        }


        return asset.description;
    }

    function getHashKey(uint _assetId) view public returns (string) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to remove
        if (asset.owner == 0x0) {
            return ("");
        }


        return asset.hashKey;
    }

    function getPrice(uint _assetId) view public returns (uint256) {
        AssetItem memory asset = assets[_assetId];

        // ensure that we have an asset to remove
        if (asset.owner == 0x0) {
            return (0);
        }


        return asset.price;
    }
}