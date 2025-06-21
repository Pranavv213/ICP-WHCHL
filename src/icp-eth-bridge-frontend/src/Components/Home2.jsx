
import React,{useEffect, useState,useRef} from 'react'
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
import EventComponent from './EventComponent';
import MoviesComponent from './MoviesComponent';

const buttons = [
  { id: 1, label: 'Movies', icon: null },
  { id: 2, label: 'Standup', icon: null },
  { id: 4, label: 'Concerts', icon: null},
  { id: 5, label: 'Sports', icon: null},
  { id: 3, label: '', icon: <CategoryIcon fontSize="large" /> },
];




dayjs.extend(relativeTime);
// import { signInWithGoogle } from "../firebase-config";

const usersCollectionRef2 = collection(db, "ticket");
const usersCollectionRef3 = collection(db, "comments");

const getEmojiFlag = (address) =>
{

  let countryName=address.slice(address.lastIndexOf(",") + 2)
  console.log(countryName.length)
  
  if(countryName.toLowerCase()=="united states")
  {
    countryName="United States of America"
  }
  
  const code = getCode(countryName);
  if (!code) return '🏳️'; // fallback for unknown countries

  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(char => 127397 + char.charCodeAt()))

}
function Home2() {

    const [randomNumber, setRandomNumber] = useState('');
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef();
  
    const generateNumber = async(id) => {
      const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setRandomNumber(number);
      const result=await addDoc(usersCollectionRef2, {TicketId:number+localStorage.getItem('email'),EventId:id});
    
      console.log(result.id)
    
     

      setShowQR(false);
    };
  

 

 const notify = () => toast("Coming Soon!",{
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
     
      });

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

     const notifyGift = (value) => toast(`You just claimed ${value} coins`,{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type:'success'
       
        });
      const notifyClipboard = () => toast("Event link copied to clipboard !",{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
       
        });
    
        const apiKey = "pk.55c533ac3f7777ffcef9fb76448b8fd2"; 

  // Function to get the city
  
    const downloadQRCode = () => {
      const qrCanvas = qrRef.current.querySelector('canvas');
      const originalSize = qrCanvas.width; // typically 200
      const quietZone = 60; // padding around QR
      const totalSize = originalSize + quietZone * 2;
  
      // Create new canvas
      const newCanvas = document.createElement('canvas');
      newCanvas.width = totalSize;
      newCanvas.height = totalSize;
  
      const ctx = newCanvas.getContext('2d');
  
      // Fill background with white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, totalSize, totalSize);
  
      // Draw original QR canvas onto new one with padding offset
      ctx.drawImage(qrCanvas, quietZone, quietZone);
  
      // Download
      const url = newCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRCode_${randomNumber}.png`;
      link.click();
    };
  
  

    const usersCollectionRef = collection(db, "events");
        const usersCollectionRef1 = collection(db, "user");
    const [coins,setCoins]=useState(localStorage.getItem('coins')?localStorage.getItem('coins'):0)
    const [prevCoins,setPrevCoins]=useState(0)
    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    const [createdEvents,setCreatedEvents]=useState([])
    const [allEvents,setAllEvents]=useState([])
    const [registeredEvents,setRegisteredEvents]=useState([])
    const [userApprovedArray,setUserApprovedArray]=useState([])
    const [showConfetti,setShowConfetti]=useState(false)
    const [showDiv,setShowDiv]=useState(false)
    const [buttonHight,setButtonHighlight]=useState(1)
    const [trendingEvents,setTrendingEvents]=useState([])
    const [city,setCity]=useState('')
    const [search,setSearch]=useState('')
    const [category,setCategory]=useState('')
    const [showLeaderboarddDiv,setShowLeaderboardboardDiv]=useState(false)
    const [leaderboardArray,setLeaderboardArray]=useState([])
    const [showCommentsDiv,setShowCommentsDiv]=useState([])
    
    const [makeComment,setMakeComment]=useState('')
    const [comments,setComments]=useState([])
    const [event_id,setEvent_id]=useState('')

    const [allUsersArray,setAllUsersArray]=useState([])

    const [isOnline,setIsOnline]=useState(false)
    
    const [allMovies,setAllMovies]=useState([])


    const  getLeaderboard=async ()=>{

      try{
      
                  const data = await getDocs(usersCollectionRef1);
                                                
                     let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
           
                     let filteredArray=usersTemp.filter(obj => obj.ProfileImage!=null && obj.UserName!=null)
      
                   console.log(filteredArray)
                   filteredArray.sort((a, b) => b.Coins - a.Coins);

                   setLeaderboardArray(filteredArray)

                   setShowLeaderboardboardDiv(true)
                   
      
                  
                 
                                 
              }
              catch{
      
                  notifyCustom("Error loading leaderboard","error")
                  setInterval(()=>{
                      window.location.href="/home"
                    },3000)
              }
    
    }
      

    async function getCityFromAddress(address) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(address)}`;
  
      const response = await fetch(url, {
          headers: {
              'User-Agent': 'YourAppName/1.0 (your@email.com)'
          }
      });
  
      const data = await response.json();
  
      if (data.length > 0) {
          const address = data[0].address;
          return address.city || address.town || address.village || address.county || null;
      } else {
          return null;
      }
  }
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
     
     
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
    
      return `${day}${getOrdinal(day)} ${month}, ${JSON.stringify(year).slice(2)}`;
    }
    const createUser = async (email) => {

            try{
                await addDoc(usersCollectionRef, { Email:email, Coins: 100, EventsCreated: [], EventsRegistered: [], EventsAttended: []});
            }
            catch{
                alert('Problem Creating User')
            }
          
           
          };

          const DrawerList = (
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>

             
              <List>
              
                {[
   
   "Stand-Up",
   "Sketch",
   "Improv",
   "Satire",
   "Sitcom",
   "Slapstick",
   "Roast",
   "Desi Comedy",
   "Offbeat",
   "Panel Show",
   "Pop",
   "Rock",
   "Hip-Hop",
   "Classical",
   "Jazz",
   "EDM",
   "Folk",
   "Reggae",
   "Country",
   "Bollywood",
   "Blues",
   "Metal"
 ].map((text, index) => (
                  <ListItem key={text} disablePadding onClick={()=>{
                    setCategory(text)
                    toggleDrawer(false)
                    
                  
                  }}>
                    <ListItemButton>
                     
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
             
            </Box>
          );

   

       const getComments=async(event_id)=>{

        let eventId=event_id

        console.log("eventId",eventId)

        let data = await getDocs(usersCollectionRef3);
                             
         let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

         let filteredArray=chats.filter(obj=>obj.EventId==eventId)
                           
         console.log("fileteredArray",filteredArray)

         if(filteredArray.length!=0)

          {
            data=await getDocs(usersCollectionRef1);

         let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

         let userFilteredArray=users.filter(obj=>obj.UserName && obj.ProfileImage)

       
         let userFilteredArray1=userFilteredArray.map(user=>user.Email)


       
         console.log("Final UserFilteredArray",userFilteredArray)    

         let chatsData=filteredArray[0].Chats.filter(obj=>userFilteredArray1.includes(obj.Sender))

         if(chatsData.length==0)
          {
           setShowCommentsDiv(["not exist"])
 
           return;
          }

         const FinalChatsData = chatsData.map(msg => {
          const user = userFilteredArray.find(user => user.Email === msg.Sender);
          return {
            ...msg,
            UserName: user?.UserName || null,
            ProfileImage: user?.ProfileImage || null
          };
        });

         setComments(FinalChatsData)
         

         setShowCommentsDiv(FinalChatsData)

         console.log("chatsData",FinalChatsData)
          }

          else{
            setShowCommentsDiv(["not exist"])
          }


         

       }

      const handleSendComment=async ()=>{


          if(!(localStorage.getItem('profileImg') && localStorage.getItem('userName')))
                    {
                      notifyCustom("Set up your profile to participate in discussions!","error")
        
                      setInterval(()=>{
        
                        window.location.href="/profilesettings"
                      },4000)

                      return;
                    }

        let eventId=event_id

        console.log("eventId",eventId)

      
        let makeComment1=makeComment
        if(makeComment.startsWith('(@'))
        {
          makeComment1="(@"+allUsersArray.filter(obj=>obj.UserName==makeComment.slice(2,makeComment.indexOf(')')))[0].Email+")"+makeComment.slice(makeComment.indexOf(")")+1)
        }

           const data = await getDocs(usersCollectionRef3);
                                
            let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

            let filteredArray=chats.filter(obj=>obj.EventId==eventId)
                              
            console.log("fileteredArray",filteredArray)

            if(filteredArray.length==0)

              {
               
               
                const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
             
                  await addDoc(usersCollectionRef3, { EventId:eventId,Chats:[{Sender:localStorage.getItem('email'),SentTo:eventId,Message:makeComment1,Timestamp: now}]});

                
                 getComments(event_id)
                 
               
              }

              else

              {


                            const userDoc1 = doc(db, "comments", filteredArray[0].id);

                            const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

                            console.log("makeComment slice",makeComment1.slice(0,2),makeComment1.slice(0,2).length)

                            if(makeComment1.length>=2 && makeComment1.slice(0,2)==="(@")
                             
                             {
            
                              const newFields1={EventId:eventId,Chats:[...filteredArray[0].Chats,{Sender:localStorage.getItem('email'),SentTo:makeComment1.slice(2,makeComment1.indexOf(')')),Message:makeComment1.slice(1,makeComment1.indexOf(')'))+makeComment1.slice(makeComment1.indexOf(')')+1),Timestamp: now}]};

                              await updateDoc(userDoc1, newFields1);
                            
            
                              getComments(event_id)
            
                             } 
                             else
                             {
                             const newFields1 = { EventId:eventId,Chats:[...filteredArray[0].Chats,{Sender:localStorage.getItem('email'),SentTo:eventId,Message:makeComment1,Timestamp: now}]};
                     
                               // update
                     
                     
                             await updateDoc(userDoc1, newFields1);
                             getComments(event_id)
                             }
              }

              setMakeComment("")
                
                              
                
                 
                 
      }
      const isUserExist=async ()=>{

        let data = await getDocs(usersCollectionRef1);

        let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                  
                                   
        let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

        return filteredArray
      }


      const getUserId=async ()=>{

        let data = await getDocs(usersCollectionRef1);
                                   
                    let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

                    setAllUsersArray(usersTemp)
                  
                                   
                    let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))
                    console.log(filteredArray)
        
                    let userRegistrationsFound=filteredArray[0].EventsRegistered
                    let userApprovedFound=filteredArray[0].EventsApproved
                    let userCreationsFound=filteredArray[0].EventsCreated
                    setUserApprovedArray(userApprovedFound)
                    

                    let data1 = await getDocs(usersCollectionRef);
                                   
                    let eventsTemp=await data1.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    setAllEvents(eventsTemp)

                    console.log("gajupaddu",eventsTemp.length)

                    const newArray = [...eventsTemp]; 
                    newArray.sort(() => Math.random() - 0.5); 

                    setTrendingEvents(newArray);
                    console.log("trending events",trendingEvents)
                    

                    let eventsCreatedFound=eventsTemp.filter(obj =>  userCreationsFound.includes(obj.id))
                    let eventsRegistrationsFound=eventsTemp.filter(obj =>  userRegistrationsFound.includes(obj.id))
                    
                    console.log("eventsCreatedFound",eventsCreatedFound)
                    console.log("eventsRegistrationsFound",eventsRegistrationsFound)
                    setCreatedEvents(eventsCreatedFound)
                    setRegisteredEvents(eventsRegistrationsFound)

                    let moviesData=await getDocs(collection(db,"movies"));
                    let moviesTemp=await moviesData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    setAllMovies(moviesTemp)

                   
                  
        
                   

      }

     
   
      useEffect(()=>{

        if(!localStorage.getItem('email'))
           {

            window.location.href="/oktologin"
            
        }

       
       

        isUserExist().then((data)=>{

         
          {
            
            getUserId()

            if(localStorage.getItem('coins') && localStorage.getItem('coins')<data[0].Coins)
              {
                
               
                console.log("prevCoins",prevCoins)
                console.log("coins",coins)
                
               
                setShowConfetti(true)
                setShowDiv(true)
                
                localStorage.setItem('coins',data[0].Coins)
               

              }

              if(!localStorage.getItem('userLocationData'))
              {
                window.location.href="/location"
              }
          
          }
        })
      },[])
// Icons and Components (keep your existing imports)
// ... (all your existing imports remain the same)



  // ... (keep all your existing state and functions)

  return (
    <div>
       <ToastContainer  />

        {showCommentsDiv.length !== 0 && (
  <div style={{
    width: '100%',
    position: 'fixed',
    bottom:'0px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'hidden', // outer div doesn't scroll
    zIndex: 1000,
  }}>
    <div style={{
      width: '95%',
      height: '80vh', // panel height for scrolling content
      backgroundColor: 'black',
      border: '2px solid #1876d1',
      borderTopLeftRadius: '3em',
      borderTopRightRadius: '3em',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden', // important to clip the content inside
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      
      {/* Header */}
      <div style={{
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        color: '#1876d1',
        padding: '10px',
      }} onClick={() => {
        setShowCommentsDiv([]);
        setMakeComment("");
      }}>
<br></br>
        &nbsp;   &nbsp;   &nbsp;   
        <CancelIcon />
      </div>

      <center>
        <h2 style={{ color: 'white' }}>Discussions Panel</h2>
      </center>

      {/* Scrollable Comment Section */}
      <div style={{
        flex: 1, // fill available space
        overflowY: 'auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
      }}>
        {showCommentsDiv.length !== 0 && showCommentsDiv[0] !== "not exist" && showCommentsDiv.map((x, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px' }}>
            <div>
              <img
                src={x.ProfileImage}
                alt="profile"
                style={{
                  width: '1.5em',
                  height: '1.5em',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

              <div style={{display:'flex',gap:'7px'}}>
              <label style={{ color: 'white', fontSize: '14px' }}><b>{x.UserName}</b></label>
              <div style={{color:'white', fontSize: '14px'}}>{x.Timestamp && dayjs(x.Timestamp).fromNow() 
              }</div>

              </div>
              

              <div style={{ color: 'white', textAlign: 'left' }}>{x.Message.startsWith('@')?"@"+allUsersArray.filter(obj=>obj.Email==x.Message.slice(1,x.Message.indexOf(" ")))[0].UserName+" "+x.Message.slice(x.Message.indexOf(" ")+1):x.Message}</div>
              <div
                style={{ color: 'grey', fontSize: '14px', cursor: 'pointer' }}
                onClick={() => setMakeComment(`(@${x.UserName}) `)}
              >
                Reply
              </div>
            </div>

            
          </div>
        ))}
      </div>

      {/* Fixed Input Section */}
      <div style={{
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid #444',
        backgroundColor: '#000',
      }}>
        <input
          style={{
            width: '80%',
            height: '30px',
            fontSize:'16px',
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #555',
            backgroundColor: '#111',
            color: 'white'
          }}
          value={makeComment}
          onChange={(e) => setMakeComment(e.target.value)}
        />
        <Button onClick={handleSendComment}>
          <SendIcon fontSize="large" />
        </Button>
      </div>
    </div>
  </div>
)}
   
      {/* Glassmorphism Navbar */}
      
        <ResponsiveAppBar 
          homeButtonStyle="contained" 
          earnButtonStyle="outlined" 
          createButtonStyle="outlined" 
          dashboardButtonStyle="outlined" 
        />
    
      <br></br>  <br></br>
       <div className="web3-container">

      {/* Main Content */}
      <div className="web3-content">
        {/* Coin Balance Card */}
        <div className="web3-coin-card">
          <div className="coin-shine-container">
            <img src={coinImage} alt="Coin" className="coin-image" />
          </div>
          <div className="coin-balance">
            <CountUp start={coins-100} end={coins} className="coin-count" />
            <span className="coin-label">COINS</span>
          </div>
          <button 
            className="web3-button leaderboard-button"
            onClick={getLeaderboard}
          >
            <LeaderboardIcon className="button-icon" />
            Leaderboard
          </button>
        </div>

        {/* Category Selector */}
        <div className="category-selector">
          {buttons.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`category-button ${buttonHight === id ? 'active' : ''}`}
              onClick={() => {
                if (id === 3) setOpen(prev => !prev);
                setButtonHighlight(id);
                setCategory('');
              }}
            >
              {icon || label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="web3-search-container" >
         
          <input
            className="web3-search-input" style={{fontSize:'16px',width:'18em'}}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search Movies, Concerts, Events..."
          />
        </div>

        {/* Content Sections */}
        <div className="content-sections">
          {buttonHight === 1 && (
            <MoviesComponent 
              allEvents={allMovies} 
              allUsersArray={allUsersArray} 
              search={search}
              event_id={event_id} 
              setEvent_id={setEvent_id} 
              getComments={getComments} 
              notifyClipboard={notifyClipboard} 
              formatDate={formatDate} 
              notifyCustom={notifyCustom}
            />
          )}
          
          {buttonHight === 2 && (
            <EventComponent 
              allEvents={allEvents} 
              allUsersArray={allUsersArray} 
              search={search}
              event_id={event_id} 
              setEvent_id={setEvent_id} 
              getComments={getComments} 
              notifyClipboard={notifyClipboard} 
              formatDate={formatDate} 
              Category={"Standup"}
            />
          )}
          
          {buttonHight === 4 && (
            <EventComponent 
              allEvents={allEvents} 
              allUsersArray={allUsersArray} 
              search={search}
              event_id={event_id} 
              setEvent_id={setEvent_id} 
              getComments={getComments} 
              notifyClipboard={notifyClipboard} 
              formatDate={formatDate} 
              Category={"Concert"}
            />
          )}
        </div>

        {/* Create Event Floating Button */}
        <button 
          className="web3-floating-button"
          onClick={() => window.location.href = "/creator"}
        >
          <AddIcon />
        </button>

        {/* Modals and Drawers */}
        <Drawer open={open} onClose={toggleDrawer(false)}>
          <div className="drawer-content">
            <h3 className="drawer-title">Categories</h3>
            {DrawerList}
          </div>
        </Drawer>

        {/* Leaderboard Modal */}
        {showLeaderboarddDiv && (
          <div className="web3-modal">
            <div className="modal-header">
              <h3>Leaderboard</h3>
              <button className="close-button" onClick={() => setShowLeaderboardboardDiv(false)}>
                <CancelIcon />
              </button>
            </div>
            <div className="leaderboard-list">
              {leaderboardArray.slice(0, 5).map((x, index) => (
                <div key={index} className="leaderboard-item">
                  <div className="user-info">
                    <span className="rank">{index + 1}.</span>
                    <img src={x.ProfileImage} alt="profile" className="user-avatar" />
                    <span className="username">{x.UserName.length < 6 ? x.UserName : `${x.UserName.slice(0, 6)}...`}</span>
                  </div>
                  <div className="coin-info">
                    <img src={coinImg} alt="coin" className="coin-icon" />
                    <span className="coin-amount">{x.Coins}</span>
                  </div>
                </div>
              ))}
              {leaderboardArray.length > 0 && (
                <div className="leaderboard-item current-user">
                  <div className="user-info">
                    <span className="rank">{leaderboardArray.findIndex(obj => obj.Email === localStorage.getItem('email')) + 1}.</span>
                    <img src={leaderboardArray.filter(x => x.Email == localStorage.getItem('email'))[0].ProfileImage} alt="profile" className="user-avatar" />
                    <span className="username">You</span>
                  </div>
                  <div className="coin-info">
                    <img src={coinImg} alt="coin" className="coin-icon" />
                    <span className="coin-amount">{leaderboardArray.filter(x => x.Email == localStorage.getItem('email'))[0].Coins}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
          </div>

        {/* Comments Panel */}
                   
  


      

        {/* Confetti and Notification */}
        {showConfetti && <Confetti width={1500} height={800} />}
{showDiv && (
  <div className="reward-popup">
    <h1>Congratulations!</h1>
    <img src={coinImage} className="reward-image" />
    <h1>{localStorage.getItem('coins')}</h1>
    <p>You just won {parseInt(localStorage.getItem('coins')) - parseInt(coins)} coins!</p>

   
    
    <div className="slider-button-container">
       <center>
      <button className='slider-button' style={{color:'white'}}
        
        onClick={() => {
          if (localStorage.getItem('coins') && localStorage.getItem('coins') >= 1) {
            setShowDiv(false);
            setShowConfetti(false);
            localStorage.setItem('count', 1);
            notifyGift(parseInt(localStorage.getItem('coins')) - coins);
            setCoins(parseInt(localStorage.getItem('coins')));
            setInterval(() => window.location.reload(), 3000);
          }
        }}
      >
       <l style={{fontSize:'16px'}}>Claim</l> 
        
      </button>
         </center>
    </div>
 
  </div>
)}
      </div>

     
  
    </div>
  );
};

export default Home2;