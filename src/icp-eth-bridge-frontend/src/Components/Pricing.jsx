import React,{useState,useEffect} from 'react'
import ResponsiveAppBar from "./ResponsiveAppBar";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import { db } from "../firebase-config";
import { useOkto } from "okto-sdk-react";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import CON_TOKEN_ABI from '../Contracts/CONABI.json'

 const usersCollectionRef1 = collection(db, "user");
// Replace with your ERC20 token contract address and ABI
const CON_TOKEN_ADDRESS = '0x2f9aC69aF261c511352CD0a6B0Aed9D849B5856f';


const RECEIVER_ADDRESS = '0x3d8C2b52d2F986B880Aaa786Ff2401B2d3412a41';

function Pricing() {

  const [loading, setLoading] = useState(false);
  
  const sendTokens = async (amountString, category) => {
    if (!window.ethereum) return alert("MetaMask is not available.");
    if (!amountString || isNaN(amountString)) return notifyCustom("Invalid amount.", "error");
    if (!RECEIVER_ADDRESS || !CON_TOKEN_ADDRESS || !CON_TOKEN_ABI) return notifyCustom("Contract details missing.", "error");
    try {
      const data = await getDocs(usersCollectionRef1);
      const usersTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
      const filteredArray = usersTemp.filter(obj => obj.Email === localStorage.getItem('email'));
      if (filteredArray.length === 0) return;
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
  
      const expectedAddress = localStorage.getItem("walletAddress");
  
      if (!expectedAddress || userAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
        notifyCustom("Connected wallet does not match your stored wallet.", "error");
        return;
      }
  
      const token = new ethers.Contract(CON_TOKEN_ADDRESS, CON_TOKEN_ABI, signer);
      const decimals = await token.decimals();
      const balance = await token.balanceOf(userAddress);
  
      const amountToSend = ethers.utils.parseUnits(amountString, decimals);
  
      if (balance.gte(amountToSend)) {
       
        const tx = await token.transfer(RECEIVER_ADDRESS, amountToSend);
        setLoading(true);
        await tx.wait();
        setLoading(false);
  
        notifyCustom(`${amountString} CON token(s) sent successfully!`, "success");
  
        const userDoc1 = doc(db, "user", filteredArray[0].id);
        await updateDoc(userDoc1, { Premium: category });
  
        notifyCustom(`Successfully bought ${category} Pack`, "success");
  
        setTimeout(() => window.location.reload(), 3000);
      } else {
        notifyCustom(`Insufficient $FNF balance.`, "error");
        setTimeout(() => window.location.reload(), 3000);
      }
    } catch (error) {
      console.error(error);
      notifyCustom(`Transaction failed or was rejected`, "error");
      setTimeout(() => window.location.reload(), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (amount,category) => {

    if(!localStorage.getItem('walletAddress'))
    {
      notifyCustom(`Wallet not connected`,"error")

      setTimeout(() => {

        window.location.reload()
        
      }, 3000);
    }

  
    if (!amount || isNaN(amount) || Number(amount) <= 0) {

      
     
      return;
    }
    sendTokens(amount,category);
  };

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

  
      const [premium,setPremium]=useState("Starter")
      const getPremium=async()=>{

        const data = await getDocs(usersCollectionRef1);
                                                  
        let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

        if(filteredArray[0].Premium)
        {
          setPremium(filteredArray[0].Premium)
        }

        
      }

      useEffect(()=>{

        getPremium()

      },[])

  return (
    <div>
        <br></br>
       <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined" />
       <br></br><br></br><br></br><br></br><br></br>

       

       {loading==true &&  <Box sx={{position:'absolute', width: '50%' ,top:'40%',left:'25%'}}>
        <l style={{color:'white',fontSize:'20px'}}>Processing Payment...</l>
        <br></br>
        <br></br> 
      <LinearProgress />
    </Box>}
 

      {loading==false && <div>

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

       <div style={{display:'flex',flexWrap:'wrap',gap:'20px',justifyContent:'center'}}>

       <Card sx={{  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: premium=='Starter' ? '1px solid green' :'1px solid rgb(255,255,255,0.5)',color:'rgb(255,255,255,0.5)' ,color:'white'}}>
      
      <CardContent >
        <Typography gutterBottom  component="div" >
            <br></br>

            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
         <l style={{fontSize:'24px'}}> Starter</l> &nbsp; 
         
         {premium=="Starter" && <button style={{backgroundColor:'green', width:'8em',height:'2em',fontSize:'12px',padding:'0',border:'none',borderRadius:'10px',color:'white'}}>Current Plan</button>}

         </div>
          <br></br><br></br>

          <l style={{fontSize:'28px'}}><b>0 $FNF</b></l> <l style={{fontSize:'16px',color:'rgb(200,200,200'}}>/ month</l>
        </Typography>
        <br></br>  
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>

            <div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'flex-start'}}> 

        

          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create unlimited online events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create 3 offline events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <ClearIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}> Create paid events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}> Maximum capacity of 50  </l>

            </div>


            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <ClearIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}> Run Ad Campaign </l>

            </div>


            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
             <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create channel </l>

          </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create 1 community </l>

            </div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <ClearIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Send crypto to individuals </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <ClearIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Aidrop to community members </l>

            </div>

          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <div style={{width:'100%'}}>
        <Button variant='outlined' style={{border:'1px solid green', color:'green',width:'10em'}}>Free</Button>

        </div>
      </CardActions>
    </Card>


    <Card sx={{  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: premium=='Creator' ? '1px solid green' :'1px solid rgb(255,255,255,0.5)',color:'rgb(255,255,255,0.5)'}}>
      
      <CardContent >
        <Typography gutterBottom  component="div" >
            <br></br>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <l style={{fontSize:'24px',color:'white'}}> Creator</l> &nbsp; 
            
            {premium=="Creator" && <button style={{backgroundColor:'green', width:'8em',height:'2em',fontSize:'12px',padding:'0',border:'none',borderRadius:'10px',color:'white'}}>Current Plan</button>}
            
            
            
            </div>
          <br></br><br></br>

          <l style={{fontSize:'28px',color:'white'}}><b>100 $FNF</b></l> <l style={{fontSize:'16px',color:'white'}}>/ month</l>
        </Typography>
        <br></br>  
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>

            <div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'flex-start'}}> 

        

          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create unlimited online events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create 10 offline events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>Create paid events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}> Unlimited capacity </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create 1 Ad Campaign </l>

            </div>


            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
             <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create channel </l>

          </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create 5 communities </l>

            </div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Send crypto to individuals </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <ClearIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Aidrop to community members </l>

            </div>

          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <div style={{width:'100%'}}>
        {premium!="Creator"  && <Button variant='outlined' style={{border:'1px solid #1876d1', color:'#1876d1',width:'10em'}} onClick={()=>{handleSubmit("100","Creator")}}>Buy</Button>}

        </div>
      </CardActions>
    </Card>


    <Card sx={{  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: premium=='Pro' ? '1px solid green' :'1px solid rgb(255,255,255,0.5)',color:'rgb(255,255,255,0.5)' ,color:'white'}}>
      
      <CardContent >
        <Typography gutterBottom  component="div" >
            <br></br>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <l style={{fontSize:'24px'}}> Pro</l> &nbsp; 
            
            {premium=="Pro" && <button style={{backgroundColor:'green', width:'8em',height:'2em',fontSize:'12px',padding:'0',border:'none',borderRadius:'10px',color:'white'}}>Current Plan</button>} 
            
            
            
            </div>
          <br></br><br></br>

          <l style={{fontSize:'28px'}}><b>150 $FNF</b></l> <l style={{fontSize:'16px',color:'rgb(200,200,200'}}>/ month</l>
        </Typography>
        <br></br>  
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>

            <div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'flex-start'}}> 

        

          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create unlimited online events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create unlimited offline events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}> Create paid events </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}> Unlimited capacity  </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create 10 Ad Campaigns </l>

            </div>


            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
             <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create channel </l>

          </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Create unlimited communities </l>

            </div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Send crypto to individuals </l>

            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
   
            <DoneIcon style={{color:'white'}} /> <l style={{color:'rgb(200,200,200',fontSize:'18px'}}>  Aidrop to community members </l>

            </div>

          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <div style={{width:'100%'}}>

        {premium!="Pro" && <Button variant='outlined' style={{border:'1px solid #1876d1', color:'#1876d1',width:'10em'}} onClick={()=>{handleSubmit("150","Pro")} }>Buy</Button>}

        </div>
      </CardActions>
    </Card>


    </div>
    </div>}

<br></br><br></br><br></br>
 <ToastContainer style={{zIndex:'99999999999'}}/>
    </div>
  )
}

export default Pricing
