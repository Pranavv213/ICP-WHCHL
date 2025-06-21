import React, { useEffect,useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import logo from '../assets/images/logo.png'





// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
  }

  body {
    background-color: #0a0a0a;
    color: #e0e0e0;
    overflow-x: hidden;
  }

  @font-face {
    font-family: 'Inter';
    src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  }
`;


const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
};

const device = {
  mobile: `(max-width: ${breakpoints.sm})`,
  tablet: `(max-width: ${breakpoints.md})`,
  laptop: `(max-width: ${breakpoints.lg})`,
  desktop: `(max-width: ${breakpoints.xl})`
};


// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const particlePop = keyframes`
  0% { transform: translate(0, 0) scale(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Base Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
`;

const Hexagon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  svg {
    width: 24px;
    height: 24px;
    fill: #ec4899;
  }
`;

// Layout Components
const FanFiWrapper = styled.div`
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 40%);
`;

const BlurCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: -1;
  opacity: 0.3;

  &:nth-child(1) {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
    top: -300px;
    left: -300px;
  }

  &:nth-child(2) {
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, #ec4899 0%, transparent 70%);
    bottom: -400px;
    right: -400px;
  }

  &:nth-child(3) {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const FloatingTokens = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`;

const FloatingToken = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  opacity: 0.6;
  top: ${props => props.top || '10%'};
  left: ${props => props.left || '20%'};
  animation: ${float} ${props => props.duration || '15s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    filter: blur(5px);
    opacity: 0.5;
  }
`;

// Navbar



// Navbar Component
const Navbar = styled.nav`
  padding: 24px 0;
  position: relative;
  z-index: 100;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavbarBrand = styled.div`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const NavbarLinks = styled.div`
  display: flex;
  gap: 32px;

  a {
    color: #e0e0e0;
    text-decoration: none;
    font-weight: 500;
    position: relative;
    transition: color 0.3s ease;

    &:hover {
      color: #ec4899;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #8b5cf6, #ec4899);
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    display: none; // Hide links by default on mobile
    flex-direction: column;
    position: absolute;
    top: 60px; // Position below the navbar
    right: 0;
    background: #0a0a12; // Background color for dropdown
    width: 100%;
    padding: 16px 0;
    gap: 16px;
    z-index: 99;
  }
`;

const NavbarCTA = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #db2777);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
  }
`;

const HamburgerMenu = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  div {
    width: 30px;
    height: 3px;
    background: #e0e0e0;
    margin: 4px 0;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    display: flex; // Show hamburger menu on mobile
  }
`;

const NavbarDropdown = styled(NavbarLinks)`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')}; // Toggle visibility
`;



const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background: #2c3e50;
  padding: 1rem;
 
`;

const Logo = styled.a`
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.7rem;
  
  &:hover {
    color: #ecf0f1;
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  
  span {
    height: 2px;
    width: 25px;
    background: #fff;
    margin-bottom: 4px;
    border-radius: 5px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    overflow: hidden;
    flex-direction: column;
    width: 100%;
    max-height: ${({ isOpen }) => (isOpen ? "300px" : "0")};
    transition: max-height 0.3s ease-in;
  }
`;

const MenuLink = styled.a`
  padding: 1rem 2rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: #ecf0f1;
  transition: all 0.3s ease-in;
  font-size: 0.9rem;
  
  &:hover {
    color: #3498db;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
  }
`;
 




// Hero Section





const HeroSection = styled.section`
  padding: 120px 0 180px;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 0 100px;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 600px;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const HeroTitle = styled.h1`
  font-size: 72px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;

  span {
background: linear-gradient(135deg, #1a1a40, #6F6AFF,rgb(195, 194, 241), #1a1a40);

 
 





    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    opacity: 0;
    transform: translateY(20px);
    
    &:nth-child(1) {
      animation: ${fadeIn} 0.8s ease forwards 0.2s;
    }
    
    &:nth-child(2) {
      animation: ${fadeIn} 0.8s ease forwards 0.4s;
    }
  }

  @media (max-width: 768px) {
    font-size: 48px; // Adjust font size for smaller screens
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: #a1a1aa;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeIn} 0.8s ease forwards 0.6s;

  @media (max-width: 768px) {
    font-size: 16px; // Adjust font size for smaller screens
    margin-bottom: 24px; // Adjust margin for smaller screens
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeIn} 0.8s ease forwards 0.8s;

  @media (max-width: 768px) {
    flex-direction: column; // Stack buttons on smaller screens
    align-items: center;
  }
`;

const LaunchAppButton = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #db2777);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%; // Full width on smaller screens
    padding: 12px; // Adjust padding for smaller screens
  }
`;

const WhitepaperButton = styled.button`
  background: transparent;
  color: #e0e0e0;
  border: 1px solid #3f3f46;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #8b5cf6;
    color: #8b5cf6;
  }

  @media (max-width: 768px) {
    width: 100%; // Full width on smaller screens
    padding: 12px; // Adjust padding for smaller screens
  }
`;

const ButtonParticles = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Particle = styled.span`
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;

  ${({ angle, delay }) => css`
    --tx: calc(cos(${angle} * 1deg) * 30px);
    --ty: calc(sin(${angle} * 1deg) * 30px);
    animation: ${particlePop} 0.8s ease-out ${delay}s infinite;
  `}
`;

const HeroVisual = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%; // Full width on smaller screens
    position: relative; // Change position for smaller screens
    top: auto; // Reset top position
    transform: none; // Reset transform
  }
`;

const TokenOrb = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 300px; // Adjust size for smaller screens
    height: 300px; // Adjust size for smaller screens
  }
