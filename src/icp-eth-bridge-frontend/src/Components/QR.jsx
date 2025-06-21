import React,{useEffect, useState,useRef} from 'react'
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { QRCodeCanvas } from 'qrcode.react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DownloadIcon from '@mui/icons-material/Download';
import backgroundImage from '../assets/images/coinBackground2.gif'
import ResponsiveAppBar from './ResponsiveAppBar';
import { useOkto } from "okto-sdk-react";
// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef1 = collection(db, "user");

const usersCollectionRef2 = collection(db, "ticket");

function QR() {

    const [randomNumber, setRandomNumber] = useState('');
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef();
    const { event_id } = useParams();
    const [isDownload,setIsDownload]=useState(false)
    const [users, setUsers] = useState([]);


     const getUsers = async () => {
            const data = await getDocs(usersCollectionRef1);
           
            let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        
            let filteredArray = usersTemp.filter(obj => 
              obj.Email === localStorage.getItem('email') && 
              obj.EventsApproved.includes(event_id)
            );
            
            return filteredArray
            // if(filteredArray.length==0)
            // {
            //   return false
            // }
            // else{
            //   return true
            // }


     }
  
    const generateNumber = async(download) => {

      if(randomNumber.length==0 )
      {
        const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        setRandomNumber(number);
        localStorage.setItem(`${event_id}TicketId`,number+localStorage.getItem('email'))
        const result=await addDoc(usersCollectionRef2, {TicketId:number+localStorage.getItem('email'),EventId:event_id});
      
        console.log(result.id)
        console.log(number)

        if(download)
        {
          downloadQRCode()
        }

        return

       
      }
      if(download)
        {
          downloadQRCode()
        }
     
      
    };
  

    
    const downloadQRCode = () => {

      try{
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
      }
      catch(err){
        console.log(err)
      }
    };


   const getTickets=async ()=>{
    const data = await getDocs(usersCollectionRef2);
           
      let ticketsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

      console.log(ticketsTemp[0].TicketId.slice(10))
  
      let filteredArray = ticketsTemp.filter(obj => 
        obj.TicketId.slice(10) === localStorage.getItem('email') && 
        obj.EventId==event_id
      );

      console.log("filtered",filteredArray)
      
      return filteredArray
   }


  
    // 🧠 Update canvas class after render


    useEffect(() => {

     getUsers().then((data)=>{
        console.log(data.length)
        if(data.length==0)
        {
          window.location.href="/error/User Not Authorized"
        }
      })

      
    



      
      
 
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.style.transition = 'filter 0.5s ease';
        canvas.style.filter = showQR ? 'blur(0px)' : 'blur(8px)';
      
        if(randomNumber.length!=0 && isDownload)
        {
          downloadQRCode()
        }


      }
    }, [showQR,randomNumber]);

  

  useEffect(()=>{
    getTickets().then((data)=>{

      if(data.length!=0 && !localStorage.getItem(`${event_id}TicketId`))
      {
        
            localStorage.setItem(`${event_id}TicketId`,data[0].TicketId)
            console.log("data",data)

            window.location.reload()
          
      }

     })
  },[])
    
      


    

  
  return (
    <div >
    
     <ResponsiveAppBar style={{top:'0'}} homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined" />
     <hr></hr>
     <br></br><br></br><br></br><br></br><br></br>
    
      <center>

            {!localStorage.getItem(`${event_id}TicketId`) &&   <div  style={{ border: '1px solid white',borderRadius:'20px',width:'22em',height:'25em', backgroundImage:`url(${backgroundImage})`,
    backgroundSize: 'cover', // Ensures the image covers the entire area without distortion
    backgroundPosition: 'center center', // Centers the image within the div
    backgroundRepeat: 'no-repeat',}}>

            <br></br>  <br></br>     <br></br> 
      
            <div
  ref={qrRef}
  style={{
    border: '2em solid white',
    display: 'inline-block',
    backgroundColor: 'white'
  }}
>


  <QRCodeCanvas
    value={randomNumber + localStorage.getItem('email')}
    size={200}
  />
</div>


      <br></br>  <br></br>  

      {!showQR && (
        <Button variant="outlined"
          onClick={() => {
            
            
            setShowQR(true)

            generateNumber(false)

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
         <VisibilityIcon/> &nbsp; Show 
        </Button>
      )}

    {showQR && (
        <Button

          variant="outlined"
          onClick={() => {
            
            
            setShowQR(false)

           

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
          <VisibilityOffIcon/> &nbsp; Hide 
        </Button>
      )}

  {!showQR && (
         <Button

         variant="outlined"
          onClick={() => {
            
            
           

            generateNumber(true)

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
        <DownloadIcon/> &nbsp; Download 
        </Button>
      )}

  {showQR && (
        <Button

        variant="outlined"
          onClick={() => {
            
            
           

          generateNumber(true)

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
           <DownloadIcon/> &nbsp; Download 
        </Button>
      )}
</div>}


{localStorage.getItem(`${event_id}TicketId`) &&   <div style={{ border: '1px solid white',borderRadius:'20px',width:'22em',height:'25em', backgroundImage:`url(${backgroundImage})`,
    backgroundSize: 'cover', // Ensures the image covers the entire area without distortion
    backgroundPosition: 'center center', // Centers the image within the div
    backgroundRepeat: 'no-repeat',}} // Prevents repeating of the image}}>
      >

<br></br>  <br></br>     <br></br> 

      <div ref={qrRef} style={{border: '2em solid white',
    display: 'inline-block',
    backgroundColor: 'white'}}>
        <QRCodeCanvas value={localStorage.getItem(`${event_id}TicketId`)} size={200}  
  quietZone={30}  />
      </div>


      <br></br>  <br></br>  

      {!showQR && (
       <Button

       variant="outlined"
          onClick={() => {
            
            
            setShowQR(true)

           

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
            <VisibilityIcon/>  &nbsp;  Show 
        </Button>
      )}

    {showQR && (
         <Button

         variant="outlined"
          onClick={() => {
            
            
            setShowQR(false)

           

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
          <VisibilityOffIcon/> &nbsp; Hide 
        </Button>
      )}

  
<Button

variant="outlined"
          onClick={() => {
            
            
           

            downloadQRCode()

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
          <DownloadIcon/> &nbsp; Download
        </Button>
  
<br></br><br></br><br></br>

 
</div>}
          

</center>


    </div>
  )
}

export default QR
