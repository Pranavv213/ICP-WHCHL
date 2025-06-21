import React,{useState,useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import { useOkto } from "okto-sdk-react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from '../assets/images/logo.png'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeIcon from '@mui/icons-material/Home';
import PaidIcon from '@mui/icons-material/Paid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';
import './ResponsiveAppBar.css'
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ToastContainer, toast } from 'react-toastify';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { ethers } from "ethers";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import StorefrontIcon from '@mui/icons-material/Storefront';
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

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const usersCollectionRef1 = collection(db, "user");



function ResponsiveAppBar({homeButtonStyle,earnButtonStyle,createButtonStyle,dashboardButtonStyle,chatButtonStyle,tokenButtonStyle,presaleButtonStyle}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [showDashboardDiv,setShowDashboardDiv]=useState(false)
  const [showChatDiv,setShowChatDiv]=useState(false)

   const { showWidgetModal, closeModal } = useOkto();
   const { createWallet, getUserDetails, getPortfolio } = useOkto();

   const [walletAddress, setWalletAddress] = useState(null);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

   const notifyCustom = (text,type,position) => toast(text,{
                position: position ? position : "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                type:type
               
                });

                const connectWallet = async () => {

                 

                  if((localStorage.getItem('walletAddress') && localStorage.getItem('email')==localStorage.getItem('walletAddress')))
                  {
                    return;
                  }


                  else if(localStorage.getItem('walletAddress')){

                       if (!window.ethereum) {
                                            window.location.href="https://metamask.io/"
                                            return;
                                          }
                                      
                                          try {
                                            // Create provider and request accounts
                        
                                            let provider
                                            let signer
                                            let address
                                       
                                                provider = new ethers.providers.Web3Provider(window.ethereum);
                                              
                                                await provider.send("eth_requestAccounts", []);
                                                signer = provider.getSigner();
                                                address = await signer.getAddress();

                                                if(localStorage.getItem('walletAddress')==address)
                                                {
                                                  return;
                                                }

                                                 const data = await getDocs(usersCollectionRef1);
                                                                                          
                                                 let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                                               
                                                
                                                localStorage.setItem('walletAddress',address)

                                                 let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))
                                                
                                                             console.log(filteredArray)
                                                                           
                                                  const userDoc1 = doc(db, "user", filteredArray[0].id);
                                                  const newFields1 = {WalletAddress:address};
                                                     
                                                               // update
                                                     
                                                     
                                                  await updateDoc(userDoc1, newFields1);
                                               
                                                  notifyCustom('Wallet Address Updated',"success")

                                                  setTimeout(()=>{
                                                    window.location.reload()
                                                  },3000)
                        
                                              }
                                          catch (error) {
                                            console.error("Error connecting wallet:", error);
                                          } } 
                                        
                                        else{
                                          if (!window.ethereum) {
                                           window.location.href="https://metamask.io/"
                                            return;
                                          }
                                          let provider
                                          let signer
                                          let address
                                          
                                           provider = new ethers.providers.Web3Provider(window.ethereum);
                                        
                                              await provider.send("eth_requestAccounts", []);
                                              signer = provider.getSigner();
                                              address = await signer.getAddress();

                                              const data = await getDocs(usersCollectionRef1);
                                                                                          
                                              let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                                            
                                             
                                             localStorage.setItem('walletAddress',address)

                                              let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))
                                             
                                                          console.log(filteredArray)
                                                                        
                                               const userDoc1 = doc(db, "user", filteredArray[0].id);
                                               const newFields1 = {WalletAddress:address};
                                                  
                                                            // update
                                                  
                                                  
                                               await updateDoc(userDoc1, newFields1);
                                            
                                               notifyCustom('Wallet Address added to profile',"success")

                                               setTimeout(()=>{
                                                 window.location.reload()
                                               },3000)

                                        }
                                        
                                        
                                        };


  return (
    <AppBar position="static" style={{backgroundColor:'black',color:'#1876d1',position:'fixed',top:'0',zIndex:'99999999999999999999999999999999999999'}}>
      <br></br>
      <Container maxWidth="xl" style={{backgroundColor:'black',background: 'transparent', boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.5)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '20px' , border: '0.5px solid rgba(255, 255, 255,0.5)'}}>
        <Toolbar disableGutters>
         
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
            
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
           <img src={logo} style={{width:'6em'}} ></img>
           
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"

              style={{color:'#6f6aff'}}

            >
              <MenuIcon />
            </IconButton>
            <Menu 
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{
                sx: {
                  backgroundColor: 'black', // Set background to black
                  color: 'white',            // (optional) text color white so text is visible
                },
              }}
            >
             
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }} ><Button variant={homeButtonStyle} style={{color:homeButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:homeButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}} onClick={()=>{
            window.location.href="/home2"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><HomeIcon fontSize='small'/> <l>Home</l></div></Button></Typography>
                </MenuItem>
                 <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}><Button variant="outlined" style={{color:tokenButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:tokenButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}} onClick={()=>{
                    window.location.href="/token"
                  }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><RocketLaunchIcon fontSize='small'/> <l>Launch</l></div></Button></Typography>
                </MenuItem>
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}><Button variant={earnButtonStyle} style={{color:earnButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:earnButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}}onClick={()=>{
                    window.location.href="/tokenlist"
                  }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><ShowChartIcon fontSize='small'/> <l>Trade</l></div></Button></Typography>
                </MenuItem>
                 <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}><Button variant={presaleButtonStyle ? presaleButtonStyle : "outlined"}  style={{color:presaleButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:presaleButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}} onClick={()=>{
                    window.location.href="/presalelist"
                  }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><StorefrontIcon/> <l>Presale</l></div></Button></Typography>
                </MenuItem>
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}><Button variant="outlined" style={{color:'#6f6aff',border:'none'}} onClick={()=>{
                    window.location.href="/stake"
                  }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><GeneratingTokensIcon fontSize='small'/> <l>Stake</l></div></Button></Typography>
                </MenuItem>
               
                {/* <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}><Button variant={createButtonStyle} onClick={()=>{
            window.location.href="/creator"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><AddCircleOutlineIcon fontSize='small'/> <l>Create</l></div></Button></Typography>
                </MenuItem> */}

           
            
            </Menu>
          </Box>
         
          
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
             
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {/* <img src={logo} style={{width:'2em'}} ></img> */}
          
             
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            
          
          <Button variant={homeButtonStyle} style={{color:homeButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:homeButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}} onClick={()=>{
            window.location.href="/home2"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><HomeIcon fontSize='small'/> <l>Home</l></div></Button>
           {/* <Button variant={createButtonStyle} onClick={()=>{
            window.location.href="/creator"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><AddCircleOutlineIcon fontSize='small'/> <l>Create</l></div></Button> */}
          <Button variant={tokenButtonStyle ? tokenButtonStyle : 'outlined'} style={{color:tokenButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:tokenButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}} onClick={()=>{
            window.location.href="/token"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><RocketLaunchIcon fontSize='small'/> <l>Launch</l></div></Button>
          <Button variant={earnButtonStyle} style={{color:earnButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:earnButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}} onClick={()=>{
            window.location.href="/tokenlist"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><ShowChartIcon fontSize='medium'/> <l>Trade</l></div></Button>

        <Button variant={presaleButtonStyle ? presaleButtonStyle : "outlined"} style={{color:presaleButtonStyle=='contained'?'white':'#6f6aff',backgroundColor:presaleButtonStyle=='contained'?'#6f6aff':'transparent',border:'none'}} onClick={()=>{
            window.location.href="/presalelist"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><StorefrontIcon fontSize='small'/> <l>Presale</l></div></Button>
            <Button variant="outlined" style={{color:'#6f6aff',border:'none'}} onClick={()=>{
            window.location.href="/stake"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><GeneratingTokensIcon fontSize='small'/> <l>Stake</l></div></Button>
          
         
          </Box>
          <Box sx={{ flexGrow: 0 }} >

<div class="flexWala">

<Button style={{cursor:'pointer'}}><NotificationsIcon style={{color:'#6f6aff'}}/></Button>

         

         


          <Button variant='outlined' style={{color:'#6f6aff',border:'0.2px solid #6f6aff'}}
              onClick={connectWallet}
            >{localStorage.getItem('walletAddress') ?
               `${localStorage.getItem('walletAddress').slice(0, 6)}...${localStorage.getItem('walletAddress').slice(-4)}` : 'Connect Wallet'
              }</Button>

          {localStorage.getItem('email') && !localStorage.getItem('profileImg') && <Button  onClick={()=>{
            setShowDashboardDiv(true)
          }}> <Avatar src="/broken-image.jpg" /></Button>}


        {localStorage.getItem('email') && localStorage.getItem('profileImg') && <Button  onClick={()=>{
            setShowDashboardDiv(true)
          }}> <img style={{width:'3em',height:'3em',borderRadius:'50%',objectFit: 'cover'}} src={localStorage.getItem('profileImg')}/></Button>}

{showDashboardDiv &&  <div style={{
          width: '150px', 
          height: '370px',
          padding: '20px', 
          backgroundColor: 'black', 
          boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.3);',
        backdropFilter: 'blur(17.5px)',
       border:'2px solid rgb(48, 19, 90)',
          blur:'50px', 
          borderRadius:'10px',
         
          textAlign: 'center', 
          
          position: 'absolute', 
          top: '5%', 
          right: '-90px', 
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
           
        }}>
          <div style={{width:'100%',textAlign:'left',cursor:'pointer',color:'#6f6aff'}} onClick={()=>{
            setShowDashboardDiv(false)
          }}>
          <CancelIcon style={{left:'2px'}}/>
          </div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'#6f6aff'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/dashboard"
          }}><DashboardIcon/> <l>Dashboard</l></div>
          <br></br>
        

        <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'#6f6aff'}} class="dashboardDivMenu" onClick={()=>{
          window.location.href="/mytokenlist"
        }}><PaidIcon/>Created Assets</div>
        <br></br>

        <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'#6f6aff'}} class="dashboardDivMenu" onClick={()=>{
          window.location.href="/mytokenlist"
        }}><AccountBalanceWalletIcon/>Collected Assets</div>
        <br></br>
          
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'#6f6aff'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/chat"
          }}><ChatIcon/>Chats</div>
          <br></br>

        
          
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'#6f6aff'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/community"
          }}><GroupIcon/>Communities</div>
          <br></br>

          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'#6f6aff'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/rewards"
          }}><CardGiftcardIcon fontSize='small'/>Rewards</div>

            <br></br>

          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'#6f6aff'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/profilesettings"
          }}><SettingsIcon/> Profile Settings</div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer',color:'red'}} class="dashboardDivMenu" onClick={()=>{
            localStorage.clear();
            window.location.href="/oktologin"
        }}><LogoutIcon/> Logout</div>
      
        </div>}

      {!localStorage.getItem('email') && !localStorage.getItem('profileImg') && <Button  onClick={()=>{
            window.location.href="/oktologin"
          }}> <Button variant='outlined'>Login</Button></Button>}

         
          



          
            </div>
          </Box>
        </Toolbar>
      </Container>


      

        {showChatDiv &&  <div style={{
          width: '150px', 
          height: '120px',
          padding: '20px', 
          backgroundColor: 'black', 
          boxShadow: '0 8px 32px 0 rgba(74, 34, 148, 0.3);',
        backdropFilter: 'blur(17.5px)',
       border:'2px solid rgb(48, 19, 90)',
          blur:'50px', 
          borderRadius:'10px',
          textAlign: 'center', 
           
          position: 'absolute', 
          top: '5%', 
          right: '5px', 
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
           
        }}>
          <div style={{width:'100%',textAlign:'left',cursor:'pointer'}} onClick={()=>{
            setShowChatDiv(false)
          }}>
          <CancelIcon style={{left:'2px'}}/>
          </div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/chat"
          }}><l>Chat</l></div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/community"
          }}> Community</div>
          
      
        </div>}

<ToastContainer/>
    </AppBar>
  );
}
export default ResponsiveAppBar;


//Hare Krishna