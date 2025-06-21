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
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const Chat = () => {

      const { community_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReply,setIsReply]=useState("")
  const [showChatDiv,setShowChatDiv]=useState(false)
  const [membersArray,setMembersArray]=useState([])
  const [showSearchDiv,setShowSearchDiv]=useState(false)
  const [search,setSearch]=useState('')
  const [showAirdrop,setShowAirdrop]=useState(false)
  const [airdropToArray,setAirdropToArray]=useState([])
  const [communityToken,setCommunityToken]=useState('')

  const scrollRef = useRef(null);


  const getUsers=async(Participants)=>{

    let data = await getDocs(collection(db, "user"));
                                    
    let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

    let filteredArray=users.filter(obj=>obj.UserName && obj.ProfileImage )

    let membersArray1=[]

   
    for(let i=0;i<filteredArray.length;i++)
    {
        if(Participants.includes(filteredArray[i].Email))
        {
            membersArray1.push(filteredArray[i])
        }
    }

    setMembersArray(membersArray1)
    const arr = new Array(membersArray1.length).fill(true);
    setAirdropToArray(arr)

    data=await getDocs(collection(db, "community"));

    let communities=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

    filteredArray=communities.filter(obj=>obj.id==community_id )

    if(filteredArray.length!=0)
    {
    
      console.log(filteredArray)
      setCommunityToken(filteredArray[0].Token)
    } 


   
  }

  useEffect(() => {
    const q = query(collection(db, "community"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filteredArray = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.id === community_id);

      if (filteredArray.length > 0) {
        setMessages(filteredArray[0]);
        console.log("Matched Document:", filteredArray[0]);
        getUsers(filteredArray[0].Participants)
      } else {
        setMessages(null);
        console.log("No matching document found");
        getUsers(filteredArray[0].Participants)
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

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
                const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),SenderUserName:localStorage.getItem('userName'),ProfileImage:localStorage.getItem('profileImg'),Message:newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants]}

                await updateDoc(userDoc1, newFields1);
            }

        else
        {

            const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),SenderUserName:localStorage.getItem('userName'),ProfileImage:localStorage.getItem('profileImg'),Message:newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants,localStorage.getItem('email')]}

            await updateDoc(userDoc1, newFields1);
        }

       


 
                     
                               // update
                     
                     
   


    setNewMessage("");
  };


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
    <div >
     <br></br> <br></br>
        
     <div style={{width:'100%' ,display:'flex',paddingRight:'1em'}}>


           <div style={{display:'flex',alignItems:'center'}} onClick={()=>{
            window.location.href=`/testing3/${community_id}`
           }}>
            
            &nbsp;&nbsp;
            <ArrowBackIosIcon style={{color:'white'}} fontSize="small"/> <l style={{color:'white'}}>Back</l></div> 

        {/* <div style={{width:'100%',textAlign:'right'}} onClick={()=>{
            window.location.href=`/testing3/${community_id}`
           }}> <l style={{color:'white'}}>Edit</l>  &nbsp;&nbsp;</div>  */}


     </div>

     <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'2em'}}>


     {messages && messages.length!=0 &&  <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'10px'}}>

          <img src={messages.ProfileImage} style={{width:'6em',height:'6em',borderRadius:'50%',objectFit: 'cover',border:'1px solid white'}}></img>

          <l style={{color:'white',fontSize:'24px'}}>{messages.Name}</l>

        

          <l style={{color:'grey',fontSize:'16px'}}>{messages.Participants.length} members</l>
          

        

          <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
            
            <Button variant="outlined" onClick={(e)=>{

            e.stopPropagation()
            notifyCustom("Subscribe to Premium to Continue","error")

            setTimeout(()=>{
                window.location.href="/pricing"
            },3000)
            }}><PaidIcon onClick={(e)=>{

              e.stopPropagation()
              setShowAirdrop(!showAirdrop)

            }}/></Button>
          
          
          
          <Button variant="outlined" onClick={()=>{

            setShowSearchDiv(true)
          }}><SearchIcon/></Button>
          
          
          
          <Button variant="outlined" onClick={()=>{

                navigator.clipboard.writeText(`https://v2-six-puce.vercel.app//testing3/${community_id}`)
                .then(() => {
                console.log("Text copied to clipboard!");

                notifyCustom("Link Copied","default")
                })
                .catch(err => {
                console.error("Failed to copy: ", err);
                });

          }}><ShareIcon/></Button>
          
          
          {showChatDiv &&  <div style={{
          width: '150px', 
          height: '150px',
          padding: '20px', 
          position:'fixed',
          marginLeft:'12em',
         color:'white',
          backgroundColor: 'black', 
          border: '2px solid #1876d1',
          borderRadius:'10px',
          blur:'50px', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
        
          transform: 'translateX(-50%)',
          zIndex: 9999,
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
          }}><LogoutIcon style={{color:'red'}}/> <l>Leave Group</l></div>
          <br></br>
          

        </div>}

          {1==1 && <Button variant="outlined" onClick={()=>{
            setShowChatDiv(true)
          }}><MenuIcon/></Button>}
          
          
          
          </div>

           </div>
        }

        {messages && messages.length!=0 && <div style={{backgroundColor:'rgba(255,255,255,0.2',width:'70%',borderRadius:'1em',color:'white',padding:'1.5em'}}><div style={{textAlign:'left'}}>{messages.Description}</div></div>}

        {membersArray && membersArray.length!=0 && <div style={{backgroundColor:'rgba(255,255,255,0.2',width:'70%',borderRadius:'1em',color:'white',padding:'1.5em',display:'flex',flexDirection:'column', gap:'12px'}}>
            
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <l style={{color:'white',width:'100%',textAlign:'left'}}>Members</l>

            {showAirdrop &&    
            <div style={{display:'flex',gap:'0px',alignItems:'center'}}> 
            <input type="checkbox" defaultChecked={true} onChange={(e)=>{
              console.log(e.target.checked)

              console.log("airdropArray",airdropToArray)

              if(e.target.checked)
              {
                const arr = new Array(membersArray.length).fill(true);
                setAirdropToArray(arr)
              }
              else
              {
                const arr = new Array(membersArray.length).fill(false);
                setAirdropToArray(arr)
              }
             


            }}></input>
              <l>All </l>
            </div>

            }



            {showAirdrop &&     
            <Button  style={{maxWidth:'18em',borderRadius:'7px'}} onClick={()=>{
              console.log(airdropToArray)

              let arr = [];
              let j = 0;
              for (let i = 0; i < airdropToArray.length; i++) {
                if (airdropToArray[i] === true) {
                  console.log(airdropToArray[i]);
                  arr[j] = membersArray[i];
                  j++;
                }
              }
              

              localStorage.setItem("receivers",JSON.stringify(arr))
              localStorage.setItem('communityToken',communityToken)
              window.location.href="/crypto_group"

            }}>Done</Button>

            }

             </div>
            <br></br>
            
            {     
               membersArray.map((x,index)=>{
                return (
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>

                    <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}} onClick={()=>{
                      window.location.href=`/channel/${x.UserName}`
                    }}  >
                    
                    <img src={x.ProfileImage} style={{width:'2em',height:'2em',borderRadius:'50%',objectFit:'cover'}}></img>

                    <l>{x.UserName}</l>
                    
                    </div>

                   {showAirdrop &&  <input type="checkbox" checked={airdropToArray[index]} onChange={(e) => {
                    
                    e.stopPropagation()
                    
                    setAirdropToArray(prev => { const copy = [...prev]; copy[index] = e.target.checked; return copy; })}}
                  />


                   }
                    </div>


                )
            })
            
            
            }

           
           
            
            </div>}


     </div>

     <ToastContainer/>

