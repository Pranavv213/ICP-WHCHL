import React from 'react'
import { useState, useEffect } from "react";
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import uploadImg from '../assets/images/uploadImg.png'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DescriptionIcon from '@mui/icons-material/Description';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddCardIcon from '@mui/icons-material/AddCard';
import CloseIcon from '@mui/icons-material/Close';
import QuizIcon from '@mui/icons-material/Quiz';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import ListIcon from '@mui/icons-material/List';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LinkIcon from '@mui/icons-material/Link';
import './AdminCreate.css'
import ResponsiveAppBar from './ResponsiveAppBar';
import Slide from '@mui/material/Slide';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import eventpageBackground from '../assets/images/coinBackground2.gif'
import { useParams } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


// import { signInWithGoogle } from "../firebase-config";



const usersCollectionRef = collection(db, "events");
const usersCollectionRef1 = collection(db, "user");

  
function AdminCreate() {

    const { event_id } = useParams();


  const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [mapUrl, setMapUrl] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [startDateTime, setStartDateTime] = useState('2025-04-30T08:00');
    const [endDateTime, setEndDateTime] = useState('2025-05-01T14:00');
    const [capacity,setCapacity]=useState(50)
    const { showWidgetModal, closeModal } = useOkto();
    const [events,setEvents]=useState([])
    const [text,setText]=useState('')
     const [showDiv , setShowDiv]=useState(false)
       const [showTextOption , setShowTextOption]=useState(false)
       const [showCheckboxOption , setShowCheckboxOption]=useState(false)
       const [showWebsiteOption , setShowWebsiteOption]=useState(false)
       const [showSocialsOption , setShowSocialsOption]=useState(false)
       const [textOptionType , setTextOptionType]=useState("short")
       const [showOptionOption , setShowOptionOption]=useState(false)
       const [optionsInOptionOption, setOptionsInOptionOption]=useState("")
       const [optionsInSocialsOption, setOptionsInSocialsOption] = useState("Twitter");
    const [description,setDescription]=useState(false)
    const [showCapacity,setShowCapacity]=useState(false)
    const [questions, setQuestions] = useState([]);
    const [type, setType] = useState("");
    const [moderatorLink,setModeratorLink]=useState("")
    const [guestLink,setGuestLink]=useState("")
        const [priceShowDiv,setPriceShowDiv]=useState(false)
        const [price,setPrice]=useState("")
        const [priceRecieverAddress,setPriceRecieverAddress]=useState("")
    
       const { createWallet, getUserDetails, getPortfolio } = useOkto();

       const [open, setOpen] = React.useState(false);

       const [openQuestions, setOpenQuestions] = React.useState(false);

       const handleClickOpen = () => {
         setOpen(true);
       };

       const handleClickOpenQuestions = () => {
        setOpenQuestions(true);
      };

       const handleClose = () => {
        setOpen(false);
      };
     
       const handleCloseQuestions = () => {
         setOpenQuestions(false);
       };

      
       const [newQuestion, setNewQuestion] = useState('');
           
             const handleAddQuestion = (isOption) => {


                
       
               
               if (newQuestion.trim() !== '') {

                if(newQuestion.length)
       
                 if(isOption==="type=options")
                 {
                   setQuestions([...questions, `type=options{${optionsInOptionOption}}${newQuestion}`]);
                   setNewQuestion('');
                   setOptionsInOptionOption('')
       
                 }

                else if(isOption==="type=website")
                    {
                      setQuestions([...questions, `type=website{}${newQuestion}`]);
                      setNewQuestion('');
                      setOptionsInOptionOption('')
          
                    }


                    else if(isOption==="type=checkbox")
                        {
                          setQuestions([...questions, `type=checkbox{}${newQuestion}`]);
                          setNewQuestion('');
                          setOptionsInOptionOption('')
              
                        }

                        else if(isOption==="type=socials")
                            {
                              setQuestions([...questions, `type=socials{}${newQuestion}`]);
                              setNewQuestion('');
                              setOptionsInOptionOption('')
                  
                            }
       
                 else
                 {
                   setQuestions([...questions, newQuestion]);
                   setNewQuestion('');
                 }
                 
                 console.log("questions",questions)
                 console.log("new question",newQuestion)
               }
             };
           
             const handleDeleteQuestion = (indexToDelete) => {
               setQuestions(questions.filter((_, index) => index !== indexToDelete));
             };
       
               const updateUser = async () => {
                     const userDoc = doc(db, "events", event_id);
       
                   
                       const newFields = { Name: eventName, Description: eventDescription, Creator:events[0].Creator ,Questions:questions,Attendees:events[0].Attendees,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Address:selectedAddress,Image:imageUrl,Price:price,PriceRecieverAddress:priceRecieverAddress};
                       await updateDoc(userDoc, newFields);
                       window.location.reload();
                 
                   
                   };

        



  const [open_description, setOpen_description] = useState(false);

  const handleClickOpen_description = () => {
    setOpen_description(true);
  };

  const handleClose_description = () => {
    setOpen_description(false);
  };
  

  const [imageUrl, setImageUrl] = useState("");
 const notify = (text,theme,position,type) => toast(text,{
      position: position,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
      type:type
     
      });
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

    const [eventName,setEventName]=useState('')
    const [eventDescription,setEventDescription]=useState('')
    const [questionsArray,setQuestionsArray]=useState(["Name","Email"])
    const [question,setQuestion]=useState('')

    const [user,setUser]=useState([])

    const updateEvent = async () => {


        if(type=="online")

            {


              let newFields;
                const userDoc = doc(db, "events", event_id);

                if(price.length==0)
                {
                 newFields = { Name: eventName, Type:"online",Description: text, Creator:events[0].Creator ,Questions:questions,Attendees:events[0].Attendees,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Address:moderatorLink+"{}"+guestLink,Image:imageUrl};
                }

                else
                {
                  newFields = { Name: eventName, Type:"online",Description: text, Creator:events[0].Creator ,Questions:questions,Attendees:events[0].Attendees,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Address:moderatorLink+"{}"+guestLink,Image:imageUrl,Price:price,PriceRecieverAddress:priceRecieverAddress};
                }
        
                    
       

        await updateDoc(userDoc, newFields);

       notify("Event Updated!","light","top-right","success")

       setInterval(() => {
        window.location.reload();
      }, 3000); 
            }

            else

            {
        const userDoc = doc(db, "events", event_id);
        let newFields;
              
        if(price.length==0)
        {
          newFields = { Name: eventName, Description: text, Creator:events[0].Creator ,Questions:questions,Attendees:events[0].Attendees,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Address:selectedAddress,Image:imageUrl};
        }

        else
        {
          newFields = { Name: eventName, Description: text, Creator:events[0].Creator ,Questions:questions,Attendees:events[0].Attendees,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Address:selectedAddress,Image:imageUrl,Price:price,PriceRecieverAddress:priceRecieverAddress};
        }
                    
 

        await updateDoc(userDoc, newFields);

       notify("Event Updated!","light","top-right","success")

       setInterval(() => {
        window.location.reload();
      }, 3000); 


    }

       
      };


    

      

      const getEvents = async () => {
              const data = await getDocs(usersCollectionRef);
             
              let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
             
              let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
              console.log(filteredArray)
              setEvents(filteredArray);
              setEventName(filteredArray[0].Name)
              setSelectedAddress(filteredArray[0].Address)
              setImageUrl(filteredArray[0].Image)

              editor.commands.setContent(filteredArray[0].Description);
              setText(filteredArray[0].Description)
              console.log(filteredArray[0].Description)
              setStartDateTime(filteredArray[0].StartDateTime)
              setEndDateTime(filteredArray[0].EndDateTime)
              setCapacity(filteredArray[0].Capacity)
              setQuestions(filteredArray[0].Questions)
              setType(filteredArray[0].Type)
              setModeratorLink(filteredArray[0].Address.slice(0,filteredArray[0].Address.indexOf("{")))
              setGuestLink(filteredArray[0].Address.slice(filteredArray[0].Address.indexOf("}")+1))

              if(filteredArray[0].Price)
              {
                setPrice(filteredArray[0].Price)
                setPriceRecieverAddress(filteredArray[0].PriceRecieverAddress)
              }

              

              console.log("image",filteredArray[0].Image)

              
             
            
            };
      
              useEffect(()=>{
      
                getEvents()

               

                localStorage.removeItem('attendeeEmails')
               

      
              },[])

           

              let editor = useEditor({
                extensions: [StarterKit], 
                content: text,
              });
                   
   
      
       
                useEffect(() => {
                  const timeout = setTimeout(() => {
                    if (query.trim() === "") {
                      setSuggestions([]);
                      return;
                    }
              
                    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`)
                      .then((res) => res.json())
                      .then((data) => {
                        setSuggestions(data);
                      });
                  }, 300); // debounce 300ms
              
                  return () => clearTimeout(timeout);
                }, [query]);
              
                const handleSelect = (place) => {
                  setSelectedAddress(place.display_name);
                  setSuggestions([]);
                  setQuery(place.display_name);
                  setMapUrl(`https://www.google.com/maps?q=${place.lat},${place.lon}&output=embed`);
                };
   
  return (
    <div>
      <br></br> 
      
      <div id="up"></div>
       <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined"/>
       <br></br> <br></br>  <br></br> <br></br>  <br></br> <br></br>
     
       <center>
       
       
             <div style={{display:'flex',justifyContent:'center'}}>
             <Button variant="contained" style={{borderRadius:'0',backgroundColor:'#6f6aff',color:'white'}}  onClick={()=>{
            window.location.reload();
       }}>Edit</Button>
       <Button variant="outlined" style={{borderRadius:'0',color:'#6f6aff',border:'0.2px solid #6f6aff'}} onClick={()=>{
            window.location.href = `/approve/${event_id}`;
       }}>Guests </Button>
       
       <Button variant="outlined" style={{borderRadius:'0',color:'#6f6aff', border:'0.2px solid #6f6aff'}} onClick={()=>{
            window.location.href = `/map/${event_id}`;
       }} >Check In</Button>
       <Button variant="outlined" style={{borderRadius:'0',color:'#6f6aff',border:'0.2px solid #6f6aff'}} onClick={()=>{
            window.location.href = `/payouts/${event_id}`;
       }}>Payouts</Button>
       
       </div>
       
       
       </center>
      
         

      <br></br>
      
{events.length!=0 && <div><div class="main">
        <div class="main1">     <input
        type="file"
        accept="image/*"
        id="fileInput"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
 
 {imageUrl.length==0 &&        <center>
  
 
      <label
  htmlFor="fileInput"
  style={{
    width: "300px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url("${events[0].Image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px black",
    border:"5px solid #1876d1"
  }}
>

</label>
<br></br>
<l style={{color:'#1876d1',textAlign:'left'}}>Choose an image for poster</l>
</center>}
{imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img src={imageUrl} alt="Uploaded" style={{border:'1px solid white',maxWidth: "300px",borderRadius:'1em'}}  />
        
        </div>
      )}
{imageUrl.length!=0 &&  <center>
    <br></br>
      <label
        htmlFor="fileInput"
        style={{
          padding: "10px 20px",
          border:'0.5px solid #4A90E2',
          
          color: "#4A90E2",
          borderRadius: "5px",
          cursor: "pointer",
         
          
         
        }}
      >
        Change Poster
      </label>
      </center>}
      </div>
        <div class="main2"> 
     
      <div class="form__group field">
<div class="eventName">
    
    <input type="input" style={{fontSize:'40px',background: "transparent", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "none", width:'100%',color:'white'}} placeholder="Event Name" required="" value={eventName} onChange={(e)=>setEventName(e.target.value)} />
    </div>
   
</div>



       
      
  
       
        <div>
  
    
  
    </div>
    <div class="datetime" style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)",borderRadius:'8px' }}>

<div class="datetime1">
  <div class="datetime1a"><CircleIcon fontSize="small"/><MoreVertIcon/><RadioButtonUncheckedIcon fontSize="small"/></div>
  <div class="datetime1b"><l>Start</l>
  <l>End</l></div>



</div>
<div class="datetime2">
 
    <input type="datetime-local"  style={{ height:'2.5em',
         
            backgroundColor: '#8193FE'
         ,color:'white',
           borderRadius:'8px',
           border:'none',
        
        }} name="datetime"
  
        value={startDateTime}
       
        onChange={(e)=>{
          setStartDateTime(e.target.value)

          
        }}/>
        
           
   
    
        
       
        <input type="datetime-local" name="datetime" name="datetime"
        value={endDateTime}
        style={{ height:'2.5em',
          backgroundColor: '#8193FE',
          color:'white', border:"none",
          border:'none',
          borderRadius:'8px'
        }}
        onChange={(e)=>{
          setEndDateTime(e.target.value)
          
        }}/>

   </div>
   </div>


  { selectedAddress.length!=0 && type!="online" && <div class="location" onClick={()=>{
    toast.dismiss()
    handleClickOpen()
  }} style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)",borderRadius:'8px' }}>
 

<div class="location2"><l style={{fontSize:'20px',gap:'2px'}}>
  &nbsp;&nbsp;
 <LocationPinIcon fontSize='small' />
  {selectedAddress.slice(0,selectedAddress.indexOf(","))}...
<EditIcon style={{color:'#1876d1'}} fontSize="small" />
  </l>
<l style={{fontSize:'15px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i>Offline Location</i></l>


</div>

  </div>}


  { selectedAddress.length!=0 && type=="online" && <div class="location" style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)",borderRadius:'8px' }}>
 

<div class="location2">

<center>

    <div style={{display:'flex',alignItems:'center',gap:'5px',paddingLeft:'10px'}} >
      <VideoCallIcon/>
<div >
  <input placeholder="Moderator Link" style={{backgroundColor:'transparent',fontSize:'17px',border:'1px solid #1876d1',color:'white'}} value={moderatorLink} onChange={(e)=>{
    setModeratorLink(e.target.value)
  }}></input>
  <br></br>   
  <input placeholder="Guest Link" style={{backgroundColor:'transparent',fontSize:'17px',border:'1px solid #1876d1',color:'white'}} onChange={(e)=>{
    setGuestLink(e.target.value)
  }} value={guestLink} ></input>
<br></br>
</div>



</div>
  </center>

</div>

  </div>}



      {mapUrl && (
        <div >
          <iframe
            title="Google Map"
            src={mapUrl}
            width="320"
            height="150"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}

      <a href="#up"  style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,color:'white',textDecoration:"none",width:'100%',textAlign:'left', height:'4em',borderRadius:'8px'}}>
   <br></br> 
  <div  onClick={()=>{
    toast.dismiss()
    setDescription(true)

  }}> {text.length==0 ? <l style={{fontSize:'20px'}}>&nbsp;&nbsp;<DescriptionIcon fontSize='small'/>&nbsp;Add Description</l>:<div style={{fontSize:'20px'}} >&nbsp;&nbsp;{text.replace(/<h[1-6][^>]*>|<\/h[1-6][^>]*>|<b>|<\/b>|<i>|<\/i>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>/g, '').replace(/<[^>]+>/g, '').slice(0,20)+"..."}<EditIcon style={{color:'#1876d1'}} fontSize='small'/>
  
  
  
  </div>}</div></a>

   
  <l style={{color:'#1876d1'}}>Event Options</l>
        <div  style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,justifyContent:'center',padding:'0.5em',width:'19.5em',borderRadius:'8px'}}>



        <div class="capacity" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',marginLeft:'0'}} onClick={async(e)=>{

        e.stopPropagation()

        const data = await getDocs(usersCollectionRef1);
                                                  
          let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            
          let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

          if(filteredArray.length!=0 && filteredArray[0].Premium!=null)
          {
            setPriceShowDiv(true)
          }
          else
          {  
            notify("Subscribe to Premium for paid events","dark","top-right","error")

            setTimeout(()=>{
                window.location.href="/pricing"
            },3000)

          }

        }}><div  style={{display:'flex',alignItems:'center',width:'100%'}} ><ConfirmationNumberIcon fontSize='small'/>
        &nbsp;<l>Tickets</l></div>
        <div style={{display:'flex',alignItems:'right'}}> &nbsp;
        <l style={{color:'#1876d1'}}>{price.length==0 ? 'Free' : 'Paid'}</l></div>
                </div>

          
       

          
        <div  style={{display:'flex',alignItems:'center',justifyContent:'space-between'}} onClick={()=>{
            toast.dismiss()
            setShowCapacity(true)
       
        
         
        }}>
            
            <div style={{display:'flex',gap:'10px'}}>
            <div  style={{display:'flex',alignItems:'center'}} ><PeopleIcon fontSize='small'/>
        &nbsp;<l>Capacity</l> 
        </div>

        <l style={{color:'green'}}>{capacity}</l> 

          </div>
        
       
          <l style={{color:'#1876d1'}}>Change</l> 
        
       
       
                    </div>
          
          
        


         
                   
      
          
          


          
        </div>
       
       
    

        <l style={{color:'#1876d1'}}>Event Questions</l>

