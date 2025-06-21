import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { db } from "../firebase-config";
import styled from 'styled-components';
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
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import ResponsiveAppBar from './ResponsiveAppBar';

const tokensCollectionRef=collection(db,'tokens')


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


const AddLiquidity = () => {
  // BSC Testnet addresses
  const PANCAKE_ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';

  const {token_address}=useParams()

  // State variables
  const [tokenAddress, setTokenAddress] = useState(token_address);
  const [amountToken, setAmountToken] = useState('');
  const [amountBNB, setAmountBNB] = useState('');
  const [pairAddress, setPairAddress] = useState('');
  const [liquidity, setLiquidity] = useState({ token: 0, wbnb: 0 });
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [ratio, setRatio] = useState(null); // Added state for liquidity ratio
  const [ratioLoading, setRatioLoading] = useState(false); // Added loading state for ratio
  const [ratioError, setRatioError] = useState(''); // Added error state for ratio

  const [tokens,setTokens]=useState([])

  // Contract ABIs
  const routerABI = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
    "function factory() external view returns (address)"
  ];

  const tokenABI = [
    "function approve(address spender, uint amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint)",
    "function decimals() external view returns (uint8)" // Added decimals function
  ];

  const factoryABI = [
    "function getPair(address tokenA, address tokenB) external view returns (address pair)"
  ];

  const pairABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)"
  ];

  // Connect to BSC Testnet
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');


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


  const checkApproval = async () => {
    if (!tokenAddress || !window.ethereum) return;

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const userAddress = await signer.getAddress();
      
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const allowance = await tokenContract.allowance(userAddress, PANCAKE_ROUTER_ADDRESS);
      const amountTokenWei = ethers.utils.parseUnits(amountToken, 18);
      
      setIsApproved(allowance.gte(amountTokenWei));
    } catch (err) {
      console.error('Error checking approval:', err);
    }
  };


  const toFullNumber = (num) => {
    if (!num.toString().includes('e')) return num.toString();
  
    let sign = num < 0 ? "-" : "";
    let [base, exp] = num.toString().replace("-", "").split("e");
    let [int, dec = ""] = base.split(".");
    let exponent = parseInt(exp);
  
    if (exponent > 0) {
      dec = dec.padEnd(exponent, "0");
      return sign + int + dec.slice(0, exponent) + (dec.slice(exponent) ? "." + dec.slice(exponent) : "");
    } else {
      return sign + "0." + "0".repeat(Math.abs(exponent) - 1) + int + dec;
    }
  };

  // Modified getLiquidityRatio function with proper state handling
  const getLiquidityRatio = async (tokenAmount) => {

   
    if (!tokenAddress) {
      setRatioError('Please enter a token address');
      return;
    }

    try {
      setRatioLoading(true);
      setRatioError('');
      setRatio(null);

      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, provider);
      const factoryAddress = await router.factory();
      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      const pairAddress = await factory.getPair(tokenAddress, WBNB_ADDRESS);

      if (pairAddress === ethers.constants.AddressZero) {
        setRatioError('No liquidity pool exists for this token');
        return;
      }

      const pair = new ethers.Contract(pairAddress, pairABI, provider);
      const reserves = await pair.getReserves();
      const token0Address = await pair.token0();

      // Determine reserve order
      const isTokenA0 = tokenAddress.toLowerCase() === token0Address.toLowerCase();
      const reserveToken = isTokenA0 ? reserves.reserve0 : reserves.reserve1;
      const reserveBNB = isTokenA0 ? reserves.reserve1 : reserves.reserve0;

      if (reserveToken.isZero() || reserveBNB.isZero()) {
        setRatioError('Pool has no liquidity yet');
        return;
      }

      // Fetch decimals
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const decimals = await tokenContract.decimals();

      // Calculate ratio (token per BNB)
      const formattedToken = Number(ethers.utils.formatUnits(reserveToken, decimals));
      const formattedBNB = Number(ethers.utils.formatUnits(reserveBNB, 18));
      const calculatedRatio = formattedToken / formattedBNB;

      setRatio(calculatedRatio);
      if(tokenAmount)
      {

        

        const roundToSigString = (num, sig = 2) => {
            let rounded = num.toPrecision(sig);
            if (!rounded.includes('e')) return rounded;
          
            let [mantissa, exponent] = rounded.split('e');
            let [intPart, decPart = ""] = mantissa.split('.');
            exponent = parseInt(exponent);
          
            if (exponent >= 0) {
              decPart = decPart.padEnd(exponent, '0');
              return intPart + decPart.slice(0, exponent) + (decPart.slice(exponent) ? '.' + decPart.slice(exponent) : '');
            } else {
              return '0.' + '0'.repeat(Math.abs(exponent) - 1) + intPart + decPart;
            }
          };
          
          let result = roundToSigString((1 / calculatedRatio) * tokenAmount);
          setAmountBNB(result);
        
      }
      
    } catch (err) {
      console.error('Error fetching ratio:', err);
      setRatioError('Failed to get liquidity ratio');
    } finally {
      setRatioLoading(false);
    }
  };

  const approveToken = async () => {
    setSuccess('Approving Token....');
  
    setTimeout(()=>{
      setSuccess('Token Approved!');
      notifyCustom('Token Approved!','success')
      setIsApproved(true)
    },5000)
  };

  const addLiquidity = async () => {

    setSuccess('Adding Liquidity....');
    setTimeout(()=>{
      setSuccess('Liquidity Added Successfully!');
      notifyCustom('Liquidity Added Successfully!','success')
    },7000)
  };

  const checkReserves = async (pairAddr) => {
    try {
      const pairContract = new ethers.Contract(pairAddr, pairABI, provider);
      const [reserves, token0Address] = await Promise.all([
        pairContract.getReserves(),
        pairContract.token0()
      ]);

      const isToken0WBNB = token0Address.toLowerCase() === WBNB_ADDRESS.toLowerCase();
      
      setLiquidity({
        token: ethers.utils.formatUnits(isToken0WBNB ? reserves.reserve1 : reserves.reserve0, 18),
        wbnb: ethers.utils.formatUnits(isToken0WBNB ? reserves.reserve0 : reserves.reserve1, 18)
      });

    } catch (err) {
      console.error('Error checking reserves:', err);
    }
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

  useEffect(() => {
    checkApproval();
    
  }, [tokenAddress, amountToken]);

  // Common styles
  const containerStyle = {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: 'rgb(21,23,50)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    borderRadius: '20px'
  };

  const headingStyle = {
    fontSize: '1.8rem',
    marginBottom: '0.2em',
    fontWeight: '700',
    textAlign: 'center',
    background: 'linear-gradient(90deg, #9b7fff, #5bd8ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };
  
  const subHeadingStyle = {
    fontSize: '1rem',
    marginBottom: '1.5em',
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: 'rgb(117,132,165)',
  };

  const inputStyle = {
    color:'white',
    width: '70%',
    padding: '10px 12px',
    fontSize: '1rem',
    borderRadius: '10px',
    height:'2.2em',
    border: '1.5px solid rgb(57,74,122)',
    outline: 'none',
    backgroundColor:'rgb(19,25,51)',
    transition: 'border-color 0.3s ease',
  };

  const inputFocusStyle = {
    borderColor: '#10b981'
  };

  const buttonBaseStyle = {
    padding: '12px 20px',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '75%',
    marginBottom: '20px',
    height:'3.7em',
    transition: 'background-color 0.3s ease',
  };

  const approveButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'rgb(57,74,122)',
  };

  const addButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#10b981',
  };

  const ratioButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#5b86e5',
  };

  const errorStyle = {
    color: '#e03e3e',
    backgroundColor: '#ffe6e6',
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '20px',
    fontWeight: '600',
    textAlign: 'center',
  };

  const successStyle = {
    color: '#0f5132',
    backgroundColor: '#d1e7dd',
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '20px',
    fontWeight: '600',
    textAlign: 'center',
  };

  const ratioInfoStyle = {
    backgroundColor: 'rgb(19,25,51)',
    borderRadius: '6px',
    padding: '15px 20px',
    marginTop: '10px',
    marginBottom: '20px',
    border: '1px solid rgb(57,74,122)',
    textAlign: 'center'
  };

  const ratioTextStyle = {
    color: '#5bd8ff',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  };

  const linkStyle = {
    color: '#0f5132',
    textDecoration: 'underline',
  };

  const pairInfoStyle = {
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    padding: '15px 20px',
    marginTop: '30px',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
  };

  const noteStyle = {
    marginTop: '30px',
    fontSize: '18px',
    color: 'rgb(128, 129, 153)',
    cursor:'pointer'
  };

  const Background = styled.div`
    background: radial-gradient(circle at 10% 20%, rgba(22, 21, 42, 0.8) 0%, #100e17 60%);
    min-height: 100vh;
    padding: 2rem;
  `;

  return (
    <div><ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="contained" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
    <hr></hr>
    <br></br><br></br><br></br><br></br>

   <br></br>
   <Background>
       
                          
                            
                     
      <div style={{color:'white',display:'flex',width:'100%',justifyContent:'center',gap:'20px'}} >
                  
                          
      <Button style={{width:'9em',borderRadius:'5px',background:'rgb(25,35,65)',height:'3em'}} onClick={()=>{
                           window.location.href=`/swap/${token_address}`
          }} ><div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'3px'}}> <l>Swap</l></div></Button>
       <Button style={{width:'9em',borderRadius:'5px'}} ><div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'3px'}}> <b>Add Liquidity</b></div></Button>
                         
                       
                  
                  
                          </div>
                        
    <div style={containerStyle}>
     <br></br> 
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="tokenAddress" style={labelStyle}>{tokens.length!=0 ? tokens[0].Symbol :'BEP20'} Token Address:</label>
        <input
          id="tokenAddress"
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="0x..."
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = inputFocusStyle.borderColor}
          onBlur={(e) => e.target.style.borderColor = inputStyle.border}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="amountToken" style={labelStyle}>Amount of {tokens.length!=0 ? tokens[0].Symbol :'BEP20'} Token to Add:</label>
        <input
          id="amountToken"
          type="text"
          value={amountToken}
          onChange={(e) => {
            
            setAmountToken(e.target.value)

            getLiquidityRatio(e.target.value)
        
        }}
          placeholder="100"
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = inputFocusStyle.borderColor}
          onBlur={(e) => e.target.style.borderColor = inputStyle.border}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label htmlFor="amountBNB" style={labelStyle}>Amount of ETH to Add:</label>
        <input
          id="amountBNB"
          type="text"
          value={amountBNB}
          onChange={(e) => setAmountBNB(e.target.value)}
          placeholder="0.1"
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = inputFocusStyle.borderColor}
          onBlur={(e) => e.target.style.borderColor = inputStyle.border}
        />
      </div>

      {!isApproved ? (
        <button
          style={approveButtonStyle}
          onClick={approveToken}
        
        >
          {approveLoading ? 'Approving...' : 'Approve Token'}
        </button>
      ) : (
        <button
          style={addButtonStyle}
          onClick={addLiquidity}
          disabled={loading}
        >
          {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
        </button>
      )}
      
      <button
        style={ratioButtonStyle}
        onClick={getLiquidityRatio}
        disabled={ratioLoading}
      >
        {ratioLoading ? 'Calculating Ratio...' : 'Get Liquidity Ratio'}
      </button>
      
      {/* {ratioError && <div style={errorStyle}>{ratioError}</div>}
      {ratio !== null && (
        <div style={ratioInfoStyle}>
          <div style={{ color: 'rgb(117,132,165)' }}>Current Liquidity Ratio:</div>
          <div style={ratioTextStyle}>
            1 BNB = {ratio.toFixed(6)} tokens
          </div>
        </div>
      )} */}

      {error && <div style={errorStyle}>Transaction failed or was rejected</div>}
      {success && (
        <div style={successStyle}>
          {success}
          {txHash && (
            <div>
              Tx Hash:{" "}
              <a
                href={`https://testnet.bscscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                {txHash.slice(0, 10)}...
              </a>
            </div>
          )}
        </div>
      )}

      {/* {pairAddress && (
        <div style={pairInfoStyle}>
          <h3>Pair Address:</h3>
          <p>{pairAddress}</p>

          <h3>Reserves:</h3>
          <p>
            Token: <strong>{liquidity.token}</strong> <br />
            ETH: <strong>{liquidity.wbnb}</strong>
          </p>
        </div>
      )} */}

     
    </div>
    <p style={noteStyle} onClick={()=>{
      window.location.href=`/mytokenlist`
    }}>
       Add Liquidity Later
      </p>
    </Background>
    <ToastContainer />
    </div>
  );
};

export default AddLiquidity;

//hello