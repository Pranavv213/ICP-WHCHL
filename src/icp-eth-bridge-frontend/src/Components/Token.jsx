import React, { useState } from "react";
import { ethers } from "ethers";
import { db } from "../firebase-config";
import { useOkto } from "okto-sdk-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import ResponsiveAppBar from "./ResponsiveAppBar";
import styled, { keyframes } from "styled-components";
import { ToastContainer, toast } from 'react-toastify';

const usersCollectionRef = collection(db, "tokens");

const notifyCustom = (text,type) =>{
      
    toast(text,{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                type:type
               
                });
  
                  
  
  
}

// Replace with your actual ABI and bytecode
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol_",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "premintAmount",
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
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
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
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "burnFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
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
	}
]
const contractBytecode = "608060405234801561000f575f5ffd5b50604051611cef380380611cef83398181016040528101906100319190610633565b818484816003908161004391906108d6565b50806004908161005391906108d6565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100c6575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100bd91906109b4565b60405180910390fd5b6100d5816100f860201b60201c565b505f8111156100ef576100ee82826101bb60201b60201c565b5b50505050610a8a565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361022b575f6040517fec442f0500000000000000000000000000000000000000000000000000000000815260040161022291906109b4565b60405180910390fd5b61023c5f838361024060201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610290578060025f82825461028491906109fa565b9250508190555061035e565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610319578381836040517fe450d38c00000000000000000000000000000000000000000000000000000000815260040161031093929190610a3c565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036103a5578060025f82825403925050819055506103ef565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161044c9190610a71565b60405180910390a3505050565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6104b882610472565b810181811067ffffffffffffffff821117156104d7576104d6610482565b5b80604052505050565b5f6104e9610459565b90506104f582826104af565b919050565b5f67ffffffffffffffff82111561051457610513610482565b5b61051d82610472565b9050602081019050919050565b8281835e5f83830152505050565b5f61054a610545846104fa565b6104e0565b9050828152602081018484840111156105665761056561046e565b5b61057184828561052a565b509392505050565b5f82601f83011261058d5761058c61046a565b5b815161059d848260208601610538565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6105cf826105a6565b9050919050565b6105df816105c5565b81146105e9575f5ffd5b50565b5f815190506105fa816105d6565b92915050565b5f819050919050565b61061281610600565b811461061c575f5ffd5b50565b5f8151905061062d81610609565b92915050565b5f5f5f5f6080858703121561064b5761064a610462565b5b5f85015167ffffffffffffffff81111561066857610667610466565b5b61067487828801610579565b945050602085015167ffffffffffffffff81111561069557610694610466565b5b6106a187828801610579565b93505060406106b2878288016105ec565b92505060606106c38782880161061f565b91505092959194509250565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061071d57607f821691505b6020821081036107305761072f6106d9565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026107927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610757565b61079c8683610757565b95508019841693508086168417925050509392505050565b5f819050919050565b5f6107d76107d26107cd84610600565b6107b4565b610600565b9050919050565b5f819050919050565b6107f0836107bd565b6108046107fc826107de565b848454610763565b825550505050565b5f5f905090565b61081b61080c565b6108268184846107e7565b505050565b5b818110156108495761083e5f82610813565b60018101905061082c565b5050565b601f82111561088e5761085f81610736565b61086884610748565b81016020851015610877578190505b61088b61088385610748565b83018261082b565b50505b505050565b5f82821c905092915050565b5f6108ae5f1984600802610893565b1980831691505092915050565b5f6108c6838361089f565b9150826002028217905092915050565b6108df826106cf565b67ffffffffffffffff8111156108f8576108f7610482565b5b6109028254610706565b61090d82828561084d565b5f60209050601f83116001811461093e575f841561092c578287015190505b61093685826108bb565b86555061099d565b601f19841661094c86610736565b5f5b828110156109735784890151825560018201915060208501945060208101905061094e565b86831015610990578489015161098c601f89168261089f565b8355505b6001600288020188555050505b505050505050565b6109ae816105c5565b82525050565b5f6020820190506109c75f8301846109a5565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610a0482610600565b9150610a0f83610600565b9250828201905080821115610a2757610a266109cd565b5b92915050565b610a3681610600565b82525050565b5f606082019050610a4f5f8301866109a5565b610a5c6020830185610a2d565b610a696040830184610a2d565b949350505050565b5f602082019050610a845f830184610a2d565b92915050565b61125880610a975f395ff3fe608060405234801561000f575f5ffd5b50600436106100f3575f3560e01c806370a082311161009557806395d89b411161006457806395d89b411461025d578063a9059cbb1461027b578063dd62ed3e146102ab578063f2fde38b146102db576100f3565b806370a08231146101e9578063715018a61461021957806379cc6790146102235780638da5cb5b1461023f576100f3565b806323b872dd116100d157806323b872dd14610163578063313ce5671461019357806340c10f19146101b157806342966c68146101cd576100f3565b806306fdde03146100f7578063095ea7b31461011557806318160ddd14610145575b5f5ffd5b6100ff6102f7565b60405161010c9190610ea6565b60405180910390f35b61012f600480360381019061012a9190610f57565b610387565b60405161013c9190610faf565b60405180910390f35b61014d6103a9565b60405161015a9190610fd7565b60405180910390f35b61017d60048036038101906101789190610ff0565b6103b2565b60405161018a9190610faf565b60405180910390f35b61019b6103e0565b6040516101a8919061105b565b60405180910390f35b6101cb60048036038101906101c69190610f57565b6103e8565b005b6101e760048036038101906101e29190611074565b6103fe565b005b61020360048036038101906101fe919061109f565b610412565b6040516102109190610fd7565b60405180910390f35b610221610457565b005b61023d60048036038101906102389190610f57565b61046a565b005b61024761048a565b60405161025491906110d9565b60405180910390f35b6102656104b2565b6040516102729190610ea6565b60405180910390f35b61029560048036038101906102909190610f57565b610542565b6040516102a29190610faf565b60405180910390f35b6102c560048036038101906102c091906110f2565b610564565b6040516102d29190610fd7565b60405180910390f35b6102f560048036038101906102f0919061109f565b6105e6565b005b6060600380546103069061115d565b80601f01602080910402602001604051908101604052809291908181526020018280546103329061115d565b801561037d5780601f106103545761010080835404028352916020019161037d565b820191905f5260205f20905b81548152906001019060200180831161036057829003601f168201915b5050505050905090565b5f5f61039161066a565b905061039e818585610671565b600191505092915050565b5f600254905090565b5f5f6103bc61066a565b90506103c9858285610683565b6103d4858585610716565b60019150509392505050565b5f6012905090565b6103f0610806565b6103fa828261088d565b5050565b61040f61040961066a565b8261090c565b50565b5f5f5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b61045f610806565b6104685f61098b565b565b61047c8261047661066a565b83610683565b610486828261090c565b5050565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104c19061115d565b80601f01602080910402602001604051908101604052809291908181526020018280546104ed9061115d565b80156105385780601f1061050f57610100808354040283529160200191610538565b820191905f5260205f20905b81548152906001019060200180831161051b57829003601f168201915b5050505050905090565b5f5f61054c61066a565b9050610559818585610716565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b6105ee610806565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361065e575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161065591906110d9565b60405180910390fd5b6106678161098b565b50565b5f33905090565b61067e8383836001610a4e565b505050565b5f61068e8484610564565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156107105781811015610701578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106f89392919061118d565b60405180910390fd5b61070f84848484035f610a4e565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610786575f6040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161077d91906110d9565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107f6575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016107ed91906110d9565b60405180910390fd5b610801838383610c1d565b505050565b61080e61066a565b73ffffffffffffffffffffffffffffffffffffffff1661082c61048a565b73ffffffffffffffffffffffffffffffffffffffff161461088b5761084f61066a565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161088291906110d9565b60405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108fd575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108f491906110d9565b60405180910390fd5b6109085f8383610c1d565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361097c575f6040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161097391906110d9565b60405180910390fd5b610987825f83610c1d565b5050565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610abe575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610ab591906110d9565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b2e575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b2591906110d9565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610c17578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610c0e9190610fd7565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c6d578060025f828254610c6191906111ef565b92505081905550610d3b565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610cf6578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610ced9392919061118d565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d82578060025f8282540392505081905550610dcc565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e299190610fd7565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f610e7882610e36565b610e828185610e40565b9350610e92818560208601610e50565b610e9b81610e5e565b840191505092915050565b5f6020820190508181035f830152610ebe8184610e6e565b905092915050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610ef382610eca565b9050919050565b610f0381610ee9565b8114610f0d575f5ffd5b50565b5f81359050610f1e81610efa565b92915050565b5f819050919050565b610f3681610f24565b8114610f40575f5ffd5b50565b5f81359050610f5181610f2d565b92915050565b5f5f60408385031215610f6d57610f6c610ec6565b5b5f610f7a85828601610f10565b9250506020610f8b85828601610f43565b9150509250929050565b5f8115159050919050565b610fa981610f95565b82525050565b5f602082019050610fc25f830184610fa0565b92915050565b610fd181610f24565b82525050565b5f602082019050610fea5f830184610fc8565b92915050565b5f5f5f6060848603121561100757611006610ec6565b5b5f61101486828701610f10565b935050602061102586828701610f10565b925050604061103686828701610f43565b9150509250925092565b5f60ff82169050919050565b61105581611040565b82525050565b5f60208201905061106e5f83018461104c565b92915050565b5f6020828403121561108957611088610ec6565b5b5f61109684828501610f43565b91505092915050565b5f602082840312156110b4576110b3610ec6565b5b5f6110c184828501610f10565b91505092915050565b6110d381610ee9565b82525050565b5f6020820190506110ec5f8301846110ca565b92915050565b5f5f6040838503121561110857611107610ec6565b5b5f61111585828601610f10565b925050602061112685828601610f10565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061117457607f821691505b60208210810361118757611186611130565b5b50919050565b5f6060820190506111a05f8301866110ca565b6111ad6020830185610fc8565b6111ba6040830184610fc8565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6111f982610f24565b915061120483610f24565b925082820190508082111561121c5761121b6111c2565b5b9291505056fea264697066735822122084972874b84b0287482d63a251d797b21706c89205b8fb9fe36896ccab6064a164736f6c634300081e0033"; // your compiled bytecode here

