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
  Timestamp,
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
import './AdminCreate.css'
import ResponsiveAppBar from './ResponsiveAppBar';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import eventpageBackground from '../assets/images/coinBackground2.gif'
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import abi from '../Contracts/EventManager.json'
import LinearProgress from '@mui/material/LinearProgress';





// import { signInWithGoogle } from "../firebase-config";



const usersCollectionRef = collection(db, "events");
const usersCollectionRef1 = collection(db, "user");




function AdminCreate() {


  const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [mapUrl, setMapUrl] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [startDateTime, setStartDateTime] = useState('2025-04-30T08:00');
    const [endDateTime, setEndDateTime] = useState('2025-05-01T14:00');
    const [capacity,setCapacity]=useState(0)
    const [isOnline,setIsOnline]=useState(false)
    const [moderatorLink,setModeratorLink]=useState("")
    const [guestLink,setGuestLink]=useState("")
    const { showWidgetModal, closeModal } = useOkto();

    const [description,setDescription]=useState(false)
    const [showCapacity,setShowCapacity]=useState(false)
    const [category,setCategory]=useState("")
    const [showShowCategory,setShowCategory]=useState(false)
    const [categoryColor,setCategoryColor]=useState(["white,white,white,white,white,white,white,white,white,white"])
    const [priceShowDiv,setPriceShowDiv]=useState(false)
    const [price,setPrice]=useState("")
    const [priceRecieverAddress,setPriceRecieverAddress]=useState("")
    const [clicked, setClicked] = useState(false);

       const { createWallet, getUserDetails, getPortfolio } = useOkto();

        const editor = useEditor({
           extensions: [StarterKit], // Add basic features: bold, italic, headings, etc.
           content: '<p>Start writing...</p>',
         });
         const [text,setText]=useState('')
       
        

       const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open_description, setOpen_description] = useState(false);

  const handleClickOpen_description = () => {
    setOpen_description(true);
  };

  const handleClose_description = () => {
    setOpen_description(false);
  };
  

  const [imageUrl, setImageUrl] = useState("");
 const notify = (text,theme,position,type) => {
  

  
  toast(text,{
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


   

    }
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
    const [loading,setLoading]=useState(false)

    const [user,setUser]=useState([])

    const createUser = async () => {

    

      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

      console.log(user)

      if(!isOnline)
      {
        if(price.length!=0 && priceRecieverAddress.length!=0)
        {
          const result=await addDoc(usersCollectionRef, { Name: eventName, Image:imageUrl,Address:selectedAddress,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Description: text, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0,Category:category,Timestamp:now,Price:price, PriceRecieverAddress:priceRecieverAddress,Coins:100});


          if(user.length!=0)
            {

              updateUser(result.id)

              if (!window.ethereum) {

               
                console.error("MetaMask not detected");
                return;
              }
            
              try {
                // Connect to wallet
                await window.ethereum.request({ method: "eth_requestAccounts" });
           
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
            
                // Initialize contract
                const contract = new ethers.Contract("0x6f9020c5E74623D50a9f30DA2bA34c3f684c235b", abi, signer);

              
            
                // Call createEvent
                const tx = await contract.createEvent(result.id);

                setLoading(true)
                
            
                // Wait for confirmation
                const receipt = await tx.wait();
                setLoading(false)
                console.log("Transaction confirmed:", receipt);
                notify("Event Created!","light","top-right","success")

                setTimeout(()=>{
                  window.location.href="/dashboard"
                },2000)
              } catch (error) {
                console.error("Error creating event:", error);
              }
            }

          console.log(result.id)
        }
        else
        {
          const result=await addDoc(usersCollectionRef, { Name: eventName, Image:imageUrl,Address:selectedAddress,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Description: text, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0,Category:category,Timestamp:now,Coins:100 });

          if(user.length!=0)
            {
              updateUser(result.id)
              notify("Event Created!","light","top-right","success")
              setTimeout(()=>{
                window.location.href="/dashboard"
              },2000)
            }

          console.log(result.id)
        }
       

      
      }
      else
      {

        if(price.length!=0 && priceRecieverAddress.length!=0)
        {
          const result=await addDoc(usersCollectionRef, { Name: eventName,Type:"online", Image:imageUrl,Address:moderatorLink+"{}"+guestLink,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Description: text, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0,Category:category,Timestamp:now,Price:price, PriceRecieverAddress:priceRecieverAddress,Coins:100});

        console.log(result.id)

        if(user.length!=0)
        {
          updateUser(result.id)

          if (!window.ethereum) {
            console.error("MetaMask not detected");
            return;
          }
        
          try {
            // Connect to wallet
           // Connect to wallet
           await window.ethereum.request({ method: "eth_requestAccounts" });
           
           const provider = new ethers.providers.Web3Provider(window.ethereum);
           const signer = provider.getSigner();
       
           // Initialize contract
           const contract = new ethers.Contract("0x6f9020c5E74623D50a9f30DA2bA34c3f684c235b", abi, signer);

         
       
           // Call createEvent
           const tx = await contract.createEvent(result.id);

           setLoading(true)
           
       
           // Wait for confirmation
           const receipt = await tx.wait();
           setLoading(false)
           console.log("Transaction confirmed:", receipt);
           notify("Event Created!","light","top-right","success")

           setTimeout(()=>{
             window.location.href="/dashboard"
           },2000)
          } catch (error) {
            console.error("Error creating event:", error);
          }
        }
        }
        else{
          const result=await addDoc(usersCollectionRef, { Name: eventName,Type:"online", Image:imageUrl,Address:moderatorLink+"{}"+guestLink,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Description: text, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0,Category:category,Timestamp:now,Coins:100});

          if(user.length!=0)
            {
              updateUser(result.id)
              notify("Event Created!","light","top-right","success")
              setTimeout(()=>{
                window.location.href="/onlinedashboard"
              },2000)
            }
        }
        
      }
        
       
      };

        const updateUser = async (id) => {

          

            console.log(user[0])
                    const userDoc = doc(db, "user", user[0].id);
                    const newFields = { Email: user[0].Email, Coins:user[0].Coins, EventsCreated:[...user[0].EventsCreated,id],EventsRegistered:user[0].EventsRegistered, EventsApproved:user[0].EventsApproved,EventsAttended:user[0].EventsAttended};
                    await updateDoc(userDoc, newFields);
                   
                  

                  };

      const getEvents = async () => {
      
      
                const data = await getDocs(usersCollectionRef1);
               
                let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
             
                
               const newArr = users.filter(obj => obj.Email === localStorage.getItem('email'));
             
               console.log(newArr[0].id)

               setUser(newArr)
               
              
              };
      
              useEffect(()=>{
      
                getEvents()
      
              },[])

   
      
       
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
       <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="contained" dashboardButtonStyle="outlined"/>

       
       
     {!loading &&  <div style={{ position: "relative", zIndex: 1 }}>
      
       <br></br> <br></br>  <br></br> <br></br>  <br></br> <br></br>
              
      <br></br>
      


      <div class="main">
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
    backgroundImage: `url(${uploadImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px black",
    border:"5px solid #1876d1",
    zIndex:1
  }}
>

</label>
<br></br>
<l style={{color:'#1876d1',textAlign:'left'}}>Choose an image for poster</l>
</center>}
{imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        
        </div>
      )}
{imageUrl.length!=0 &&  <center>
      <label
        htmlFor="fileInput"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4A90E2",
          color: "white",
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
    
    <input type="input" style={{fontSize:'40px',background: "transparent", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(0px)", border: "none", width:'100%',color:'white'}} placeholder="Event Name" required="" value={eventName} onChange={(e)=>setEventName(e.target.value)} />
    </div>
   
</div>



       
      
  
       
        <div>
  
    
  
    </div>
    <div class="datetime" style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,borderRadius:'8px'}}>

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
  {!isOnline && <div class="location" onClick={()=>{
    
    toast.dismiss()
    handleClickOpen()}} style={{ cursor:'pointer',background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)",borderRadius:'8px' }}>
 

<div class="location2"><l style={{fontSize:'20px'}}>
  
  {selectedAddress.length!=0 && <l>&nbsp;&nbsp;<LocationPinIcon fontSize='small' />{selectedAddress.split(',')[0]}</l>}
  {selectedAddress.length==0 && <l>&nbsp;&nbsp;<LocationPinIcon fontSize='small'/> Add Location</l>}
  
  </l>
<l style={{fontSize:'15px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Offline Location <l style={{color:'#1876d1'}} onClick={(event)=>{
  event.stopPropagation(); 
  toast.dismiss()
  setIsOnline(true)
}}>&nbsp;<i>or Online Event</i></l></l>



</div>

  </div>
}

{

isOnline && <div class="location"  style={{ cursor:'pointer',background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)",width:'100%',height:'10em' ,borderRadius:'8px'}}>
 




    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'flex-start', width:'100%',padding:'0.5em',gap:'20px'}} >
      <VideoCallIcon/>

  <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
  <input placeholder="Moderator Link" style={{backgroundColor:'transparent',fontSize:'17px',border:'1px solid #1876d1',color:'white'}} onChange={(e)=>{
    setModeratorLink(e.target.value)
  }}></input>

  <input placeholder="Guest Link" style={{backgroundColor:'transparent',fontSize:'17px',border:'1px solid #1876d1',color:'white'}} onChange={(e)=>{
    setGuestLink(e.target.value)
  }}></input>

<l style={{color:'#1876d1'}} onClick={()=>{
  toast.dismiss()
  setIsOnline(false)
}}><i>or <br></br> Offline Event </i></l>

</div>








</div>




  </div>

}



      {mapUrl && (
        <div  >
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

      <a href="#up"  style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(15px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,color:'white',textDecoration:"none",width:'100%',textAlign:'left', height:'4em',borderRadius:'8px'}}>
   <br></br> 
  <div  onClick={()=>{
    
    toast.dismiss()
    setDescription(true)

  }}> {text.length==0 ? <l style={{fontSize:'20px'}}>&nbsp;&nbsp;<DescriptionIcon fontSize='small'/>&nbsp;Add Description</l>:<div style={{fontSize:'20px'}} >&nbsp;&nbsp;{text.replace(/<h[1-6][^>]*>|<\/h[1-6][^>]*>|<b>|<\/b>|<i>|<\/i>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>/g, '').replace(/<[^>]+>/g, '').slice(0,20)+"....."} &nbsp; <l style={{color:'#1876d1'}}>Edit</l></div>}</div></a>

   
       
       
        <l style={{color:'#1876d1'}}>Event Options</l>
        <div class="eventOptions" style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,justifyContent:'center',paddingBottom:'1em', paddingTop:'1em',paddingRight:'1em',borderRadius:'8px'}}>



         
          
          <div class="capacity" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}} onClick={async(e)=>{

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
           
}}><div  style={{display:'flex',alignItems:'center',width:'100%',cursor:'pointer'}} ><ConfirmationNumberIcon fontSize='small'/>
        &nbsp;<l>Tickets</l></div>
        <div style={{display:'flex',alignItems:'right',cursor:'pointer'}}> &nbsp;
        <l style={{color:'#1876d1'}}>{price.length==0 ? 'Free' : 'Paid'}</l></div>
                    </div>



    


          <div class="capacity" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',cursor:'pointer'}} onClick={()=>{
            toast.dismiss()
            setShowCategory(true)
       
        
         
        }}><div  style={{display:'flex',alignItems:'center',width:'100%',cursor:'pointer'}} ><CategoryIcon fontSize='small'/>
        &nbsp;<l>Category </l></div>
        <div style={{display:'flex',alignItems:'right'}}> &nbsp;
        <l style={{color:'#1876d1'}}>{category.length==0 ? "select" : category.slice(0,6)+"..."}</l></div>
                    </div>
          
          
                    <div class="capacity" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',cursor:'pointer'}} onClick={()=>{
            toast.dismiss()
            setShowCapacity(true)
       
        
         
        }}><div  style={{display:'flex',alignItems:'center',width:'100%',cursor:'pointer'}} ><PeopleIcon fontSize='small'/>
        &nbsp;<l>Capacity </l></div>
        <div style={{display:'flex',alignItems:'right'}}> &nbsp;
        <l style={{color:'#1876d1'}}>{capacity==0 ? "select" :capacity}</l></div>
                    </div>
          
          
        


         
                   
      
          
          


          
        </div>
      <br></br><br></br>
        <button  className='button-85' style={{height:'2em',width:'100%'}} disabled={clicked} onClick={()=>{

          setClicked(true)
          toast.dismiss()
            createUser()

            

        
        }}>Create</button>
       
     
      
      </div>

     
       
      </div>
  <br></br>  <br></br>
     
      {/* <br></br>
      <input style={{ fontSize: '40px',border:'2px solid white',color:'white' }} placeholder="50"></input> */}
    
      <br></br>
      <br></br>
      <br></br>
      <br></br>


    
       


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
              onClick={() =>{ 
                
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
        <DialogActions style={{ backgroundColor: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)',border:'1px solid #1876d1',borderBottom:'2px solid rgb(48, 19, 90)',color:'white'}}>
          
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
            <div style={{width:'20em',display:'flex',justifyContent:'center',paddinng:'2em',height:'4em',alignItems:'center',  border: '2px solid rgb(48, 19, 90)' ,borderTop:'none', borderBottomLeftRadius:'10px', borderBottomRightRadius:'10px',backgroundColor:'black'}}>
          <Button variant="outlined" style={{border:'1px solid red',color:'red',height:'2em'}} onClick={()=>{
            toast.dismiss()
            setDescription(false)
           
          }}>Cancel</Button>
          &nbsp;  &nbsp;   &nbsp;  &nbsp;
          <Button variant="contained" style={{height:'2em'}} onClick={()=>{
            
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

        {showShowCategory &&  <div style={{
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
          <br></br>  <br></br> <br></br> <br></br> 
<center>
          <div style={{padding:'2em',width:'18em',backgroundColor: 'black', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', border: '2px solid rgb(48, 19, 90)',borderBottom:'2px solid rgb(48, 19, 90)' ,borderRadius:'8px'}}>
          <h2 style={{color:'white'}}>Category</h2>
         
          <br></br>
          <center>
          <p style={{color:'white'}}
          
          onChange={(e)=>{
            setCapacity(parseInt(e.target.value))
          }} placeholder='Standup'>{category}</p>
          
          <br></br> <br></br>
          <Button variant="outlined" style={{borderRadius:'5px', margin: '5px'}} onClick={()=>{
  if(!category.toLowerCase().includes("Standup".toLowerCase())) {
    setCategory(category.length === 0 ? "Standup" : category + ",Standup");
    categoryColor[0]="#1876d1"
    setCategoryColor(categoryColor)
  } else {
    categoryColor[0]="white"
    setCategoryColor(categoryColor)
    if(category.startsWith("Standup,")) {
      setCategory(category.slice("Standup,".length));
    } else if(category === "Standup") {
      setCategory("");
    } else if(category.startsWith("Standup")) {
      setCategory(category.slice("Standup".length));
    } else {
      setCategory(category.slice(0,category.indexOf(",Standup"))+category.slice(category.indexOf(",Standup")+5));
    }
  }
}}>Standup</Button>

<Button variant="outlined" style={{borderRadius:'5px', margin: '5px'}} onClick={()=>{
  if(!category.toLowerCase().includes("Concert".toLowerCase())) {
    setCategory(category.length === 0 ? "Concert" : category + ",Concert");
    categoryColor[1]="#1876d1"
    setCategoryColor(categoryColor)
  } else {
    categoryColor[1]="white"
    setCategoryColor(categoryColor)
    if(category.startsWith("Concert,")) {
      setCategory(category.slice("Concert,".length));
    } else if(category === "Concert") {
      setCategory("");
    } else if(category.startsWith("Concert")) {
      setCategory(category.slice("Concert".length));
    } else {
      setCategory(category.slice(0,category.indexOf(",Concert"))+category.slice(category.indexOf(",Concert")+7));
    }
  }
}}>Concert</Button>


          
          </center>
       
          <br></br><l></l>
          <div >
         
              </div>
     <br></br><br></br>
          <center>
          <Button variant="outlined" style={{color:'red',border:'0.5px solid red'}} onClick={()=>{
            
            setCategory("")
            setShowCategory(false)
           
          }}>Cancel</Button>
          &nbsp;  &nbsp;   &nbsp;  
          <Button variant="contained"  onClick={()=>{
            toast.dismiss()
            setShowCategory(false)

           
          }}>Save</Button>
          </center>

          </div>
          </center>
        </div>}


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
 
        
    </div>
}

{loading==true &&  <Box sx={{position:'absolute', width: '50%' ,top:'40%',left:'25%',zIndex:'9999999999999'}}>
        <l style={{color:'white',fontSize:'20px'}}>Creating Event...</l>
        <br></br>
        <br></br> 
      <LinearProgress style={{backgroundColor:'green',color:'green'}} />
    </Box>}
    <ToastContainer style={{zIndex:'999999999999999999999999999999'}} />
    </div>
  )
}

export default AdminCreate