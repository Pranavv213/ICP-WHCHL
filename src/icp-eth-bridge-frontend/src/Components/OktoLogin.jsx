import React, { useState, useRef, useEffect } from 'react'
import { useOkto } from "okto-sdk-react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import logo from '../assets/images/logo.png'
import { ToastContainer, toast } from 'react-toastify';
import { signInWithGoogle } from "../firebase-config";
import { ethers } from "ethers";
import metamask from '../assets/images/metamask.png'
import eventBackgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import { db } from "../firebase-config";
import { collection } from "firebase/firestore";
import { AuthClient } from "@dfinity/auth-client";
import icplogo from '../assets/images/icplogo.png'
import powered from '../assets/images/powered.png'

const usersCollectionRef1 = collection(db, "user");

// Styled Components
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:#0F0F1A;
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: white;
  overflow: hidden;
  position: relative;
`;

const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.15;
  z-index: 0;
`;

const ContentWrapper = styled.div`
 
  top:50px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem;
`;

const NavBar = styled.div`
  width: 100%;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 5, 36, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(113, 47, 255, 0.3);
  z-index: 2;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  background: white;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const GlowCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  background: #1F1E3A !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(113, 47, 255, 0.2) !important;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
              0 0 20px rgba(113, 47, 255, 0.1),
              0 0 30px rgba(113, 47, 255, 0.1) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
  
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 
                0 0 30px rgba(113, 47, 255, 0.2),
                0 0 40px rgba(113, 47, 255, 0.2) !important;
  }
`;

const CardHeader = styled.div`
  padding: 2rem 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(113, 47, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.5);
  
  &:before, &:after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(113, 47, 255, 0.5), transparent);
  }
  
  &:before {
    margin-right: 1rem;
  }
  
  &:after {
    margin-left: 1rem;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: 50px;
  background: white;
  color: #444;
  fontSize:16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f1f1f1;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const MetaMaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: 50px;
  background: linear-gradient(90deg, #f6851b, #e2761b);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: linear-gradient(90deg, #e2761b, #d66913);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const Particle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(113, 47, 255, 0.3);
  z-index: 0;
`;

function OktoLogin() {
  const { createWallet, getUserDetails, getPortfolio, authenticate } = useOkto();
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();
  const buttonBRef = useRef(null);
  const [walletAddress, setWalletAddress] = useState(null);

  // Create particles for background
  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.particle-container');
      if (!container) return;
      
      container.innerHTML = '';
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        particle.classList.add('particle');
        container.appendChild(particle);
      }
    };
    
    createParticles();
    notify();
    
    // Add resize listener to recreate particles on resize
    window.addEventListener('resize', createParticles);
    return () => window.removeEventListener('resize', createParticles);
  }, []);

  const handleButtonClickA = () => {
    if (buttonBRef.current) {
      buttonBRef.current.click();
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      localStorage.setItem("email", address);
      localStorage.setItem('walletAddress', address);
      window.location.href = "/home";
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const notify = () => toast("Sign in to start earning!", {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    type: 'default'
  });

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    authenticate(idToken, (authResponse, error) => {
      if (authResponse) {
        setAuthToken(authResponse.auth_token);
        console.log("Authenticated successfully, auth token:", authResponse.auth_token);
        navigate('/home');
      } else if (error) {
        console.error("Authentication error:", error);
      }
    });
  };

  const [principal, setPrincipal] = useState("");

  const handleShowPrincipal = async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());

      localStorage.setItem("email", principal.toString());
      localStorage.setItem('walletAddress', principal.toString());
      window.location.href = "/home";
    } else {
      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: "https://identity.ic0.app",
          onSuccess: resolve,
          onError: reject,
        });
      });
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());

      localStorage.setItem("email", principal.toString());
      localStorage.setItem('walletAddress', principal.toString());
      window.location.href = "/home";
    }
  };

  return (
    <PageContainer>
      <div className="particle-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden'
      }} />
      
      <VideoBackground autoPlay loop muted playsInline>
        <source src={eventBackgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>
      
    
      
      <ContentWrapper>
        {!authToken ? (
          <GlowCard>
            <CardHeader>
              <IconWrapper>
                <PersonAddIcon fontSize="large" style={{ color: '#9c4dff' }} />
              </IconWrapper>
            </CardHeader>
            <CardContent>
              <h2 style={{ 
                color: 'white', 
                textAlign: 'center',
                marginBottom: '0.5rem',
               
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                
              }}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
               <l> Welcome to</l>  <img src={logo} style={{ width: '4em', marginRight: '0.5em' }} alt="Logo" />
               </div>
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: '0.9rem'
              }}>
                Please sign in to begin <b> Entertainment </b>
              </p>
              
              {/* <GoogleButton onClick={signInWithGoogle}>
                <ButtonIcon src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" />
                Sign in with Google
              </GoogleButton>
              <br></br> */}
              <button onClick={handleShowPrincipal} style={{display:'flex',alignItems:'center',gap:'10px' ,width:'100%',height:'4em',borderRadius:'50px',border:'1px solid #9c4dff',justifyContent:'center',fontFamily:'circular',fontSize:'16px'}} ><img src={icplogo} style={{ width: '2em' }} alt="Logo" />Login with Internet Identity</button>
              {principal && <div>Your Principal: {principal}</div>}
              <Divider>or</Divider>
              
              <MetaMaskButton onClick={connectWallet}>
                <ButtonIcon src={metamask} />
                Connect with MetaMask
              </MetaMaskButton>
              <br></br><br></br>
              <img src={powered} style={{ width: '15em' }} alt="Logo" />
            </CardContent>
          </GlowCard>
        ) : (
          <p>Authenticated</p>
        )}
      </ContentWrapper>
      
      <ToastContainer />
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-50px) translateX(20px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </PageContainer>
  );
}

export default OktoLogin;