`;

const OrbCore = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%);
  filter: blur(20px);
  animation: ${pulse} 4s ease-in-out infinite;
`;

const OrbRing = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(139, 92, 246, 0.5);
  animation: ${float} 8s ease-in-out infinite;

  &:nth-child(1) {
    width: 300px;
    height: 300px;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 400px;
    height: 400px;
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    width: 500px;
    height: 500px;
    animation-delay: 1s;
  }
`;

const OrbParticle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  filter: blur(2px);
  animation: ${float} 6s ease-in-out infinite;

  &:nth-child(1) {
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    top: 60%;
    left: 70%;
    animation-delay: 1s;
  }

  &:nth-child(3) {
    top: 30%;
    left: 50%;
    animation-delay: 2s;
  }
`;

const FloatingCards = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px; // Space between cards
`;

const FloatingCard = styled.div`
  position: relative;
  width: 120px;
  height: 160px;
  background: rgba(24, 24, 27, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
  z-index: 2;

  span {
    display: block;
    text-align: center;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
    border-radius: inherit;
    z-index: -1;
  }

  &.card-1 {
    animation: ${fadeIn} 0.8s ease forwards 0.3s;
    align-self: flex-start;
   margin-top: 20px;
     @media (max-width: 768px) {
    align-self: flex-start;
  }
  }

  &.card-2 {
    animation: ${fadeIn} 0.8s ease forwards 0.5s;
    align-self: center;
    margin-top: 20px; // Adjust spacing to prevent overlap
    @media (max-width: 768px) {
    align-self: center;
  }
  }

  &.card-3 {
    animation: ${fadeIn} 0.8s ease forwards 0.7s;
    align-self: flex-end;
    margin-top: 20px; // Adjust spacing to prevent overlap
  }


`;

// Stats Section
const StatsSection = styled.section`
  padding: 100px 0;
  position: relative;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeIn} 0.8s ease forwards;

  h2 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 16px;

    span {
      background: linear-gradient(90deg, #8b5cf6, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  p {
    font-size: 18px;
    color: #a1a1aa;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const StatItem = styled.div`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeIn} 0.8s ease forwards ${props => props.delay || '0s'};

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(139, 92, 246, 0.3);
  }

  h3 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 16px;
    color: white;
  }

  p {
    color: #a1a1aa;
    line-height: 1.6;
  }

  .stat-value {
    color: #ec4899;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 100px 0;
  position: relative;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const FeatureCard = styled.div`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeIn} 0.8s ease forwards ${props => props.delay || '0s'};

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(139, 92, 246, 0.3);
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: white;
  }

  p {
    color: #a1a1aa;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .feature-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    transition: width 0.5s ease;
  }

  &:hover .feature-underline {
    width: 100%;
  }
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 100px 0;
  position: relative;
`;

const StepsContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 0;
`;

const StepLine = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  z-index: 1;
`;

const Step = styled.div`
  position: relative;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  z-index: 2;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeIn} 0.8s ease forwards ${props => props.delay || '0s'};

  &:nth-child(odd) {
    flex-direction: row-reverse;
    text-align: right;

    .step-content {
      margin-right: 40px;
      margin-left: 0;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
`;

const StepContent = styled.div`
  margin-left: 40px;

  h3 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
    color: white;
  }

  p {
    color: #a1a1aa;
    line-height: 1.6;
  }
`;

const StepVisual = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
    z-index: -1;
  }
