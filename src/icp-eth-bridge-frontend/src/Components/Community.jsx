import React, { useEffect, useState, useRef } from "react";
import {
  getDocs,
  collection,
  onSnapshot,
  addDoc,
  query
} from "firebase/firestore";
import { db } from "../firebase-config.js";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import ResponsiveAppBar from "./ResponsiveAppBar";
import DescriptionIcon from '@mui/icons-material/Description';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';


import { ToastContainer, toast } from 'react-toastify';


import AddCircleIcon from '@mui/icons-material/AddCircle';

import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import dayjs from "dayjs";
import ShareIcon from '@mui/icons-material/Share';
import uploadImg from '../assets/images/uploadImg.png'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import { ethers } from "ethers";

import erc20Abi from '../Contracts/CONABI.json'
const Chat = () => {
 
  const [name,setName]=useState('')
  const [description,setDescription]=useState('')
  const [allCommunities,setAllCommunities]=useState('')
  const [createdCommunities, setCreatedCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [showCreateDiv,setShowCreateDiv]=useState(false)
  const [token,setToken]=useState('')

  const scrollRef = useRef(null);

  useEffect(() => {


    const q = query(collection(db, "community"));

   

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const email = localStorage.getItem('email');

      let allArray = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))

      setAllCommunities(allArray)
      

      let filteredArray = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.Creator === email);

     console.log(filteredArray)

      const filteredArray1 = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.Participants?.includes(email));

        console.log(filteredArray1)

      setCreatedCommunities(filteredArray);
      setJoinedCommunities(filteredArray1);
    });

    return () => unsubscribe();
  }, []);

  async function isTokenOwner(tokenAddress) {
     try {

             
             
      
              // Check if MetaMask is installed
              if (typeof window.ethereum === 'undefined') {
                alert('Please install MetaMask first!');
                return;
              }
             
      
              // Request account access
              const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
              });
             
              const userAddress = accounts[0];
              
      
              // Setup provider and signer
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
            
      
              // ERC20 Token ABI
              const tokenAbi = [
                "function balanceOf(address account) view returns (uint256)",
                "function decimals() view returns (uint8)"
              ];

              
      
              // Create token contract
              const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

             
      
              // Get token decimals
              const decimals = await tokenContract.decimals();
              const requiredAmount = ethers.utils.parseUnits("1000001", decimals);

             
      
              // Get token balance
              const balance = await tokenContract.balanceOf(userAddress);
           
              return (balance-requiredAmount)>0
             

            
      
           
            } catch (error) {
             
              console.error('Token check failed:', error);
            
              alert('Error: ' + error.message);
            }
          }
    
  

  const createCommunity=async()=>{


    
                   toast.dismiss()

                  const result=await isTokenOwner(token)
                  if(!result)
                  {
                    toast.dismiss()

                    notifyCustom("You must hold more than 1 Million tokens","error")
                    return;
                  }

                 

                  console.log("result",result)

                   if((description.length==0 || imageUrl.length==0 || name.length==0) )
                   {
                    toast.dismiss()

                    notifyCustom("Fill all the fields","error")
                    return;

                   }
                   
                    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
                 
                      await addDoc(collection(db,"community"), {Name:name,Description:description, Chats:[],Creator:localStorage.getItem('email'),ProfileImage:imageUrl,Timestamp:now,Participants:[localStorage.getItem('email')],Token:token});

                      notifyCustom("Community Created!","success")

                      setTimeout(()=>{
                        window.location.reload()
                      },1000)

                     
    
  }


  const [imageUrl, setImageUrl] = useState("");
 
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_unsigned_preset"); // 👈 Replace
      formData.append("cloud_name", "getsetcourse");       // 👈 Replace
  
      const res = await fetch(`https://api.cloudinary.com/v1_1/getsetcourse/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      setImageUrl(data.secure_url); // ✅ Final image URL
    };
  
    const notifyCustom = (text,type) => toast(text,{
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
    
  

  return (
    <div>
     <br></br>
         <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
         <br></br> <br></br>  <br></br> <br></br>  <br></br> <br></br>
      <Button variant="outlined" onClick={()=>{
           setShowCreateDiv(true)
      }}>Create  &nbsp;<AddCircleIcon/></Button>
      <Button variant="outlined" onClick={()=>{
           window.location.href = '/manage';
      }}>Manage &nbsp;<EditCalendarIcon/></Button>
      <br></br> <br></br> <br></br>


      <br></br>

      <h2 style={{color:'white'}}>All ({allCommunities && allCommunities.length })</h2>

      <br></br>
      <div style={{display:'flex',flexWrap:'wrap',gap:'2em',justifyContent:'center'}}>
      {allCommunities && allCommunities.length !== 0 && allCommunities.map((x)=>{

        return (
         <Card 
         sx={{ maxWidth: 400,minWidth:300 ,maxHeight:600  }} style={{ position:'relative',background: 'transparent', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.2)',position:'relative',borderRadius:'20px'}}
>
  <CardActionArea
    onClick={() => {
      window.location.href = `/testing3/${x.id}`;
    }}
  >
    <img 
     style={{width:'20em' ,height:'20em'}}
      src={x.ProfileImage} 
      alt="Event"
    />

    <CardContent 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
       
        color: 'white',
        gap: '5px',
        padding: '1em'
      }}
    >
      <h2>{x.Name}</h2>

      <div style={{display:'flex',gap:'3px',flexWrap:'wrap',justifyContent:'center'}}>

      <Button variant="outlined" onClick={(e)=>{

        e.stopPropagation()

        window.location.href=`/testing3/${x.id}`
      }}><OpenInNewIcon/></Button>

      <Button variant="outlined" onClick={(e)=>{

        e.stopPropagation()

        navigator.clipboard.writeText(`https://v2-six-puce.vercel.app/testing3/${x.id}`)
      .then(() => {
       notifyCustom("Community link copied","success");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });

      }}><ShareIcon/></Button>

      <Button variant="outlined" style={{border:'0.08px solid red',color:'red'}}><LogoutIcon/></Button>

     


      </div>
     
     
    </CardContent>
  </CardActionArea>
