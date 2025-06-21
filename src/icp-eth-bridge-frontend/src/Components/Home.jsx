import React,{useEffect, useState} from 'react'
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import './Home.css'
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
import coinImg from '../assets/images/coinImg.png'
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';




import Confetti from 'react-confetti'

// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef1 = collection(db, "user");

function Home() {



    const [coins,setCoins]=useState(0)
    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    const notify = () => toast("Account Created",{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "success", // 👈 This makes it green
      }
     
      )

    

      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const [showDiv, setShowDiv] = useState(false);
    

      const getUsers=async ()=>{

        let data = await getDocs(usersCollectionRef1);
                                   
                    let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                  
                                   
                    return usersTemp
                   
      }


   


  



      useEffect(()=>{

      if(localStorage.getItem('email') && localStorage.getItem('coins'))
      {

        
           window.location.href="/home2"
        
        
      }

      if(!localStorage.getItem('email'))
      {
        window.location.href="/oktologin"
      }

     


        getUsers().then((usersTemp)=>{

          
        


          console.log("usersTemp",usersTemp)
          let filteredArray=usersTemp.filter(obj=>obj.Email==localStorage.getItem('email'))
                console.log("filteredArray",filteredArray)
                if(filteredArray.length!=0)
                {
                  localStorage.setItem('email',localStorage.getItem('email'))
                  localStorage.setItem('coins',filteredArray[0].Coins)
                  if(filteredArray[0].WalletAddress)
                  {
                    localStorage.setItem('walletAddress',filteredArray[0].WalletAddress)
                  }
                  if(filteredArray[0].ProfileImage)
                  {
                    localStorage.setItem('profileImg',filteredArray[0].ProfileImage)
                  }
                  if(filteredArray[0].UserName)
                    {
                      localStorage.setItem('userName',filteredArray[0].UserName)
                    }
                  if(localStorage.getItem('currentEvent'))
                  {
                    window.location.href=`/event/${localStorage.getItem('currentEvent')}`
                  }
                  else{
                    window.location.href="/home2"
                  }
                  
                }
                else{
               

                

                   
                 
                  localStorage.setItem('coins',100)
                  
                     const timer = setTimeout(() => {
                      setShowDiv(true);
                    }, 1000); // 2 seconds
                
                    return () => clearTimeout(timer);

                }


            })
      },[])
  return (
    <div >
  
      <br></br>
    
      {/* <div style={{
  width: '300px', 
  height:'200px',
  padding: '20px', 
  backgroundColor: '#fff', 
  border: '1px solid #ddd', 
  textAlign: 'center', 
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
  position: 'absolute', 
  top: '30%', 
  left: '50%', 
  transform: 'translateX(-50%)',  // This will center the div horizontally
}}>
  <h1>Congratulations!</h1>
  <p>Your account has been created.</p>
  <p>Click on Start Earning to continue.</p>
</div> */}

{showDiv && (
        <div style={{
          width: '300px', 
          height: '250px',
          padding: '20px', 
          backgroundColor: 'rgb(25,25,25)', 
          borderRadius:'10px',
          border: '0.1px solid #6f6aff', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '29%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          animation: 'popupAnimation 0.5s ease',
          color:'white'
        }}>
          <h1>Congratulations!</h1>
          <p>Your account has been created.</p>
          <p>Click on Get Started to continue.</p>
          <br></br>
          <center>    {coins==0 && <button class="button-85" style={{height:'3em'}} onClick={async()=>{
    
    if( localStorage.getItem('email') )
    {

       
        const data = await getDocs(usersCollectionRef1);
                      
        let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    
                       
      
        if(localStorage.getItem('walletAddress') && localStorage.getItem('walletAddress')==localStorage.getItem('email'))
        {
          await addDoc(usersCollectionRef1, { Email:localStorage.getItem('email'), Coins: 100, EventsCreated: [], EventsRegistered: [], EventsApproved:[],EventsAttended: [],WalletAddress:localStorage.getItem('email')});
          setCoins(100)

          if(localStorage.getItem('currentEvent'))
            {
    
              window.location.href=`event/${localStorage.getItem('currentEvent')}`
            }
    
            else{
              window.location.href = '/home2';
            }
        }
        
        else if(localStorage.getItem('email'))

          {
            await addDoc(usersCollectionRef1, { Email:localStorage.getItem('email'), Coins: 100, EventsCreated: [], EventsRegistered: [], EventsApproved:[],EventsAttended: []});
            setCoins(100)

            if(localStorage.getItem('currentEvent'))
              {
      
                window.location.href=`event/${localStorage.getItem('currentEvent')}`
              }
      
              else{
                window.location.href = '/home2';
              }
          }
      
       

      
        
        
       

      
       

       

    }
   
}}><l>Get Started</l>&nbsp; <img src={coinImg} style={{width: '40px', 
  height: '40px', 
  objectFit: 'cover' }}></img></button>}</center>
      
        </div>
      )}

      {/* Keyframes for animation */}
      <style>
        {`
          @keyframes popupAnimation {
            0% {
              opacity: 0;
              transform: translateX(-50%) scale(0.5);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) scale(1);
            }
          }
        `}
      </style>

      <div className="full-width-bar" >
        <div class="logo" >  <img src={logo} style={{width:'6em'}} alt="Logo" /></div>

        <div style={{color:'white'}} >

      <Button variant="outlined" onClick={notify} style={{color:'#6f6aff',border:'none'}}>Launch</Button>
      <Button variant="outlined" onClick={notify} style={{color:'#6f6aff',border:'none'}}>Trade</Button>
      <Button variant="outlined" onClick={notify} style={{color:'#6f6aff',border:'none'}}>Presale</Button>
      <Button variant="outlined" onClick={notify} style={{color:'#6f6aff',border:'none'}}>Stake</Button>


        </div>
          
            <div className="text" > <Button variant="outlined" onClick={()=>{
              showWidgetModal()
            }}> <AccountBalanceWalletIcon/></Button></div>
          </div>
      <hr></hr>
      <Alert severity="info" >Click on Start Earning to Get Started !</Alert>
<center>
  <br></br><br></br><br></br><br></br>
  <Confetti
      width={"1500px"}
      height={"800px"}
    />
  


<div class="coin" style={{marginLeft:'0%',marginTop:'0%'}}>  <img src={coinImg} style={{width: '130px', 
    height: '100px', 
    objectFit: 'cover' }} alt="Logo"  />   <l style={{fontSize:"52px"}}>0</l></div>
      </center>

<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>


<br></br>
<br></br><br></br><br></br><br></br><br></br><br></br>




<ToastContainer/>




    </div>
  )
}

export default Home
