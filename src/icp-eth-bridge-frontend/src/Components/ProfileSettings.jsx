import React,{useState,useEffect} from 'react'
import ResponsiveAppBar from './ResponsiveAppBar'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import accountImg from '../assets/images/accountImg.png'

import { db } from "../firebase-config";
import { useOkto } from "okto-sdk-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


function ProfileSettings() {

    const usersCollectionRef1 = collection(db, "user");

     const [imageUrl, setImageUrl] = useState("");
     const [userName,setUserName]=useState("")
     const [bio,setBio]=useState("")
     const [FaceAttendance,setFaceAttendance]=useState("False")

     const [checked, setChecked] = useState(true); // defaultChecked = true

  const handleChange = (event) => {
    const isChecked = event.target.checked;

    // Only trigger navigation when switching from false => true
    if (!checked && isChecked) {
      window.location.href = "/faceupload";
    }

    setChecked(isChecked);
  };


      const notify = (text,type) => {


        toast(text,{
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
        
        setInterval(()=>{
            window.location.reload()
        },2000)
        
       

        }


    const getUser=async ()=>{

        try{

            const data = await getDocs(usersCollectionRef1);
                                          
               let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
     
               let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

             console.log(filteredArray)

             if(filteredArray[0].ProfileImage)
             {
                localStorage.setItem('profileImg',filteredArray[0].ProfileImage)
                setImageUrl(filteredArray[0].ProfileImage)
             }

             if(filteredArray[0].UserName)
             {
                localStorage.setItem('userName',filteredArray[0].UserName)
                setUserName(filteredArray[0].UserName)

                
             }
             if(filteredArray[0].Bio)
            {
                  
                    setBio(filteredArray[0].Bio)
            }

            if(filteredArray[0].FaceAttendance)
            {
              setFaceAttendance(filteredArray[0].FaceAttendance)
            }
            
            
           
                           
        }
        catch{

            notify("Error loading profile setting","error")
            setInterval(()=>{
                window.location.href="/home"
              },3000)
        }

    }

      const updateUser = async () => {
     
      
             try{
     
              
              if((imageUrl.length==0 || userName.length==0 || bio.length==0))
              {
                notify("Fill all the fields","error")

                return;
              }


              if(userName.length>15)
                {
                  notify("username cannot exceed 15 characters","error")
  
                  return;
                }

              if(bio.length>300)
                {
                  notify("Bio cannot be more than 300 characters","error")
  
                  return;
                }


               const data = await getDocs(usersCollectionRef1);
                                          
               let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

               let isUserNameExist=usersTemp.filter(obj => obj.UserName && obj.UserName.toLowerCase()==userName.toLowerCase() && obj.Email!=localStorage.getItem('email'))

               if(isUserNameExist.length!=0)
               {

                notify("Username already exists!","error")

                return;
               }
     
               let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

             console.log(filteredArray)
                           
            const userDoc1 = doc(db, "user", filteredArray[0].id);
             const newFields1 = { Email: filteredArray[0].Email, Coins:filteredArray[0].Coins, EventsCreated:filteredArray[0].EventsCreated,EventsRegistered:[...filteredArray[0].EventsRegistered], EventsApproved:[...filteredArray[0].EventsApproved],EventsAttended:filteredArray[0].EventsAttended,ProfileImage:imageUrl,UserName:userName,Bio:bio};
     
               // update
     
     
             await updateDoc(userDoc1, newFields1);
             
             notify("Profile updated!","success")
     
             setInterval(()=>{
               window.location.reload();
             },3000)
     
             
             }
             catch{
               
               notify("Some error occured","error")
             }
     
           };

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

      useEffect(()=>{
        getUser()
      },[])

  return (
    <div style={{ position: "relative" }}>

<ResponsiveAppBar
      homeButtonStyle="outlined"
      earnButtonStyle="outlined"
      createButtonStyle="outlined"
      dashboardButtonStyle="outlined"
    />
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

<center>
  {/* Foreground Content */}


<br></br><br></br><br></br><br></br>

\
  <div style={{ position: "relative", zIndex: 1,background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)',width:'20em' }}>
    

    <br />
    <br />
    

    <div
      style={{
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "3px",
        justifyContent: "center",
        
      }}
    >
      <SettingsIcon fontSize="large" /> &nbsp;
      <l style={{ fontSize: "18px" }}> Profile Settings </l>
    </div>


    <center>
  

      <input
        type="file"
        accept="image/*"
        id="fileInput"
        
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {imageUrl.length == 0 && (
        <center>
          <label
            htmlFor="fileInput"
            style={{
              width: "200px",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `url(${accountImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              textShadow: "1px 1px 2px black",
            }}
          ></label>
          <br />
          <l style={{ color: "#1876d1", textAlign: "left" }}>
            Set Profile Picture
          </l>
        </center>
      )}

      {imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <br />

      {imageUrl.length != 0 && (
        <center>
          <label
            htmlFor="fileInput"
            style={{
              padding: "10px 20px",
              color: "#1876d1",
              cursor: "pointer",
            }}
          >
            Change Photo
          </label>
        </center>
      )}

      <br />
      <br />


      <input
        style={{
          color: "black",
          fontSize: "16px",
          width: "11em",
          height: "2em",
        }}

       
        value={userName}
       
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      ></input>

      <br />
      <br />

      <textarea

      rows="6"
        style={{
          color: "black",
          fontSize: "16px",
          width: "11em",
          
        }}
        value={bio}
        placeholder='Enter Bio'
        onChange={(e) => {
          setBio(e.target.value);
        }}
      ></textarea>
      
      <br></br> <br></br>

      <Button
        variant="contained"
        style={{ width: "13em" }}
        onClick={() => {

           
          updateUser();
        }}
      >
        Save
      </Button>

      <br />
      <br />
     <hr style={{border:'0.1px solid rgb(255,255,255,0.5)'}}></hr>

     &nbsp; &nbsp; &nbsp; &nbsp;
      {
  FaceAttendance === "True" && (
    <FormControlLabel
      control={<Switch defaultChecked />}
      label={<span style={{ color: 'white' }}>Face Attendance</span>}
      
      sx={{
        backgroundColor: 'grey',
        borderRadius: '4px', // optional for rounded edges
        padding:'0.3em'
      
      }}
    />
  )
}

{
  FaceAttendance === "False" && (
    <FormControlLabel
      control={<Switch />}
      label={<span style={{ color: 'white' }}>Face Attendance</span>}
      onClick={() => { window.location.href = "/faceupload"; }}
      sx={{
        backgroundColor: 'grey',
        borderRadius: '4px',
         padding:'0.3em'
       
      }}
    />
  )
}

   

    
      <br></br>
        <br></br>
      <Button
        variant="outlined"
        style={{ width: "13em", border: "1px solid red", color: "red" }}
        onClick={() => {
          localStorage.clear();
          window.location.href = "/oktologin";
        }}
      >
        Logout
      </Button>
    </center>

    <br />

    
  </div>
  </center>

  <ToastContainer style={{ zIndex: "99999999999" }} />
</div>

        
  )
}

export default ProfileSettings