</Card>

       ) })}

       </div>
       

     
      <br></br>

      <h2 style={{color:'white'}}>Created ({createdCommunities && createdCommunities.length })</h2>

      <br></br>
      <div style={{display:'flex',flexWrap:'wrap',gap:'2em',justifyContent:'center'}}>
      {createdCommunities && createdCommunities.length !== 0 && createdCommunities.map((x)=>{

        return (
         <Card 
         sx={{ maxWidth: 400,minWidth:300 ,maxHeight:600  }} style={{ position:'relative',background: 'transparent', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.2)',position:'relative',borderRadius:'20px'}}
>
  <CardActionArea
    onClick={() => {
      window.location.href = `/testing3/${x.id}`;
    }}
  >
    <img 
     style={{width:'20em' ,height:'20em'}}
      src={x.ProfileImage} 
      alt="Event"
    />

    <CardContent 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
       
        color: 'white',
        gap: '5px',
        padding: '1em'
      }}
    >
      <h2>{x.Name}</h2>

      <div style={{display:'flex',gap:'3px',flexWrap:'wrap',justifyContent:'center'}}>

      <Button variant="outlined" onClick={(e)=>{

        e.stopPropagation()

        window.location.href=`/testing3/${x.id}`
      }}><OpenInNewIcon/></Button>

      <Button variant="outlined" onClick={(e)=>{

        e.stopPropagation()

        navigator.clipboard.writeText(`https://v2-six-puce.vercel.app/testing3/${x.id}`)
      .then(() => {
       notifyCustom("Community link copied","success");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });

      }}><ShareIcon/></Button>

      <Button variant="outlined" style={{border:'0.08px solid red',color:'red'}}><LogoutIcon/></Button>

     


      </div>
     
     
    </CardContent>
  </CardActionArea>
</Card>

       ) })}

       </div>

   <br></br>

   <hr style={{ border: '0.5px solid rgba(255, 255, 255, 0.3)'}}></hr>

   <h2 style={{color:'white'}}>Joined ({joinedCommunities && joinedCommunities.length })</h2>
   <br></br>

   <div style={{display:'flex',flexWrap:'wrap',gap:'2em',justifyContent:'center'}}>
      {joinedCommunities && joinedCommunities.length !== 0 && joinedCommunities.map((x)=>{

        return (
            <Card 
            sx={{ maxWidth: 400,minWidth:300 ,maxHeight:600  }} style={{ position:'relative',background: 'transparent', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.2)',position:'relative',borderRadius:'20px'}}
>
  <CardActionArea
    onClick={() => {
      window.location.href = `/testing3/${x.id}`;
    }}
  >
    <img 
     style={{width:'20em' ,height:'20em'}}
      src={x.ProfileImage} 
      alt="Event"
    />

    <CardContent 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
       
        color: 'white',
        gap: '5px',
        padding: '1em'
      }}
    >
      <h2>{x.Name}</h2>

      <div style={{display:'flex',gap:'3px',flexWrap:'wrap',justifyContent:'center'}}>

      <Button variant="outlined" onClick={(e)=>{

        e.stopPropagation()

        window.location.href=`/testing3/${x.id}`
        }}><OpenInNewIcon/></Button>

      <Button variant="outlined" onClick={(e)=>{
         e.stopPropagation()

         navigator.clipboard.writeText(`https://v2-six-puce.vercel.app/testing3/${x.id}`)
       .then(() => {
        notifyCustom("Community link copied","success");
       })
       .catch(err => {
         console.error('Failed to copy: ', err);
       });
      }}><ShareIcon/></Button>

      <Button variant="outlined" style={{border:'0.08px solid red',color:'red'}}><LogoutIcon/></Button>

     


      </div>
     
     
    </CardContent>
  </CardActionArea>
</Card>

       ) })}
       </div>
