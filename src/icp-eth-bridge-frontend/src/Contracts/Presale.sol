// SPDX-License-Identifier: MIT
// 0x674F5509361eD9d816bd1cC8B1BeB06b0344b9Da
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenPresale is Ownable, ReentrancyGuard {
    IERC20 public token;

    uint256 public rate; // tokens per ETH
    uint256 public startTime;
    uint256 public endTime;
    uint256 public hardCap;
    uint256 public totalETHRaised;

    bool public isPaused;

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event TokensDeposited(uint256 amount);
    event ETHWithdrawn(uint256 amount);
    event RateChanged(uint256 newRate);
    event PresalePaused(bool status);

    modifier onlyWhileOpen() {
        require(block.timestamp >= startTime, "Presale has not started");
        require(block.timestamp <= endTime, "Presale has ended");
        require(!isPaused, "Presale is paused");
        _;
    }

    constructor(
        address _token,
        uint256 _rate,
        uint256 _durationInDays,
        uint256 _hardCap
    ) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        require(_rate > 0, "Rate must be > 0");
        require(_durationInDays > 0, "Duration must be > 0");
        require(_hardCap > 0, "Hard cap must be > 0");

        token = IERC20(_token);
        rate = _rate;
        startTime = block.timestamp;
        endTime = block.timestamp + (_durationInDays * 1 days);
        hardCap = _hardCap;
    }

    function depositTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit TokensDeposited(amount);
    }

    function buyTokens() public payable nonReentrant onlyWhileOpen {
        _buyTokens();
    }

    function _buyTokens() internal {
        require(msg.value > 0, "Send ETH to buy tokens");
        require(totalETHRaised + msg.value <= hardCap, "Hard cap reached");

        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount, "Not enough tokens");

        totalETHRaised += msg.value;
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");

        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    function setRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be > 0");
        rate = newRate;
        emit RateChanged(newRate);
    }

    function pausePresale(bool _status) external onlyOwner {
        isPaused = _status;
        emit PresalePaused(_status);
    }

    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
        emit ETHWithdrawn(balance);
    }

    function withdrawUnsoldTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(owner(), balance), "Token transfer failed");
    }

    function getTokenAmount(uint256 ethAmount) public view returns (uint256) {
        return ethAmount * rate;
    }

    function isPresaleActive() public view returns (bool) {
        return (block.timestamp >= startTime &&
                block.timestamp <= endTime &&
                !isPaused);
    }

    receive() external payable {
        _buyTokens();
    }

    fallback() external payable {
        _buyTokens();
    }
}
