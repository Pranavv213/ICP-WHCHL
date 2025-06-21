import React from 'react'
import { useState, useEffect } from "react";
import { useOkto } from "okto-sdk-react";
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
import { signInWithGoogle } from "../firebase-config";
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import logo from '../assets/images/logo.png'
import Stack from '@mui/material/Stack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import coinImg from '../assets/images/coinImg.svg'
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import './EventPage.css'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import mapImage from '../assets/images/mapImage.svg'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ResponsiveAppBar from './ResponsiveAppBar';
import eventpageBackground from '../assets/images/coinBackground2.gif'
import eventpageBackground2 from '../assets/images/eventBackgroundVideo.mp4'
import eventpageEntireBackground from '../assets/images/eventBackground5.gif'
import CloseIcon from '@mui/icons-material/Close';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CancelIcon from '@mui/icons-material/Cancel';
import { ethers } from 'ethers';
import LinearProgress from '@mui/material/LinearProgress';
import USDC_TOKEN_ABI from '../Contracts/USDCABI.json'
import EVENT_ABI from '../Contracts/EventManager.json'

const USDC_TOKEN_ADDRESS = '0x489058E31fAADA526C59561eE858120A816a09C8';

const EVENT_ADDRESS='0x6f9020c5E74623D50a9f30DA2bA34c3f684c235b'








