// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistry {
    struct User {
        string username;
        string profileHash;  // Could store IPFS hash for additional profile data
        bool isRegistered;
        uint256 registrationDate;
    }
    
    mapping(address => User) public users;
    
    event UserRegistered(address indexed userAddress, string username);
    
    function registerUser(string memory _username, string memory _profileHash) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        
        users[msg.sender] = User({
            username: _username,
            profileHash: _profileHash,
            isRegistered: true,
            registrationDate: block.timestamp
        });
        
        emit UserRegistered(msg.sender, _username);
    }
}