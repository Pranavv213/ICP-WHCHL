import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import { db } from '../firebase-config';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../assets/images/coinBackground2.gif'
import ResponsiveAppBar from './ResponsiveAppBar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


export default function FaceRecognition() {
  const { event_id } = useParams();
  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const [storedImages, setStoredImages] = useState([]);

  const eventsCollectionRef = collection(db, 'events');
  const faceCollectionRef = collection(db, 'Face');
  const usersCollectionRef = collection(db, 'user');

  const notify = (text, type) =>
    toast(text, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      type: type
    });


      const getEvents = async () => {
    
              if(!localStorage.getItem('email'))
              {
                window.location.href = '/oktologin';
              }
              const data = await getDocs(eventsCollectionRef);
             
              let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
             
              let filteredArray=eventsTemp.filter(obj => obj.Creator === localStorage.getItem('email') && obj.id===event_id)
              
              if(filteredArray.length==0)
              {
                window.location.href = '/error/User Not Authorized';
              }
             
             
            
            };


  // Load face-api models
  useEffect(() => {
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models/';
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ])
      .then(() => setModelsLoaded(true))
      .catch((error) => console.error('Error loading models:', error));
  }, []);

  // Load stored images from Firestore
  const loadStoredImages = async () => {
    try {
      const data = await getDocs(faceCollectionRef);
      const images = data.docs
        .map((doc) => {
          const faceImageUrl = doc.data().FaceImage;
          if (faceImageUrl && faceImageUrl.startsWith('http')) {
            return { ...doc.data(), id: doc.id };
          } else {
            console.warn('Skipping invalid FaceImage URL for document:', doc.id);
            return null;
          }
        })
        .filter((img) => img !== null);

      setStoredImages(images);
    } catch (error) {
      console.error('Error loading stored images:', error);
    }
  };

  useEffect(() => {
    loadStoredImages();

    getEvents()
  }, []);

  const updateUser = async (userObj, eventId) => {
    try {
      const userDocRef = doc(db, 'user', userObj.id);

      // Check if user already attended the event
      const hasAttended = userObj.EventsAttended?.includes(event_id);

      if (!hasAttended) {
        const eventsSnapshot = await getDocs(eventsCollectionRef);
        const events = eventsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const event = events.find((e) => e.id === event_id);

        if (event) {
          const updatedUser = {
            ...userObj,
            Coins: userObj.Coins + event.Coins,
            EventsAttended: [...(userObj.EventsAttended || []), eventId]
          };

          await updateDoc(userDocRef, updatedUser);

          notify('Congratulations ${userObj.UserName}! You earned ConnectVerse coins","success', 'success');
          
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const detectAndCompare = async () => {
    if (
      !modelsLoaded ||
      !webcamRef.current ||
      !webcamRef.current.video ||
      webcamRef.current.video.readyState !== 4 ||
      storedImages.length === 0
    ) {
      return;
    }

    try {

       
      const video = webcamRef.current.video;
      const liveDetection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!liveDetection) {
        setMatchResult('No face detected in webcam');
        return;
      }

      const liveDescriptor = liveDetection.descriptor;
      let matchFound = false;

      for (const image of storedImages) {
        if (!image.FaceImage) continue;

        const img = await faceapi.fetchImage(image.FaceImage);
        const detection = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) continue;

        const distance = faceapi.euclideanDistance(liveDescriptor, detection.descriptor);

        if (distance < 0.6) {
          // Match found!
          const usersSnapshot = await getDocs(usersCollectionRef);
          const users = usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          const matchedUser = users.find((user) => user.Email === image.Email);

          if (!matchedUser) {
            setMatchResult('❌ User Not Approved');
            
          } else if (matchedUser.EventsApproved?.includes(event_id)) {
            setMatchResult(`✅ Welcome ${matchedUser.UserName}!`);
            speak(`Welcome ${matchedUser.UserName}`);
            updateUser(matchedUser, event_id);
            matchFound = true;
            break;
          } else {
            setMatchResult(`❌ ${matchedUser.UserName} Not Approved for this event`);
           
            matchFound = true;
          }
        }
      }

      if (!matchFound) {
        setMatchResult('❌ No User Found');
      }
    } catch (error) {
      console.error('Error during detection & comparison:', error);
      setMatchResult('❌ An error occurred');
    }
  };

  // Run detection every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      detectAndCompare();
    }, 2000);

   

    return () => clearInterval(interval);
  }, [modelsLoaded, storedImages]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.voice = speechSynthesis.getVoices()[0];
      speech.pitch = 1;
      speech.rate = 1;
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  return (
    <div style={{ textAlign: 'center', color: 'white', backgroundImage:`url(${backgroundImage})`,
    backgroundSize: 'cover', // Ensures the image covers the entire area without distortion
    backgroundPosition: 'center center', // Centers the image within the div
    backgroundRepeat: 'no-repeat', height:'50em'}}>

<ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined" />
    
    <br></br><br></br><br></br><br></br><br></br>
       
      <h2>Mark your attendance here</h2>

      <div style={{ margin: '20px',borderRadius:'7px' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
         
          videoConstraints={{
            width: 320,
            height: 240,
            facingMode: 'user'
          }}
          style={{
            width: "80%",
            maxWidth: "600px",
            borderRadius: "10px",
            border:'1px solid white'
          }}
        />
      </div>

      <h3>{matchResult}</h3>
      <br></br> <br></br>

       <FormControlLabel
                  control={<Switch defaultChecked />}
                  label={<span style={{ color: 'white' }}>Face Attendance</span>}
      
                  onClick={()=>{
                    window.location.href=`/map/${event_id}`
                  }}
                  
                  sx={{
                    backgroundColor: 'grey',
                    borderRadius: '4px', // optional for rounded edges
                    padding:'0.3em'
                  
                  }}
                />

      <ToastContainer style={{ zIndex: '99999999999999' }} />
    </div>
  );
}
