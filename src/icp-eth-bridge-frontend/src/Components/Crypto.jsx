import React,{useState} from 'react'
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
import CON_TOKEN_ABI from '../Contracts/USDCABI.json'


function Crypto() {



const CON_TOKEN_ADDRESS = '0x489058E31fAADA526C59561eE858120A816a09C8';


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



    const sendTokens = async () => {
    

    
  
     
                      try {
    
                        
                        // Fetch users from Firestore
    
    
                       let RECEIVER_ADDRESS = localStorage.getItem('receiver') && JSON.parse(localStorage.getItem('receiver')).WalletAddress;
    
                      
                        
                        const amountString = amount;
                        if (!window.ethereum) return alert("MetaMask is not available.");
                        if (!amountString || isNaN(amountString)) {
                            
                            
                         notifyCustom("Invalid amount.", "error")

                         setTimeout(()=>{
                            window.location.reload()
                          },2000)
                          return 
                        
                        
                        
                        }
                        if (!RECEIVER_ADDRESS || !CON_TOKEN_ADDRESS || !CON_TOKEN_ABI) return notifyCustom("Contract details missing.", "error");
                    
                        // Connect to MetaMask
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        await provider.send("eth_requestAccounts", []);
                        const signer = provider.getSigner();
                        const userAddress = await signer.getAddress();
                    
                        const expectedAddress = localStorage.getItem("walletAddress");
                        if (!expectedAddress || userAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
                          notifyCustom("Connected wallet does not match your stored wallet.", "error");
                          setTimeout(()=>{
                            window.location.reload()
                          },2000)
                          return 
                        }
                    
                        // Prepare token transaction
                        const token = new ethers.Contract(CON_TOKEN_ADDRESS, CON_TOKEN_ABI, signer);
                        const decimals = await token.decimals();
                        const balance = await token.balanceOf(userAddress);
                        const amountToSend = ethers.utils.parseUnits(amountString, decimals);
                    
                        if (balance.lt(amountToSend)) {
                          notifyCustom("Insufficient balance.", "error");
                          setTimeout(()=>{
                            window.location.reload()
                          },2000)
                          return 
                        }
                    
                        // Execute token transfer
                        const tx = await token.transfer(RECEIVER_ADDRESS, amountToSend);
                        setTxn(tx.hash)
                        setLoading(true);
                        await tx.wait();
                        setLoading(false);
                    
                       
                    
                       
                    
                       
                    
                        
                      } catch (error) {
                        console.error("Transaction Error:", error);
                        notifyCustom("Transaction failed or was rejected", "error");

                        setTimeout(()=>{
                            window.location.reload()
                        },3000)
                        
                      } finally {
                        setLoading(false);
                      }
                    };
                    
    

  return (
    <div>
        <br></br>
<ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
<hr></hr>
<br></br><br></br>
<br></br><br></br><br></br>
<br></br>


{loading==true &&  <Box sx={{position:'absolute', width: '50%' ,top:'40%',left:'25%',zIndex:'9999999999999'}}>
        <l style={{color:'white',fontSize:'20px'}}>Sending {amount} USDC to ${localStorage.getItem('receiver') && JSON.parse(localStorage.getItem('receiver')).UserName}...</l>
        <br></br>
        <br></br> 
      <LinearProgress />
    </Box>}

    {loading==false && 

<center>

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

{ localStorage.getItem('receiver') && <Card sx={{  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgb(255,255,255,0.5)',color:'rgb(255,255,255,0.5)' ,color:'white',width:'35vh'}}>
      
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
      {/* Profile Row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={JSON.parse(localStorage.getItem("receiver")).ProfileImage}
          style={{
            width: "3em",
            height: "3em",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span style={{ fontSize: "24px" }}>
          {JSON.parse(localStorage.getItem("receiver")).UserName}
        </span>
      </div>

      {/* Wallet Address */}
      <div style={{ textAlign: "left" }}>
        <span
          style={{
            display: "inline-block",
            wordBreak: "break-word",
            maxWidth: "100%",
            overflowWrap: "break-word",
          }}
        >
         <b>Wallet Address:</b> {`${JSON.parse(localStorage.getItem('receiver')).WalletAddress.slice(0,5)}...${JSON.parse(localStorage.getItem('receiver')).WalletAddress.slice(-5)}`}
          
        </span>
      </div>

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
               backgroundColor:'rgba(255, 255, 255, 0.25)',
              color:'white',
              border:'none'
            }}
          >
             <option style={{ color:'white'}} value="USDC">USDC</option>
            <option style={{ color:'white'}} value="ETH">ETH</option>
           
          </select>
        </label>
      </div>

      {/* Amount Input */}
      <div onClick={()=>{
        if(txn.length!=0)
        {
            window.location.reload()
        }
      }}>
        <label>
          Enter Amount:
          <input
            value={amount}

            onChange={(e)=>{
                setAmount(e.target.value)
            }}
            
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              width: "100px",
              fontSize:'16px',
              backgroundColor:'rgba(255, 255, 255, 0.25)',
              color:'white',
               border:'none'
            }}
          />
        </label>
      </div>

      {/* Send Button */}
      <Button variant='outlined'

      style={{width:'100%'}}

      onClick={sendTokens}
        
      >
        Send
      </Button>

      {txn.length!=0 &&  <hr style={{width:'100%',border:'0.1px solid white'}}></hr>}

      {txn.length!=0 && <div style={{display:'flex',gap:'10px'}}>
        

      <b>Sent {amount} USDC</b> <CheckCircleIcon style={{color:'green'}}/>

       </div>}

     {txn.length!=0 && <div style={{display:'flex',gap:'10px'}}><b>Txn:</b><div style={{color:'green'}}>{txn.slice(0, 6)}...{txn.slice(-6)}</div> &nbsp; <ContentCopyIcon fontSize="small" onClick={()=>{
        navigator.clipboard.writeText(txn)
        .then(() => {
          console.log("Text copied to clipboard!");
          notifyCustom('Txn hash copied to clipboard!','default')
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
     }}/></div>} 
     
    </div>
  </Typography>
</CardContent>

            </Card>
}
</center>
}


<ToastContainer style={{zIndex:'999999999999'}} onClick={()=>{

    toast.dismiss()
}}/>
      
    </div>
  )
}

export default Crypto
