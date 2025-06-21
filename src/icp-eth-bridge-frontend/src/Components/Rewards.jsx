import React, { useState,useEffect } from 'react'
import ResponsiveAppBar from './ResponsiveAppBar'
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
import Button from '@mui/material/Button';
import coinImg from '../assets/images/coinImg2.png'
import './Rewards.css'
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'

const usersCollectionRef = collection(db, "events");
const usersCollectionRef1 = collection(db, "user");



function Rewards() {

    const [events,setEvents]=useState([])

    const getEvents=async()=>{

        let data = await getDocs(usersCollectionRef1);
                                                  
        let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
             
        let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

        if(filteredArray.length!=0)
        {
            data = await getDocs(usersCollectionRef);
                                                  
            usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

             
           let filteredArrayEvents=usersTemp.filter(obj => filteredArray[0].EventsAttended.includes(obj.id))

           setEvents(filteredArrayEvents)
        }

        
        
    }

    useEffect(()=>{

        if(!localStorage.getItem('email'))
        {
            window.location.href="/oktologin"
        }

        if(!localStorage.getItem('email') || !localStorage.getItem('profileImg') || !localStorage.getItem('userName'))
        {
            window.location.href="/profilesettings"
        }
        else{
            getEvents()
        }
    },[])

  return (
    <div>
        <br></br>
<ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
<hr></hr>
<br></br><br></br>
<br></br><br></br><br></br>
<br></br>


      
{ events.length!=0 && <div style={{display:'flex',justifyContent:'center',gap:'20px',flexWrap:'wrap'}}>

      
        {
            events.map((x)=>{
                return(

                    <div style={{ position:'relative',background: 'transparent', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.2)',position:'relative',borderRadius:'20px'}}>

                    <img style={{width:'20em' ,height:'20em',objectFit:'cover'}} src={x.Image}></img>
                        <br></br> <br></br> 
                        
                        <div style={{color:'white',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}> <img src={coinImg} style={{width: '4em', 
                    height: '4em', 
                    objectFit: 'cover' }} alt="Logo"  /> <l style={{fontSize:'24px',color:'rgb(200,200,200'}}>  {x.Coins}</l>
                    
                    <button variant='contained' style={{backgroundColor:'green', width:'5em',height:'2em',fontSize:'12px',padding:'0',border:'none',borderRadius:'10px',color:'white'}}>Claimed</button>
                    </div>
                        
                         <br></br>
                            <center>
                        <button class="button-85" style={{height:'2em'}} onClick={()=>{
                            window.location.href=`/nft/${localStorage.getItem('userName')}/${x.id}`
                        }}>POAP NFT</button>
                        </center>

                        <br></br> 


                    </div>

                )
            })
        }


      </div>

  }
    
    </div>
  )
}

export default Rewards
