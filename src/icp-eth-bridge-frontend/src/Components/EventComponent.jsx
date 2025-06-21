import React from 'react'
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { QRCodeCanvas } from 'qrcode.react';
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
import coinImg from '../assets/images/coinImg3.png'
import coinImage from '../assets/images/coinImg.png'
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import './Home2.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import Confetti from 'react-confetti'
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CategoryIcon from '@mui/icons-material/Category';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import ResponsiveAppBar from './ResponsiveAppBar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CountUp from 'react-countup';
import coinAnimation from '../assets/images/coinBackground3.gif'
import EventIcon from '@mui/icons-material/Event';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import axios from 'axios';
import { getCode } from 'country-list';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import Badge from 'react-bootstrap/Badge';


function EventComponent({allEvents,allUsersArray,search,setEvent_id,getComments,notifyClipboard,formatDate,Category}) {
  return (
   
    <div className="events">
  {allEvents.length !== 0 &&
    allEvents
      .filter((x) => {

      
        const input = search.toLowerCase().replace(/[^\w\s]/g, '').trim();
        const name = x.Name?.toLowerCase().replace(/[^\w\s]/g, '') || '';

        if (search.length === 0) {
          return x.Type !== 'online'; // show all offline events if search is empty
        } else {
          return name.includes(input) && x.Type !== 'online'; // filter offline events based on address
        }
      })
      .map((x) => {
        if(x.Category==Category)
        return (
            <Card sx={{ maxWidth: 350,minWidth:300 ,maxHeight:1000  }} style={{ position:'relative',background: 'black', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.2)',position:'relative',borderRadius:'20px'}}>
                 <CardActionArea>
                   
                   <img style={{width:'300px' ,height:'500px',objectFit:'cover', border: '1px solid rgba(255, 255, 255, 0.18)'}} src={x.Image} onClick={()=>{
                     window.location.href=`/event/${x.id}`
                   }}></img>
           
           {localStorage.getItem('email') && x.Creator==localStorage.getItem('email') && 
                                   <button variant='contained' style={{backgroundColor:'#1876d0',border:'none',position:'absolute',top:'20px',left:'85%',borderRadius:'50%',height:'3em',width:'3em'}} onClick={()=>{
                                   window.location.href=`/manage/${x.id}`
                                   }}> <EditIcon style={{color:'white'}}/> </button>
                                   }
                  
                   <CardContent>
           
                  
                     <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
           
                       <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}> 
           
                         
                         <div style={{display:'flex',gap:'10px' }}>
                         
                         {allUsersArray.length!=0 && allUsersArray.filter(obj=>obj.EventsCreated.includes(x.id) && obj.UserName && obj.ProfileImage).length!=0 && allUsersArray.filter(obj=>obj.EventsCreated.includes(x.id) && obj.UserName && obj.ProfileImage)[0].ProfileImage ? <img onClick={()=>{
               window.location.href=`/channel/${allUsersArray.filter(obj=>obj.EventsCreated.includes(x.id) && obj.UserName && obj.ProfileImage)[0].UserName}`
             }} src={allUsersArray.filter(obj=>obj.EventsCreated.includes(x.id) && obj.UserName && obj.ProfileImage)[0].ProfileImage} style={{width:'2em',height:'2em',borderRadius:'50%',objectFit:'cover',border:'1px solid white'}}></img> :<img style={{width:'2.8em',height:'2.8em',borderRadius:'50%',objectFit:'cover'}} src='https://i.pinimg.com/564x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg'></img> }  
                       
                       <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'0px'}}>
                         
                         <l style={{fontSize:'18px'}}>{x.Name}</l>
           
                         
           
                         <l>
                           
                           {allUsersArray.length!=0 && allUsersArray.filter(obj=>obj.EventsCreated.includes(x.id) && obj.UserName && obj.ProfileImage).length!=0 && allUsersArray.filter(obj=>obj.EventsCreated.includes(x.id) && obj.UserName && obj.ProfileImage)[0].ProfileImage ? <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}><l style={{fontSize:'15px',color:'rgb(200,200,200'}}>{allUsersArray.filter(obj=>obj.EventsCreated.includes(x.id) && obj.UserName && obj.ProfileImage)[0].UserName}   </l></Typography>  : <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}><l style={{fontSize:'15px',color:'rgb(200,200,200'}}>Anonymous User </l></Typography>}
                         
                         </l>
                         <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}><l style={{fontSize:'14px',color:'rgb(200,200,200'}}>{x.RegistrationsCount} Registrations .   {x.Timestamp && dayjs(x.Timestamp).fromNow() }</l></Typography>
           
                       
                         
                         <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'flex-start',gap:'3px'}}> 
           
                         <div className="coinimg-perspective">
             <div className="coinimg-container">
               <img
                 src={coinImg}
                 alt="Coin"
                 style={{ width: '4em', height: '4em', objectFit: 'cover' }}
               />
             </div>
           </div>
           &nbsp;
           
                                   <l style={{fontSize:'24px',color:'rgb(200,200,200'}}>  {x.Coins}</l>
                                  
                                   </Typography>
                      
                                   </div>
           
                         
                                  
                         
           
                       
                         </div>
           
                         <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
           
                                   <Button  onClick={(e)=>{
                                   e.stopPropagation()
                                   window.location.href=`/event/${x.id}`
                                   }}><LaunchIcon/>  </Button>
           
                                   <Button  onClick={(e)=>{
                                   e.stopPropagation()
           
                                   setEvent_id(x.id)
           
                                   getComments(x.id)
           
           
           
           
                                   }}><CommentIcon/>  </Button>
           
                                   <Button  onClick={(e)=>{
                                   e.stopPropagation()
                                   navigator.clipboard.writeText(`https://v2-six-puce.vercel.app/event/${x.id}`)
                                   notifyClipboard()
                                   }}><ShareIcon/>  </Button>
           
                                   
                                   </div>
           
           
           
                         
                         </div>
                  
                     </Typography>    
           
           
                    
                         
                     <Typography gutterBottom sx={{  fontSize: 14 }} style={{position:'absolute',left:'20%',bottom:'10%',color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
                       
                       <div style={{display:'flex',alignItems:'flex-start',gap:'5px'}}>
                     <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
                     </div>
           
                     &nbsp;&nbsp;{!x.Type && <> <LocationPinIcon fontSize='small'/>
                        <l>{ x.Address.slice(x.Address.lastIndexOf(",") + 1).length>7 ? x.Address.slice(x.Address.lastIndexOf(",") + 1):x.Address.slice(x.Address.lastIndexOf(",") + 1) } </l> </>}
           
           
                         {x.Type=="online" && <> <VideoCallIcon fontSize='small'/>
                           <l>Online</l> </>}
                   </Typography>
                   <br></br>
        
           
                     
           
                   <br></br> <br></br>
                   <Button variant='outlined' onClick={()=>{
                    window.location.href=`event/${x.id}`
                   }} style={{backgroundColor:'rgb(236,16,52)',color:'white',borderRadius:'20px'}}>Book Tickets</Button>
                   <br></br><br></br>
                   </CardContent>
                 </CardActionArea>
               </Card>
              
        );
      })}
</div>


    
    
  )
}

export default EventComponent