function EventPage() {



  const { showWidgetModal, closeModal } = useOkto();
  const { createWallet, getUserDetails, getPortfolio } = useOkto();
  const [loading, setLoading] = useState(false);
  const [loadingText,setLoadingText]=useState("")
  const [clicked, setClicked] = useState(false);

    // Store answers as an array
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const [creator,setcreator]=useState([])

  // Handle input change
  const handleChange = (index, value) => {

    console.log("funtionRUN",answers)
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

 const notify = (text,type) => {
  

  toast(text,{
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      type:type
     
      })

  }

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
  
  

                const sendTokens = async (result) => {


                  console.log("answersArray",answers)

                  if(Object.keys(result).slice(1).some(key => result[key] === undefined || result[key] === ""))
                  {
                    notifyCustom("Fill all the fields","error")

                    return;
                  }

                  

                
        
 
                  try {


                   
                  
                   
  

                    
                    // Fetch users from Firestore


                   let RECEIVER_ADDRESS = '';

                   if(events.length!=0 && events[0].PriceRecieverAddress)
                   {
                    RECEIVER_ADDRESS=events[0].PriceRecieverAddress
                   }
                    const data = await getDocs(usersCollectionRef1);
                    const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const userEmail = localStorage.getItem('email');
                    const filteredUser = users.find((user) => user.Email === userEmail);
                
                    if (!filteredUser) return;
                
                    // Check if user already registered
                    if (filteredUser.EventsRegistered.includes(event_id)) {
                      notify("Already Registered", "error");
                      return;
                    }
                
                    const amountString = events.length ? events[0].Price : null;
                    if (!window.ethereum) return alert("MetaMask is not available.");
                    if (!amountString || isNaN(amountString)) return notifyCustom("Invalid amount.", "error");
                    if (!RECEIVER_ADDRESS || !USDC_TOKEN_ADDRESS || !USDC_TOKEN_ABI) return notifyCustom("Contract details missing.", "error");
                
                    // Connect to MetaMask
                  
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const userAddress = await signer.getAddress();
                
                    const expectedAddress = localStorage.getItem("walletAddress");
                    if (!expectedAddress || userAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
                      notifyCustom("Connected wallet does not match your stored wallet.", "error");
                      return;
                    }
                
                    // Prepare token transaction
                   
                    const token = new ethers.Contract(USDC_TOKEN_ADDRESS, USDC_TOKEN_ABI, signer);
                   
                    const event = new ethers.Contract(EVENT_ADDRESS, EVENT_ABI, signer);
                   
                    const decimals = await token.decimals();
                    
                    const balance = await token.balanceOf(userAddress);
                   
                    const amountToSend = ethers.utils.parseUnits(amountString, decimals);
                   
                    if (balance.lt(amountToSend)) {
                      notifyCustom("Insufficient balance.", "error");
                      return setTimeout(() => window.location.reload(), 3000);
                    }
                    
                    
                    // Execute token transfer

                    
                    const approveTx = await token.approve("0x6f9020c5E74623D50a9f30DA2bA34c3f684c235b", amountToSend+10);
                   
                    setLoadingText("Approving Request...")
                    setLoading(true);
                    await approveTx.wait();
                    const tx = await event.depositAmount(event_id,amountToSend,USDC_TOKEN_ADDRESS,localStorage.getItem('email'));
                    setLoadingText("Processing Payment...")
                   
                    await tx.wait();
                    setLoading(false);
                
                    // Firestore updates
                    if (!userEmail) {
                      notify("Please log in first", "error");
                      localStorage.setItem("currentEvent", event_id);
                      return;
                    }
                
                    const eventDocRef = doc(db, "events", event_id);
                    await updateDoc(eventDocRef, {
                      Name: events[0].Name,
                      Description: events[0].Description,
                      Creator: events[0].Creator,
                      Questions: events[0].Questions,
                      Attendees: arrayUnion(result), // If Attendees needs to be updated too, you can also use arrayUnion
                      Registrations: arrayUnion(result),
                      AttendeesCount: increment(1), // Or handle via increment if it's dynamic
                      RegistrationsCount: increment(1),
                      Coins: increment(1000), // This can also be increment(1000) or calculate based on your logic
                    });
                
                    const userDocRef = doc(db, "user", filteredUser.id);
                    const updatedUserData = {
                      ...filteredUser,
                      EventsRegistered: [...filteredUser.EventsRegistered, event_id],
                      EventsApproved: [...filteredUser.EventsApproved, event_id], // Fixed typo here

                    };
                    await updateDoc(userDocRef, updatedUserData);
                
                    notify("Registration complete!", "success");
                
                    if (events.length) {
                      notifyCustom(`Successfully booked ticket for ${events[0].Name}!`, "success");

                      setTimeout(()=>{
                        window.location.href="/dashboard"
                      },2000)
                    }
                
                    // setTimeout(() => window.location.reload(), 3000);
                  } catch (error) {
                    console.error("Transaction Error:", error);
                    notifyCustom("Transaction failed or was rejected", "error");
                    // setTimeout(()=>{
                    //   window.location.reload()
                    // },2000)

                    // setTimeout(()=>{
                    //   window.location.reload()
                    // },2000)
                    // setTimeout(() => window.location.reload(), 500);
                  } finally {
                    setLoading(false);
                  }
                };
                



  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    setClicked(true)

   

    const result = {};
    events.length!=0 && events[0].Questions.forEach((question, index) => {

      if(question==="Email")
      {
        result[question] = localStorage.getItem('email');
      }
      
      else
      {
        result[question] = answers[index];
      }
    
    });

  console.log(result);

    console.log(result); 

    if(events.length!=0 && events[0].Price)
    {
      sendTokens(result)
    }

    else
    {
      updateUser(result)
    }
   
    
  };


    const usersCollectionRef = collection(db, "events");
    const usersCollectionRef1 = collection(db, "user");
    const { event_id } = useParams();

   const [events, setEvents] = useState([]);

   const [showAcceptInvite, setShowAcceptInvite] = useState(false);

   function formatDate(dateStr) {
    const date = new Date(dateStr);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Feb"
    const year = date.getFullYear();
  
    // Get ordinal suffix for day
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${getOrdinal(day)} ${month}, ${year}`;
  }

    const getEvents = async () => {
       let data = await getDocs(usersCollectionRef);
       
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
        let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
        console.log(filteredArray)
        setEvents(filteredArray);

        filteredArray[0].Questions.map((x,index)=>{
          if(x.startsWith('type') && x.slice(x.indexOf("=")+1,x.indexOf("{"))==="options")
            {
              handleChange(index,x.slice(x.indexOf("{")+1,x.indexOf(",")))
              console.log(index,x.slice(x.indexOf("{")+1,x.indexOf(",")))
            }
  
            if(x.startsWith('type') && x.slice(x.indexOf("=")+1,x.indexOf("{"))==="checkbox")
              {
                handleChange(index,"false")
                console.log(index,"false")
              }

        })

        data = await getDocs(usersCollectionRef1);
       
        let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

       filteredArray=usersTemp.filter(obj=>obj.EventsCreated.includes(event_id))

        setcreator(filteredArray)
        console.log("filteredArrayof users", filteredArray)

        
       
      
      };

      const updateUser = async (result) => {

        console.log("answersArray",answers)

        if(Object.keys(result).slice(1).some(key => result[key] === undefined || result[key] === ""))
        {
          notifyCustom("Fill all the fields","error")

          return;
        }

        try{

          if(!localStorage.getItem('email')){
            notify("Please Login in first","error")
            localStorage.setItem('currentEvent',event_id)
            return

          }



          const data = await getDocs(usersCollectionRef1);
                                     
          let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

          let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

          if(filteredArray[0].EventsRegistered.includes(event_id))
          {
            notify("Already Registered","error")

            return
          }


          


        const userDoc = doc(db, "events", event_id);
        await updateDoc(userDoc, {
          Name: events[0].Name,
          Description: events[0].Description,
          Creator: events[0].Creator,
          Questions: events[0].Questions,
          Attendees: events[0].Attendees, // If Attendees needs to be updated too, you can also use arrayUnion
          Registrations: arrayUnion(result),
          AttendeesCount: events[0].AttendeesCount, // Or handle via increment if it's dynamic
          RegistrationsCount: increment(1),
          Coins: increment(1000), // This can also be increment(1000) or calculate based on your logic
        });
     

        
                    
                                     
        
        
        console.log(filteredArray)
                      
       
        const userDoc1 = doc(db, "user", filteredArray[0].id);
        const newFields1 = { Email: filteredArray[0].Email, Coins:filteredArray[0].Coins, EventsCreated:filteredArray[0].EventsCreated,EventsRegistered:[...filteredArray[0].EventsRegistered,event_id], EventsApproved:[...filteredArray[0].EventsApproved],EventsAttended:filteredArray[0].EventsAttended};

          // update


        await updateDoc(userDoc1, newFields1);

        notify("Registration complete!","success")

        setTimeout(()=>{
          window.location.href="/dashboard"
        },2000)
        
        }
        catch{
          
          notify("Fill all the fields before submitting the form","error")
        }

      };

    useEffect(() => {

      if(localStorage.getItem('currentEvent'))
      {
        localStorage.removeItem('currentEvent');
      }
        getEvents();
     
         
        },[])

      
  return (
    <div style={{
      
    }}>
      <div id="up"></div>
      <br></br>
      <ResponsiveAppBar   homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined"/>
      <br></br> <br></br>  <br></br> <br></br>  <br></br> <br></br>

      {loading==true &&  <Box sx={{position:'absolute', width: '50%' ,top:'40%',left:'25%',zIndex:'9999999999999'}}>
        <l style={{color:'white',fontSize:'20px'}}>{loadingText}...</l>
        <br></br>
        <br></br> 
      <LinearProgress />
    </Box>}
  
       {loading==false && <div className="item" >

<div className="item1">

<div class="item1a">

<img class="poster" src={events.length!=0 && events[0].Image}></img>

</div>

<div
  className="item1b"
  style={{
    width: '300px',               // Set fixed width
    wordWrap: 'break-word',       // Break long words
    whiteSpace: 'normal',         // Allow text to wrap
    overflowWrap: 'break-word',   // For better cross-browser wrapping
    border: '1px solid gray',
    padding: '10px',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  }}
>
  <p style={{
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    margin: 0,
    textAlign:'left'
  }}>

    <div style={{display:'flex',alignItems:'center',gap:'5px',color:'white'}}>
  
    {creator.length!=0 && <img style={{width:'2em', height:'2em',borderRadius:'50%',objectFit:'cover'}} src={events.length!=0 && creator.length!=0 && creator[0].ProfileImage!=null ? creator[0].ProfileImage : 'https://i.pinimg.com/564x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg'} onClick={()=>{
      window.location.href=`/channel/${creator[0].UserName}`
    }}></img>
}
    
      {events.length!=0 && creator.length!=0 && creator[0].UserName!=null && creator[0].UserName }

    {events.length!=0 && creator.length==0 && events[0].Creator }

    <button variant='contained' style={{backgroundColor:'green', width:'5em',height:'2em',fontSize:'12px',padding:'0',border:'none',borderRadius:'10px',color:'white'}}>Creator</button>

    </div>
    
    
 

    {/* {events.length!=0 && events[0].Creator} */}
  </p>

  <div
    className="item1c"
    style={{ marginTop: '10px' }}
  >
    <span style={{ color: 'white' }}>
      Registrations:&nbsp;
      {events.length !== 0 && events[0].RegistrationsCount}
    </span>
    <br></br>
    <span style={{ color: 'white' }}>

    {events.length !== 0 && events[0].Price && <div  style={{display:'flex',backgroundColor:'red',paddingRight:'1em',paddingLeft:'1em',height:'2em',fontSize:'12px',border:'none',borderRadius:'10px',color:'white',alignItems:'center'}}><l>Price: ${events[0].Price} USD</l></div>
}

{events.length !== 0 && !events[0].Price && <div  style={{display:'flex',backgroundColor:'red',paddingRight:'1em',paddingLeft:'1em',height:'2em',fontSize:'12px',border:'none',borderRadius:'10px',color:'white',alignItems:'center'}}><l>FREE</l></div>
}
     
      
    </span>
  </div>
</div>


</div>





<div className="item2">
<div class="item2a" style={{border: '1px solid gray',
    padding: '10px',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    backgroundImage:`url(${eventpageBackground})`,
    backgroundSize: 'cover', // Ensures the image covers the entire area without distortion
    backgroundPosition: 'center center', // Centers the image within the div
    backgroundRepeat: 'no-repeat', // Prevents repeating of the image
    
    }}>
  
  <h1 style={{color:'white'}}>{events.length!=0 && events[0].Name}</h1>
<div style={{color:'white',display:'flex',alignItems:'center',gap:'3px'}}><CalendarMonthIcon/><l>{events.length!=0 && formatDate(events[0].StartDateTime)}</l></div>

<div style={{textAlign:'left',display:'flex',alignItems:'flex-start',gap:'3px'}}>

  { events.length!=0 && events[0].Address && events[0].Type!="online" && <LocationPinIcon style={{color:'white'}}/> }

{events.length!=0 && events[0].Address && events[0].Type!="online" && <l style={{color:'white'}} >{events[0].Address}</l>}

{ events.length!=0 && events[0].Address && events[0].Type=="online" && <VideoCallIcon style={{color:'white'}}/> }

{events.length!=0 && events[0].Address && events[0].Type=="online" && <l style={{color:'white'}} >Online</l>}

</div>

<div   >

{events.length!=0 && events[0].Address && events[0].Type!="online" && <iframe
            title="Google Map"
            style={{backgroundColor:'white',borderRadius:'0.5em'}}
          
            src={`https://www.google.com/maps?q=${events[0].Address}&output=embed`}
           class="map"
           
            allowFullScreen=""
            loading="lazy"
          ></iframe>}

</div>


{
  events.length!=0 && events[0].Type!="online" && <div style={{paddingLeft:'1.5em'}}>
<a href="#up" style={{textDecoration:'none'}}>
  <br></br>
    <button class="button-85" style={{height:'2.5em'}} type="submit" onClick={()=>{

      setShowAcceptInvite(true)
    }}>Accept Invitation</button></a>
<br></br>

  </div>
}

{
  events.length!=0 && events[0].Type=="online" && <div>
<a href="#up" style={{textDecoration:'none'}}>
    <button class="button-85" style={{height:'3em'}} type="submit" onClick={()=>{

      setShowAcceptInvite(true)
    }}>Accept Invitation</button></a>


  </div>
}




</div>

<div class="item2b" >
 
<h1 style={{color:'white'}}>About Event</h1>


<div style={{textAlign:'left'}}>



{events.length!=0 && <div style={{textAlign:'left',color:'white'}} dangerouslySetInnerHTML={{ __html: events[0].Description }} />}
</div>


</div>
    </div>
    
    </div>
}

  
       <br></br>
     
       <br></br>

      
     

       {showAcceptInvite && 


    <div
     
    style={{
      width: '90%', 
     
      padding: '20px', 
     border:'1px solid  #1876d1',
     
      blur:'50px', 
   
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
     
      transform: 'translateX(-50%)',
   
      animation: 'popupAnimation 0.5s ease',
      
      position: 'fixed',
      top: '0',
      left: '50%',
      width: '100vw',
      height: '100vh',
      overflowY: 'auto',
    
      zIndex: 99999,
      
       backgroundColor:'black'

      

                 
     
    }}
    >

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
        src={eventpageBackground2} 
      />
      <br></br> <br></br>  <br></br>   <br></br> <br></br>  <br></br>


   <center >
  {loading==false && <div style={{width:'35vh',background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' ,padding:'2em',border:'2px solid grey',borderRadius:'10px'}}>

  <div style={{textAlign:'right'}}>
     <CancelIcon style={{color:'white'}} onClick={()=>{
      setShowAcceptInvite(false)
     }} />

     </div>
     <br></br>  

      {events.length !== 0 &&
        events[0].Questions.map((question, index) => {
          const type = question.startsWith('type') ? question.slice(question.indexOf('=') + 1, question.indexOf('{')) : null;
          const label = question.slice(question.indexOf('}') + 1);
          const options = type === 'options' ? question.slice(question.indexOf('{') + 1, question.indexOf('}')).split(',') : [];

         
         

          return (
            <div key={index} >


              <div style={{display:'flex',flexDirection:'column',marginBottom:'2em',gap:'10px'}}>

                <div style={{width:'100%',textAlign:'left'}}>
              {type !== null && type!=="checkbox" && type!=="options" && <label style={{color:'rgb(207,207,207)'}}><b>{label}</b>
              <br></br><br></br></label>}

              {type==null && <label style={{color:'rgb(207,207,207)'}}><b>{question}</b> <br></br><br></br></label>}
              
              

              {/* Text input (default or empty type) */}

              {(type === null && question.slice(0,5)==='Email' && localStorage.getItem('email')) && (
                <input
                  type="text"
                  

                  style={{fontSize:'16px',height:'2em',width:'100%',borderRadius:'7px',border:'none',backgroundColor:'rgb(46,47,48)',color:'white'}}

                  value={`${localStorage.getItem('email')}`}
                  
                  placeholder={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}

          {(type === null && question.slice(0,5)==='Email' && !localStorage.getItem('email')) && (
                          <input
                            type="text"
                            

                            style={{fontSize:'16px',height:'2em',width:'100%',borderRadius:'7px',border:'none',backgroundColor:'rgb(46,47,48)',color:'white'}}

                            
                            
                            placeholder={answers[index]}
                            onChange={(e) => handleChange(index, e.target.value)}
                          />
                        )}

              {(type === null && question.slice(0,5)!=='Email' || type === '') && (
                <input
                  type="text"
                

                  style={{fontSize:'16px',height:'2em',width:'100%',borderRadius:'7px',border:'none',backgroundColor:'rgb(46,47,48)',color:'white'}}
                  
                  placeholder={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}

              {/* Socials input */}
              {type === 'socials' && (
                <input
                  type="text"
               
                  style={{fontSize:'16px',height:'2em',width:'100%',borderRadius:'7x',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',backgroundColor:'rgb(46,47,48)'}}
                  placeholder={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}

              {/* Website input */}
              {type === 'website' && (
                <input
                 
                  className="textInput"
                  style={{fontSize:'16px',height:'2em',width:'100%',borderRadius:'7px',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',backgroundColor:'rgb(46,47,48)'}}
                  placeholder={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}

              {/* Checkbox */}
              {type === 'checkbox' && (
                <div >

                  <l style={{width:'100%',color:'rgb(207,207,207)'}}><b>{label}</b> <br></br><br></br></l>
                  <input type="checkbox" value="yes" style={{width:'100%',backgroundColor:'rgb(46,47,48)',color:'white'}} onChange={(e) =>handleChange(index, e.target.value.toString())}/>
                </div>
              )}

              {/* Options select */}


            
              
              
              {type === 'options' && (

               

               <div style={{width:'100%',textAlign:'left'}}> 
               <l style={{height:'2em',color:'rgb(207,207,207)'}}> <b>{label}</b><br></br><br></br></l>
                
                <select
                  
                  
                  style={{fontSize:'16px',height:'2.5em',width:'18em',borderRadius:'10px',backgroundColor:'rgb(46,47,48)',color:'white',border:'none'}}
                  onChange={(event)=>{
                    

                    console.log(event.target.value)
                    setSelectedOption(event.target.value)
                    handleChange(index,event.target.value)



                  }}
                  
                >
                  <option  value="Select Option">
                    Select Option
                    </option>

                  {options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                

         

                </div>)}


</div>
</div>
            </div>
          );

         
        })
        
       
        
        }
  

<center>
  

  {/* class="buttonInput" variant="contained" style={{height:'3em',borderRadius:'1em',backgroundColor:'black',color:'white',border:'1px solid white'}} */}

  <Button  variant="contained" class="button-85"  style={{width:'100%',height:'2.5em',fontSize:'16px',border:'none',color:'rgb(207,207,207)'}} onClick={handleSubmit} disabled={clicked} >
      <b> Register </b> 
      </Button>
    
      
     
      </center>

      </div>
}
      </center>
      <br></br><br></br> <br></br><br></br> <br></br><br></br> <br></br><br></br> <br></br><br></br>
    </div>
    
   
}

       <ToastContainer style={{zIndex:'99999999999'}}/>
    
        <br></br> <br></br> <br></br> <br></br> <br></br>
    </div>
  )
}

export default EventPage