`;

// Tokenomics Section
const TokenomicsSection = styled.section`
  padding: 100px 0;
  position: relative;
`;

const TokenomicsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TokenPie = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    #8b5cf6 0% 40%,
    #ec4899 40% 60%,
    #3b82f6 60% 85%,
    #f472b6 85% 100%
  );
  animation: ${pulse} 4s ease-in-out infinite;

  .pie-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #18181b;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    color: white;
    font-size: 18px;
  }
`;

const TokenLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 30px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;

    &.color-1 {
      background: #8b5cf6;
    }
    &.color-2 {
      background: #ec4899;
    }
    &.color-3 {
      background: #3b82f6;
    }
    &.color-4 {
      background: #f472b6;
    }
  }

  span {
    color: #a1a1aa;
  }
`;

const TokenomicsFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  flex: 1;
`;

const FeatureItem = styled.div`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border-color: rgba(139, 92, 246, 0.3);
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 16px 0 8px;
    color: white;
  }

  p {
    color: #a1a1aa;
    line-height: 1.6;
    font-size: 14px;
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(139, 92, 246, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 24px;
      height: 24px;
      fill: #8b5cf6;
    }
  }
`;

// Community Section
const CommunitySection = styled.section`
  padding: 100px 0;
  position: relative;
`;

const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const CommunityCard = styled.div`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeIn} 0.8s ease forwards ${props => props.delay || '0s'};

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(139, 92, 246, 0.3);
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 20px 0 10px;
    color: white;
  }

  p {
    color: #a1a1aa;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .card-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

    svg {
      width: 36px;
      height: 36px;
      fill: #8b5cf6;
    }
  }

  .community-link {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    color: white;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
    }
  }
`;

// Final CTA Section
const FinalCTASection = styled.section`
  padding: 120px 0;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  position: relative;
  overflow: hidden;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30,10 L50,30 L70,10" fill="none" stroke="rgba(139, 92, 246, 0.05)" stroke-width="1"/></svg>');
    opacity: 0.3;
    z-index: -1;
  }

  h2 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 24px;

    span {
      background: linear-gradient(90deg, #8b5cf6, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  p {
    font-size: 18px;
    color: #a1a1aa;
    max-width: 600px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }
`;

// Footer
const Footer = styled.footer`
  padding: 80px 0 40px;
  background: #09090b;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const FooterBrand = styled.div`
  max-width: 300px;

  .logo-gradient {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    margin-bottom: 16px;
  }

  p {
    color: #a1a1aa;
    line-height: 1.6;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 60px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 30px;
  }
`;

const LinkGroup = styled.div`
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin-bottom: 16px;
  }

  a {
    display: block;
    color: #a1a1aa;
    margin-bottom: 12px;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #8b5cf6;
    }
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
  border-top: 1px solid #3f3f46;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;

  a {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(139, 92, 246, 0.2);
      transform: translateY(-2px);

      svg {
        fill: #8b5cf6;
      }
    }

    svg {
      width: 20px;
      height: 20px;
      fill: #a1a1aa;
      transition: fill 0.3s ease;
    }
  }