<div  style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,justifyContent:'center', width:'100%',textAlign:'left', display:'flex',flexDirection:'column', padding:'10px',width:'19em', alignItems:'flex-start',borderRadius:'8px'}}>


{questions.map((x,index)=>{

  if(x==="Name" || x==="Email") return (
     
        <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>

        <div style={{color:'white'}}>&nbsp; &nbsp;{index+1}.&nbsp; &nbsp;{x}</div>

        <div style={{color:'green'}}>Text</div>


        </div>
    )

  


})}



  


  
</div>
{
    questions.length>2 && <Button variant="outlined" style={{background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)",width:'23.5em',borderRadius:'8px'}} onClick={()=>{
        toast.dismiss()
        handleClickOpenQuestions()
    }} >View All questions</Button>
}



< a href="#up">
<Button variant="outlined" onClick={()=>{

    toast.dismiss()
    setShowDiv(true)
}} style={{background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)",width:'23.5em',borderRadius:'8px'}}>Add new question</Button>
</a>
      
      
      
      
      
      <br></br>
        <button  className='button-85' style={{height:'2em',width:'100%'}} onClick={()=>{

            toast.dismiss()
             updateEvent()
        }}>Update</button></div></div>

     
       
        </div>

}

      
       
     
      
      
  <br></br>  <br></br>
     
      {/* <br></br>
      <input style={{ fontSize: '40px',border:'2px solid white',color:'white' }} placeholder="50"></input> */}
    
      <br></br>
      <br></br>
      <br></br>
      <br></br>


    
       
