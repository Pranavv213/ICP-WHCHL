import React,{useState,useEffect} from 'react'
import ResponsiveAppBar from './ResponsiveAppBar'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ethers } from 'ethers';
import LinearProgress from '@mui/material/LinearProgress';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/material/Box';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import { useAccordionButton } from 'react-bootstrap';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  arrayUnion
} from "firebase/firestore";

import erc20Abi from '../Contracts/USDCABI.json'

const disperseAbi = [
  "function disperseToken(address token, address[] calldata recipients, uint256[] calldata values) external"
];



const disperseAddress = "0xFA29d78dbD24D0397e9D5f07E6F6B4050014741F";

export default function DisperseTokenComponent() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [tokenAddress,setTokenAddress]=useState("0x489058E31fAADA526C59561eE858120A816a09C8")
  const [tokenSymbol,setTokenSymbol]=useState('USDC')
  const [recipientsText, setRecipientsText] = useState("");
  const [valuesText, setValuesText] = useState("");


  const getTokenDetails=async()=>{
     let data = await getDocs(collection(db, "tokens"));
                                        
        let tokens=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    
        let filteredArray=tokens.filter(obj=>obj.Address==localStorage.getItem('communityToken') )

        console.log(filteredArray)

        if(filteredArray.length!=0)
        {
          setTokenSymbol(filteredArray[0].Symbol)
        }


  }
  

      useEffect(()=>{

          
        getTokenDetails()
        const storedReceivers = localStorage.getItem('receivers');

        if (storedReceivers) {
        let temp = JSON.parse(storedReceivers);

        temp=temp.filter(obj=>obj.WalletAddress)

        const arr = temp.map(item => item?.WalletAddress);
        setReceiversArray(arr);

        setTokenAddress(localStorage.getItem('communityToken'))
        console.log("arr",arr)
        }
       

    },[])

 


    
    
    
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
    
    
        const [amount,setAmount]=useState(0)
    
          const [loading, setLoading] = useState(false);
    
          const [txn,setTxn]=useState('')

          const [inputValue,setInputValue]=useState(0)

          const [receiversArray,setReceiversArray]=useState([])
    
    
    

  

		  async function disperseTokens() {
			try {
			  const _provider = new ethers.providers.Web3Provider(window.ethereum);
			  await _provider.send("eth_requestAccounts", []);
			  const _signer = _provider.getSigner();
			  const address = await _signer.getAddress();
			  
			  console.log("Connected:", address);
			  
			  const disperseContract = new ethers.Contract(disperseAddress, disperseAbi, _signer);
			  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, _signer);
		  
			  const decimals = 18; // adjust this if your token has different decimals
			  const parsedInputValue = ethers.utils.parseUnits(inputValue.toString(), decimals);
		  
			  const recipients = receiversArray;
			  const values = new Array(receiversArray.length).fill(parsedInputValue);
		  
			  const total = values.reduce((acc, val) => acc.add(val), ethers.BigNumber.from(0));
		  
			  const owner = await _signer.getAddress();
			  const allowance = await tokenContract.allowance(owner, disperseAddress);
		  
			  if (allowance.lt(total)) {
				console.log("Allowance insufficient. Approving tokens now...");
				const approveTx = await tokenContract.approve(disperseAddress, total);
				await approveTx.wait();
				console.log("Tokens approved.");
			  } else {
				console.log("Sufficient allowance already granted, skipping approval.");
			  }
		  
			  console.log("Dispersing tokens...");
			  const tx = await disperseContract.disperseToken(tokenAddress, recipients, values);
			  setLoading(true);
			  setTxn(tx.hash);
			  await tx.wait();
			  setLoading(false);
			} catch (err) {
			  console.error(err);
			}
		  }
		  
  
    return (
    <div>

    <br></br>
    <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
    <hr></hr>
    <br></br><br></br>
  

    {loading==true &&  <Box sx={{position:'absolute', width: '50%' ,top:'40%',left:'25%',zIndex:'9999999999999'}}>
        <l style={{color:'white',fontSize:'20px'}}>Airdropping {inputValue} {tokenSymbol} to each...</l>
        <br></br>
        <br></br> 
      <LinearProgress />
    </Box>}

    {loading == false && (
  <div style={{ position: "relative" }}>
    {/* Background Video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        objectFit: "cover",
        zIndex: 0,
      }}
      src={backgroundVideo}
    />

    {/* Foreground Content */}
    <div style={{ position: "relative", zIndex: 1 }}>
    <br></br><br></br><br></br>
    <br></br>
      <center>
        <Card
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(17.5px)",
            WebkitBackdropFilter: "blur(17.5px)",
            borderRadius: "10px",
            border: "1px solid rgb(255,255,255,0.5)",
            color: "white",
            width: "35vh",
          }}
        >
          <CardContent>
            <Typography gutterBottom component="div">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                {/* Token Selector */}
                <div>
                  <label>
                    Select Token:
                    <select
                      style={{
                        marginLeft: "10px",
                        padding: "5px",
                        borderRadius: "5px",
                        width: "100px",
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <option style={{ color: "white" }} value={tokenSymbol}>
                        {tokenSymbol}
                      </option>
                     
                    </select>
                  </label>
                </div>

                {/* Amount Input */}
                <div
                  onClick={() => {
                    if (txn.length != 0) {
                      window.location.reload();
                    }
                  }}
                >
                  <label>
                    Enter Amount:
                    <input
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                      }}
                      style={{
                        marginLeft: "10px",
                        padding: "5px",
                        borderRadius: "5px",
                        width: "100px",
                        fontSize: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        color: "white",
                        border: "none",
                      }}
                    />
                  </label>
                </div>

                {/* Send Button */}
                <Button
                  variant="outlined"
                  onClick={() => {
                    disperseTokens();
                  }}
                  style={{ width: "100%" }}
                >
                  Send
                </Button>

                {txn.length != 0 && (
                  <>
                    <hr
                      style={{ width: "100%", border: "0.1px solid white" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <b>Sent {tokenSymbol}</b>
                      <CheckCircleIcon style={{ color: "green" }} />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <b>Txn:</b>
                      <div style={{ color: "green" }}>
                        {txn.slice(0, 6)}...{txn.slice(-6)}
                      </div>
                      &nbsp;
                      <ContentCopyIcon
                        fontSize="small"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(txn)
                            .then(() => {
                              console.log("Text copied to clipboard!");
                              notifyCustom(
                                "Txn hash copied to clipboard!",
                                "default"
                              );
                            })
                            .catch((err) => {
                              console.error("Failed to copy text: ", err);
                            });
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </Typography>
          </CardContent>
        </Card>

        <br />

        {/* Receivers Section */}
        {localStorage.getItem("receivers") &&
          JSON.parse(localStorage.getItem("receivers")).length != 0 && (
            <div
              style={{
                position: "relative",
                zIndex: 1,
                backgroundColor: "rgb(51,51,51)",
                width: "30vh",
                borderRadius: "1em",
                color: "white",
                padding: "1.5em",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <l
                style={{
                  color: "white",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Receivers
              </l>
              <br />
              {JSON.parse(localStorage.getItem("receivers")).map(
                (x, index) => {if(x.WalletAddress) return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={x.ProfileImage}
                        alt="Profile"
                        style={{
                          width: "2em",
                          height: "2em",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <l>{x.UserName}</l>
                    </div>
                  </div>
                )
            }
              )}
            </div>
          )}
      </center>
    </div>
  </div>
)}


<ToastContainer style={{zIndex:'999999999999'}} onClick={()=>{

    toast.dismiss()
}}/>
    </div>
  )
    
}