`;

const Copyright = styled.div`
  color: #a1a1aa;
  font-size: 14px;
`;


// FanFiEnhanced Component
const FanFiEnhanced = () => {


  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY === 0 && window.location.href!='https://v2-six-puce.vercel.app/' && window.location.href!='http://localhost:3000/') {

      
     window.location.href="/"
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
});

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
    

      <GlobalStyle />
      <FanFiWrapper>
        {/* Background Elements */}
        <BlurCircle />
        <BlurCircle />
        <BlurCircle />
        
        <FloatingTokens>
          {[...Array(12)].map((_, i) => (
            <FloatingToken 
              key={i}
              top={`${Math.random() * 100}%`}
              left={`${Math.random() * 100}%`}
              delay={`${i * 0.5}`}
              duration={`${10 + Math.random() * 20}`}
            />
          ))}
        </FloatingTokens>

        {/* Navbar */}


       <Nav style={{backgroundColor:'black',color:'#1876d1',position:'fixed',width:'100%',border:'0.5px solid grey',borderRadius:'20px',zIndex:999999999}}>
      <Logo href="#"><img src={logo} style={{width:'4em'}}></img></Logo>
      <Hamburger onClick={() => setIsOpen(!isOpen)}>
        <span />
        <span />
        <span />
      </Hamburger>
      <Menu isOpen={isOpen}>
        <MenuLink href="/">Home</MenuLink>
        <MenuLink href="#features">Features</MenuLink>
        <MenuLink href="#how-it-works">How it Works</MenuLink>
        <MenuLink href="#community">Community</MenuLink>
      </Menu>
    </Nav>
    <br></br>   <br></br>   <br></br>   <br></br>   <br></br>

        {/* Hero Section */}
        <HeroSection>
          <Container>
            <HeroContent>
              <HeroTitle>
                <span>Tokenizing</span>
                <span>Entertainment</span>
              </HeroTitle>
              <HeroSubtitle>The decentralized platform where creators tokenize their IP and fans become stakeholders
              </HeroSubtitle>
              <CTAButtons>
                <LaunchAppButton onClick={()=>{
                  window.location.href="/home2"
                }}>
                  Launch App
                  <ButtonParticles>
                    {[...Array(12)].map((_, i) => (
                      <Particle key={i} angle={i * 30} delay={i * 0.05} />
                    ))}
                  </ButtonParticles>
                </LaunchAppButton>
                <WhitepaperButton onClick={()=>{
                  window.location.href="https://drive.google.com/file/d/1Bne9AyNAra_UGTHa1fnx13xWa-Cx-THT/view"
                }}>Download Whitepaper</WhitepaperButton>
              </CTAButtons>
            </HeroContent>
            <br></br> <br></br>
            <HeroVisual>
              <TokenOrb>
                <OrbCore />
                <OrbRing />
                <OrbRing />
                <OrbRing />
                <OrbParticle />
                <OrbParticle />
                <OrbParticle />
              </TokenOrb>
              <FloatingCards>
                <FloatingCard className="card card-1 animate-on-scroll" data-delay="0.3s">
                  <span>FIP</span>
                  <span>Token</span>
                </FloatingCard>
                <FloatingCard className="card card-2 animate-on-scroll" data-delay="0.5s">
                  <span>LP</span>
                  <span>Staking</span>
                </FloatingCard>
                <FloatingCard className="card card-3 animate-on-scroll" data-delay="0.7s">
                  <span>Web3</span>
                  <span>Ticketing</span>
                </FloatingCard>
              </FloatingCards>
            </HeroVisual>
          </Container>
        </HeroSection>

        {/* Stats Section */}
        <StatsSection id="features">
          <Container>
            <SectionHeader>
              <h2 className="section-title">
                <span className="gradient-text">Powering the Future of Fandom</span>
              </h2>
              <p className="section-subtitle">
                FanFi bridges the gap between creators and fans through blockchain technology
              </p>
            </SectionHeader>
            <StatsGrid>
              <StatItem delay="0s">
                <div className="stat-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/>
                    </svg>
                  </Hexagon>
                </div>
                <div className="stat-value">For Creators</div>
                <h3>Monetize Your IP</h3>
                <p>Tokenize your content and raise capital directly from your most loyal fans</p>
              </StatItem>
              <StatItem delay="0.2s">
                <div className="stat-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                    </svg>
                  </Hexagon>
                </div>
                <div className="stat-value">For Fans</div>
                <h3>Invest in Culture</h3>
                <p>Own a piece of the content you love and earn rewards for your participation</p>
              </StatItem>
              <StatItem delay="0.4s">
                <div className="stat-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </Hexagon>
                </div>
                <div className="stat-value">For Everyone</div>
                <h3>Join the Movement</h3>
                <p>Be part of the revolution that's changing how entertainment is created and consumed</p>
              </StatItem>
            </StatsGrid>
          </Container>
        </StatsSection>

        {/* Features Section */}
        <FeaturesSection>
          <Container>
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">
                <span className="gradient-text" style={{color:'white',glow:'none'}}>The FanFi Ecosystem</span>
              </h2>
              <p className="section-subtitle">
                A comprehensive platform with everything creators and fans need
              </p>
            </div>
            <FeaturesGrid>
              <FeatureCard>
                <div className="feature-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                    </svg>
                  </Hexagon>
                </div>
                <h3>FIP Tokenization</h3>
                <p>Creators launch tokens representing their movies, shows, or music, enabling direct monetization.</p>
                <div className="feature-underline"></div>
              </FeatureCard>
              <FeatureCard>
                <div className="feature-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </Hexagon>
                </div>
                <h3>Built-in DEX</h3>
                <p>Trade FIP Tokens in a decentralized exchange with creator-aligned incentives.</p>
                <div className="feature-underline"></div>
              </FeatureCard>
              <FeatureCard>
                <div className="feature-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                    </svg>
                  </Hexagon>
                </div>
                <h3>Liquidity Pools</h3>
                <p>Provide liquidity and earn APY while supporting your favorite creators.</p>
                <div className="feature-underline"></div>
              </FeatureCard>
              <FeatureCard>
                <div className="feature-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </Hexagon>
                </div>
                <h3>Web3 Ticketing</h3>
                <p>Book tickets with crypto or fiat and unlock token-based discounts.</p>
                <div className="feature-underline"></div>
              </FeatureCard>
              <FeatureCard>
                <div className="feature-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </Hexagon>
                </div>
                <h3>Token-Gated Access</h3>
                <p>Exclusive communities and content for FIP Token holders.</p>
                <div className="feature-underline"></div>
              </FeatureCard>
              <FeatureCard>
                <div className="feature-icon">
                  <Hexagon>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </Hexagon>
                </div>
                <h3>Attend-to-Earn</h3>
                <p>Earn $FNF tokens for participating in events and engaging with content.</p>
                <div className="feature-underline"></div>
              </FeatureCard>
            </FeaturesGrid>
          </Container>
        </FeaturesSection>

        {/* How It Works Section */}
{/* How It Works Section */}
{/* How It Works Section */}
{/* How It Works Section */}

{/* How It Works Section */}
        <HowItWorksSection id="how-it-works">
          <Container>
            <SectionHeader className="animate-on-scroll">
              <h2>
                <span>How FanFi Works</span>
              </h2>
              <p>
                A simple process for creators and fans to engage in the new entertainment economy
              </p>
            </SectionHeader>
            <StepsContainer>

              <FeatureItem>
                  <div className="feature-icon">
                     <StepNumber>1</StepNumber>
                  </div>
                  <h2>Creators Tokenize IP</h2>
                  <br></br>
                  <p style={{fontSize:'16px'}}>Launch FIP Tokens representing your movies, shows, or music</p>
                  <br></br><br></br>
                </FeatureItem>
                  <FeatureItem>
                  <div className="feature-icon">
                     <StepNumber>2</StepNumber>
                  </div>
                  <h2>Host a Presale</h2>
                  <br></br>
                  <p style={{fontSize:'16px'}}>Raise early capital from your most loyal fans</p>
                  <br></br><br></br>
                </FeatureItem>
                  <FeatureItem>
                  <div className="feature-icon">
                     <StepNumber>3</StepNumber>
                  </div>
                  <h2>List on DEX</h2>
                  <br></br>
                  <p style={{fontSize:'16px'}}>Enable global trading of your FIP Tokens</p>
                  <br></br><br></br>
                </FeatureItem>
                  <FeatureItem>
                  <div className="feature-icon">
                     <StepNumber>4</StepNumber>
                  </div>
                  <h2>Engage Fans</h2>
                  <br></br>
                  <p style={{fontSize:'16px'}}>Offer token-gated content, ticketing perks, and rewards</p>
                  <br></br><br></br>
                </FeatureItem>
             
            
             
            </StepsContainer>
          </Container>
        </HowItWorksSection>

        {/* Tokenomics Section */}
        <TokenomicsSection id="tokenomics">
          <Container>
            <SectionHeader className="animate-on-scroll">
              <h2>
                <span>FanFi Token ($FNF)</span>
              </h2>
              <p>
                The utility token powering the FanFi ecosystem
              </p>
            </SectionHeader>
            <TokenomicsContent>
              <div className="animate-on-scroll">
                <TokenPie>
                  <div className="pie-center">$FNF</div>
                </TokenPie>
                <TokenLegend>
                  <LegendItem>
                    <div className="legend-color color-1"></div>
                    <span>Liquidity Mining (40%)</span>
                  </LegendItem>
                  <LegendItem>
                    <div className="legend-color color-2"></div>
                    <span>Team & Advisors (20%)</span>
                  </LegendItem>
                  <LegendItem>
                    <div className="legend-color color-3"></div>
                    <span>Ecosystem Fund (25%)</span>
                  </LegendItem>
                  <LegendItem>
                    <div className="legend-color color-4"></div>
                    <span>Community Rewards (15%)</span>
                  </LegendItem>
                </TokenLegend>
              </div>
              <TokenomicsFeatures className="animate-on-scroll" delay="0.2">
                <FeatureItem>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                    </svg>
                  </div>
                  <h3>Staking Rewards</h3>
                  <p>Earn additional $FNF by staking your tokens in liquidity pools</p>
                </FeatureItem>
                <FeatureItem>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <h3>Governance</h3>
                  <p>Participate in platform decisions through decentralized voting</p>
                </FeatureItem>
                <FeatureItem>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                    </svg>
                  </div>
                  <h3>Fee Discounts</h3>
                  <p>Reduce platform fees by holding $FNF tokens</p>
                </FeatureItem>
                <FeatureItem>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </div>
                  <h3>Exclusive Access</h3>
                  <p>Unlock premium features and content with $FNF</p>
                </FeatureItem>
              </TokenomicsFeatures>
            </TokenomicsContent>
          </Container>
        </TokenomicsSection>

        {/* Community Section */}
        <CommunitySection id="community">
          <Container>
            <SectionHeader className="animate-on-scroll">
              <h2>
                <span>Join Our Community</span>
              </h2>
              <p>
                Be part of the revolution shaping the future of entertainment
              </p>
            </SectionHeader>

            
            <CommunityGrid>
              <CommunityCard className="animate-on-scroll">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <h3>Twitter</h3>
                <p>Follow us for the latest updates and announcements</p>
                <a href="#" className="community-link">Join Now</a>
              </CommunityCard>

               <CommunityCard className="animate-on-scroll">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <h3>Twitter</h3>
                <p>Follow us for the latest updates and announcements</p>
                <a href="#" className="community-link">Join Now</a>
              </CommunityCard>

               <CommunityCard className="animate-on-scroll">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <h3>Twitter</h3>
                <p>Follow us for the latest updates and announcements</p>
                <a href="#" className="community-link">Join Now</a>
              </CommunityCard>
               <CommunityCard className="animate-on-scroll">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <h3>Twitter</h3>
                <p>Follow us for the latest updates and announcements</p>
                <a href="#" className="community-link">Join Now</a>
              </CommunityCard>


              
              
            </CommunityGrid>
          </Container>
        </CommunitySection>

        {/* Final CTA Section */}
        <FinalCTASection>
          <Container>
            <div className="animate-on-scroll">
              <h2>
                <span>Ready to Join the Entertainment Revolution?</span>
              </h2>
              <p>
                Whether you're a creator looking to monetize your IP or a fan wanting to invest in the content you love, FanFi is your gateway to the future of entertainment.
              </p>
              <LaunchAppButton onClick={()=>{
                window.location.href="/home2"
              }}>
                Launch App
                <ButtonParticles>
                  {[...Array(12)].map((_, i) => (
                    <Particle key={i} angle={i * 30} delay={i * 0.05} />
                  ))}
                </ButtonParticles>
              </LaunchAppButton>
            </div>
          </Container>
        </FinalCTASection>

        {/* Footer */}
        <Footer>
          <Container>
            <FooterContent>
              <FooterBrand>
                <span className="logo-gradient">FanFi</span>
                <p>Tokenizing Entertainment, Monetizing Culture</p>
              </FooterBrand>
              <FooterLinks>
                <LinkGroup>
                  <h4>Product</h4>
                  <a href="#features">Features</a>
                  <a href="#how-it-works">How It Works</a>
                  <a href="#tokenomics">Tokenomics</a>
                </LinkGroup>
                <LinkGroup>
                  <h4>Resources</h4>
                  <a href="#">Whitepaper</a>
                  <a href="#">Documentation</a>
                  <a href="#">Blog</a>
                </LinkGroup>
                <LinkGroup>
                  <h4>Company</h4>
                  <a href="#">About</a>
                  <a href="#">Team</a>
                  <a href="#">Careers</a>
                </LinkGroup>
              </FooterLinks>
            </FooterContent>
            <FooterBottom>
              <SocialLinks>
                <a href="#">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.54 3.23c-.2-.48-.64-.84-1.17-.94-1.12-.2-4.43-.35-6.37-.35-1.94 0-5.25.15-6.37.35-.53.1-.97.46-1.17.94-.2.56-.34 1.88-.34 3.77 0 1.89.14 3.21.34 3.77.2.48.64.84 1.17.94 1.12.2 4.43.35 6.37.35 1.94 0 5.25-.15 6.37-.35.53-.1.97-.46 1.17-.94.2-.56.34-1.88.34-3.77 0-1.89-.14-3.21-.34-3.77zm-8.79 6.03c-1.48 0-2.68-1.2-2.68-2.68s1.2-2.68 2.68-2.68 2.68 1.2 2.68 2.68-1.2 2.68-2.68 2.68zm6.44 1.54c-.31 0-.56-.25-.56-.56s.25-.56.56-.56.56.25.56.56-.25.56-.56.56zm1.84-1.54c-1.48 0-2.68-1.2-2.68-2.68s1.2-2.68 2.68-2.68 2.68 1.2 2.68 2.68-1.2 2.68-2.68 2.68z"/>
                  </svg>
                </a>
                <a href="#">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                    <path d="M8.5 15H10V9H7v1.5h1.5zM13.5 12.75L15.25 15H17l-2.25-3L17 9h-1.75l-1.75 2.25V9H12v6h1.5z"/>
                  </svg>
                </a>
                <a href="#">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z"/>
                  </svg>
                </a>
              </SocialLinks>
              <Copyright>
                © {new Date().getFullYear()} FanFi. All rights reserved.
              </Copyright>
            </FooterBottom>
          </Container>
        </Footer>
      </FanFiWrapper>
    </>
  );
};

export default FanFiEnhanced;