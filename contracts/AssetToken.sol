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

    // balance of tokens
    mapping(address => uint256) balances;

    // balance of tokens sold by contract's owner
    uint256 balanceSoldTokens;


    //
    // Events
    //

    //
    // Implementation
    //


    // set the rate to buy and to sell a token
    function setRate(uint256 _newRate) public onlyOwner {
        require(_newRate > 0, "The rate must be greater than 0");
        rate = _newRate;
    }

    // purchase tokens
    function buyTokens() public payable {
        require(rate > 0, "The rate must be greater than 0");

        uint256 weiAmount = msg.value;
        uint256 _tokens = weiAmount.div(rate);

        // store tokens owned by the account
        balances[msg.sender] = balances[msg.sender].add(_tokens);

        // keep amount earned by the contract's owner
        balanceSoldTokens = balanceSoldTokens.add(msg.value);
    }

    // get the rate to buy a token
    function getRate() public view returns (uint256 _rate) {
        return rate;
    }

    // get the number of tokens owned by the account
    function getTokens() public view returns (uint256 _tokens) {
        return balances[msg.sender];
    }

    // get the number of ether earned by the contract's owner
    function getBalanceOfOwner() public view returns (uint256 _balance) {
        return balanceSoldTokens;
    }



}