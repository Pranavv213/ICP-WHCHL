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
import coinImg from '../assets/images/coinImg.png'
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
import { useParams } from 'react-router-dom';




function Channel() {

    const usersCollectionRef1 = collection(db, "user");
    const usersCollectionRef = collection(db, "events");
    const usersCollectionRef3 = collection(db, "comments");

    const [users,setUsers]=useState([])

     const [makeComment,setMakeComment]=useState('')
     const [comments,setComments]=useState([])
    const [showCommentsDiv,setShowCommentsDiv]=useState([])


    const [allUsersArray,setAllUsersArray]=useState([])

    const [events,setEvents]=useState([])
      const [event_id,setEvent_id]=useState('')

    const [myProfile,setMyProfile]=useState({})

    const [isFollow,setIsFollow]=useState(false)
   
    const { userName } = useParams();

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


    const handleFollow = async () => {
        try {
            const currentEmail= localStorage.getItem('email');
            const userDoc1 = doc(db, "user", users[0].id);
            const existingFollowers = users[0].Followers || [];
    
            // Avoid duplicate followers
            const updatedFollowers = existingFollowers.includes(currentEmail)
                ? existingFollowers
                : [...existingFollowers, currentEmail];
    
            await updateDoc(userDoc1, { Followers: updatedFollowers });
    
            // Fetch current user data
            const data = await getDocs(usersCollectionRef1);
            const usersTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            const filteredArray = usersTemp.filter(obj => obj.Email === currentEmail);
    
            if (filteredArray.length === 0) {
                notifyCustom("User not found", "error");
                return;
            }
    
            const currentUser = filteredArray[0];
            const userDoc2 = doc(db, "user", currentUser.id);
    
            const existingFollowing = currentUser.Following || [];
    
            // Avoid duplicate following
            const updatedFollowing = existingFollowing.includes(users[0].Email)
                ? existingFollowing
                : [...existingFollowing, users[0].Email];
    
            await updateDoc(userDoc2, { Following: updatedFollowing });
    
            notifyCustom(`Subscribed ${userName}`, "success");
    
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error in handleFollow:", error);
            notifyCustom("Something went wrong", "error");
        }
    };
    
    const handleUnFollow = async () => {
        try {
            const email = localStorage.getItem('email');
            const userDoc1 = doc(db, "user", users[0].id);
    
            const updatedFollowers = (users[0].Followers || []).filter(
                item => item !== email
            );
    
            await updateDoc(userDoc1, { Followers: updatedFollowers });
    
            const data = await getDocs(usersCollectionRef1);
            const usersTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            const filteredArray = usersTemp.filter(obj => obj.Email === email);
    
            if (filteredArray.length === 0) {
                notifyCustom("User not found", "error");
                return;
            }
    
            const currentUser = filteredArray[0];
            const userDoc2 = doc(db, "user", currentUser.id);
    
            const updatedFollowing = (currentUser.Following || []).filter(
                item => item !== users[0].Email
            );
    
            await updateDoc(userDoc2, { Following: updatedFollowing });
    
            notifyCustom(`Unsubscribed ${userName}`, "success");
    
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Error in handleUnFollow:", error);
            notifyCustom("Something went wrong", "error");
        }
    };
    


    const getUsers=async()=>{



         let data = await getDocs(usersCollectionRef1);
                                           
          let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))      
          
          setAllUsersArray(usersTemp)
                                           
          let filteredArray=usersTemp.filter(obj => obj.UserName && obj.UserName.toLowerCase()==userName.toLowerCase())

          console.log(userName)

          console.log(usersTemp)
          
          console.log(filteredArray)

          setUsers(filteredArray)

          if(filteredArray.length!=0)

            {
                data = await getDocs(usersCollectionRef);

                let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))                
                                                
                let filteredArrayEvents=eventsTemp.filter(obj => filteredArray[0].EventsCreated.includes(obj.id))

                setEvents(filteredArrayEvents)

                if(filteredArray[0].Followers && filteredArray[0].Followers.length!=0 && filteredArray[0].Followers.includes(localStorage.getItem('email')))
                {
                    setIsFollow(true)
                }


            }   

            


     }

    useEffect(()=>{

        if(!localStorage.getItem('email'))
        {
            notifyCustom("User not logged in","error")

            setTimeout(() => {
                window.location.href="/oktologin"
            }, 1500);
        }

        else if((!localStorage.getItem('userName') || !localStorage.getItem('profileImg')))
            {
                notifyCustom("Set up your profile to continue","error")
    
                setTimeout(() => {
                    window.location.href="/profilesettings"
                }, 1500);
            }

        getUsers()

       

    },[])

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
    


  return (
    <div>
        <br></br>
      <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined" />
      <hr></hr>
      <br></br><br></br><br></br>
      <br></br>  

<center>
    <div style={{display:'flex',flexDirection:'column',color:'white',alignItems:'center',width:'20em',gap:'10px'}}>

    <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>

        <img style={{height:'4em',width:'4em',borderRadius:'50%',objectFit:'cover',border:'1px solid white'}} src={users.length!=0 && users[0].ProfileImage}></img>

        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'20px'}}>

        <l style={{color:'white'}}><b>{users.length!=0 && users[0].UserName}</b></l>

        <div style={{display:'flex',gap:'15px'}}>

            <div>
            
            <l><b>{users.length!=0 && users[0].EventsCreated.length}</b></l>
            <br></br>

            Events

            </div>

            <div>
            
            <l>{users.length!=0 && users[0].Followers!=null && users[0].Followers.length!=0 ? users[0].Followers.length:0}</l>
            <br></br>

            Subscribers

            </div>

            <div>
            
            <l><b>{users.length!=0 && users[0].Following!=null && users[0].Following.length!=0 ? users[0].Following.length:0}</b></l>
            <br></br>

            Following

            </div>




        <div>

           
        </div>

        </div>

        </div>




    </div>
    <div style={{width:'100%',textAlign:'left'}}>