<br></br> <br></br><br></br>

{showCreateDiv && (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      padding: '20px',
      position: 'fixed',
      top: '0px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'black',
      border: '2px solid #1876d1',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      animation: 'popupAnimation 0.5s ease',
      overflowY: 'auto',
      backdropFilter: 'blur(10px)'
    }}
  >
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0
      }}
      src={backgroundVideo}
    />

<center>

<br />
      <br />
      <br />
      <br />
      <br />
      <br />
    {/* All content here is above the video */}
    <div style={{ position: 'relative', zIndex: 1, color: 'white',width:'18em' ,background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
    
      <br />
     

      <div
        style={{
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer'
        }}
        onClick={() => {
          setShowCreateDiv(false);
        }}
      >
        &nbsp;&nbsp;&nbsp;&nbsp;
        <CancelIcon style={{ left: '0px' }} fontSize="small" />
      </div>

      <br />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2em'
        }}
      >
        <div>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          {imageUrl.length === 0 && (
            <center>
              <label
                htmlFor="fileInput"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: `url(${uploadImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px black',
                  border: '0.5px solid #1876d1',
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  color:'#4A90E2'
                }}
              ></label>
              <br />
              <label htmlFor="fileInput" style={{ color: '#1876d1' }}>Choose an image for Profile</label>
            </center>
          )}

          {imageUrl && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={imageUrl}
                alt="Uploaded"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          

          {imageUrl.length !== 0 && (
            <center>
              <label
                htmlFor="fileInput"
                style={{
                  padding: '10px 20px',
                  color: '#4A90E2',
                 
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Change Picture
              </label>
            </center>
          )}
        </div>

        <input
          style={{
            fontSize: '16px',
            width: '15em',
            backgroundColor: 'black',
            color: 'white',
            height: '2em',
            borderRadius: '6px',
            border: '0.5px solid #1876d1'
          }}
          placeholder="Name of the community"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
         <input
          style={{
            fontSize: '16px',
            width: '15em',
            backgroundColor: 'black',
            color: 'white',
            height: '2em',
            borderRadius: '6px',
            border: '0.5px solid #1876d1'
          }}
          placeholder="Token Address"
          onChange={(e) => {
            setToken(e.target.value);
          }}
        />

        <textarea
          placeholder="Enter Description"
          rows="10"
          cols="10"
          style={{
            fontSize: '16px',
            width: '15em',
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '6px',
            border: '0.5px solid #1876d1'
          }}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <Button
          variant="contained"
          style={{ width: '18em' }}
          onClick={() => {
            createCommunity();
          }}
        >
          Create Community
        </Button>
      </div>

      <br></br>
    </div>
    </center>
    <br />
      <br />
      <br />
      <br />
  </div>
)}


<Fab 
  color="primary" 
  aria-label="add"  
  size="large" 
  style={{
    position: 'fixed',
    bottom: '5%',
    right: '10px',
  }}

  onClick={()=>{

    setShowCreateDiv(true)
  }}
>
  <AddIcon />
</Fab>

<ToastContainer style={{zIndex:'99999999999'}}/>




    </div>
  );
};




export default Chat;

