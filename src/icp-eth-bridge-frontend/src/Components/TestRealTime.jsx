import React, { useEffect, useState, useRef} from "react";
import { collection, getDocs,updateDoc, doc, deleteDoc,addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../firebase-config.js";

import dayjs from "dayjs";
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import ResponsiveAppBar from "./ResponsiveAppBar";
import DescriptionIcon from '@mui/icons-material/Description';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ToastContainer, toast } from 'react-toastify';
import PeopleIcon from '@mui/icons-material/People';
import Confetti from 'react-confetti'
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ethers } from "ethers";

import './TestRealTime.css'

const Chat = () => {

      const { community_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReply,setIsReply]=useState("")
  const [showChatDiv,setShowChatDiv]=useState(false)
  const [showConfetti,setShowConfetti]=useState(false)
  const [showDeleteDiv,setShowDeleteDiv]=useState(false)
  const [deleteIndex,setDeleteIndex] =useState(-10)
  const [allUsers,setAllUsers]=useState([])
  const [fileUrl,setFileUrl]=useState("")
 
 


const MENU_ID = "message-options";
const { show } = useContextMenu({ id: MENU_ID });
const touchTimer = useRef(null);

const handleContextMenu = (event) => {
    event.preventDefault();
    show({ event });
  };

  const handleTouchStart = (event) => {
    // Start timer
    touchTimer.current = setTimeout(() => {
      show({ event }); // Show menu after long press
    }, 600); // 600ms = long press
  };

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned_preset"); // 🔁 Replace with your actual preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/getsetcourse/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        console.log("✅ Uploaded File URL:", data.secure_url);
        setFileUrl(data.secure_url)
       
      } else {
        console.error("❌ Upload failed:", data);
      }
    } catch (error) {
      console.error("❌ Error uploading file:", error);
    }
  };

  const scrollRef = useRef(null);

  const getAllUsers=async()=>{


    const data = await getDocs(collection(db, "user"));
                                    
   let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

    setAllUsers(usersTemp)



  }

  async function checkTokenAuthorization() {
    try {
      const q = query(collection(db, "community"));
      
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const filteredArray = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doc => doc.id === community_id);
  
        if (filteredArray.length === 0) {
          alert("Community does not exist");
          return;
        }
  
        try {
          const tokenAddress = filteredArray[0].Token;
  
          // Check if MetaMask is installed
          if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask first!');
            return;
          }
  
          // Request account access
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          const userAddress = accounts[0];
  
          // Setup provider and signer
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
  
          // ERC20 Token ABI
          const tokenAbi = [
            "function balanceOf(address account) view returns (uint256)",
            "function decimals() view returns (uint8)"
          ];
  
          // Create token contract
          const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  
          // Get token decimals
          const decimals = await tokenContract.decimals();
          const requiredAmount = ethers.utils.parseUnits("100", decimals);
  
          // Get token balance
          const balance = await tokenContract.balanceOf(userAddress);
  
          // Check authorization
          if (balance.gte(requiredAmount)) {
           
          
          } else {
              window.location.href="/error/User Not Authorized"

          }
        } catch (error) {
          console.error('Token check failed:', error);
          alert('Error: ' + error.message);
        }
      });
    } catch (error) {
      console.error('Firestore error:', error);
      alert('Database error: ' + error.message);
    }
  }

  useEffect(() => {

  

    if(!localStorage.getItem('email'))
    {
        notifyCustom("Please login in to join community","error")

        setInterval(()=>{

            window.location.href="/oktologin"
        },500)
    }

    if(localStorage.getItem('email') && !(localStorage.getItem('userName') && localStorage.getItem('profileImg')))
    {

        notifyCustom("Set up your profile to join community","error")

        setInterval(()=>{

            window.location.href="/profilesettings"
        },3000)

    }

    checkTokenAuthorization()
    const q = query(collection(db, "community"))

    getAllUsers()

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filteredArray = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.id === community_id);

      if (filteredArray.length > 0) {
        setMessages(filteredArray[0]);
        if(filteredArray[0].Participants && !filteredArray[0].Participants.includes(localStorage.getItem('email')))
        {
            setShowConfetti(true)
        }
        console.log("Matched Document:", filteredArray[0]);
      } else {
        setMessages(null);
        console.log("No matching document found");
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);


  const handleDelete=async()=>{

            let index=deleteIndex

       
            const data = await getDocs(collection(db, "community"));
                                    
            let communities=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
         
            let filteredArray=communities.filter(obj=>obj.id==community_id)

           
            let newChats=filteredArray[0].Chats.filter((_, i) => i !== index)



        
         
            const userDoc1 = doc(db, "community", filteredArray[0].id);

            const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:newChats,Timestamp: filteredArray[0].Timestamp,Participants:[...filteredArray[0].Participants]}

            await updateDoc(userDoc1, newFields1);

            notifyCustom("message deleted for everyone","success")
            setDeleteIndex(-10)
            setShowDeleteDiv(false)



        


  }

  useEffect(()=>{
  
              if (scrollRef.current) {
                  scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
          }
      
      ,[messages])

//   const sendMessage = async () => {x
//     if (!newMessage.trim()) return;

//     await addDoc(collection(db, "community"), {
//       text: newMessage,
//       timestamp: serverTimestamp(),
//     });

//     setNewMessage("");
//   };


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const data = await getDocs(collection(db, "community"));
                                    
   let communities=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

   let filteredArray=communities.filter(obj=>obj.id==community_id)

     const userDoc1 = doc(db, "community", filteredArray[0].id);
    
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

     
        if(filteredArray[0].Participants.includes(localStorage.getItem('email')))

            {
                if(fileUrl.length==0)
                {
                  const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),Message:newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants]}

                  await updateDoc(userDoc1, newFields1);
                }

                else
                {
                  const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),Message:"(Image?"+fileUrl+")"+newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants]}

                  await updateDoc(userDoc1, newFields1);
                }

                
                setFileUrl("")
               
            }

        else
        {

          if(fileUrl.length==0)
            {

            const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),Message:newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants,localStorage.getItem('email')]}

            await updateDoc(userDoc1, newFields1);

            }
            else
            {
              const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),Message:"(Image?"+fileUrl+")"+newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants,localStorage.getItem('email')]}

              await updateDoc(userDoc1, newFields1);
            }

            setFileUrl("")
        }

       


 
                     
                               // update
                     
                     
   


    setNewMessage("");
  };


    const addNewMember=async()=>{
       

    const data = await getDocs(collection(db, "community"));
                                    
   let communities=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

   let filteredArray=communities.filter(obj=>obj.id==community_id)

     const userDoc1 = doc(db, "community", filteredArray[0].id);
    
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

     
        if(!filteredArray[0].Participants.includes(localStorage.getItem('email')))

            {
                const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats],Timestamp: now,Participants:[...filteredArray[0].Participants,localStorage.getItem('email')]}

            await updateDoc(userDoc1, newFields1);

            notifyCustom(`${messages.Name} joined!`,"success")
            }

           
                 
    }

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


        const getUserByEmail=async(email)=>{


            // console.log(allUsers)

            if(allUsers.length==0)
            {
                return []
            }

            

           

            let filteredArray=allUsers.filter(obj=>obj.Email==email)

            console.log("filteredArray",filteredArray[0])

           
            return filteredArray[0]
        }

  return (
    <div style={{overflowX:'hidden'}}>


{ showConfetti && <Confetti
      width={"1500px"}
      height={"800px"}

      style={{zIndex:'99999999999999999'}}
    />
}
     

        
         {messages && messages.length!=0 && (
       <div style={{
        width: '100%',
        position: 'fixed',
        top: '0px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'hidden',
        zIndex: 1000000000,
        backgroundColor: 'black',
        height: '100vh' // Full height of viewport
      }}>
        <div style={{
          width: '100%',
          height: '100vh',
         
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}>

           
       {/* Header */}
       <div  style={{padding:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'0.3px solid #1876d1'}} >

       




<div style={{display:'flex',alignItems:'center',justifyContent:'flex-start'}}>

<Button style={{color:'white'}} onClick={()=>{
    window.location.href="/community"
}}><ArrowBackIosIcon fontSize="small"/></Button>

<img src={messages.ProfileImage} style={{width:'2.5em',height:'2.5em',borderRadius:'50%',objectFit: 'cover'}}></img>
&nbsp;&nbsp;

                <l style={{ color: 'white' , fontSize:'16px'}}><b>{messages.Name} &nbsp;&nbsp;&nbsp;&nbsp;</b></l>

</div>


{!showChatDiv && <MoreHorizIcon style={{backgroundColor:'#1876d1',borderRadius:'50%',color:'white'}} onClick={()=>{
                setShowChatDiv(true)
              }} fontSize="small"/>}

            {showChatDiv && <MoreVertIcon style={{backgroundColor:'#1876d1',borderRadius:'50%',color:'white'}} onClick={()=>{
                setShowChatDiv(false)
              }} fontSize="small"/>}
        
</div>

        
      
            {/* Scrollable Comment Section */}
            <div ref={scrollRef}  style={{
               flex: 1,
        
               maxHeight:'85%',
               overflowY: 'auto',
               overflowX:'hidden',
               padding: '10px',
              
               display: 'flex',
               flexDirection: 'column',
               gap: '25px',

             
            }}  >
              { messages.Chats.map((x, index) => (

                <div key={index} style={{ display: 'flex', gap: '10px', alignItems:'flex-end'}} >
                  <div>
                    <img
                      src={allUsers.length!=0 && allUsers.filter(obj=>obj.Email==x.SenderEmail)[0].ProfileImage}
                      alt="profile"
                      style={{
                        width: '1.5em',
                        height: '1.5em',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                
              
          
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',gap:'5px', backgroundColor: x.SenderEmail==localStorage.getItem('email') ?' #1876d1' : 'rgb(65, 65, 65)' ,padding:'1em',borderRadius:'5px', maxWidth:'70%'}}  onContextMenu={handleContextMenu}
              >
                    <div style={{display:'flex',gap:'7px'}} id={`ChatId=${x.ChatId}`} >

                    <label style={{ color: 'white', fontSize: '14px' }}><b>{x.SenderEmail==localStorage.getItem('email') ? "You":allUsers.length!=0 && allUsers.filter(obj=>obj.Email==x.SenderEmail)[0].UserName}</b></label>
                   
            
                    
                    <div style={{color:'white', fontSize: '14px'}}>{x.Timestamp && dayjs(x.Timestamp).fromNow() 
                    }</div>

      
                    </div>

                    {x.isReply && x.isReply.length!=0 && 
                

                <a style={{textDecoration:'none'}} href={`#ChatId=${parseInt(x.isReply.slice(
                    x.isReply.indexOf('|') + 1,
                    x.isReply.indexOf('|', x.isReply.indexOf('|') + 1)
                  )
                  )}`}> 
                  
                  
                  <div style={{ display:'flex',flexDirection:'column',justifyContent:'space-between' ,gap:'10px',overflow: 'hidden',borderRadius:'5px',backgroundColor: x.isReply.slice(2,x.isReply.indexOf('|'))==localStorage.getItem('email') ? '#5a9ddb': 'rgb(100, 100, 100)' , alignItems:'flex-start',padding:'1em'}}>

                   
                    <label style={{ color:'white', cursor: 'pointer',fontSize:'14px'}} >

                    

                       <b>{x.isReply.slice(2,x.isReply.indexOf('|'))===localStorage.getItem('email')?"You":allUsers.length!=0 && allUsers.filter(obj=>obj.Email==x.isReply.slice(2,x.isReply.indexOf('|')))[0].UserName}</b> 
                   </label>
                
                    <div style={{ color:'white', cursor: 'pointer',fontSize:'14px',textAlign:'left'}} >

                
                    {!x.isReply.slice(x.isReply.indexOf('|',x.isReply.indexOf('|')+1)+1).startsWith('(Image?') && <div style={{maxHeight:'2.4em',overflow: 'hidden',padding:'2px',maxWidth:'10em'}}>{x.isReply.slice(x.isReply.indexOf('|',x.isReply.indexOf('|')+1)+1)}</div>
                    
                    }

                  {x.isReply.slice(x.isReply.indexOf('|',x.isReply.indexOf('|')+1)+1).startsWith('(Image?') && <img style={{maxWidth:'10em',maxHeight:'10em'}} src={x.isReply.slice(x.isReply.indexOf('|',x.isReply.indexOf('|')+1)+1).slice(x.isReply.slice(x.isReply.indexOf('|',x.isReply.indexOf('|')+1)+1).indexOf('?')+1,x.isReply.slice(x.isReply.indexOf('|',x.isReply.indexOf('|')+1)+1).indexOf(')'))} />
                    
                  }
                        


                       
                    </div>

                    
                       


                    </div>



                    </a>
                
                
                }
      
                    
                    <div
                        style={{ color: 'grey', cursor: 'pointer',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'10px' }}
                        onClick={() => {

                            setIsReply(`@(${x.SenderEmail}|${x.ChatId}|${x.Message})`)
                           

                        }
                        
                        } 
                    >

           
<div style={{ color: 'white', textAlign: 'left' }}>
  {(() => {
    const raw = x.Message;

    // Extract the first link (if any)
    
    // Remove link from message for clean text parsing
   

    // Image detection
    const hasImage = x.Message.startsWith('(Image?');
    const imageUrl = hasImage
      ? x.Message.slice(x.Message.indexOf('?')+1, x.Message.indexOf(')'))
      : null;

      
    let textAfterImage = hasImage
      ? x.Message.slice(x.Message.indexOf(')') + 1).trim()
      : x.Message;

      const link = (textAfterImage.match(/https?:\/\/[^\s]+/) || [])[0];

      textAfterImage=textAfterImage.replace(link, "");


      

    return (
      <>
        {/* Image (if any) */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="image"
            style={{
              maxWidth: '15em',
              maxHeight: '15em',
              display: 'block',
              marginBottom: '0.5em',
            }}
          />
        )}

        {/* Text (if any) */}
        {textAfterImage && (
          <div style={{ wordBreak: 'break-word', marginBottom: link ? '0.5em' : 0 }}>
            {textAfterImage}
          </div>
        )}

        {/* Link (if any) */}
        {link && (
          <div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'lightblue', wordBreak: 'break-word' }}
            >
              {link}
            </a>
          </div>
        )}
      </>
    );
  })()}
</div>



     

                     <div style={{display:'flex',justifyContent:'flex-start' ,gap:'10px',alignItems:'center'}}>


                     <label style={{color: 'white',fontSize: '14px'}}> Reply</label>

                     {(messages.Creator==localStorage.getItem('email') || allUsers.length!=0 && allUsers.filter(obj=>obj.Email==x.SenderEmail)[0].UserName==localStorage.getItem('userName')) && <label style={{color: 'white',fontSize: '14px'}} onClick={(e)=>{

                        e.stopPropagation()
                        setDeleteIndex(index)
                        setShowDeleteDiv(true)
                     }}>Delete</label>
                        }



                     </div>
                   
                       
                       
                       
                    </div>
      
                   
                  </div>
      
                  
                </div>
              ))


            
              
              }


              <br></br> <br></br> <br></br>
            </div>
      <br></br> <br></br> <br></br>
            {/* Fixed Input Section */}
            <div style={{
                position:'fixed',
                bottom:'0px',
                width:'100%',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid #444',
              backgroundColor: '#000',
            }}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%',gap:'2em'}}>

                {isReply.length!=0 && 
                

                <div style={{ display:'flex',justifyContent:'space-between' ,gap:'10px'}}>
                
                    <label style={{ color: 'grey', cursor: 'pointer',fontSize:'16px'}} >

                        Replying to {allUsers.length!=0 && allUsers.filter(obj=>obj.Email==isReply.slice(2,isReply.indexOf('|')))[0].UserName}

                       
                    </label>

                    <CancelIcon style={{color:'white'}} fontSize='small' onClick={()=>{
                        setIsReply("")
                    }} />



                    </div>
                
                
                }

                <div style={{display:'flex', width:'100%',alignItems:'center',gap:'5px'}}>


              {  fileUrl.length==0 && 
                
                <div>
            <AddIcon
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={handleIconClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>

              }

      {  fileUrl.length!=0 && 
                
                <div style={{display:'flex',gap:'5px'}}>
                  <CancelIcon style={{color:'white'}} fontSize="small" onClick={()=>{
                    setFileUrl("")
                  }}/>
                <img style={{width:'2em',height:'2em',border:'0.1px solid white'}} src={fileUrl}/>
              </div>

              }
             

                 

                <input
                style={{
                  width: '100%',
                  height: '30px',
                  fontSize:'16px',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #555',
                  backgroundColor: '#111',
                  color: 'white'
                }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
                 <Button onClick={sendMessage}>
                <SendIcon fontSize="large" />
              </Button>
              </div>
                    </div>
              
             
            </div>
          </div>
        </div>
      )}

              
          


{showChatDiv &&  <div style={{
          width: '150px', 
          height: '180px',
          padding: '20px', 
         color:'white',
          backgroundColor: 'black', 
          border: '2px solid #1876d1',
          borderRadius:'10px',
          blur:'50px', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '5%', 

          right:'-40px',
        
          transform: 'translateX(-50%)',
          zIndex: 9999999990000000000,
          animation: 'popupAnimation 0.5s ease',
           
        }}>
          <div style={{width:'100%',textAlign:'left',cursor:'pointer'}} onClick={()=>{
            setShowChatDiv(false)
          }}>
          <CancelIcon style={{left:'2px'}} fontSize="small"/>
          </div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href=`/groupinfo/${community_id}`
          }}><DescriptionIcon/> <l>Group Info</l></div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={(e)=>{

            e.stopPropagation()
            window.location.href=`/groupinfo/${community_id}`
            }} ><PaidIcon/>  Airdrop </div>
          <br></br>
          
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={(e)=>{

            e.stopPropagation()

            navigator.clipboard.writeText(`https://v2-six-puce.vercel.app//testing3/${community_id}`)
            .then(() => {
            console.log("Text copied to clipboard!");

            notifyCustom("Link Copied","default")
            })
            .catch(err => {
            console.error("Failed to copy: ", err);
            });
            
          }}><PeopleIcon/> Add Members</div>

        




       
          
      
        </div>}

     <ToastContainer style={{zIndex:'9999999999999999999999999999999'}}/>


     {showConfetti && (
        <div style={{

            position:'fixed',
            top:'10px',
          width: '300px', 
          height: '230px',
          padding: '20px', 
          backgroundColor: 'black', 
          border: '0.2px solid #ddd', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '30%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          animation: 'popupAnimation 0.5s ease',
          zIndex:'99999999999999999',

          border:'2px solid #1876d1',
          color:'white'

        }}>
            <center>
          <h1>Welcome to {messages.Name}!</h1>
          <br></br>
          <button class="button-85" style={{height:'3em'}} onClick={async()=>{

            setShowConfetti(false)

            addNewMember()


          }}>Join</button>
          </center>
          <br></br>
          </div>
)}


{showDeleteDiv && (
        <div style={{

            position:'fixed',
            top:'10px',
          width: '300px', 
          height: '150px',
          padding: '20px', 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '30%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          animation: 'popupAnimation 0.5s ease',
          zIndex:'99999999999999999',

          border:'2px solid #1876d1'

        }}>
            <center>
          <h3>Are you sure you want to delete this message ?</h3>
          <br></br>
          <Button style={{height:'3em'}} variant="outlined" onClick={async()=>{

           
            handleDelete()
         


          }}>Yes</Button>

          &nbsp; 

        <Button style={{height:'3em'}} variant="outlined" onClick={async()=>{

        setShowDeleteDiv(false)




        }}>No</Button>
          </center>
          <br></br>
          </div>
)}
    

        
      </div>
  
  );
};

export default Chat;
