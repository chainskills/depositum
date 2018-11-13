pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract AssetToken is Ownable {

    //
    // OpenZeppelin specifics
    //
    using SafeMath for uint256;

    //
    // state variables
    //

    // rate for a token
    uint256 public rate;


    //
    // Events
    //

    //
    // Implementation
    //


    // set the rate to buy and to sell a token
    function setRate(uint256 _newRate) public onlyOwner {
        require(_newRate > 0);
        rate = _newRate;
    }

    // get the rate to buy a token
    function getRate() public view returns (uint256 _rate) {
        return rate;
    }
}