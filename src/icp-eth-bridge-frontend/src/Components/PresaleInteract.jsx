import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import styled, { keyframes, css } from 'styled-components';
import tokenABI from '../Contracts/CONABI.json';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import ResponsiveAppBar from './ResponsiveAppBar';

// Animations
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.7); }
  70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(138, 43, 226, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(138, 43, 226, 0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const spinAnimation = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  background: linear-gradient(135deg, rgba(30, 30, 45, 0.9) 0%, rgba(20, 20, 35, 0.95) 100%);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(154, 106, 255, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
    border-color: rgba(154, 106, 255, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(154, 106, 255, 0.1) 0%,
      rgba(0, 255, 170, 0.05) 50%,
      rgba(154, 106, 255, 0.1) 100%
    );
    animation: ${gradientAnimation} 15s ease infinite;
    z-index: -1;
    opacity: 0.5;
  }
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;
  text-shadow: 0 0 15px rgba(154, 106, 255, 0.6);
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 120px;
    height: 4px;
    background: linear-gradient(to right, #9a6aff, #00ffaa);
    border-radius: 3px;
  }
`;

const TitleIcon = styled.span`
  display: inline-flex;
  margin-right: 12px;
  color: #9a6aff;
`;

const Subtitle = styled.h3`
  color: rgba(224, 224, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0.5rem 0 2rem 0;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 1.2rem 1.5rem;
  border-radius: 14px;
  border: 1px solid rgba(154, 106, 255, 0.3);
  background: rgba(18, 18, 26, 0.8);
  color: #e0e0ff;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  font-family: 'Roboto Mono', monospace;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: none;
    border-color: #9a6aff;
    box-shadow: 0 0 0 3px rgba(154, 106, 255, 0.2), inset 0 2px 5px rgba(0, 0, 0, 0.3);
    background: rgba(18, 18, 26, 0.9);
  }

  &::placeholder {
    color: rgba(224, 224, 255, 0.4);
    font-family: 'Roboto', sans-serif;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6e3ffd 0%, #9a6aff 100%);
  color: white;
  border: none;
  padding: 1.2rem 2.2rem;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  min-width: 180px;
  box-shadow: 0 5px 15px rgba(110, 63, 253, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(154, 106, 255, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background: rgba(42, 42, 61, 0.7);
    color: rgba(184, 184, 214, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #9a6aff 0%, #00ffaa 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 1;
  }

  ${props => props.secondary && css`
    background: rgba(42, 42, 61, 0.7);
    border: 1px solid rgba(154, 106, 255, 0.3);
    
    &:hover {
      background: rgba(42, 42, 61, 0.9);
      border-color: rgba(154, 106, 255, 0.5);
    }
  `}
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, rgba(42, 42, 61, 0.6) 0%, rgba(30, 30, 45, 0.7) 100%);
  border-radius: 18px;
  padding: 1.8rem;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(154, 106, 255, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  animation: ${floatAnimation} 6s ease-in-out infinite;

  &:hover {
    border-color: rgba(154, 106, 255, 0.4);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    transform: translateY(-3px);
  }

  h3 {
    margin: 0 0 1.5rem 0;
    color: #9a6aff;
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #9a6aff;
      margin-right: 0.8rem;
      box-shadow: 0 0 15px #9a6aff;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.8rem;
  margin-top: 1.5rem;
`;

const InfoItem = styled.div`
  background: rgba(110, 63, 253, 0.15);
  padding: 1.8rem;
  border-radius: 14px;
  border: 1px solid rgba(154, 106, 255, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(154, 106, 255, 0.4);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(154, 106, 255, 0.1) 0%, rgba(0, 255, 170, 0.05) 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #b8b8d6;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const InfoValue = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
  word-break: break-all;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
  font-family: 'Roboto Mono', monospace;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  background: rgba(255, 77, 77, 0.15);
  padding: 1.4rem;
  border-radius: 14px;
  margin: 2rem 0;
  border: 1px solid rgba(255, 77, 77, 0.3);
  backdrop-filter: blur(5px);
  animation: ${pulseAnimation} 2s infinite;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const SuccessMessage = styled(ErrorMessage)`
  color: #00ffaa;
  background: rgba(0, 255, 170, 0.15);
  border: 1px solid rgba(0, 255, 170, 0.3);
  animation: none;

  &::before {
    content: '✓';
  }
`;

const WalletAddress = styled.div`
  background: rgba(154, 106, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  border: 1px solid rgba(154, 106, 255, 0.2);
  font-family: 'Roboto Mono', monospace;
  font-size: 0.95rem;
  color: #9a6aff;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(154, 106, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(154, 106, 255, 0.2);
  }

  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00ffaa;
    margin-right: 0.8rem;
    box-shadow: 0 0 10px #00ffaa;
  }

  &::after {
    content: 'Copy';
    position: absolute;
    right: -50px;
    background: rgba(0, 255, 170, 0.2);
    padding: 0 10px;
    border-radius: 10px;
    font-size: 0.7rem;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::after {
    right: 10px;
    opacity: 1;
  }
`;

const LoadingIndicator = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(154, 106, 255, 0.3);
  border-radius: 50%;
  border-top-color: #9a6aff;
  animation: ${spinAnimation} 1s ease-in-out infinite;
  margin-left: 12px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(42, 42, 61, 0.7);
  border-radius: 4px;
  margin: 1.5rem 0;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, #9a6aff, #00ffaa);
  border-radius: 4px;
  width: ${props => props.percentage}%;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: rgba(224, 224, 255, 0.8);
  margin-bottom: 0.5rem;
`;

const TokenIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(154, 106, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #9a6aff;
  font-size: 1.2rem;
  border: 2px solid rgba(154, 106, 255, 0.3);
`;

const TokenInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(18, 18, 26, 0.8);
  border-radius: 14px;
  padding: 0 1rem;
  border: 1px solid rgba(154, 106, 255, 0.3);
  flex: 1;
`;

const MaxButton = styled.button`
  background: rgba(154, 106, 255, 0.1);
  border: none;
  color: #9a6aff;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(154, 106, 255, 0.2);
  }
`;

const TokenBalance = styled.div`
  font-size: 0.9rem;
  color: rgba(224, 224, 255, 0.6);
  margin-top: 0.5rem;
  text-align: right;
`;

const ContractLink = styled.a`
  color: #9a6aff;
  text-decoration: none;
  border-bottom: 1px dashed rgba(154, 106, 255, 0.5);
  transition: all 0.3s ease;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.9rem;

  &:hover {
    color: #00ffaa;
    border-bottom-color: rgba(0, 255, 170, 0.5);
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(154, 106, 255, 0.3), transparent);
  margin: 2rem 0;
`;
// Presale ABI (same as before)
const PRESALE_ABI  = [
	{
		"inputs": [],
		"name": "buyTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "depositTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_rate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_durationInDays",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_hardCap",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ETHWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "pausePresale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "PresalePaused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRate",
				"type": "uint256"
			}
		],
		"name": "RateChanged",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newRate",
				"type": "uint256"
			}
		],
		"name": "setRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensDeposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ethAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			}
		],
		"name": "TokensPurchased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "withdrawETH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawUnsoldTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "endTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ethAmount",
				"type": "uint256"
			}
		],
		"name": "getTokenAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hardCap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isPaused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isPresaleActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalETHRaised",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]






const PresaleInteraction = () => {
  const { contract_address } = useParams();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [presaleInfo, setPresaleInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState('Deposit');
  const [isProcessing1, setIsProcessing1] = useState('Buy');
  const [copied, setCopied] = useState(false);
  const [raisedAmount, setRaisedAmount] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    
  }, []);

  // Load contract after signer is set
  useEffect(() => {
    
  }, [signer, contract_address, account]);

  const handleBuyTokens = async () => {
    if (!contract || !ethAmount) {
      setError('Please enter an ETH amount');
      return;
    }
    
    try {
      setIsProcessing1('Approving...');
      const tx = await contract.buyTokens({
        value: ethers.utils.parseEther(ethAmount.toString())
      });

      setIsProcessing1('Buying Tokens...');
      await tx.wait();
      setIsProcessing1('Buy Successful');
      setSuccess(`Successfully purchased tokens with ${ethAmount} ETH`);
      setEthAmount('');
      
      // Refresh data
      const raised = await contract.totalETHRaised();
      setRaisedAmount(ethers.utils.formatUnits(raised, 18));
    } catch (err) {
      setError('Failed to buy tokens: ' + (err.message || err.data?.message || 'Unknown error'));
      setIsProcessing1('Buy');
    }
  };

  const handleDepositTokens = async () => {
   

      setIsProcessing('Depositing Tokens...');
      
      setIsProcessing('Deposit Successful');
      setSuccess(`Successfully deposited ${tokenAmount} tokens`);
      setTokenAmount('');
      window.location.href = `/presalelist`;
      
     
      // setTokenBalance(ethers.utils.formatUnits(newBalance, 18));
    
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMaxEth = () => {
    // In a real app, you might want to get the user's ETH balance
    setEthAmount('1'); // Example value
  };

  const handleMaxTokens = () => {
    setTokenAmount(tokenBalance);
  };

  return (
    <div>
      <ResponsiveAppBar 
          homeButtonStyle="outlined" 
          earnButtonStyle="outlined" 
          createButtonStyle="outlined" 
          chatButtonStyle="contained" 
          dashboardButtonStyle="outlined" 
          tokenButtonStyle="outlined"
          presaleButtonStyle="contained"
        />
      <br></br> <br></br> <br></br> <br></br>
      
      <Container>
        <Title>
          <TitleIcon>🪙</TitleIcon>
          PRESALE DASHBOARD
        </Title>
        <Subtitle>Manage and participate in the token presale</Subtitle>
        
     
          <>
           
             

            <SectionDivider />

            <InfoCard>
              <h3>PARTICIPATE IN PRESALE</h3>
              

            
                  <InputGroup>
                    <TokenInputWrapper>
                      <TokenIcon>🪙</TokenIcon>
                      <Input
                        type="number"
                        placeholder="Token amount to deposit"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                      />
                      <MaxButton onClick={handleMaxTokens}>MAX</MaxButton>
                    </TokenInputWrapper>
                    <Button
                      onClick={handleDepositTokens}
                      disabled={!tokenAmount || isProcessing.includes('...')}
                    >
                      {isProcessing}
                      {isProcessing.includes('...') && <LoadingIndicator />}
                    </Button>
                  </InputGroup>
                 
             
             
           
           
            </InfoCard>
          </>

      </Container>
    </div>
  );
};

export default PresaleInteraction;


