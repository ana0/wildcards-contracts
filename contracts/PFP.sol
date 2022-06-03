// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SignatureValidator.sol";

contract PFP is Ownable, ERC721, SignatureValidator {
    uint256 public price;
    string public contractURI;
    bool public released;
    address public controller;
    uint256 public maxMint;

    mapping (uint256 => bool) public controllerNonces;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        //super.constructor(name_, symbol_);
    }

    function setPrice(uint256 price_) public onlyOwner {
        price = price_;
    }

    function setReleased(bool released_) public onlyOwner {
        released = released_;
    }

    function setMaxMint(uint256 maxMint_) public onlyOwner {
        maxMint = maxMint_;
    }

    function setController(address controller_) public onlyOwner {
        controller = controller_;
    }

    // function setBaseURI(string memory baseURI_) public onlyOwner {
    //     _setBaseURI(baseURI_);
    // }

    function setContractURI(string memory contractURI_) public onlyOwner {
        contractURI = contractURI_;
    }

    // function setTokenURI(uint256 tokenId_, string memory tokenURI_) public onlyOwner {
    //     _setTokenURI(tokenId_, tokenURI_);
    // }

    function withdraw() public onlyOwner {
        bool sent = payable(owner()).send(address(this).balance);
        require(sent, "Failed to send Ether");
    }

    function mint(uint256 tokenId_, uint256 nonce, bytes memory authorization) public payable {
        require(msg.value >= price, "Insufficient funds");
        require(tokenId_ <= maxMint, "Token id invalid");
        require(!controllerNonces[nonce], "Invalid nonce");
        require(verifyAuthorization(controller, msg.sender, tokenId_, nonce, authorization), "Invalid auth token");
        controllerNonces[nonce] = true;
        _safeMint(msg.sender, tokenId_);
    }

    function ownerMint(address to, uint256 tokenId_) public onlyOwner {
        _safeMint(to, tokenId_);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(released, "Token not released");
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(released, "Token not released");
        super.safeTransferFrom(from, to, tokenId, "");
    }
}