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
import { CircularProgressbar } from 'react-circular-progressbar';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import 'react-circular-progressbar/dist/styles.css';
import { SocialIcon } from 'react-social-icons'


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


  const [filterOption, setFilterOption] = useState('All');

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

   
 

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
  const [search,setSearch] = useState("")

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

      

      localStorage.removeItem('attendeeEmails')

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
      <ResponsiveAppBar  homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined"/>
      <br></br> <br></br>  <br></br> <br></br>  <br></br> <br></br>

      <center>


      <div style={{display:'flex',justifyContent:'center'}}>
      <Button variant="outlined" style={{borderRadius:'0',color:'#6f6aff',border:'0.2px solid #6f6aff'}}  onClick={()=>{
     window.location.href = `/manage/${event_id}`;
}}>Edit </Button>
<Button variant="contained" style={{borderRadius:'0',backgroundColor:'#6f6aff',color:'white'}} onClick={()=>{
     window.location.href = '/manage';
}}>Guests </Button>

<Button variant="outlined" style={{borderRadius:'0',color:'#6f6aff',border:'0.2px solid #6f6aff'}} onClick={()=>{
     window.location.href = `/map/${event_id}`;
}} >Check In</Button>
<Button variant="outlined" style={{borderRadius:'0',color:'#6f6aff',border:'0.2px solid #6f6aff'}} onClick={()=>{
      window.location.href = `/payouts/${event_id}`;
}}>Payouts</Button>

</div>


</center>
      
      <br></br>  
  
        <div className="item" >

<div className="item1">

<div class="item1a">





<img class="poster" style={{border:'1px solid white'}} src={events.length!=0 && events[0].Image}></img>
<h2 style={{color:'white',textAlign:'center'}}>{events.length!=0 && events[0].Name}</h2>



</div>

<div
  className="item1b"
  style={{
    width: '270px',               // Set fixed width
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
    justifyContent:'center',
    alignItems:'center',
    width:'90%',
  }}