<l style={{fontSize:'14px',color:'rgb(180,180,180)'}}> {users.length!=0 && users[0].Bio}</l>

</div>

{users.length!=0 && localStorage.getItem('email') != users[0].Email && <div style={{width:'100%',textAlign:'left',display:'flex',justifyContent:'space-between'}}>

<Button variant="contained" style={{height:'2em',backgroundColor:isFollow?'grey':'red'}} onClick={()=>{

if(isFollow)
{
    handleUnFollow()
}

else
    {
        handleFollow()
    }


}}>{isFollow ? "Subscribed":"Subscribe"}</Button>  <Button variant="outlined" style={{height:'2em'}}onClick={()=>{

localStorage.setItem('getChat',JSON.stringify(users[0]))

                        window.location.href="/chat"


}}> Message</Button>

<Button variant="outlined" style={{height:'2em',width:'4em',border:'0.1px solid yellow',color:'yellow'}} onClick={()=>{

    if(users.length!=0 && users[0].Premium && (users[0].Premium=='Creator' || users[0].Premium=='Pro'))
    {
      localStorage.setItem('receiver',JSON.stringify(users[0]))
      window.location.href="/crypto"
    }

    else{
      notifyCustom("Subscribe to premium to continue","error")

      setTimeout(()=>{
        window.location.reload()
      },2000)
    }
}}>Pay</Button>

</div>
}




 

    </div>



    </center>

    <center>
        <br></br>

    <h3 style={{color:'white'}}>Created Events {events.length!=0 && `(${events.length})`}</h3>

<div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'20px'}}>

{

    events.length!=0 && events.map((x)=>{

        return(

            <Card sx={{ maxWidth: 345,minWidth:300 ,maxHeight:500  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
            <CardActionArea>
              <br></br>
              <img style={{width:'20em' ,height:'20em'}} src={x.Image} onClick={()=>{
                window.location.href=`/event/${x.id}`
              }}></img>
             
              <CardContent>
      
             
                <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
      
                  <div style={{display:'flex',alignItems:'flex-start',gap:'10px'}}> 
                  
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'0px'}}>
                    
                    <l style={{fontSize:'18px'}}>{x.Name}</l>
      
                    <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
                <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
                {!x.Type && <> <LocationPinIcon fontSize='small'/>
                   <l>{ x.Address.slice(x.Address.lastIndexOf(",") + 1).length>7 ? x.Address.slice(x.Address.lastIndexOf(",") + 1).slice(0,9)+"..." :x.Address.slice(x.Address.lastIndexOf(",") + 1) } </l> </>}
      
      
                    {x.Type=="online" && <> <VideoCallIcon fontSize='small'/>
                      <l>Online</l> </>}
              </Typography>
      
                    <l>
                      
                      
                    
                    </l>
                   
                    
      
              <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}><l style={{fontSize:'15px',color:'rgb(200,200,200'}}>{x.RegistrationsCount} Registrations   {x.Timestamp && dayjs(x.Timestamp).fromNow() }</l></Typography>
      
                    
                    </div>
                    
                    </div>
             
                </Typography>
      
                
      
                <br></br>
      
                <Button variant="outlined" onClick={(e)=>{
                   e.stopPropagation()
                  window.location.href=`/event/${x.id}`
                }}><LaunchIcon/>  </Button>
      
                <Button variant="outlined" onClick={(e)=>{
                   e.stopPropagation()
      
                   setEvent_id(x.id)
      
                   getComments(x.id)
      
                   
      
                  
                }}><CommentIcon/>  </Button>
      
                <Button variant="outlined" onClick={(e)=>{
                   e.stopPropagation()
                  navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
                  notifyCustom("Link copied to clipboard","success")
                }}><ShareIcon/>  </Button>
      
                {localStorage.getItem('email') && x.Creator==localStorage.getItem('email') && 
                <Button variant="outlined" style={{color:'green'}} onClick={()=>{
                  window.location.href=`/manage/${x.id}`
                }}><EditIcon/>  </Button>
              }
              
              </CardContent>
            </CardActionArea>
          </Card>
         
        
        )
    })


}

</div>



    </center>

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

 <ToastContainer style={{zIndex:'99999999999'}}/>
   
    </div>
  )
}

export default Channel
