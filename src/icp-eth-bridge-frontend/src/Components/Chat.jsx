import React,{useState,useEffect,useRef} from 'react'
import ResponsiveAppBar from './ResponsiveAppBar'
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  onSnapshot

} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import MessageIcon from '@mui/icons-material/Message';
import PeopleIcon from '@mui/icons-material/People';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import './Chat.css'
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ChatIcon from '@mui/icons-material/Chat';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';





const usersCollectionRef1 = collection(db, "user");
const usersCollectionRef4 = collection(db, "chats");

function Chat() {

        const [buttonHight,setButtonHighlight]=useState(1)
        const [showChat1Div,setShowChat1Div]=useState(true)
        const [showChat2Div,setShowChat2Div]=useState([])
        const [usersData,setUsersData]=useState([])
        const [searchUser,setSearchUser]=useState('')
        const [userData,setUserData]=useState({})
       
            
            const [makeComment,setMakeComment]=useState('')
            const [comments,setComments]=useState([])
            const [event_id,setEvent_id]=useState('')
            const [userName,setUserName]=useState('')
            const [profileImage,setProfileImage]=useState('')



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



                          const getComments = (userName, profileImage) => {
                            console.log("userName", userName);
                          
                            const unsubscribe = onSnapshot(usersCollectionRef4, (snapshot) => {
                              const chats = snapshot.docs.map((doc) => ({
                                ...doc.data(),
                                id: doc.id,
                              }));
                          
                              const currentUser = localStorage.getItem("email");
                          
                              const filteredArray = chats.filter(
                                (obj) => obj.People.includes(currentUser) && obj.People.includes(userName)
                              );

                              console.log("userName",userName)


                          
                              console.log("filteredArray", filteredArray);
                          
                              if (filteredArray.length !== 0) {
                                setShowChat2Div(filteredArray[0]);
                              } else {
                                setShowChat2Div(["not exist"]);
                              }
                            });
                          
                            return unsubscribe; // Call this to stop listening later if needed
                          };
            
                  const handleSendComment=async ()=>{
            
            
                      if(!(localStorage.getItem('profileImg') && localStorage.getItem('userName')))
                                {
                                  notifyCustom("Set up your profile to chat!","error")
                    
                                  setInterval(()=>{
                    
                                    window.location.href="/profilesettings"
                                  },4000)
            
                                  return;
                                }
            
                   
            
                 
            
            
            
                    
            
                       const data = await getDocs(usersCollectionRef4);
                                            
                        let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            
                        let filteredArray=chats.filter(obj=>obj.People.includes(localStorage.getItem('email')) && obj.People.includes(userName))
                                          
                        console.log("fileteredArray",filteredArray)
            
                        if(filteredArray.length==0)
            
                          {
                           
                           
                            const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
                         
                            await addDoc(usersCollectionRef4, { People: [localStorage.getItem('email'), userName], Chats: [{ Sender: localStorage.getItem('email'), SentTo: userName, Message: makeComment, Timestamp: now }], Timestamp: now, ProfileImage: { [localStorage.getItem('email')]: localStorage.getItem('profileImg'), [userName]: profileImage } });

                            setMakeComment("")

                            getComments(userName,profileImage)
                            
                            
                             
                           
                          }

                          else{

                            const userDoc1 = doc(db, "chats", filteredArray[0].id);
                            
                            const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

                            const newFields1 = { People: [localStorage.getItem('email'), userName], Chats: [...filteredArray[0].Chats,{ Sender: localStorage.getItem('email'), SentTo: userName, Message: makeComment, Timestamp: now }], Timestamp: now, ProfileImage: { [localStorage.getItem('email')]: localStorage.getItem('profileImg'), [userName]: profileImage } }
                                                
                                                        
                                                
                                                
                            await updateDoc(userDoc1, newFields1);

                            setMakeComment("")

                            getComments(userName,profileImage)

                          


                          }
            
                         
}


        const hasConersationWith=async(userName)=>{

            let data = await getDocs(usersCollectionRef4);
                                         
            let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
   
            let filteredArray=chats.filter(obj=>obj.People.includes(localStorage.getItem('email')) && obj.People.includes(userName))
                              
            console.log("fileteredArray",filteredArray)
   
            if(filteredArray.length!=0)
   
             {

                return filteredArray[0].Timestamp
           
             }

             else{

       
                 return ""
               
             }
   
           
        }

        const getUsers=async()=>{

            let data = await getDocs(usersCollectionRef1);
                                         
            let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

            let fileteredArray=users.filter(obj=>obj.UserName && obj.ProfileImage)

            for(let i=0;i<fileteredArray.length;i++)
                {
    
                    hasConersationWith(fileteredArray[i].UserName).then((a)=>{
                        if(a.length!=0)
                            {
                                fileteredArray[i].conversation=a
                            }
                            else{
                                fileteredArray[i].conversation="no"
                            }
                    })
                   
                }

            console.log("chalo",fileteredArray)

            setShowChat1Div(fileteredArray)

            setUsersData(fileteredArray)
            
                     
        }

        const scrollRef = useRef(null);

        useEffect(()=>{

            if(!localStorage.getItem('email'))
            {
               window.location.href="/oktologin"

            }

            if(localStorage.getItem('getChat'))

                {
                    let x=JSON.parse(localStorage.getItem('getChat'))
                    setUserName(x.Email)
                    setUserData(x)
                    setProfileImage(x.ProfileImage)
                   getComments(x.Email,x.ProfileImage)

                   localStorage.removeItem('getChat')
                }

           


           
              
            getUsers()
        },[])

        useEffect(()=>{

            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
        }
    
    ,[showChat2Div])
  return (
    <div>
        <br></br>
        {showChat2Div.length==0 &&     <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>}
     
         <br></br> <br></br>  <br></br> <br></br>  <br></br> <br></br>

            <div style={{display:'flex',justifyContent:'center', gap:'5px'}}>
         
         {buttonHight==1 && <Button variant="contained" style={{borderRadius:'0px'}} onClick={()=>{
           
       }}>Chat &nbsp; <MessageIcon/> </Button>}
        {buttonHight!=1 && <Button variant="outlined" style={{borderRadius:'0px',border:'#1876d1 0.09px solid', color:'#1876d1'}} onClick={()=>{
            setButtonHighlight(1)

            setShowChat1Div(true)
           
       }}>Chat &nbsp; <MessageIcon/>  </Button>}

       {buttonHight==2 && <Button variant="contained" style={{borderRadius:'0px'}} onClick={()=>{
           window.location.href="/community"
       }}>Community &nbsp; <PeopleIcon/></Button>}

       {buttonHight!=2 && <Button variant="outlined" style={{borderRadius:'0px',border:'#1876d1 0.09px solid', color:'#1876d1'}} onClick={()=>{
             window.location.href="/community"
            
             
       }}>Community &nbsp; <PeopleIcon/></Button>}
       
        
       
       </div>

       <br></br>  <br></br>  <br></br>

            <center>
               
                 <input placeholder='Search by Username' style={{
                  width: '80%',
                  height: '30px',
                  fontSize:'16px',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #555',
                  backgroundColor: '#111',
                  zIndex:'999999999',
                  color: 'white'}} onChange={(e)=>{

                    setSearchUser(e.target.value)

                 }}></input>
               </center>

        

           {showChat1Div.length!=0 && (
           <div style={{
            width: '100%',
            position: 'fixed',
            
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'hidden', // outer div doesn't scroll
            zIndex: 10,
           }}>
             <div style={{
               width: '95%',
               height: '85vh', // panel height for scrolling content
               backgroundColor: 'black',
              
               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
               overflow: 'hidden', // important to clip the content inside
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-between',
             }}>
               
               {/* Header */}
       
               
           

               <div style={{color:'white', overflowY: 'auto'}}>

               <div style={{display:'flex',flexDirection:'column',padding:'3em'}}>
                 {usersData.length!=0  && <div style={{color:'white'}}>
                    
                 {usersData.filter(person => {
                    const query = searchUser.toLowerCase().replace(/\s/g, '');
                    const userName = person.UserName.toLowerCase().replace(/\s/g, '');
                    const email = person.Email.toLowerCase().replace(/\s/g, '');
                  
                    return userName.includes(query) || email.includes(query);
                }).map((x,index)=>{

                    if(x.UserName!==localStorage.getItem('userName') ) return(

                       

                            <div class="people" onClick={()=>{

                                if(!localStorage.getItem('email'))
                                    {
                                        notifyCustom("Please login in to chat","error")
                                
                                        setInterval(()=>{
                                
                                            window.location.href="/oktologin"
                                            return
                                        },300)
                                    }
                                
                                    if(localStorage.getItem('email') && !(localStorage.getItem('userName') && localStorage.getItem('profileImg')))
                                    {
                                
                                        notifyCustom("Set up your profile to chat","error")
                                
                                        setInterval(()=>{
                                
                                            window.location.href="/profilesettings"
                                            return
                                        },3000)
                                
                                    }
                               
                                setUserName(x.Email)
                                setProfileImage(x.ProfileImage)
                                setUserData(x)

                               getComments(x.Email,x.ProfileImage)
                            }} >

                            <div>

                            <img src={x.ProfileImage} style={{width:'3em',height:'3em',borderRadius:'50%',objectFit: 'cover'}} onClick={(e)=>{
                                e.stopPropagation()
                                window.location.href=`/channel/${x.UserName}`
                            }}></img>

                            </div>

                            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%'}}>
                                
                                <div style={{width:'100%',display:'flex',justifyContent:'space-between'}}> {x.UserName}  <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}> 
                                    
                                    <ChatIcon style={{color:'#1876d1'}}/> <MonetizationOnIcon style={{color:'#1876d1'}} onClick={(e)=>{

                                        e.stopPropagation()

                                        if(usersData.length!=0 && usersData.filter(obj=>obj.Email==localStorage.getItem('email')).length!=0 && !usersData.filter(obj=>obj.Email==localStorage.getItem('email'))[0].Premium)
                                        {
                                          notifyCustom("Subscribe to Premium to send crypto","error")

                                          setTimeout(()=>{
                                              window.location.href="/pricing"
                                          },3000)
                                        }

                                        else if(!x.WalletAddress)
                                        {
                                          notifyCustom(`${x.UserName} has not set up wallet address`,"error")
                                        }

                                        else

                                        {
                                          localStorage.setItem('receiver',JSON.stringify(x))
                                          window.location.href=`/crypto`
                                        }
                                       
                                    }}/>
                                </div>
                                
                                </div>

                              

                                {
                                    x.conversation==="no" &&  <div style={{color:'grey'}}> Chat</div>
                                }

                                {
                                    x.conversation && x.conversation!=="no" &&  <div style={{color:'grey'}}>{ dayjs(x.conversation).fromNow() 
                                    } </div>
                                }
 </div>

                            
                            

                            </div>

                    )
                })
                
                }
                    
                </div>}

                </div>



               </div>
         
               {/* Scrollable Comment Section */}
               <div style={{
                 flex: 1, // fill available space
                 overflowY: 'auto',
                 padding: '10px',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '25px',
               }}>
                 
         
             
               </div>
             </div>
           </div>
         )}


      
        


      
     



       {showChat2Div.length !== 0 && (
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
      <div  style={{padding:'20px',borderBottom:'0.3px solid #1876d1'}} onClick={() => {

       
        setShowChat2Div([]);
        setMakeComment("");
      }}>

        <div style={{display:'flex',alignItems:'center',gap:'15px',color:'white'}}>
       
        <ArrowBackIosIcon  />

        <img src={userData.ProfileImage}  style={{
                    width: '3em',
                    height: '3em',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}></img>

        <l style={{color:'white'}}>{userData.UserName}</l>

        </div>

        
      </div>

      {/* Scrollable Comment Section */}
      <div ref={scrollRef} style={{
        flex: 1,
        
        maxHeight:'85%',
        overflowY: 'auto',
        overflowX:'hidden',
        padding: '10px',
       
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
      }}>



        {showChat2Div.length !== 0 && showChat2Div[0] !== "not exist" && showChat2Div.Chats.map((x, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', alignItems:'flex-end'}}>

           
            <div>

           
                
              {x.Sender === localStorage.getItem('email') ? (
                <img
                  src={localStorage.getItem('profileImg')}
                  alt="profile"
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <img
                  src={profileImage}
                  alt="profile"
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>

           

           {x.Sender==localStorage.getItem('email') && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',backgroundColor:'#1876d1',padding:'1em',borderRadius:'5px',maxWidth:'70%' }}>
              <div style={{ display: 'flex', gap: '7px' }}>
                <label style={{ color: 'white', fontSize: '14px' }}><b>{usersData.length!=0 && usersData.filter(obj=>obj.Email==x.Sender)[0].UserName}</b></label>
                <div style={{ color: 'white', fontSize: '14px' }}>
                  {x.Timestamp && dayjs(x.Timestamp).fromNow()}
                </div>
              </div>
              <div style={{ color: 'white', textAlign: 'left' }}>{x.Message}</div>
            </div>
                }


        {x.Sender!=localStorage.getItem('email') && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' ,backgroundColor:'rgb(65, 65, 65)',padding:'1em',borderRadius:'5px',maxWidth:'70%'}}>
              <div style={{ display: 'flex', gap: '7px' }}>
                <label style={{ color: 'white', fontSize: '14px' }}><b>{usersData.length!=0 && usersData.filter(obj=>obj.Email==x.Sender)[0].UserName}</b></label>
                <div style={{ color: 'white', fontSize: '14px' }}>
                  {x.Timestamp && dayjs(x.Timestamp).fromNow()}
                </div>
              </div>
              <div style={{ color: 'white', textAlign: 'left' }}>{x.Message}</div>
            </div>
                }




          </div>

       


        ))}



        <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
      </div>

      {/* Input Section */}
      <div style={{
        position:'fixed',
        height:'5%',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid #444',
       backgroundColor:'black',
        bottom:'0px',
        width:'100%',
        overflowX:'hidden',
        overflowY:'hidden',
        zIndex:'999999999999'
      }}>
        <input
          style={{
            width: '80%',
            height: '30px',
            fontSize: '16px',
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #555',
            backgroundColor: '#111',
            color: 'white'
            
          }}
          value={makeComment}
          onChange={(e) => setMakeComment(e.target.value)}
        />
        <Button onClick={() => { handleSendComment() }}>
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

export default Chat