<ToastContainer style={{zIndex:'99999999999'}}/>

<Dialog style={{ backgroundImage:`url(${eventpageBackground})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',top:'2%'}}
        open={open}
        onClose={handleClose}
        
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
       
        <DialogContent style={{width:'15em',minHeight:'16em',backgroundColor:'black',border:'1px solid #1876d1',borderRadius:'0'}}>
          <DialogContentText>
            <br></br> <br></br>
          &nbsp;&nbsp;<l style={{color:'white'}}>Enter Location</l>
          </DialogContentText>
          <br></br>
        
          <input
            
            style={{fontSize:'16px',maxWidth:'70%',backgroundColor:'black',borderTop:'none',borderLeft:'none',borderRight:'none',color:'white'}}
            
            
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="&nbsp; 🔍 Search Location"
          />
         
          <br></br>
          {suggestions.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          background: "black",
          border: "1px solid #ccc",
          position: "absolute",
          width: "10em",
          zIndex: 9999,
          
          maxHeight: "200px",
          overflowY: "auto",
          color:'white'
        }}>
          {suggestions.map((place, index) => (
            <li 
              key={index}
              onClick={() => {
                toast.dismiss()
                handleSelect(place)}}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {selectedAddress && (
        <div style={{ marginTop: "20px" , color:'#1876d1'}}>
          <strong>Selected Address:</strong> {selectedAddress}
        </div>
      )}

      {mapUrl && (
        <div style={{ marginTop: "20px" }}>
          <iframe
            title="Google Map"
            src={mapUrl}
            width="250"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}
        </DialogContent>
        <DialogActions style={{backgroundColor:'black',borderLeft:'1px solid #1876d1',borderTop:'none',borderRight:'1px solid #1876d1',borderBottom:'1px solid #1876d1',color:'white'}}>
          
          <Button variant="contained" type="submit">Add</Button>
        </DialogActions>
      </Dialog>


      {description &&  <div style={{
          width: '100%', 
          minHeight:'100%',
         
          padding: '20px', 
          position:'fixed',
          top:'0px',
          left:'50%',
       
          
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
        
          transform: 'translateX(-50%)',
          zIndex: 99999999,

          

        }} class="halo-box1">


            <br></br><br></br><br></br><br></br><br></br>
      
          <div style={{borderRadius:'8px'}} >

            <center>
                {/* Toolbar with buttons */}
                <div style={{borderRadius:'8px'}}>
                <div style={{color:'white',backgroundColor: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', border: '2px solid rgb(48, 19, 90)',borderBottom:'2px solid rgb(48, 19, 90)', borderRadius: '10px',width:'20em'}}>
                <h3 >Description</h3>
                </div>
                <div class="editorIcons" style={{backgroundColor:'#1876d1',width:'20em', border: '1px solid #1876d1',}}>
                  <Button variant="outlined" style={{width:'3em',height:'2.5em',fontSize:'20px',width:'2em', border: '1px solid #1876d1',color:'white'}} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} ><b>H</b></Button>
                  <Button variant="outlined" style={{borderRadius:'0', border: '1px solid #1876d1',color:'white'}} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon/></Button>
                  <Button variant="outlined" style={{borderRadius:'0', border: '1px solid #1876d1',color:'white'}} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon/></Button>
                 
                  <Button variant="outlined" style={{borderRadius:'0', border: '1px solid #1876d1',color:'white'}} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon/></Button>
                  <Button variant="outlined"style={{borderRadius:'0', border: '1px solid #1876d1',color:'white'}} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon/></Button>
                  </div>
                </div>
                </center>
                {/* The editable content area with increased height */}
                <center>
                <div
                  style={{
                    height: '50vh',
                    overflowY: 'auto',
                     border: '2px solid rgb(48, 19, 90)', // Optional: Add a border to the editor
                    backgroundColor:'black',width:'20em',
                    color:'white',
                    textAlign: 'left',
                    borderRadius:'2px'
                  }}
                >
                  <EditorContent
                    editor={editor}
                    
                    style={{
                      padding: '10px', // Optional: Add padding for better layout
                    }}
                  />
                </div>
                </center>
        
         
                {/* Inline CSS to remove focus outline */}
                <style>
                  {`
                    .ProseMirror:focus {
                      outline: none !important;  /* Remove focus outline */
                      box-shadow: none !important; /* Remove focus shadow */
                    }
                  `}
                </style>
              
          
                <center>
            <div style={{backgroundColor:'black',width:'20em',display:'flex',justifyContent:'center',paddinng:'2em',height:'4em',alignItems:'center',  border: '2px solid rgb(48, 19, 90)' ,borderTop:'none', borderBottomLeftRadius:'10px', borderBottomRightRadius:'10px'}}>
          <Button variant="outlined" style={{border:'1px solid red',color:'red',height:'2em'}} onClick={()=>{
            toast.dismiss()
            setDescription(false)
           
          }}>Cancel</Button>
          &nbsp;  &nbsp;   &nbsp;  &nbsp;
          <Button variant="contained" style={{height:'2em'}} onClick={()=>{
            toast.dismiss()
            setText(editor.getHTML())
            setDescription(false)
            console.log(editor.getHTML())
           
          }}>Save</Button>

</div>
          </center>
               
              </div>
     
         
        </div>}
 

        {showCapacity &&  <div style={{
            width: '100%', 
            minHeight:'100%',
           
            padding: '20px', 
            position:'fixed',
            top:'0px',
            left:'50%',
            
           color:'white',
           
            
            borderRadius:'8px',
            
            textAlign: 'center', 
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          
            transform: 'translateX(-50%)',
            zIndex: 99999999,
            

           
        }} class="halo-box1">
            <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> 
            <center>
            <div style={{padding:'2em',width:'18em', backgroundColor: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', border: '2px solid rgb(48, 19, 90)',borderBottom:'2px solid rgb(48, 19, 90)' ,borderRadius:'8px'}}>
          <h2 style={{color:'white'}}>Tickets</h2>
         
          <br></br>
          <center>
          <input style={{fontSize:'20px',width:'10em',backgroundColor:'black',borderTop:'none',borderLeft:'none',borderRight:'none',color:'white'}}onChange={(e)=>{
            setCapacity(parseInt(e.target.value))
          }} placeholder='Enter Capacity'></input>
          </center>
          <br></br>
          <br></br><div class="subscribe"><AddCardIcon/><l>Buy Premium for unlimited capacity </l></div>
          <br></br><l></l>
          <div >
         
              </div>
     <br></br><br></br>
          <center>
          <Button variant="outlined" style={{color:'red',border:'0.5px solid red'}} onClick={()=>{
            toast.dismiss()
            setCapacity(50)
            setShowCapacity(false)
           
          }}>Cancel</Button>
          &nbsp;  &nbsp;   &nbsp;  
          <Button variant="contained"  onClick={()=>{
            toast.dismiss()
            setShowCapacity(false)
           
          }}>Save</Button>

          <br></br>
          
          </center>

          </div>

          </center>
        </div>}

        {showDiv &&  <div style={{
           width: '100%', 
           minHeight:'100%',
          
           padding: '20px', 
           position:'fixed',
           top:'0px',
           left:'50%',
           
         
          
           textAlign: 'center', 
           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
         
           transform: 'translateX(-50%)',
           zIndex: 99999999,
        }} class="halo-box1">
            <br></br> <br></br>   <br></br>  <br></br> <br></br> <br></br><br></br>  

            <center>

            <div style={{padding:'2em',width:'18em',paddingBottom:'3em', backgroundColor: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', border: '2px solid rgb(48, 19, 90)',borderBottom:'2px solid rgb(48, 19, 90)' ,borderRadius:'8px'}}>
            
            <CancelIcon style={{marginTop:'2px',marginLeft:'90%',color:'white'}} onClick={()=>{
                toast.dismiss()
            setShowDiv(false)
            }} />
                        
            <br></br> 

 
       

        <br></br>
        
        <QuizIcon style={{marginLeft:'2px',color:'white'}} fontSize='large'/>

         
       
       

          <br></br>
         
    

          {/* No Options */}
         

          {!showTextOption && !showOptionOption && !showCheckboxOption && !showWebsiteOption && !showSocialsOption && <div> 

            <h3 style={{color:'white'}}>Questions</h3>
            <br></br>

            <div style={{backgroundColor:'#1876d1',display:'flex',justifyContent:'flex-start',flexWrap:'wrap'}}>
            
            <Button variant="contained" style={{borderRadius:'0',width:'50%'}} onClick={()=>{
                 setNewQuestion("")
              setShowTextOption(true)
            }}> <TextFormatIcon/> Text </Button> 


          <Button variant="contained" style={{borderRadius:'0',width:'50%'}} onClick={()=>{
             setNewQuestion("")
            setShowOptionOption(true)
          }}><ListIcon/> Options</Button>


          <Button variant="contained" style={{borderRadius:'0',width:'50%'}}onClick={()=>{

            setNewQuestion("Twitter")
            setShowSocialsOption(true)
            
          }}><AccountCircleIcon/> &nbsp;Socials</Button>

          <Button variant="contained" style={{borderRadius:'0',width:'50%'}} onClick={()=>{
            setNewQuestion("")
            setShowWebsiteOption(true)
           
          }}><LinkIcon/> Website</Button>

          {/* <Button variant="contained" style={{borderRadius:'0'}} onClick={()=>{
             setNewQuestion("")
            setShowCheckboxOption(true)
          }}><CheckBoxIcon/>Checkbox</Button> */}

</div>
        
            </div>}


          {/* Text Option */}
          

            {
              showTextOption &&

              <div>
                <h3 style={{color:'white'}}>Text</h3>
             
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                 <input
          type="text"   style={{fontSize:'18px',width:'15em',height:'2em',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',borderRadius:'7px'}}
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Write a new question"
          className="flex-grow p-2 border rounded"
        />


    
      

 
     
        
        <br></br>

        <div style={{display:'flex',justifyContent:'center',gap:'15px'}}>

        <Button variant="outlined" style={{width:'9em',height:'2em',border:'1px solid red',color:'red'}} onClick={()=>{

          setNewQuestion("")  
          setShowTextOption(false)
        }}>Cancel</Button>
     
        <Button variant="contained" style={{width:'9em',height:'2em'}}
          onClick={()=>{
            


            handleAddQuestion()
            setShowTextOption(false)

            setShowDiv(false)
            

            

             

             
              

          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
          Add
        </Button>
</div>
</div>
          
              </div>
   }


        {/* Option Option*/}


        {
              showOptionOption &&

              <div>
                 <h3 style={{color:'white'}}>Options</h3>
                 <br></br>
                 <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Add a new question"
          className="flex-grow p-2 border rounded"
          style={{fontSize:'18px',width:'15em',height:'2em',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',borderRadius:'7px'}}
        />
      <br></br>
    
      <br></br>

        <input placeholder="option1,option2"  style={{fontSize:'18px',width:'15em',height:'2em',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',borderRadius:'7px'}} value={optionsInOptionOption} onChange={(e)=>{

            setOptionsInOptionOption(e.target.value)

        }}/>

       


        <br></br> <br></br>

        <div style={{display:'flex',justifyContent:'center',gap:'15px'}}>

        <Button variant="outlined" onClick={()=>{

          setNewQuestion("")
          setShowOptionOption(false)
        }}  style={{width:'9em',height:'2em',border:'1px solid red',color:'red'}} >Cancel</Button>


        <Button variant="contained" style={{width:'9em',height:'2em'}}
          onClick={()=>{

            
             handleAddQuestion("type=options")
             setShowOptionOption(false)
 
             setShowDiv(false)
            

           
            
             

          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
          Add
        </Button>

        </div>


              </div>
   }


        {/* Checkbox Option */}


        {
              showCheckboxOption &&

              <div>
                <h3 style={{color:'white'}}>Checkbox</h3>
             
              
                 <input
          type="text" style={{fontSize:'18px',width:'15em',height:'2em',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',borderRadius:'7px'}}
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Write a new question"
          className="flex-grow p-2 border rounded"
        />
      <br></br>

        <button style={{width:'10.5em',height:'2em',border:'1px solid red',backgroundColor:'white',color:'red'}} onClick={()=>{

            setNewQuestion("")
          setShowCheckboxOption(false)
        }}>Cancel</button>
     
        <button style={{width:'10.5em',height:'2em',border:'1px solid #1876d1',backgroundColor:'#1876d1',color:'white'}}
          onClick={()=>{

              handleAddQuestion("type=checkbox")
              setShowCheckboxOption(false)
 
             setShowDiv(false)
             

          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
          Add
        </button>


              </div>
   }


{/* Website Option */}


{
              showWebsiteOption &&

              <div>
                <h3 style={{color:'white'}}>Website</h3>
              
                 <input
          type="text" style={{fontSize:'18px',width:'15em',height:'2em',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',borderRadius:'7px'}}
          value="Enter Website Link"
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Write a new question"
          className="flex-grow p-2 border rounded"
        />
      
      <br></br> <br></br> 

      <div style={{display:'flex',gap:'15px',justifyContent:'center'}}>
            
        <Button variant="outlined" style={{width:'9em',height:'2em',border:'1px solid red',color:'red'}} onClick={()=>{
          setShowWebsiteOption(false)
          setNewQuestion("")
        }}>Cancel</Button>
     
        <Button variant="contained" style={{width:'9em',height:'2em'}}
          onClick={()=>{

              handleAddQuestion("type=website")

              setShowWebsiteOption(false)
 
             setShowDiv(false)
             

          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
          Add
        </Button>

        </div>


              </div>
   }


   {/* Socials Option */}



{
              showSocialsOption &&

              <div>
                <h3 style={{color:'white'}}>Social Profile</h3>
             
                <input
          type="text" style={{fontSize:'18px',width:'15em',height:'2em',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',borderRadius:'7px'}}
          value={`What is your ${newQuestion} handle ?`}
          
          placeholder="Write a new question"
          className="flex-grow p-2 border rounded"
        />
        <br></br>
        <br></br>
        <select id="dropdown"  onChange={(e)=>{
            setNewQuestion(e.target.value)
           
        }} style={{fontSize:'17.5px',width:'15em',height:'2em',backgroundColor:'rgb(46,47,48)',color:'white',border:'none',borderRadius:'7px'}}>
            <option value="Twitter">Twitter</option>
            <option value="Linkedin">Linkedin</option>
            <option value="Instagram">Instagram</option>

          
        </select>
              <br></br>
              <br></br>
             
     
             
        <div style={{display:'flex',justifyContent:'center',gap:'15px'}}>

        <Button variant="outlined" style={{width:'9em',height:'2em',border:'1px solid red',color:'red'}} onClick={()=>{

            setNewQuestion('')
          setShowSocialsOption(false)

        }}>Cancel</Button>
     
        <Button variant="contained" style={{width:'9em',height:'2em'}}
          onClick={()=>{

           
              handleAddQuestion("type=socials")

              setShowSocialsOption(false)
 
             setShowDiv(false)

             
             

          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
          Add
        </Button>

        </div>


              </div>
             
   }

          
          </div>
          </center>
          
        </div>}




        {openQuestions && (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: '20px',
      position: 'fixed',
      top: '0px',
      left: '50%',
      color: 'white',
      
          
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
        
          transform: 'translateX(-50%)',
          zIndex: 99999999,
    }}
  class="halo-box1">
  <br></br><br></br>



    <div style={{ paddingTop: '10vh', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
        
          padding: '1em',
          maxWidth: '40em',
        backgroundColor: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', border: '2px solid rgb(48, 19, 90)',borderBottom:'2px solid rgb(48, 19, 90)' ,borderRadius:'8px'
        }}
      >
        <div style={{width:'100%',textAlign:'right'}} onClick={()=>{
            setOpenQuestions(false)
        }}><CancelIcon/></div>

        <h2 style={{ color: 'white', marginBottom: '1em' }}>Questions</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ borderBottom: '0.2px solid #1876d1' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Question</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '10px' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((x, index) => {
              let questionText = x;
              let type = 'Text';

              if (x.slice(0, 4) === 'type') {
                type = x.slice(x.indexOf('=') + 1, x.indexOf('{'));
                questionText = x.slice(x.indexOf('}') + 1);
              }

              return (
                <tr
                  key={index}
                  style={{
                    borderBottom: index === questions.length - 1 ? 'none' : '1px solid #1876d1', // No border on last row
                  }}
                >
                  <td style={{ padding: '10px', paddingRight: '2px', wordWrap: 'break-word', textAlign: 'left' }}>
                    {questionText}
                  </td>
                  <td style={{ padding: '10px', color: 'lightgreen' }}>{type}</td>
                  <td style={{ padding: '10px' }}>
                    {/* If the question is Name or Email, show "Required" in red */}
                    {(questionText === 'Name' || questionText === 'Email') ? (
                      <span style={{ color: 'red' }}>Required</span>
                    ) : (

                        <DeleteIcon  style={{ color: 'red', cursor: 'pointer'}}  onClick={() => handleDeleteQuestion(index)}/>
                        
                    
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{priceShowDiv &&  <div style={{
            width: '100%', 
            minHeight:'100%',
           
            padding: '20px', 
            position:'fixed',
            top:'0px',
            left:'50%',
            
           color:'white',
           
          
            
            textAlign: 'center', 
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          
            transform: 'translateX(-50%)',
            zIndex: 99999999,
            
           
        }} class="halo-box1">
            <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
            <center>
            <div style={{backgroundColor: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', border: '2px solid rgb(48, 19, 90)',padding:'2em',width:'18em' ,borderRadius:'10px'}}>
          <h2 style={{color:'white'}}>Tickets</h2>
         
          <br></br><br></br><br></br>
          <center>
          <input style={{fontSize:'20px',width:'10em',backgroundColor:'black',borderTop:'none',borderLeft:'none',borderRight:'none',color:'white'}}onChange={(e)=>{
            setPrice(e.target.value)
          }} placeholder='Enter Price' value={price}></input>
          </center>
          <br></br>
          <center>
          <input style={{fontSize:'20px',width:'10em',backgroundColor:'black',borderTop:'none',borderLeft:'none',borderRight:'none',color:'white'}}onChange={(e)=>{
           setPriceRecieverAddress(e.target.value)
          }} placeholder='Receiver Wallet Address' value={priceRecieverAddress}></input>
          </center>
          <br></br>
         
          <br></br><l></l>
          <div >
         
              </div>
     <br></br><br></br>
          <center>
          <Button variant="outlined" style={{color:'red',border:'0.5px solid red'}} onClick={()=>{
            
            setPrice("")
            setPriceRecieverAddress("")
            setPriceShowDiv(false)
           
          }}>Cancel</Button>
          &nbsp;  &nbsp;   &nbsp;  
          <Button variant="contained"  onClick={()=>{
            toast.dismiss()
            setPriceShowDiv(false)
           
          }}>Save</Button>

          <br></br>
          
          </center>

          </div>

          </center>
        </div>}


        <Dialog 
  fullScreen

  TransitionComponent={Transition}
>
    <br></br> <br></br> <br></br> <br></br> 
  <AppBar sx={{ position: 'relative'}} style={{ backgroundColor: 'black' }}>
    <Toolbar style={{ backgroundColor: 'black' }}>
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleCloseQuestions}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
        Questions
      </Typography>
    </Toolbar>
  </AppBar>
  <h3>&nbsp;&nbsp;&nbsp; Questions</h3>
  <List >
    {questions.map((x, index) => {
      if (x === "Email" || x === "Name") {
        return (
          <>
            <ListItemButton key={index}>
              <ListItemText
                primary={
                  <div style={{ display: 'flex',flexDirection:'column', justifyContent: 'flex-start', padding: '1em',gap:'3px' }}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <l style={{fontSize:'28px'}}><b>{x}</b></l>
                      <l style={{color:'green'}}>Text</l>
                    </div>
                   
                  </div>
                }
              />
            </ListItemButton>
            <Divider />
          </>
        );
      } else if (x.slice(0, 4) === "type") {
        return <>


<ListItemButton key={index}>
              <ListItemText
                primary={
                  <div style={{ display: 'flex',flexDirection:'column', justifyContent: 'flex-startr', padding: '1em',gap:'3px' }}>
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                      <l style={{fontSize:'28px'}}><b>{x.slice(x.indexOf("}")+1)}</b></l>
                     
                      <l style={{color:'green'}}>{x.slice(x.indexOf("=")+1,x.indexOf("{"))}</l>
                    </div>

                    <Button variant='contained' onClick={()=>{
                        toast.dismiss()
                        handleDeleteQuestion(index)
                    }}>Delete</Button>
                    
                    
                  </div>
                }
              />
            </ListItemButton>
            <Divider />


        </>;
      } else {
        return <>
        
        <ListItemButton key={index}>
              <ListItemText
                primary={
                  <div style={{ display: 'flex',flexDirection:'column', justifyContent: 'flex-startr', padding: '1em',gap:'3px' }}>
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                      <l style={{fontSize:'28px'}}><b>{x}</b></l>
                      <l style={{color:'green'}}>Text</l>
                    </div>
                    <Button variant='contained' onClick={()=>{
                        toast.dismiss()
                        handleDeleteQuestion(index)
                    }}>Delete</Button>
                  </div>
                }
              />
            </ListItemButton>
            <Divider />
        
        </>;
      }
    })}
  </List>
</Dialog>

    </div>
  )
}

export default AdminCreate
