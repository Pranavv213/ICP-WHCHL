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
import './Manage.css'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import mapImage from '../assets/images/mapImage.svg'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ResponsiveAppBar from './ResponsiveAppBar';
import eventpageBackground from '../assets/images/coinBackground2.gif'
import eventpageEntireBackground from '../assets/images/eventBackground5.gif'
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function EventManage() {


  const { event_id } = useParams();

  const usersCollectionRef = collection(db, "events");
  const usersCollectionRef1 = collection(db, "user");
 

 const [events, setEvents] = useState([]);
 const [users,setUsers]=useState([])

 const [showAcceptInvite, setShowAcceptInvite] = useState(false);
  const { showWidgetModal, closeModal } = useOkto();
  const { createWallet, getUserDetails, getPortfolio } = useOkto();

  const [userDialog,setUserDialog]=useState({})


   
 

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

    // Store answers as an array
  const [answers, setAnswers] = useState([]);
  const [approvedUsers,setApprovedUsers] = useState([])

  const getUsers=async ()=>{
  
    let data = await getDocs(usersCollectionRef1);
                               
                let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                let filteredArray=usersTemp.filter(obj=>obj.EventsRegistered.includes(event_id))
              
                               
                setUsers(filteredArray)
               
  }

  // Handle input change
  const handleChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

   

    const result = {};
    events.length!=0 && events[0].Questions.forEach((question, index) => {
    result[question] = answers[index];
    });

  console.log(result);

    console.log(result); // You can send this to backend or do whatever you need
    updateUser(result)
  };


    

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
        const data = await getDocs(usersCollectionRef);
       
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
        let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
        console.log(filteredArray)
        setEvents(filteredArray);

        if(filteredArray.length!=0)
        {
          let approvedUsersTemp=filteredArray[0].Attendees.map(item=>item.Email)
          setApprovedUsers(approvedUsersTemp)
          console.log(approvedUsers)
        }
        
       
      
      };

      const updateUser = async (result) => {

        if(result.delete && result.delete==="delete")
        {

          result.delete="nodelete"
          const userDoc = doc(db, "events", event_id);

          let newApprovedArray=events[0].Attendees.filter(obj=>obj.Email!=result.Email)

        const newFields = { Name: events[0].Name, Description: events[0].Description, Creator:events[0].Creator ,Questions:events[0].Questions,Attendees:newApprovedArray,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount-1,RegistrationsCount:events[0].RegistrationsCount};
        await updateDoc(userDoc, newFields);
     

        const data = await getDocs(usersCollectionRef1);
                                     
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    
                                     
        let filteredArray=eventsTemp.filter(obj => obj.Email === result.Email)
        
        console.log(filteredArray)
                      
       
        newApprovedArray=filteredArray[0].EventsApproved.filter(item=>item!=event_id)
        
        const userDoc1 = doc(db, "user", filteredArray[0].id);
        const newFields1 = { Email: filteredArray[0].Email, Coins:filteredArray[0].Coins, EventsCreated:filteredArray[0].EventsCreated,EventsRegistered:[...filteredArray[0].EventsRegistered], EventsApproved:newApprovedArray,EventsAttended:filteredArray[0].EventsAttended};
        await updateDoc(userDoc1, newFields1);
        window.location.reload();

        return ;


        }

        const userDoc = doc(db, "events", event_id);
        const newFields = { Name: events[0].Name, Description: events[0].Description, Creator:events[0].Creator ,Questions:events[0].Questions,Attendees:[...events[0].Attendees,result],Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount+1,RegistrationsCount:events[0].RegistrationsCount};
        await updateDoc(userDoc, newFields);
     

        const data = await getDocs(usersCollectionRef1);
                                     
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    
                                     
        let filteredArray=eventsTemp.filter(obj => obj.Email === result.Email)
        
        console.log("filteredArray",filteredArray)
                      
       
        
        const userDoc1 = doc(db, "user", filteredArray[0].id);
        const newFields1 = { Email: filteredArray[0].Email, Coins:filteredArray[0].Coins, EventsCreated:filteredArray[0].EventsCreated,EventsRegistered:[...filteredArray[0].EventsRegistered], EventsApproved:[...filteredArray[0].EventsApproved,event_id],EventsAttended:filteredArray[0].EventsAttended};
        await updateDoc(userDoc1, newFields1);
       
        window.location.reload();

      };

    useEffect(() => {

      if(!localStorage.getItem('email'))
      {
        alert('Please Log In First')
        window.location.href = '/oktologin';

      }
      else
      {

        getUsers()
        getEvents();
      }
         
        },[])

      
  return (
    <div style={{
      
    }}>
      <div id="up"></div>
      <br></br>
      <ResponsiveAppBar   homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined"/>
      <hr></hr>
      <br></br> 

      <center>


      <div style={{display:'flex',justifyContent:'center'}}>
      <Button variant="contained" style={{borderRadius:'0'}}  onClick={()=>{
     window.location.reload();
}}>Overview </Button>
<Button variant="outlined" style={{borderRadius:'0'}} onClick={()=>{
     window.location.href = `/approve/${event_id}`;
}}>Guests </Button>

<Button variant="outlined" style={{borderRadius:'0'}} onClick={()=>{
     window.location.href = `/map/${event_id}`;
}} >Check In</Button>
<Button variant="outlined" style={{borderRadius:'0'}} onClick={()=>{
     window.location.href = '/manage';
}}>More</Button>

</div>


</center>
      
      <br></br>  <br></br>  <br></br>
  
        <div className="item" >

<div className="item1">

<div class="item1a">

<img class="poster" style={{border:'1px solid white'}}src={events.length!=0 && events[0].Image}></img>

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
    Hosted by {events.length!=0 && events[0].Creator}
  </p>

  <div
    className="item1c"
    style={{ marginTop: '10px' }}
  >
    <span style={{ color: 'white' }}>
      Registrations:&nbsp;
      {events.length !== 0 && events[0].RegistrationsCount}
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
    border:'0.2px solid white '
    
    }}>
  
  <h1 style={{color:'white'}}>{events.length!=0 && events[0].Name}</h1>
