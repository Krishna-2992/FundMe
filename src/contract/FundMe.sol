//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FundMe{

    mapping(address => uint256) private addressToAmountFunded;
    address[] private funders;
    address immutable public i_owner;

    constructor(){
        i_owner = msg.sender;
    }

    function fund() public payable {
        require(msg.value > 0, "send more than 0 ETH");
        if(addressToAmountFunded[msg.sender]==0){
            funders.push(msg.sender);
        }
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public{
        require(msg.sender == i_owner, "sender is not owner");
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "not sent the ethers");
    }

    function getBalance() public view returns(uint256) {
        return (address(this).balance);
    }

    function getFunders() public view returns(address[] memory) {
        return funders;
    }

    function getFundedAmount(address funder) public view returns(uint256) {
        return addressToAmountFunded[funder];
    }

    function getOwner() public view returns(address) {
        return i_owner;
    }
}