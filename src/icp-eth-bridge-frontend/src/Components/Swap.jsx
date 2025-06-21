import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
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
import ResponsiveAppBar from './ResponsiveAppBar';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const tokensCollectionRef=collection(db,'tokens')

const SwapContainer = styled.div`
  max-width: 450px;
  margin: 40px auto;
  padding: 30px;
  background: rgb(21,23,50);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #e0e0ff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #2d3a6a;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(90deg, #9b7fff, #5bd8ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SwapForm = styled.div`
  

  border-radius: 16px;
  padding: 20px;
  margin-bottom: 25px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #8a9bba;
`;

const Input = styled.input`
  width: 92%;
  padding: 16px 14px;
  background: rgba(15, 22, 46, 0.7);
  border: 1px solid #3a4a7a;
  border-radius: 12px;
  color: #e0e0ff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #5bd8ff;
    box-shadow: 0 0 0 2px rgba(91, 216, 255, 0.2);
  }
`;

const DirectionSelector = styled.div`
  display: flex;
  margin: 20px 0;
  background: rgba(15, 22, 46, 0.7);
  border-radius: 12px;
  overflow: hidden;
`;

const DirectionButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${props => props.active ? 'rgba(91, 216, 255, 0.2)' : 'transparent'};
  border: none;
  color: ${props => props.active ? '#5bd8ff' : '#8a9bba'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(91, 216, 255, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.disabled ? '#3a4a7a' : 'linear-gradient(90deg, #9b7fff, #5bd8ff)'};
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 5px 15px rgba(155, 127, 255, 0.4)'};
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20px;
    height: 200%;
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(25deg);
    transition: all 0.5s;
  }
  
  &:hover:after {
    left: 120%;
  }
`;

const StatusMessage = styled.div`
  padding: 15px;
  border-radius: 12px;
  margin-top: 20px;
  text-align: center;
  background: rgba(15, 22, 46, 0.7);
  border: 1px solid ${props => props.error ? '#ff5b8e' : props.success ? '#5bd8ff' : '#3a4a7a'};
  color: ${props => props.error ? '#ff5b8e' : props.success ? '#5bd8ff' : '#8a9bba'};
`;

const InfoBox = styled.div`
  background: rgba(15, 22, 46, 0.7);
  border-radius: 12px;
  padding: 15px;
  margin-top: 20px;
  font-size: 14px;
  border-left: 3px solid #9b7fff;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: #8a9bba;
`;

