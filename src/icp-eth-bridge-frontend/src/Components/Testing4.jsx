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
  serverTimestamp,
  Timestamp
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



function Testing4() {

  const tweetText = "Check out this awesome project! 🚀 #ReactJS #OpenAI";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;



    const addUser=async()=>{

         const data = await getDocs(collection(db,"user"));
                              
               
         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
         let result = '';
         const charactersLength = characters.length;
         for (let i = 0; i < 6; i++) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
         }
         
         const width = 600; // You can change the width
         const height = 400; // You can change the height
         const randomImageUrl = `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
                               
              
                            
              
                await addDoc(collection(db,"user"), { Email:`${result}@gmail.com`, Coins: 100, EventsCreated: [], EventsRegistered: [], EventsApproved:[],EventsAttended: [],UserName:result,ProfileImage:randomImageUrl});
               


    }


    const addRandomDateTimetoEvents = async () => {
      const data = await getDocs(collection(db, "events"));
  
      let eventsTemp = await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
      for (let i = 0; i < eventsTemp.length; i++) {
          // Random offset within 4 hours (0 to 4 hours in ms)
          const randomOffset = Math.random() * 4 * 60 * 60 * 1000; // 4 hours in ms
          const randomTime = dayjs(Date.now() - randomOffset).format("YYYY-MM-DD HH:mm:ss");
  
          const userDoc = doc(db, "events", eventsTemp[i].id);
          const newFields = { Timestamp: randomTime };
  
          await updateDoc(userDoc, newFields);
      }
  };
  

   const addCoinstoEvents=async()=>{

    const data = await getDocs(collection(db,"events"));

     
                                       
    let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

    

    for(let i=0;i<eventsTemp.length;i++)
    {

       

        const userDoc = doc(db, "events",eventsTemp[i].id);
           
                       
        const newFields = {Coins:eventsTemp[i].RegistrationsCount*1000+100};

        await updateDoc(userDoc, newFields);

    }


    
   

}


const addSpecificImagesToEvents = async () => {
  const data = await getDocs(collection(db, "events"));

  let eventsTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  // Your specific images list
 

  
  const specificImages = [
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyNiBKdWw%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00438839-bvfgnglcuw-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNCBKdW4%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00441959-rwznwbccqt-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCA3IEp1bg%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00392009-jxvnjshmlw-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNCBKdW4gb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00441613-ugzmwxbxhp-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxMiBKdWw%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00442637-lzkfkjeztp-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxMiBKdWwgb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355125-hmdapfnykq-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNCBKdW4gb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00329412-dbdvwxsanp-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAyMCBKdW4%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00331714-mudxptvjha-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNCBKdW4%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00424117-gzrdrrtbdc-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxMCBBdWc%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00447081-ndpgfpbfde-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-TW9uLCAyIEp1biBvbndhcmRz,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00415255-rabcycarym-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCA3IEp1bg%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00397951-ambmadvqcg-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-V2VkLCA0IEp1bg%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00402369-qrzvfscwkm-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCA2IEp1biBvbndhcmRz,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00345989-yuvthqzlbu-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNSBKdW4%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00393085-urmrarvqxe-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-V2VkLCAxMSBKdW4%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00402548-lcbsmzarlh-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCA3IEp1bg%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00408882-uwzuffbetf-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyMSBKdW4%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00440526-bnwgxansvl-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxMiBKdWw%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00447295-kxrwgdjanz-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAyNSBKdWwgb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-image,i-discovery-catalog@@icons@@bundle-icon-shadow-4x.png,lx-15,ly-15,w-50,l-end/et00364778-fatkhpaggq-portrait.jpg"
  ];
  
  
 
  
  let previousIndex = -1; // Initialize with a value that cannot be a valid index

  for (let i = 0; i < eventsTemp.length; i++) {
    let a;
    do {
      a = Math.floor(Math.random() * (specificImages.length - 1)) + 1;
    } while (a === previousIndex); 
  
    previousIndex = a; 
  
   
    const imageUrl = specificImages[i%specificImages.length] || null;
  
    const userDoc = doc(db, "events", eventsTemp[i].id);
    const newFields = { Image: imageUrl, Category:'Standup' };
  
    await updateDoc(userDoc, newFields);
  }
  
};

const addSpecificNamesToEvents = async () => {
  const data = await getDocs(collection(db, "events"));

  let eventsTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  // Your specific images list
 

  
  const comedyShows = [
    "Chai Pe Charcha (Comedy Edition)",
    "The Gupshup Show",
    "Masala Mix LOL",
    "Desi Jokes Junction",
    "Laughter ke Laddoos",
    "Jhakaas Jokes",
    "Comedy ka Dhamaka",
    "Pataka Punchlines",
    "Nakhra Nights",
    "Bhukkad Bakchodi",
    "Nonsense Nukkad",
    "Andaaz-e-Laughter",
    "Full-On Nautanki",
    "Lassi & Laughter",
    "Garam Garam Gags",
    "Taco & Tequila Tickle",
    "Sushi & Slapstick",
    "LOL in Paris",
    "Berlin Belly Laughs",
    "Kangaroo Kicks & Giggles",
    "Mamma Mia Masti",
    "Espresso Express Laughs",
    "Russian Roulette of Jokes",
    "Global Guffaws",
    "Worldwide Wackiness",
    "Raita Phail Gaya",
    "LOL After Dark",
    "The Great Bakra Show",
    "Jokes from the Jhopdi",
    "Bindaas Bakchodi",
    "Tamasha Tales",
    "Laughter ka Lota",
    "Khaas Baat with Kicks",
    "Jugaadu Jesters",
    "Shaadi ke Side Effects (of Laughs)",
    "Paka Mat Yaar",
    "Bawaseer of Banter",
    "The Comedy Curry",
    "Spicy Stand-Up",
    "Dilli ka Drama",
    "Mic Me Maro",
    "Galliyan & Giggles",
    "The Bakchod Brigade",
    "Ha Ha, Gaali Gaali",
    "Rant Room Rascals",
    "Masti Mein Gaali",
    "Swag Wali Satire",
    "The No Filter Show",
    "Full Power PJs",
    "Reality ke Rascals",
    "Masaledaar Mic Nights",
    "The Stand-Up Dhaba",
    "Roti, Rum & Rants",
    "Shudh Desi Laughter",
    "Hatt ke Humor",
    "Biryani Banter",
    "Jokes ka Jugaad",
    "Bakchodi Bar",
    "Apna Time Aayega… of LOL",
    "The LOL Bazaar",
    "Chappal Comedy",
    "Pind ke Punchlines",
    "The Totla Tadka Show",
    "The Bindaas Bhukkad",
    "Laugh Ki Dukaan",
    "Jhakaas Josh",
    "Ullu de Patthe (comedy edition)",
    "The Kebab Kicks",
    "Nonsense ka Nukkad",
    "Andaaz Apna LOL",
    "Mirchi Masti",
    "Masaledaar Mockery",
    "Hot & Spicy Humor",
    "Tadke Wale Jokes",
    "Chutney & Chuckles",
    "Bhaiyon Ki Bakchodi",
    "Raita Comedy Club",
    "Masti Ki Mehfil",
    "LOL ki Shaam",
    "Chulbuli Chuckles",
    "The Desi Roast Show",
    "Jugaad-e-Comedy",
    "Laughter Langar",
    "Desi Stand-Up Diaries",
    "Laughter Mein Twist",
    "Baat Ban Gayi!",
    "Shaam-e-Laughter",
    "Masala Mic Madness",
    "Desi Mic Drop",
    "Bindaas Banter",
    "Oye Hoye, LOL",
    "Bakchod Baithak",
    "The Mehfil of Masti",
    "Swaad Anusaar",
    "LOL-e-Mandi",
    "Desi Dose of Laughs",
    "Mic Pe Masti",
    "Kaafi Crazy",
    "Laughter ki Baaraat",
    "Jhakaas Jamboree"
  ];
  
  
 
  
  let previousIndex = -1; // Initialize with a value that cannot be a valid index

  for (let i = 0; i < eventsTemp.length; i++) {
    let a;
    do {
      a = Math.floor(Math.random() * (comedyShows.length - 1)) + 1;
    } while (a === previousIndex); // Repeat if it's the same as the previous
  
    previousIndex = a; // Update previous index
  
    // Get the specific image for the current event (or fallback to null if not enough images)
    const name = comedyShows[a].trim().split(" ").slice(0, -1).join(" ") || null;
  
    const userDoc = doc(db, "events", eventsTemp[i].id);
    const newFields = { Name: name};
  
    await updateDoc(userDoc, newFields);
  }
  
};

const addSpecificCategoryToEvents = async () => {
  const data = await getDocs(collection(db, "events"));

  let eventsTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  // Your specific images list
 

  
  const category = [
   
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
  ];
  
  
 
  
  let previousIndex = -1; // Initialize with a value that cannot be a valid index

  const imageUrls = [
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyNiBKdWw%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00438839-bvfgnglcuw-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNCBKdW4%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00441959-rwznwbccqt-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCA3IEp1bg%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00392009-jxvnjshmlw-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxMCBBdWc%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00447081-ndpgfpbfde-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxMiBKdWw%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00442637-lzkfkjeztp-portrait.jpg"
  ];
  

  for (let i = 0; i < eventsTemp.length; i++) {
   
 
  
    const userDoc = doc(db, "events", eventsTemp[i].id);

    if(imageUrls.includes(eventsTemp[i].Image))
    {
      const newFields = { Category: "Concert"};
  
      await updateDoc(userDoc, newFields);
    }
    else
    {
      const newFields = { Category: "Standup"};
  
      await updateDoc(userDoc, newFields);
    }
    
  }
  
};

const addMovies=async()=>{
 

  const movies = [
    {
      Title: "Demented",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1744328908/amc-cdn/production/2/movies/79400/79436/PosterDynamic/170735.jpg"
    },
    {
      Title: "The Rituals",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1746645734/amc-cdn/production/2/movies/79500/79517/PosterDynamic/171285.jpg"
    },
    {
      Title: "Dan Da Dan",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1744041310/amc-cdn/production/2/movies/80000/79957/PosterDynamic/170404.jpg"
    },
    {
      Title: "Bring Her Back",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1746826558/amc-cdn/production/2/movies/79500/79459/PosterDynamic/171320.jpg"
    },
    {
      Title: "Mission Impossible",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1744040840/amc-cdn/production/2/movies/59500/59505/PosterDynamic/170393.jpg"
    },
    {
      Title: "Lilo and Stitch",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1746540045/amc-cdn/production/2/movies/72500/72470/PosterDynamic/171252.jpg"
    },
    {
      Title: "Final Destination",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1746755483/amc-cdn/production/2/movies/79000/78990/PosterDynamic/171305.jpg"
    },
    {
      Title: "The Thunderbolts",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1746461039/amc-cdn/production/2/movies/67500/67481/PosterDynamic/171249.jpg"
    },
    {
      Title: "Ballerina",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1745939726/amc-cdn/production/2/movies/73200/73197/PosterDynamic/171162.jpg"
    },
    {
      Title: "Karate Kid",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1729259508/amc-cdn/production/2/movies/71200/71237/PosterDynamic/167674.jpg"
    },
    {
      Title: "Friendship",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1740756588/amc-cdn/production/2/movies/79600/79556/PosterDynamic/169946.jpg"
    },
    {
      Title: "The Pheonician Sceme",
      Image: "https://amc-theatres-res.cloudinary.com/image/upload/c_limit,w_272/f_auto/q_auto/v1748874458/amc-cdn/production/2/movies/79500/79486/PosterDynamic/171620.jpg"
    }
  ];
  // const data = await getDocs(collection(db, "movies"));

  // let moviesTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  for(let i=0;i<movies.length;i++)
  {
    // let a= Math.floor(Math.random() * (movies.length - 1)) + 1;

    const randomDate = dayjs().subtract(Math.random() * 7 * 24 * 60 * 60 * 1000, 'millisecond').format("YYYY-MM-DD HH:mm:ss");

    // const userDoc = doc(db, "movies", moviesTemp[i].id);
    // deleteDoc(userDoc)


    await addDoc(collection(db, "movies"), { Name:movies[i%movies.length].Title ,Registrations:[],AttendeesCount:0,RegistrationsCount:0,Image:movies[i%movies.length].Image,Timestamp:randomDate,Coins:100 });
    
  }




}

const addCreatorToMovies = async () => {
  const data = await getDocs(collection(db, "movies"));

  let moviesTemp = await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  for (let i = 0; i < moviesTemp.length; i++) {
     

      const userDoc = doc(db, "movies", moviesTemp[i].id);
      const newFields = { Creator:'events.connectverse@gmail.com'};

      await updateDoc(userDoc, newFields);
  }
};

const deleteUserData=async()=>{

  const data = await getDocs(collection(db, "user"));

  let usersTemp = await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  for (let i = 0; i < usersTemp.length; i++) {
     

      const userDoc = doc(db, "user", usersTemp[i].id);

      if(usersTemp[i].Email!='quantumworld394@gmail.com')
      {
        const newFields = { EventsRegistered:[],EventsCreated:[], EventsApproved:[],EventsAttended:[]};

      await updateDoc(userDoc, newFields);
      }
      
  }

}

const deleteEventsData=async()=>{

  const data = await getDocs(collection(db, "user"));

  let usersTemp = await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  for (let i = 0; i < usersTemp.length; i++) {
     

      const userDoc = doc(db, "user", usersTemp[i].id);

     
    
        const newFields = { EventsRegistered:[],EventsCreated:[], EventsApproved:[],EventsAttended:[]};

      await updateDoc(userDoc, newFields);
     
      
  }

}



  return (
    <div>
      
<br></br>

      <button onClick={()=>{
        addUser()
      }}>Add Random User</button>
      <br></br>

      <button onClick={()=>{
       addRandomDateTimetoEvents()
      }}>Set Ramdom Timestamp to all events</button>


<button onClick={()=>{
       addCoinstoEvents()
      }}>Set Coins to Events</button>


<button onClick={()=>{
       addSpecificImagesToEvents()
      }}>Add Specific images to all events</button>

<button onClick={()=>{
      addSpecificNamesToEvents()
      }}>Add Specific names to all events</button>


<button onClick={()=>{
     addSpecificCategoryToEvents()
      }}>Add Specific category to all events</button>
      
      <button onClick={()=>{
     addMovies()
      }}>Add Movies</button>

<button onClick={()=>{
     addCreatorToMovies()
      }}>Add Creator to Movies</button>

      <button onClick={()=>{
    deleteUserData()
      }}>Delete User Data</button>

      
<br></br>
    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
  <button>Share on LinkedIn</button>
</a>

    </div>

  
  )
}

export default Testing4
