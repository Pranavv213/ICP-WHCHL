import React, { useState, useRef, useEffect } from 'react';
import { db} from '../firebase-config';
import {
  collection,
  addDoc,
  doc,getDocs,updateDoc
} from 'firebase/firestore';
import Webcam from 'react-webcam';
import CameraIcon from '@mui/icons-material/Camera';
import ReplayIcon from '@mui/icons-material/Replay';
import Button from '@mui/material/Button';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'

const CaptureAndUpload = () => {
  const webcamRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  const usersCollectionRef5 = collection(db, 'Face');

  const usersCollectionRef1 = collection(db, 'user');

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageData(imageSrc);
    }
  };

  const handleUpload = async () => {
    if (!imageData) {
      alert('Please capture an image first.');
      return;
    }

    try {
      const blob = await (await fetch(imageData)).blob();

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', 'my_unsigned_preset'); // Replace with your preset
      formData.append('cloud_name', 'getsetcourse'); // Replace with your cloud name

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/getsetcourse/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      let data = await res.json();
      const imageUrl = data.secure_url;

      data = await getDocs(usersCollectionRef5);
      
      let faceTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

      let filteredArray=faceTemp.filter(obj=>obj.Email==localStorage.getItem('email'))

      if(filteredArray.length!=0)
      {
        const userDoc1 = doc(db, "Face", filteredArray[0].id);
        const newFields1 = {
            FaceImage: imageUrl,
            Email: localStorage.getItem('email'),
          }
             
                       // update
             
             
         await updateDoc(userDoc1, newFields1);
      }

      else{
        await addDoc(usersCollectionRef5, {
            FaceImage: imageUrl,
            Email: localStorage.getItem('email'),
          });
      }
    

       data = await getDocs(usersCollectionRef1);
                                                
       let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        filteredArray=usersTemp.filter(obj=>obj.Email==localStorage.getItem('email'))

       if(filteredArray.length!=0)
       {
        const userDoc1 = doc(db, "user", filteredArray[0].id);
       const newFields1 = {FaceAttendance:"True" };
            
                      // update
            
            
        await updateDoc(userDoc1, newFields1);
       }

       


       setTimeout(()=>{
        window.location.href="/profilesettings"
       },200)
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    }
  };

  useEffect(()=>{
    if(!localStorage.getItem('email') || !localStorage.getItem('userName') || !localStorage.getItem('profileImg'))
    {
        window.location.href="/errorpage/user not authorized"
    }

   
  })

  return (
    <div>

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
      <h2>Capture Image</h2>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300, height: 300 }}>
          {!imageData ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
              height={300}
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: 'user',
              }}
              style={{ borderRadius: '7px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: 300, height: 300, borderRadius: '7px', overflow: 'hidden' }}>
              <img
                src={imageData}
                alt="Captured"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '7px'
                }}
              />
            </div>
          )}

          {/* Conditional Camera or Retake Icon */}
          {!imageData ? (
            <CameraIcon
              onClick={captureImage}
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '50px',
                color: 'white',
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '50%',
                padding: '5px'
              }}
            />
          ) : (
            <ReplayIcon
              onClick={() => setImageData(null)}
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '50px',
                color: 'white',
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '50%',
                padding: '5px'
              }}
            />
          )}
        </div>

        <br />

        {imageData && (
          <Button
            onClick={handleUpload}
            style={{
              color: 'green',
              border: '0.2px solid green',
              width: '20em'
            }}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

export default CaptureAndUpload;
