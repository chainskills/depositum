pragma solidity ^0.4.25;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract AssetToken is Ownable, ERC20Mintable {

    //
    // OpenZeppelin specifics
    //
    using SafeMath for uint256;


    // Token identity
    string public constant name = 'Depositum';
    string public constant symbol = 'DPM';
    uint8 public constant decimals = 1;

    //
    // state variables
    //

    // rate for a token
    uint256 public rate;

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

    // mint additional tokens
    function mint(uint256 _tokens) public onlyOwner {
        mint(msg.sender, _tokens);
    }

    // purchase tokens
    function buyTokens() public payable {
        require(rate > 0, "The rate must be greater than 0");

        uint256 weiAmount = msg.value;
        uint256 _tokens = weiAmount.div(rate);

        // enough token?
        require(balanceOf(owner()) >= _tokens, "Not enough tokens");

        // transfer to the account
        _transfer(owner(), msg.sender, _tokens);

        // keep amount earned by the contract's owner
        balanceSoldTokens = balanceSoldTokens.add(msg.value);

        emit Transfer(owner(), msg.sender, _tokens);
    }

    // get the rate to buy a token
    function getRate() public view returns (uint256 _rate) {
        return rate;
    }

    // get the number of ether earned by the contract's owner
    function getBalanceOfOwner() public view returns (uint256 _balanceOwner) {
        return balanceSoldTokens;
    }

}