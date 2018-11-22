pragma solidity ^0.4.24;

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
    uint8 public constant decimals = 0;

    //
    // state variables
    //

    // rate for a token
    uint256 public rate;

    // service fee to use the add a new asset (in token)
    uint public serviceFee;


    // balance of earning sold by contract's owner
    uint256 balanceEarnings;


    //
    // Events
    //
    event TransferEarnings(address _owner, uint256 _amount);

    //
    // Implementation
    //


    // set the rate to buy and to sell a token
    function setRate(uint256 _newRate) public onlyOwner {
        require(_newRate > 0, "The rate must be greater than 0");
        rate = _newRate;
    }

    // set the cost for a service
    function setServiceFee(uint _serviceFee) public onlyOwner {
        require(_serviceFee > 0, "The service fee must be greater than 0");
        serviceFee = _serviceFee;
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
        balanceEarnings = balanceEarnings.add(msg.value);

        emit Transfer(owner(), msg.sender, _tokens);
    }

    // transfer earning to the contract owner
    function transferEarnings() public onlyOwner {

        if (balanceEarnings == 0) {
            // nothing to transfer
            return;
        }

        // reset the balance
        uint256 amount = balanceEarnings;
        balanceEarnings = 0;

        // transfer the amount to the contract's owner
        owner().transfer(amount);

        emit TransferEarnings(owner(), amount);
    }

    // get the rate to buy a token
    function getRate() public view returns (uint256 _rate) {
        return rate;
    }

    // get the service fee
    function getServiceFee() public view returns (uint256 _serviceFee) {
        return serviceFee;
    }

    // get the number of ether earned by the contract's owner
    function getEarnings() public view returns (uint256 _balanceEarnings) {
        return balanceEarnings;
    }

}