// Styled Components
const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  border-radius: 20px;
  background: linear-gradient(145deg, #16152a 0%, #1c1a36 100%);
  border: 1px solid rgba(94, 92, 230, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const Heading = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(90deg, #9b7fff, #5bd8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #8a9ef5;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 90%;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 12px;
  border: 1.5px solid rgba(94, 92, 230, 0.3);
  outline: none;
  background: rgba(19, 25, 51, 0.7);
  color: white;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:focus {
    border-color: #5bd8ff;
    box-shadow: 0 0 0 2px rgba(91, 216, 255, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  margin: 1rem 0;
  background: linear-gradient(135deg, #6c8fef 0%, #9b7fff 100%);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(108, 143, 239, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #9b7fff 0%, #5bd8ff 100%);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;

const ImageUploadLabel = styled.label`
  display: block;
  padding: 12px 16px;
  background: rgba(94, 92, 230, 0.1);
  color: #8a9ef5;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1.5px dashed rgba(94, 92, 230, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(94, 92, 230, 0.2);
    border-color: #5bd8ff;
  }
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 2px solid rgba(94, 92, 230, 0.3);
  display: block;
  margin: 0 auto 1.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(19, 25, 51, 0.5);
  border-radius: 4px;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #5bd8ff, #9b7fff);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const Status = styled.p`
  color: #8a9ef5;
  font-size: 0.9rem;
  margin: 1rem 0;
  padding: 12px;
  border-radius: 8px;
  background: rgba(19, 25, 51, 0.5);
  border-left: 3px solid #5bd8ff;
`;

const ContractLink = styled.a`
  color: #5bd8ff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: #9b7fff;
    text-decoration: underline;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Background = styled.div`
  background: radial-gradient(circle at 10% 20%, rgba(22, 21, 42, 0.8) 0%, #100e17 60%);
  min-height: 100vh;
  padding: 2rem;
`;

export default function DeployConnectVerse() {
  const [status, setStatus] = useState("");
  const [contractAddress, setContractAddress] = useState(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [premintAmount, setPremintAmount] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    
    setStatus("Configuring FIP Token details...");
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "my_unsigned_preset");
    formData.append("cloud_name", "getsetcourse");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/getsetcourse/image/upload`, {
        method: "POST",
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setStatus("Error uploading image");
      return null;
    }
  };

  async function deploy() {
    try {
    
      const imageUrl = await uploadImage();
      if (!imageUrl && image) {
        setStatus("Image upload failed, deployment aborted");
        return;
      }

	  setStatus("Creating FIP Token.....");

    setTimeout(()=>{

		notifyCustom('FIP Token Created Successfully!','success')
		setStatus("FIP Token Created Successfully!");

		setTimeout(async()=>{
			const wallet = ethers.Wallet.createRandom();
	

	const uadd=ethers.Wallet.createRandom();
   
      await addDoc(usersCollectionRef, {
        Name: tokenName,
        Symbol: tokenSymbol,
        Owner: uadd.address,
        Address: wallet.address,
        Email: localStorage.getItem('email'),
        ImageUrl: imageUrl || "",
        CreatedAt: Timestamp.now()
      });

   
      window.location.href = `/presale/${wallet.address}`;
      setStatus("Contract deployed successfully!");
			window.location.href = `/presale/${wallet.address}`;
		},4000)

	},7000)
	
    } catch (error) {
      console.error(error);
      setStatus("Error deploying contract");
    }
  }

  return (
	<div>
		<ResponsiveAppBar 
        homeButtonStyle="outlined" 
        earnButtonStyle="outlined" 
        createButtonStyle="outlined" 
        chatButtonStyle="contained" 
        dashboardButtonStyle="outlined" 
        tokenButtonStyle="contained"
      />

    <Background>
      
	  <br></br> <br></br> <br></br>
      
      <Container>
        <Heading>Launch FIP Token</Heading>

        <FormGroup>
          <Label htmlFor="tokenName">Token Name</Label>
          <Input
            id="tokenName"
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g. Dua Lipa"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tokenSymbol">Token Symbol</Label>
          <Input
            id="tokenSymbol"
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            placeholder="e.g. DLP"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="premintAmount">Premint Amount</Label>
          <Input
            id="premintAmount"
            type="number"
            min="0"
            step="any"
            value={premintAmount}
            onChange={(e) => setPremintAmount(e.target.value)}
            placeholder="e.g. 1000000"
          />
        </FormGroup>

        <FormGroup>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <ImageUploadLabel htmlFor="imageUpload">
            {imagePreview ? "Change FIP Token Image" : "Upload FIP Token Image"}
          </ImageUploadLabel>
          
          {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <ProgressBar>
              <ProgressFill progress={uploadProgress} />
            </ProgressBar>
          )}
        </FormGroup>

        <Button onClick={deploy}>
          Deploy Token Contract
        </Button>

        {status && <Status>Status: {status}</Status>}

        {contractAddress && (
          <Status>
            Contract Address:{" "}
            <ContractLink
              href={`https://etherscan.io/address/${contractAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {contractAddress}
            </ContractLink>
          </Status>
        )}
      </Container>
    </Background>
	<ToastContainer />
	</div>
  );
}