<div style={{color:'white',display:'flex',alignItems:'center',gap:'3px'}}><CalendarMonthIcon/><l>{events.length!=0 && formatDate(events[0].StartDateTime)}</l></div>

<div style={{textAlign:'left',display:'flex',alignItems:'flex-start',gap:'3px'}}>
<LocationPinIcon style={{color:'white'}}/> 
{events.length!=0 && events[0].Address && <l style={{color:'white'}} >{events[0].Address}</l>}
</div>

<div>

{events.length!=0 && events[0].Address && <iframe

style={{backgroundColor:'white',borderRadius:'0.5em'}}
            title="Google Map"
            src={`https://www.google.com/maps?q=${events[0].Address}&output=embed`}
           class="map"
           
            allowFullScreen=""
            loading="lazy"
          ></iframe>}

</div>




</div>

<div class="item2b" >
 



{events.length!=0 && events[0].RegistrationsCount!=0 && <h1 style={{color:'white'}}>Recent Registrations</h1>}

{events.length!=0 && events[0].RegistrationsCount==0 && <h1 style={{color:'white'}}>No Registrations</h1>}

{events.length!=0 && events[0].RegistrationsCount!=0 && <div style={{width:'90%',background: 'rgba(255,255,255,1)', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0)' }}>

{events.length!=0 && events[0].Registrations.map((x,index)=>{

  if(index==0 ) return(
  <div class="registrationsDiv" style={{borderTopRightRadius:'1em',borderTopLeftRadius:'1em'}} onClick={()=>{

    setUserDialog(x)
    console.log(x)
    handleClickOpen()
  }}
  
  ><div style={{display:'flex',flexWrap:'wrap',gap:'3px'}}><l style={{fontSize:'16px'}}><b>{x.Name}</b></l><l style={{fontSize:'16px',color:'grey'}}>{x.Email}</l></div>
  
{approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}

{ !approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid red',color:'white',backgroundColor:'red'}} onClick={(e)=>{

e.stopPropagation();
  updateUser(x)
}} >Approve</Button>}


  </div>
  )

  else if (index==events[0].Registrations.length-1) return(
    <div class="registrationsDiv" style={{borderBottomRightRadius:'1em',borderBottomLeftRadius:'1em'}} onClick={()=>{

      setUserDialog(x)
      handleClickOpen()
    }}><div style={{display:'flex',flexWrap:'wrap',gap:'3px'}} ><l style={{fontSize:'16px'}}><b>{x.Name}</b></l><l style={{fontSize:'16px',color:'grey'}}>{x.Email}</l></div>
    
    {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}}>Going</Button>}

{ !approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid red',color:'white',backgroundColor:'red'}} onClick={(e)=>{

e.stopPropagation();
updateUser(x)
}}>Approve</Button>}
    
    
    </div>
    )

    else return(
      <div class="registrationsDiv" onClick={()=>{

        setUserDialog(x)
        handleClickOpen()
      }}><div style={{display:'flex',flexWrap:'wrap',gap:'10px',alignItems:'center'}}><l style={{fontSize:'16px'}}><b>{x.Name}</b></l><l style={{fontSize:'16px',color:'grey'}}>{x.Email}</l></div>
      
      
      {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}}>Going</Button>}

{ !approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid red',color:'white',backgroundColor:'red'}} onClick={(e)=>{

e.stopPropagation();
updateUser(x)
}}>Approve</Button>}
      
      </div>
      )


})}

</div>}


         
              </div>
              </div>
    
         
       
       </div>

       
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar style={{backgroundColor:'black'}}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {userDialog.Name}
            </Typography>

            {approvedUsers.includes(userDialog.Email) && <Button variant='contained' style={{border:'1px solid red',backgroundColor:'red'}} onClick={()=>{

              userDialog.delete="delete"
              updateUser(userDialog)


            }}>
              Unapprove
            </Button>}

            {!approvedUsers.includes(userDialog.Email) && <Button variant='contained' style={{border:'1px solid red',backgroundColor:'red'}} onClick={()=>{

              console.log("updateUser",userDialog)
              updateUser(userDialog)
              
            }}>
              Approve
            </Button>}

            
          </Toolbar>
        </AppBar>
        <h3>&nbsp;&nbsp;&nbsp;Registration Questions</h3>
        <List>
          {Object.entries(userDialog).map(([key, value])=>{ if(key!="delete")
            return(<>
              <ListItemButton>
            <ListItemText primary={key} secondary={value} />
          </ListItemButton>
          <Divider />
            </>
          )})}
          
         
          
        </List>
      </Dialog>
        <br></br> <br></br> <br></br> <br></br> <br></br>
    </div>
  )
}

export default EventManage
