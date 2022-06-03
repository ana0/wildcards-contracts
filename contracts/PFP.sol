// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PFP is Ownable, ERC721 {
    uint256 public price;
    string public contractURI;
    bool public released;

    mapping (uint256 => bool) public forSale;
    mapping (string => bool) public mintCodes;

    function setPrice(uint256 price_) public onlyOwner {
        price = price_;
    }

    function setReleased(bool released_) public onlyOwner {
        released = released_;
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        _setBaseURI(baseURI_);
    }

    function setContractURI(string memory contractURI_) public onlyOwner {
        contractURI = contractURI_;
    }

    function setTokenURI(uint256 tokenId_, string memory tokenURI_) public onlyOwner {
        _setTokenURI(tokenId_, tokenURI_);
    }

    function withdraw() public onlyOwner {
        bool sent = payable(owner()).send(address(this).balance);
        require(sent, "Failed to send Ether");
    }

    function mint(string memory mintCode_, uint256 tokenId_) public {
        require(isOpen, "Not currently open to the public");
        require(msg.value >= price, "Insufficient funds");
        require(mintCodes[mintCode_] == true, "Mintcode invalid");
        _safeMint(msg.sender, tokenId);
    }

    function ownerMint(uint256 tokenId_) public onlyOwner {
        _safeMint(msg.sender, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(released, "Token not released");
        super transferFrom(address from, address to, uint256 tokenId)
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(released, "Token not released");
        super safeTransferFrom(from, to, tokenId, "");
    }
}