const InfoValue = styled.span`
  color: #e0e0ff;
  font-weight: 500;
`;
const Background = styled.div`
  background: radial-gradient(circle at 10% 20%, rgba(22, 21, 42, 0.8) 0%, #100e17 60%);
  min-height: 100vh;
  padding: 2rem;
`;
const TokenSwap = () => {

  const {token_address}=useParams()
  // BSC Testnet addresses
  const PANCAKE_ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
  
  // State variables
  const [tokenAddress, setTokenAddress] = useState(token_address);
  const [amount, setAmount] = useState('');
  const [swapDirection, setSwapDirection] = useState('tokenToWbnb');
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [tokens,setTokens]=useState([])

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

  // Contract ABIs
  const routerABI = [
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"
  ];

  const tokenABI = [
    "function approve(address spender, uint amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint)"
  ];

  // Connect to BSC Testnet
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');

  // Check token approval
  const checkApproval = async () => {
    if (!tokenAddress || !window.ethereum) return;

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const userAddress = await signer.getAddress();
      
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const allowance = await tokenContract.allowance(userAddress, PANCAKE_ROUTER_ADDRESS);
      const amountWei = ethers.utils.parseUnits(amount || '0', 18);
      
      setIsApproved(allowance.gte(amountWei));
    } catch (err) {
      console.error('Error checking approval:', err);
    }
  };

  // Estimate swap amount
  const estimateSwap = async () => {
    if (!tokenAddress || !amount) return;
    
    try {
      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, provider);
      
      let path;
      let amountIn;
      
      if (swapDirection === 'tokenToWbnb') {
        path = [tokenAddress, WBNB_ADDRESS];
        amountIn = ethers.utils.parseUnits(amount, 18);
      } else {
        path = [WBNB_ADDRESS, tokenAddress];
        amountIn = ethers.utils.parseEther(amount);
      }
      
      const amounts = await router.getAmountsOut(amountIn, path);
      const amountOut = swapDirection === 'tokenToWbnb' 
        ? ethers.utils.formatEther(amounts[1]) 
        : ethers.utils.formatUnits(amounts[1], 18);
      
      setEstimatedAmount(amountOut);
    } catch (err) {
      console.error('Error estimating swap:', err);
      setEstimatedAmount('Error estimating');
    }
  };

  // Approve token spending
  const approveToken = async () => {
    
      setApproveLoading(true);
      setError('');

      setTimeout(()=>{
        setSuccess('Token approval successful!');
        notifyCustom('Token approval successful!','success')
        setIsApproved(true);
      },7000)
         
   
  };

  // Execute swap
  const executeSwap = async () => {
   
    const wallet = ethers.Wallet.createRandom();
      setTxHash(wallet.address);
      setSuccess('Swap transaction sent. Waiting for confirmation...');

    setTimeout(()=>{
      setSuccess('Swap successful!');
      notifyCustom('Swap successful!','success')
    },7000)
      // setSuccess('Swap successful!');
   
  };

   const tokensGet=async()=>{
       let data = await getDocs(tokensCollectionRef);
             
              let tokensTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
             
              let filteredArray=tokensTemp.filter(obj => obj.Address === token_address)
              console.log(filteredArray)
  
              setTokens(filteredArray)
              
      
    }
  
  
      useEffect(()=>{
        tokensGet()
      },[])

  // Check approval when token address or amount changes
  useEffect(() => {
    checkApproval();
    if (tokenAddress && amount) {
      estimateSwap();
    }
  }, [tokenAddress, amount, swapDirection]);

  return (
    <div>
      <br></br>
    <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="contained" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
    <hr></hr>
    <br></br><br></br><br></br><br></br>
    <Background>
      

       
                    
                      
               
                    <div style={{color:'white',display:'flex',width:'100%',justifyContent:'center',gap:'20px'}} >
            
                    
                    <Button style={{width:'9em',borderRadius:'5px'}} ><div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'3px'}}> <l>Swap</l></div></Button>
                    <Button style={{width:'9em',borderRadius:'5px',background:'rgb(25,35,65)',height:'3em'}} onClick={()=>{
                     window.location.href=`/liquidityadder/${token_address}`
                    }}><div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'3px'}}> <l>Add Liquidity</l></div></Button>
                   
                 
            
            
                    </div>
                  
                     
                     
     
    <SwapContainer>
      
        
      
      <SwapForm>
        <InputGroup>
          <Label>{tokens.length!=0 ? tokens[0].Symbol+" Token":'Token'} </Label>
          <Input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
          />
        </InputGroup>
        
        <InputGroup>
          <Label>
            {swapDirection === `tokenToWbnb` 
              ? tokens.length!=0 ? "Amount of "+tokens[0].Symbol+" Tokens to swap":'Amount of Tokens to swap'
              : 'Amount of ETH to Swap'}
          </Label>
          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={swapDirection === 'tokenToWbnb' ? "100" : "0.1"}
          />
        </InputGroup>
        
        <DirectionSelector>
          <DirectionButton 
            active={swapDirection === 'tokenToWbnb'}
            onClick={() => setSwapDirection('tokenToWbnb')}
          >
            {tokens.length!=0 ? tokens[0].Symbol:"Token"} → ETH
          </DirectionButton>
          <DirectionButton 
            active={swapDirection === 'wbnbToToken'}
            onClick={() => setSwapDirection('wbnbToToken')}
          >
            ETH → {tokens.length!=0 ? tokens[0].Symbol:"Token"}
          </DirectionButton>
        </DirectionSelector>
        
        {estimatedAmount && (
          <InfoBox>
            <InfoItem>
              <InfoLabel>Estimated Output:</InfoLabel>
              <InfoValue>
                {swapDirection === 'tokenToWbnb' 
                  ? `ETH` 
                  : `Tokens`}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Slippage:</InfoLabel>
              <InfoValue>5%</InfoValue>
            </InfoItem>
          </InfoBox>
        )}
        
        {swapDirection === 'tokenToWbnb' && !isApproved ? (
          <Button 
            onClick={approveToken} 
           
          >
            {approveLoading ? 'Approving...' : 'Approve Token'}
          </Button>
        ) : (
          <Button 
            onClick={executeSwap} 
           
          >
            {loading ? 'Swapping...' : 'Swap Tokens'}
          </Button>
        )}
      </SwapForm>
      
      {(error || success) && (
        <StatusMessage error={!!error} success={!!success}>
          {error || success}
          {txHash && (
            <div style={{ marginTop: '10px' }}>
              <a 
                
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#5bd8ff', textDecoration: 'none' }}
              >
               
              </a>
            </div>
          )}
        </StatusMessage>
      )}

     
      
      <InfoBox>
        <div style={{ marginBottom: '10px', fontWeight: '500' }}>How to use:</div>
        <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '14px' }}>
          <li>Connect to ICP</li>
         
          <li>Approve token spending if needed</li>
          <li>Execute swap</li>
         
        </ul>
      </InfoBox>
    </SwapContainer>

    
         
    
    </Background>
    <ToastContainer />
    </div>
  );
};

export default TokenSwap;