>

   
    

  

  <div
    className="item1c" style={{width:'100%'}}
    
  >
    <span style={{ color: 'white' }}>
      Registrations:&nbsp;
      {events.length !== 0 && events[0].RegistrationsCount}
     &nbsp; &nbsp;
      Approvals:&nbsp;
      {events.length !== 0 && events[0].AttendeesCount}
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
    border:'0.5px solid white'
    
    }}>

        
  <div style={{width:'100%',display:'flex',gap:'50px',justifyContent:'center'}}>


  <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around'}}><Button  style={{color:'yellow',height:'3em',width:'7em'}}><l style={{fontSize:'28px',color:'rgb(62,152,199'}}>Cap  &nbsp;{events.length!=0 && events[0].Capacity}</l></Button></div>

  <div style={{width:'7em'}}>

    {events.length!=0 &&  <CircularProgressbar value={approvedUsers.length*100/events[0].Capacity} text={approvedUsers.length+"/"+events[0].Capacity} /> }
    
    
    
    
   
    
    
    </div>

    </div>
    
    
   
   
    
  


  



</div>

<div class="item2b" >

    <div style={{width:'100%'}}>

    <div style={{display:'flex'}}><input style={{width:'100%',fontSize:'28px',backgroundColor:'black',color:'white',borderTop:'none',border:'0.08px solid white',borderTopLeftRadius:'0.5em',borderBottomLeftRadius:'0.5em',borderRight:'none'}} placeholder='&nbsp;&nbsp;🔍 Search guests' onChange={(e) => {

console.log(e.target.value.toLowerCase())
setSearch(e.target.value)


        }    }/> 
    <div >

    <select style={{fontSize:'16px',height:'3em',backgroundColor:'black',border:'0.08px solid white',borderTopRightRadius:'0.7em',borderBottomRightRadius:'0.7em',color:'white',width:'7em',textAlign:'center'}}
        id="fruits"
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Unapproved">Unapproved</option>
        <option value="Approved">Approved</option>
      
      </select>
    {/* <Box sx={{ minWidth: 80 }} style={{backgroundColor:'black',border:'0.08px solid white',borderTopRightRadius:'1em',borderBottomRightRadius:'1em'}}>
   
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"><div style={{display:'flex',alignItems:'center'}}><FilterAltIcon style={{color:'white'}}/> </div></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterOption}
          label="Age"
          onChange={handleFilterChange}

          style={{color:'white'}}
        >
          <MenuItem value={"All"}>All</MenuItem>
          <MenuItem value={"Unapproved"}>Unapproved</MenuItem>
          <MenuItem value={"Approved"}>Approved</MenuItem>
        </Select>
      </FormControl>
    </Box> */}
    </div>
    </div>


    </div>


 


<br></br>


{events.length!=0 && search.length!=0 && <div> <div style={{width:'100%',background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(5px)',borderRadius:'10px'}}>
        {events[0].Registrations
          .filter(person => {

            
            const query = search.toLowerCase().replace(/\s/g, '');
            console.log("query",search)
            const name = person.Name.toLowerCase().replace(/\s/g, '');
            const email = person.Email.toLowerCase().replace(/\s/g, '');
            return name.includes(query) || email.includes(query);
          })
          .map((x, index) =>{ if(index==0 ) return (
            <div class="registrationsDiv" style={{borderTopRightRadius:'1em',borderTopLeftRadius:'1em'}} onClick={()=>{

              setUserDialog(x)
              console.log(x)
              handleClickOpen()
            }}
            
            >
              
              <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
            
            {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
              
              
              <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

              </div>
              
              
              <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
            
          {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
          
          { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}} onClick={(e)=>{
          
          e.stopPropagation();
            updateUser(x)
          }} >Approve</Button>}
          
          
            </div>
          )
          else if (index==events[0].Registrations.length-1) return(
            <div class="registrationsDiv" style={{borderBottomRightRadius:'1em',borderBottomLeftRadius:'1em'}} onClick={()=>{
        
              setUserDialog(x)
              handleClickOpen()
            }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
            
            {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
              
              
              <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

              </div>
              
              
              <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
            
          {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
          <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
          
          e.stopPropagation();
            updateUser(x)
          }} >Approve</Button>}
          
          
            </div>
            )
        
            else return(
              <div class="registrationsDiv" onClick={()=>{
        
                setUserDialog(x)
                handleClickOpen()
              }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
              
              {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
                
                
                <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>
  
                </div>
                
                
                <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
              
            {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
            
            { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
            
            e.stopPropagation();
              updateUser(x)
            }} >Approve</Button>}
            
            
              </div>
              )
        
        
        
        
        
        
        })
        }
      </div>
      
      
      </div>
      }


{/* All */}

<br></br>

{(filterOption.length == 0 || filterOption==="All" && search.length==0) && <div>
    
   


<div style={{width:'100%', background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>

{events.length!=0 && events[0].Registrations.map((x,index)=>{

  if(index==0 ) return(
  <div class="registrationsDiv" style={{borderTopRightRadius:'1em',borderTopLeftRadius:'1em'}} onClick={()=>{

    setUserDialog(x)
    console.log(x)
    handleClickOpen()
  }}
  
  > <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
  <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
  
  {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
    
    
    <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

    </div>
    
    
    <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
  
{approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}

{ !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{

e.stopPropagation();
  updateUser(x)
}} >Approve</Button>}


  </div>
  )

  else if (index==events[0].Registrations.length-1) return(
    <div class="registrationsDiv" style={{borderBottomRightRadius:'1em',borderBottomLeftRadius:'1em'}} onClick={()=>{

      setUserDialog(x)
      handleClickOpen()
    }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
    <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
    
    {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
      
      
      <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

      </div>
      
      
      <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
    
  {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
  
  { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
  
  e.stopPropagation();
    updateUser(x)
  }} >Approve</Button>}
  
  
    </div>
    )

    else return(
      <div class="registrationsDiv" onClick={()=>{

        setUserDialog(x)
        handleClickOpen()
      }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
      
      {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
        
        
        <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

        </div>
        
        
        <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
      
    {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
    
    { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
    
    e.stopPropagation();
      updateUser(x)
    }} >Approve</Button>}
    
    
      </div>
      )


})}

</div>
</div>
         }








{/* filterOption=Unapproved */}



{filterOption.length!=0 && filterOption=="Unapproved" && search.length==0 &&  <div><div style={{width:'100%', background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)'}}>

{events.length!=0 && events[0].Registrations.map((x,index)=>{

  if(index==0 && !approvedUsers.includes(x.Email)) return(
  <div class="registrationsDiv" style={{borderTopRightRadius:'1em',borderTopLeftRadius:'1em'}} onClick={()=>{

    setUserDialog(x)
    console.log(x)
    handleClickOpen()
  }}
  
  > <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
  <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
  
  {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
    
    
    <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

    </div>
    
    
    <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
  
{approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}

{ !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{

e.stopPropagation();
  updateUser(x)
}} >Approve</Button>}


  </div>
  )

  else if (index==events[0].Registrations.length-1 && !approvedUsers.includes(x.Email)) return(
    <div class="registrationsDiv" style={{borderBottomRightRadius:'1em',borderBottomLeftRadius:'1em'}} onClick={()=>{

      setUserDialog(x)
      handleClickOpen()
    }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
    <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
    
    {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
      
      
      <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

      </div>
      
      
      <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
    
  {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
  
  { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
  
  e.stopPropagation();
    updateUser(x)
  }} >Approve</Button>}
  
  
    </div>
    )

    else if ( !approvedUsers.includes(x.Email)) return(
      <div class="registrationsDiv" onClick={()=>{

        setUserDialog(x)
        handleClickOpen()
      }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
      
      {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
        
        
        <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

        </div>
        
        
        <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
      
    {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
    
    { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
    
    e.stopPropagation();
      updateUser(x)
    }} >Approve</Button>}
    
    
      </div>
      )


})}

</div>
</div>
         }



{/* filterOption=Approved */}


{filterOption.length!=0 && filterOption=="Approved" && search.length==0 && <div><div style={{width:'100%', background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>

{events.length!=0 && events[0].Registrations.map((x,index)=>{

  if(index==0 && approvedUsers.includes(x.Email)) return(
  <div class="registrationsDiv" style={{borderTopRightRadius:'1em',borderTopLeftRadius:'1em'}} onClick={()=>{

    setUserDialog(x)
    console.log(x)
    handleClickOpen()
  }}
  
  > <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
  <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
  
  {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
    
    
    <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

    </div>
    
    
    <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
  
{approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}

{ !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{

e.stopPropagation();
  updateUser(x)
}} >Approve</Button>}


  </div>
  )

  else if (index==events[0].Registrations.length-1 && approvedUsers.includes(x.Email)) return(
    <div class="registrationsDiv" style={{borderBottomRightRadius:'1em',borderBottomLeftRadius:'1em'}} onClick={()=>{

      setUserDialog(x)
      handleClickOpen()
    }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
    <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
    
    {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
      
      
      <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

      </div>
      
      
      <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
    
  {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
  
  { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
  
  e.stopPropagation();
    updateUser(x)
  }} >Approve</Button>}
  
  
    </div>
    )

    else if ( approvedUsers.includes(x.Email))return(
      <div class="registrationsDiv" onClick={()=>{

        setUserDialog(x)
        setOpen(true)
      }}> <div style={{display:'flex',flexWrap:'wrap',gap:'3px',alignItems:'center'}}> 
            
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}> 
      
      {users.filter(obj=>obj.ProfileImage && obj.Email==x.Email).length!=0 && <img style={{width:'2em', height:'2em', borderRadius:'50%',objectFit:'cover'}} src={users.filter(obj=>obj.ProfileImage && obj.Email==x.Email)[0].ProfileImage}></img>}
        
        
        <l style={{fontSize:'16px',color:'white'}}><b>{x.Name}</b></l>

        </div>
        
        
        <l style={{fontSize:'16px',color:'rgb(205,201,201)'}}>{x.Email}</l></div>
      
    {approvedUsers.includes(x.Email) && <Button variant="contained" style={{height:'2em',border:'1px solid green',color:'white',backgroundColor:'green'}} >Going</Button>}
    
    { !approvedUsers.includes(x.Email) && <Button variant="outlined" style={{height:'2em',border:'1px solid red',color:'red'}}  onClick={(e)=>{
    
    e.stopPropagation();
      updateUser(x)
    }} >Approve</Button>}
    
    
      </div>
      )


})}

</div>
</div>
         }



              </div>
              </div>
    
         
       
       </div>

       
       {open && (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: '20px',
      position: 'fixed',
      top: '0px',
      left: '50%',
      color: 'white',
      backgroundColor: 'black',
      border: '2px solid #1876d1',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      transform: 'translateX(-50%)',
      zIndex: 99999999,
      animation: 'popupAnimation 0.5s ease',
      backgroundImage: `url(${eventpageBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      overflowY: 'auto',
    }}
  >
    <br /><br />
    <div style={{ paddingTop: '10vh', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          backgroundColor: 'black',
          padding: '1em',
          maxWidth: '20em',
          border: '1px solid #1876d1',
          borderRadius: '10px',
        }}
      >
        <div style={{ width: '100%', textAlign: 'right' }} onClick={() => setOpen(false)}>
          <CloseIcon />
        </div>

        <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
                <strong>Question</strong>
              </th>
              <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
                <strong>Answer</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(Object.fromEntries([
  ...["Name", "Email"].filter(k => k in userDialog).map(k => [k, userDialog[k]]),
  ...Object.entries(userDialog).filter(([k]) => k !== "Name" && k !== "Email" && !k.startsWith("type=socials{}")),
  ...Object.entries(userDialog).filter(([k]) => k.startsWith("type=socials{}"))
])).map(([key, value]) => {
              if (key !== 'delete' && (key=="Email" || key=="Name")) {
                return (
                  <tr key={key}>
                    
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{key}</td>
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}><div style={{whiteSpace: 'normal',
  wordBreak: 'break-word'}}>{value}</div></td>
                  </tr>
                );
                
              }

              else if (key !== 'delete' && key.startsWith("type=socials{}")) {
                return (
                  <tr key={key}>
                    
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}><SocialIcon url={value}/></td>
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}><div style={{whiteSpace: 'normal',
  wordBreak: 'break-word'}}><a href={value} style={{textDecoration:'none',color:'#1876d1'}} >{value}</a></div></td>
                  </tr>
                );
                
              }

            

              else if (key !== 'delete' && key.startsWith("type=options{")) {
                return (
                  <tr key={key}>
                    
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{key.slice(key.indexOf('}')+1)}</td>
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}><div style={{whiteSpace: 'normal',
  wordBreak: 'break-word'}}>{value}</div></td>
                  </tr>
                );
                
              }

              return null;
            })}
          </tbody>
        </table>

        {approvedUsers.includes(userDialog.Email) ? (
          <Button
            variant="contained"
            style={{ border: '1px solid red', backgroundColor: 'red', marginTop: '1em' , height:'2em' }}
            onClick={() => {
              userDialog.delete = 'delete';
              updateUser(userDialog);
            }}
          >
            Unapprove
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{ border: '1px solid red', backgroundColor: 'red', marginTop: '1em' , height:'2em' }}
            onClick={() => {
              console.log('updateUser', userDialog);
              updateUser(userDialog);
            }}
          >
            Approve
          </Button>
        )}
      </div>
    </div>
  </div>
)}

        <br></br> 
        
       
       
        
        
        
        <br></br> <br></br> <br></br> <br></br>
    </div>
  )
}

export default EventManage
