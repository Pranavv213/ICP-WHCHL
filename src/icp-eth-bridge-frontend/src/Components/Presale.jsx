import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
} from "firebase/firestore";
import dayjs from 'dayjs';
import ResponsiveAppBar from './ResponsiveAppBar';

// Global Styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #0A0B14;
    color: #E0E0FF;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }
`;

// Animations
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at bottom, #0D0F18 0%, #07090F 100%);
`;

const MainContent = styled.main`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 120px;
`;

const Card = styled.div`
  background: rgba(16, 18, 37, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(110, 63, 253, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.36);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(90deg, rgba(110, 63, 253, 0.1) 0%, rgba(0, 255, 170, 0.05) 100%);
  border-bottom: 1px solid rgba(110, 63, 253, 0.2);
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(90deg, #9B7FFF 0%, #5BD8FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CardSubtitle = styled.p`
  margin: 0.5rem 0 0;
  color: rgba(224, 224, 255, 0.7);
  font-size: 0.9rem;
`;

const CardBody = styled.div`
  padding: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(224, 224, 255, 0.8);
  text-transform: capitalize;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(110, 63, 253, 0.3);
  background: rgba(10, 11, 20, 0.8);
  color: #E0E0FF;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  outline: none;

  &:focus {
    border-color: #6E3FFD;
    box-shadow: 0 0 0 2px rgba(110, 63, 253, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
`;

const PrimaryButton = styled.button`
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #6E3FFD 0%, #9A6AFF 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(110, 63, 253, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: rgba(110, 63, 253, 0.1);
  color: #9B7FFF;
  border: 1px solid rgba(110, 63, 253, 0.3);

  &:hover {
    background: rgba(110, 63, 253, 0.2);
    box-shadow: 0 4px 12px rgba(110, 63, 253, 0.1);
  }
`;

const WalletBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  background: rgba(110, 63, 253, 0.1);
  border: 1px solid rgba(110, 63, 253, 0.2);
  font-size: 0.875rem;
`;

const WalletAddress = styled.span`
  font-family: 'Roboto Mono', monospace;
  color: #5BD8FF;
`;

const WalletBalance = styled.span`
  color: #00FFAA;
  font-weight: 500;
`;

const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.connected ? '#00FFAA' : '#FF6B6B'};
  animation: ${pulse} 2s infinite;
`;

const ContractAddressBox = styled.div`
  margin-top: 2rem;
  padding: 1.25rem;
  background: rgba(110, 63, 253, 0.05);
  border-radius: 12px;
  border: 1px dashed rgba(110, 63, 253, 0.3);
`;

const ContractAddressLink = styled.a`
  font-family: 'Roboto Mono', monospace;
  color: #5BD8FF;
  word-break: break-all;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #9B7FFF;
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Icon = styled.span`
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
`;

const FooterNote = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: rgba(224, 224, 255, 0.6);
  font-size: 20px;
  cursor:pointer
`;

// Main Component
const Presale = () => {
  const { token_address } = useParams();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [presaleAddress, setPresaleAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [presaleParams, setPresaleParams] = useState({
    tokenAddress: token_address,
    tokenRate: '10000000',
    durationDays: '7',
    hardCap: '100',
  });


 

  const abi=[
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
];
  const bytecode="608060405234801561000f575f5ffd5b50604051612012380380612012833981810160405281019061003191906103fd565b335f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a2575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100999190610470565b60405180910390fd5b6100b1816102ab60201b60201c565b50600180819055505f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610127576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161011e906104e3565b60405180910390fd5b5f8311610169576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101609061054b565b60405180910390fd5b5f82116101ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101a2906105b3565b60405180910390fd5b5f81116101ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101e49061061b565b60405180910390fd5b8360025f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260038190555042600481905550620151808261024a9190610666565b4261025591906106a7565b600581905550806006819055503360085f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050506106da565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61039982610370565b9050919050565b6103a98161038f565b81146103b3575f5ffd5b50565b5f815190506103c4816103a0565b92915050565b5f819050919050565b6103dc816103ca565b81146103e6575f5ffd5b50565b5f815190506103f7816103d3565b92915050565b5f5f5f5f608085870312156104155761041461036c565b5b5f610422878288016103b6565b9450506020610433878288016103e9565b9350506040610444878288016103e9565b9250506060610455878288016103e9565b91505092959194509250565b61046a8161038f565b82525050565b5f6020820190506104835f830184610461565b92915050565b5f82825260208201905092915050565b7f496e76616c696420746f6b656e206164647265737300000000000000000000005f82015250565b5f6104cd601583610489565b91506104d882610499565b602082019050919050565b5f6020820190508181035f8301526104fa816104c1565b9050919050565b7f52617465206d757374206265203e2030000000000000000000000000000000005f82015250565b5f610535601083610489565b915061054082610501565b602082019050919050565b5f6020820190508181035f83015261056281610529565b9050919050565b7f4475726174696f6e206d757374206265203e20300000000000000000000000005f82015250565b5f61059d601483610489565b91506105a882610569565b602082019050919050565b5f6020820190508181035f8301526105ca81610591565b9050919050565b7f4861726420636170206d757374206265203e20300000000000000000000000005f82015250565b5f610605601483610489565b9150610610826105d1565b602082019050919050565b5f6020820190508181035f830152610632816105f9565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610670826103ca565b915061067b836103ca565b9250828202610689816103ca565b915082820484148315176106a05761069f610639565b5b5092915050565b5f6106b1826103ca565b91506106bc836103ca565b92508282019050808211156106d4576106d3610639565b5b92915050565b61192b806106e75f395ff3fe608060405260043610610117575f3560e01c8063b187bd261161009f578063dd49756e11610063578063dd49756e14610342578063e086e5ec1461036a578063f2fde38b14610380578063fb86a404146103a8578063fc0c546a146103d257610126565b8063b187bd2614610294578063c2507ac1146102be578063c8bdbfb6146102fa578063d0febe4c14610310578063d7299ef71461031a57610126565b806360d938dc116100e657806360d938dc146101d6578063715018a61461020057806378e9792514610216578063893d20e8146102405780638da5cb5b1461026a57610126565b806328f5c7b3146101305780632c4e722e1461015a5780633197cbb61461018457806334fcf437146101ae57610126565b36610126576101246103fc565b005b61012e6103fc565b005b34801561013b575f5ffd5b506101446106c2565b6040516101519190610fe0565b60405180910390f35b348015610165575f5ffd5b5061016e6106c8565b60405161017b9190610fe0565b60405180910390f35b34801561018f575f5ffd5b506101986106ce565b6040516101a59190610fe0565b60405180910390f35b3480156101b9575f5ffd5b506101d460048036038101906101cf9190611027565b6106d4565b005b3480156101e1575f5ffd5b506101ea61075f565b6040516101f7919061106c565b60405180910390f35b34801561020b575f5ffd5b50610214610792565b005b348015610221575f5ffd5b5061022a6107a5565b6040516102379190610fe0565b60405180910390f35b34801561024b575f5ffd5b506102546107ab565b60405161026191906110c4565b60405180910390f35b348015610275575f5ffd5b5061027e6107d3565b60405161028b91906110c4565b60405180910390f35b34801561029f575f5ffd5b506102a86107fa565b6040516102b5919061106c565b60405180910390f35b3480156102c9575f5ffd5b506102e460048036038101906102df9190611027565b61080d565b6040516102f19190610fe0565b60405180910390f35b348015610305575f5ffd5b5061030e610823565b005b6103186109ee565b005b348015610325575f5ffd5b50610340600480360381019061033b9190611107565b610ae2565b005b34801561034d575f5ffd5b5061036860048036038101906103639190611027565b610b3e565b005b348015610375575f5ffd5b5061037e610c9f565b005b34801561038b575f5ffd5b506103a660048036038101906103a1919061115c565b610d72565b005b3480156103b3575f5ffd5b506103bc610df6565b6040516103c99190610fe0565b60405180910390f35b3480156103dd575f5ffd5b506103e6610dfc565b6040516103f391906111e2565b60405180910390f35b5f341161043e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043590611255565b60405180910390fd5b6006543460075461044f91906112a0565b1115610490576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104879061131d565b60405180910390fd5b5f6003543461049f919061133b565b90508060025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016104fc91906110c4565b602060405180830381865afa158015610517573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061053b9190611390565b101561057c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161057390611405565b60405180910390fd5b3460075f82825461058d91906112a0565b9250508190555060025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b81526004016105f0929190611423565b6020604051808303815f875af115801561060c573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610630919061145e565b61066f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610666906114d3565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167f8fafebcaf9d154343dad25669bfa277f4fbacd7ac6b0c4fed522580e040a0f3334836040516106b79291906114f1565b60405180910390a250565b60075481565b60035481565b60055481565b6106dc610e21565b5f811161071e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161071590611562565b60405180910390fd5b806003819055507f595a30f13a69b616c4d568e2a2b7875fdfe86e4300a049953c76ee278f8f3f10816040516107549190610fe0565b60405180910390a150565b5f600454421015801561077457506005544211155b801561078d5750600860149054906101000a900460ff16155b905090565b61079a610e21565b6107a35f610ea8565b565b60045481565b5f60085f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600860149054906101000a900460ff1681565b5f6003548261081c919061133b565b9050919050565b61082b610e21565b5f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161088691906110c4565b602060405180830381865afa1580156108a1573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906108c59190611390565b90505f8111610909576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610900906115ca565b60405180910390fd5b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb61094e6107d3565b836040518363ffffffff1660e01b815260040161096c929190611423565b6020604051808303815f875af1158015610988573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109ac919061145e565b6109eb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109e2906114d3565b60405180910390fd5b50565b6109f6610f69565b600454421015610a3b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a3290611632565b60405180910390fd5b600554421115610a80576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a779061169a565b60405180910390fd5b600860149054906101000a900460ff1615610ad0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ac790611702565b60405180910390fd5b610ad86103fc565b610ae0610fb8565b565b610aea610e21565b80600860146101000a81548160ff0219169083151502179055507f66006354ac6a35f0f9b001e7cd8a73623bab487be4239f71fb1428656e7de6a681604051610b33919061106c565b60405180910390a150565b610b46610e21565b5f8111610b88576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7f9061176a565b60405180910390fd5b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b8152600401610be693929190611788565b6020604051808303815f875af1158015610c02573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610c26919061145e565b610c65576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c5c90611807565b60405180910390fd5b7f77acf75e237f9aae98f997395832d522bdb695e4a9bd07704936aa889a3667d181604051610c949190610fe0565b60405180910390a150565b610ca7610e21565b5f4790505f8111610ced576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ce49061186f565b60405180910390fd5b610cf56107d3565b73ffffffffffffffffffffffffffffffffffffffff166108fc8290811502906040515f60405180830381858888f19350505050158015610d37573d5f5f3e3d5ffd5b507f043f607a14d3b4f0a11a0b2e192bbfcd894298ba5abf22553be6081406db28aa81604051610d679190610fe0565b60405180910390a150565b610d7a610e21565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610dea575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610de191906110c4565b60405180910390fd5b610df381610ea8565b50565b60065481565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610e29610fc1565b73ffffffffffffffffffffffffffffffffffffffff16610e476107d3565b73ffffffffffffffffffffffffffffffffffffffff1614610ea657610e6a610fc1565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610e9d91906110c4565b60405180910390fd5b565b5f5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050815f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600260015403610fae576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fa5906118d7565b60405180910390fd5b6002600181905550565b60018081905550565b5f33905090565b5f819050919050565b610fda81610fc8565b82525050565b5f602082019050610ff35f830184610fd1565b92915050565b5f5ffd5b61100681610fc8565b8114611010575f5ffd5b50565b5f8135905061102181610ffd565b92915050565b5f6020828403121561103c5761103b610ff9565b5b5f61104984828501611013565b91505092915050565b5f8115159050919050565b61106681611052565b82525050565b5f60208201905061107f5f83018461105d565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6110ae82611085565b9050919050565b6110be816110a4565b82525050565b5f6020820190506110d75f8301846110b5565b92915050565b6110e681611052565b81146110f0575f5ffd5b50565b5f81359050611101816110dd565b92915050565b5f6020828403121561111c5761111b610ff9565b5b5f611129848285016110f3565b91505092915050565b61113b816110a4565b8114611145575f5ffd5b50565b5f8135905061115681611132565b92915050565b5f6020828403121561117157611170610ff9565b5b5f61117e84828501611148565b91505092915050565b5f819050919050565b5f6111aa6111a56111a084611085565b611187565b611085565b9050919050565b5f6111bb82611190565b9050919050565b5f6111cc826111b1565b9050919050565b6111dc816111c2565b82525050565b5f6020820190506111f55f8301846111d3565b92915050565b5f82825260208201905092915050565b7f53656e642045544820746f2062757920746f6b656e73000000000000000000005f82015250565b5f61123f6016836111fb565b915061124a8261120b565b602082019050919050565b5f6020820190508181035f83015261126c81611233565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6112aa82610fc8565b91506112b583610fc8565b92508282019050808211156112cd576112cc611273565b5b92915050565b7f48617264206361702072656163686564000000000000000000000000000000005f82015250565b5f6113076010836111fb565b9150611312826112d3565b602082019050919050565b5f6020820190508181035f830152611334816112fb565b9050919050565b5f61134582610fc8565b915061135083610fc8565b925082820261135e81610fc8565b9150828204841483151761137557611374611273565b5b5092915050565b5f8151905061138a81610ffd565b92915050565b5f602082840312156113a5576113a4610ff9565b5b5f6113b28482850161137c565b91505092915050565b7f4e6f7420656e6f75676820746f6b656e730000000000000000000000000000005f82015250565b5f6113ef6011836111fb565b91506113fa826113bb565b602082019050919050565b5f6020820190508181035f83015261141c816113e3565b9050919050565b5f6040820190506114365f8301856110b5565b6114436020830184610fd1565b9392505050565b5f81519050611458816110dd565b92915050565b5f6020828403121561147357611472610ff9565b5b5f6114808482850161144a565b91505092915050565b7f546f6b656e207472616e73666572206661696c656400000000000000000000005f82015250565b5f6114bd6015836111fb565b91506114c882611489565b602082019050919050565b5f6020820190508181035f8301526114ea816114b1565b9050919050565b5f6040820190506115045f830185610fd1565b6115116020830184610fd1565b9392505050565b7f52617465206d757374206265203e2030000000000000000000000000000000005f82015250565b5f61154c6010836111fb565b915061155782611518565b602082019050919050565b5f6020820190508181035f83015261157981611540565b9050919050565b7f4e6f20746f6b656e7320746f20776974686472617700000000000000000000005f82015250565b5f6115b46015836111fb565b91506115bf82611580565b602082019050919050565b5f6020820190508181035f8301526115e1816115a8565b9050919050565b7f50726573616c6520686173206e6f7420737461727465640000000000000000005f82015250565b5f61161c6017836111fb565b9150611627826115e8565b602082019050919050565b5f6020820190508181035f83015261164981611610565b9050919050565b7f50726573616c652068617320656e6465640000000000000000000000000000005f82015250565b5f6116846011836111fb565b915061168f82611650565b602082019050919050565b5f6020820190508181035f8301526116b181611678565b9050919050565b7f50726573616c65206973207061757365640000000000000000000000000000005f82015250565b5f6116ec6011836111fb565b91506116f7826116b8565b602082019050919050565b5f6020820190508181035f830152611719816116e0565b9050919050565b7f416d6f756e74206d757374206265203e203000000000000000000000000000005f82015250565b5f6117546012836111fb565b915061175f82611720565b602082019050919050565b5f6020820190508181035f83015261178181611748565b9050919050565b5f60608201905061179b5f8301866110b5565b6117a860208301856110b5565b6117b56040830184610fd1565b949350505050565b7f5472616e73666572206661696c656400000000000000000000000000000000005f82015250565b5f6117f1600f836111fb565b91506117fc826117bd565b602082019050919050565b5f6020820190508181035f83015261181e816117e5565b9050919050565b7f4e6f2045544820746f20776974686472617700000000000000000000000000005f82015250565b5f6118596012836111fb565b915061186482611825565b602082019050919050565b5f6020820190508181035f8301526118868161184d565b9050919050565b7f5265656e7472616e637947756172643a207265656e7472616e742063616c6c005f82015250565b5f6118c1601f836111fb565b91506118cc8261188d565b602082019050919050565b5f6020820190508181035f8301526118ee816118b5565b905091905056fea264697066735822122049c3af6c01513d4761c61b6b2ea4cb6428ed30a87a8ac7e0454892c51343c8f664736f6c634300081e0033"




  const isMetaMaskInstalled = () => Boolean(window.ethereum && window.ethereum.isMetaMask);

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask first!');
      return;
    }

    try {
      setIsConnecting(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(ethersProvider);
      setSigner(signer);
      setAccount(address);
      
      if (address !== localStorage.getItem('walletAddress')) {
        alert('Wallet address does not match');
        return;
      }
      
      await fetchBalance(ethersProvider, address);

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
      console.error("User denied account access:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else {
      setAccount(accounts[0]);
      if (provider) await fetchBalance(provider, accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const fetchBalance = async (provider, address) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const deployPresale = async () => {
    

    try {
      setIsLoading(true);
      
      const contract=ethers.Wallet.createRandom();

      const owner=ethers.Wallet.createRandom();

      setPresaleAddress(contract.address);
      setContract(contract);
      
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      await addDoc(collection(db, "presale"), {
        PresaleContractAddress: contract.address,
        TokenAddress: token_address,
        Email: localStorage.getItem('email'),
        OwnerAddress:owner.address,
        Rate: presaleParams.tokenRate,
        Duration: presaleParams.durationDays,
        CreationTime: now
      });

      window.location.href = `/presaleinteraction/${contract.address}`;
    } catch (error) {
      console.error("Deployment failed:", error);
      alert(`Deployment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPresaleParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {

    const add=ethers.Wallet.createRandom();
    setAccount(add.address)
    // connectWallet();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <ResponsiveAppBar 
          homeButtonStyle="outlined" 
          earnButtonStyle="outlined" 
          createButtonStyle="outlined" 
          chatButtonStyle="contained" 
          dashboardButtonStyle="outlined" 
          tokenButtonStyle="outlined"
          presaleButtonStyle="contained"
        />
        
        <MainContent>
          <Card>
            <CardHeader>
              <CardTitle>Launch Presale for your IP Token</CardTitle>
              <CardSubtitle>Configure your token presale parameters</CardSubtitle>
            </CardHeader>
            
            <CardBody>
              <FormGrid>
                {Object.entries(presaleParams).map(([key, value]) => (
                  <FormGroup key={key}>
                    <Label>{key.split(/(?=[A-Z])/).join(' ')}</Label>
                    <Input
                      type={key === 'tokenAddress' ? 'text' : 'number'}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      placeholder={key === 'tokenAddress' ? '0x...' : ''}
                      step={key.includes('Deposit') ? '0.1' : '1'}
                      disabled={key === 'tokenAddress'}
                    />
                  </FormGroup>
                ))}
              </FormGrid>

              <ButtonGroup>
                {!account ? (
                  <SecondaryButton onClick={connectWallet} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <LoadingSpinner />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Icon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                          </svg>
                        </Icon>
                        Connect Wallet
                      </>
                    )}
                  </SecondaryButton>
                ) : (
                  <WalletBadge>
                    <StatusIndicator connected />
                    <WalletAddress>
                      {account.substring(0, 6)}...{account.substring(account.length - 4)}
                    </WalletAddress>
                    <WalletBalance>{parseFloat(balance).toFixed(4)} ETH</WalletBalance>
                  </WalletBadge>
                )}

                <PrimaryButton 
                  onClick={deployPresale} 
                  disabled={!account || isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                      </Icon>
                      Launch Presale
                    </>
                  )}
                </PrimaryButton>
              </ButtonGroup>

              {presaleAddress && (
                <ContractAddressBox>
                  <h3>Presale Contract Deployed:</h3>
                  <ContractAddressLink
                    href={`https://etherscan.io/address/${presaleAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {presaleAddress}
                  </ContractAddressLink>
                </ContractAddressBox>
              )}
            </CardBody>
          </Card>

          <FooterNote onClick={()=>{
            window.location.href=`/liquidityadder/${token_address}`
          }}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'5px'}}>
            <div>SKIP</div> <div> </div>
            </div>
          </FooterNote>
        </MainContent>
      </Container>
    </>
  );
};

export default Presale;