<center>
     {showSearchDiv &&  <div style={{
          width: '100%', 
          minHeight:'100%',
         
          padding: '20px', 
          position:'fixed',
          top:'0px',
          left:'50%',
          
         color:'white',
          backgroundColor: 'black', 
          border: '2px solid #1876d1',
          borderRadius:'10px',
          blur:'50px', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
        
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
           
        }}>
          <div style={{width:'100%',textAlign:'left',cursor:'pointer'}} onClick={()=>{
            setShowSearchDiv(false)
          }}> &nbsp;&nbsp;&nbsp;&nbsp;
          <CancelIcon style={{left:'2px'}} fontSize="small"/>
          </div>
          <br></br>
          <input style={{width:'80%',border:'0.2px solid grey',backgroundColor:'black',color:'white',fontSize:'24px'}} placeholder="&nbsp; &nbsp;🔍 Search Members" onChange={(e)=>{

            setSearch(e.target.value)
            
          }}></input>
          <br></br> <br></br> <br></br>
          <center>
          {membersArray && membersArray.length!=0 && <div style={{backgroundColor:'rgba(255,255,255,0.2',width:'70%',borderRadius:'1em',color:'white',padding:'1.5em',display:'flex',flexDirection:'column', gap:'12px'}}>
            
            <l style={{color:'white',width:'100%',textAlign:'left'}}>Members</l>
            <br></br>
            
            {     
               membersArray.filter(person => {

                const query = search.toLowerCase().replace(/\s/g, '');
                const userName = person.UserName.toLowerCase().replace(/\s/g, '');
                const email = person.Email.toLowerCase().replace(/\s/g, '');
              
                return userName.includes(query) || email.includes(query);
            }).map((x,index)=>{
                return (

                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>

                <div style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}} onClick={()=>{
                      window.location.href=`/channel/${x.UserName}`
                    }} >
                    
                    <img src={x.ProfileImage} style={{width:'2em',height:'2em',borderRadius:'50%',objectFit:'cover'}}></img>

                    <l>{x.UserName}</l>

                    </div>

                    <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'20px'}}>

                    {showAirdrop &&  <input type="checkbox" checked={airdropToArray[index]} onChange={(e) => {
                      
                      e.stopPropagation()
                      setAirdropToArray(prev => { const copy = [...prev]; copy[index] = e.target.checked; return copy; })}}
                    />

                   }

                    <ArrowForwardIosIcon fontSize="small" onClick={()=>{


                        localStorage.setItem('getChat',JSON.stringify(x))

                        window.location.href="/chat"

                    }}/>
                    </div>

                    
                    </div>


                )
            })
            
            
            }</div>}

</center>


          

        </div>}
        </center>

     
    </div>
  );
};

export default Chat;
