import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useParams } from 'react-router-dom';
import backgroundImage from '../assets/images/coinBackground2.gif'
import ResponsiveAppBar from "./ResponsiveAppBar";
import { ToastContainer, toast } from 'react-toastify';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ethers } from "ethers";
import EventManagerABI from "../Contracts/EventManager.json"; // update with your actual ABI file

const QrScanner = () => {
  const webcamRef = useRef(null);
  const [qrCode, setQrCode] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [showAuthorizationMessage,setShowAuthorizationMessage]=useState("")

  const usersCollectionRef = collection(db, "events");
  const usersCollectionRef1 = collection(db, "user");
  const usersCollectionRef2 = collection(db, "ticket");




const markAttendanceBatch = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = "0x6f9020c5E74623D50a9f30DA2bA34c3f684c235b";
        const contract = new ethers.Contract(contractAddress, EventManagerABI, signer);

        // Create an array of booleans (assuming all attended)

        const attendeeEmails = [...new Set(JSON.parse(localStorage.getItem('attendeeEmails') || '[]'))];


        const statuses = attendeeEmails.map(() => true);

        // Send the transaction
        const tx = await contract.batchMarkAttendance(event_id, attendeeEmails, statuses);
        console.log("Transaction sent:", tx.hash);

        // Wait for it to be mined
        await tx.wait();
        console.log("Attendance marked successfully for all attendees!");

        alert("Attendance marked for all attendees!");
    } catch (error) {
        console.error(error);
        alert("Error marking attendance.");
    }
};



   const notify = (text,type) => toast(text,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        type:type
       
        });

   const { event_id } = useParams();

  

  useEffect(()=>{

    getEvents()
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isReady) {
        scanQRCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady]);

  const handleLoadedMetadata = () => {
    setIsReady(true);
  };


    const getEvents = async () => {

          if(!localStorage.getItem('email'))
          {
            window.location.href = '/oktologin';
          }
          const data = await getDocs(usersCollectionRef);
         
          let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
         
          let filteredArray=eventsTemp.filter(obj => obj.Creator === localStorage.getItem('email') && obj.id===event_id)
          
          if(filteredArray.length==0)
          {
            window.location.href = '/error/User Not Authorized';
          }
         
         
        
        };
  const scanQRCode = () => {
    const video = webcamRef.current?.video;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

      const updateUser = async (obj,EventId) => {
    
              
                        let userDoc = doc(db, "user", obj.id);
                        let filteredArray=0;
                         filteredArray=obj.EventsAttended.filter(x=>x==event_id)
                        console.log(obj.EventsAttended)
                        console.log(filteredArray)
                        
                        localStorage.setItem('attendeeEmails', JSON.stringify([...(JSON.parse(localStorage.getItem('attendeeEmails') || '[]')), obj.Email]));

                       
                        if(filteredArray.length==0)
                        {

                          let data = await getDocs(usersCollectionRef);
                                 
                           let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                                 
                           let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
                           console.log(filteredArray)
                          
                           if(filteredArray.length!=0)
                           {
                            let newFields = { Email: obj.Email, Coins:obj.Coins+filteredArray[0].Coins, EventsCreated:obj.EventsCreated,EventsRegistered:obj.EventsRegistered, EventsApproved:obj.EventsApproved,EventsAttended:[...obj.EventsAttended,EventId]};
                            await updateDoc(userDoc, newFields);
  
                            userDoc = doc(db, "events", event_id);

  
                           
                         
                           notify("Congratulations! You earned ConnectVerse coins","success")
                           }

                         
                        }
                      

                        
                      };
    
  const getTickets = async (code) => {
        let data = await getDocs(usersCollectionRef2);
       
        let ticketTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
        let filteredArray=ticketTemp.filter(obj => obj.EventId==event_id && obj.TicketId==code)

       

       
        if(filteredArray.length!=0)
        {
         

          let EventId=filteredArray[0].EventId

          data = await getDocs(usersCollectionRef1);
       
          let userTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
          filteredArray=userTemp.filter(obj => obj.Email === code.slice(10))
         
          if(filteredArray.length!=0)
          {
            updateUser(filteredArray[0],EventId)
          }
        }
        else
          {
            alert('User Not Authorized')
          }
         
       
      
      };
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code && code.data !== qrCode) {
      alert(code.data)
      setQrCode(code.data);
      getTickets(code.data)
    }
  };

  return (
    <div style={{ backgroundImage:`url(${backgroundImage})`,
    backgroundSize: 'cover', // Ensures the image covers the entire area without distortion
    backgroundPosition: 'center center', // Centers the image within the div
    backgroundRepeat: 'no-repeat', // Prevents repeating of the image}}>
    height:'50em'
  }}>
   

<ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined" />
    
     <br></br><br></br><br></br><br></br><br></br> <br></br>
     <div style={{ color:'white' }}>
        <h3>Scan your Ticket here</h3>
        {/* <p>{qrCode || "Waiting for scan..."}</p> */}
      </div>
      <br></br>
      
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          width: "80%",
          maxWidth: "600px",
          borderRadius: "10px",
          border:'1px solid white'
        }}
      />

      <br></br>    <br></br>

      <Button variant="outlined" onClick={()=>{
        markAttendanceBatch()
      }}>On Chain</Button>
      <br></br>    <br></br>

       <FormControlLabel
            control={<Switch  />}
            label={<span style={{ color: 'white' }}>Face Attendance</span>}

            onClick={()=>{
              window.location.href=`/testing5/${event_id}`
            }}
            
            sx={{
              backgroundColor: 'grey',
              borderRadius: '4px', // optional for rounded edges
              padding:'0.3em'
            
            }}
          />
     

<ToastContainer  style={{zIndex:'99999999999999'}}/>


    </div>
  );
};

export default QrScanner;
