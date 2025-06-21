import { useState, useEffect } from 'react';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'

// Enhanced city extraction logic
const extractCity = (address) => {
  // Priority list of address fields to check
  const fieldsToCheck = [
    'city',
    'town',
    'county',
    'state_district',
    'state',
    'village',
    'municipality',
    'region'
  ];

  // Try fields in order
  for (const field of fieldsToCheck) {
    if (address[field]) {
      // Clean and return the first valid candidate
      return cleanCityName(address[field]);
    }
  }

  // Fallback to neighborhood or suburb
  return cleanCityName(address.neighbourhood || address.suburb || '');
};

// Clean and normalize city names
const cleanCityName = (name) => {
  if (!name) return '';
  
  // Remove administrative suffixes
  let cleaned = name
    .replace(/\s*(Urban|Rural|District|Division|Region|Zone|Area|Circle)\s*$/i, '')
    .replace(/^(Greater\s+)/i, '')
    .trim();
  
  // Replace common English names with official names
  const nameMappings = {
    'Bangalore': 'Bengaluru',
    'Bombay': 'Mumbai',
    'Madras': 'Chennai',
    'Calcutta': 'Kolkata',
    'Pondicherry': 'Puducherry',
    'Trivandrum': 'Thiruvananthapuram',
    'Cochin': 'Kochi',
    'Benares': 'Varanasi',
    'Baroda': 'Vadodara',
    'Gurgaon': 'Gurugram'
  };
  
  // Check if we need to map to an official name
  return nameMappings[cleaned] || cleaned;
};

const LocationPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if location data exists in localStorage
    const locationData = localStorage.getItem('userLocationData');
    if (!locationData) {
      // Small delay to let page render before showing popup
      const timer = setTimeout(() => setShowPopup(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const getLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Get detailed location information
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&namedetails=1`
          );
          
          if (!response.ok) throw new Error('Location fetch failed');
          
          const data = await response.json();
          
          if (!data.address) {
            throw new Error('No address information found');
          }
          
          // Extract city using our enhanced logic
          const city = extractCity(data.address);
          const fullLocation = data.display_name;

          if (!city) throw new Error('City information not found');

          // Save to localStorage
          localStorage.setItem(
            'userLocationData',
            city
          );
          
          setShowPopup(false);
          window.location.href="/home"
        } catch (err) {
          setError('Failed to get location details: ' + err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Error getting location: ' + (
          err.code === err.PERMISSION_DENIED 
            ? 'Permission denied. Please enable location access.' 
            : 'Location unavailable. Please try again later.'
        ));
        setLoading(false);
      }
    );
  };

  if (!showPopup) return null;

  return (
    <div >
        <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    objectFit: "cover",
                    zIndex: 1,
                  }}
                  src={backgroundVideo}
                />
   
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Location Access Required</h2>
          <div style={styles.glow}></div>
        </div>
        
        <p style={styles.message}>
          To suggest movies,concerts,sports,etc happeing in your area, we need your location.
          
        </p>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <button 
          onClick={getLocation} 
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Securing Location...
            </>
          ) : (
            'Grant Permission'
          )}
        </button>
        
        <div style={styles.footer}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.web3Text}>Your data always stays your in browser</span>
        </div>
      </div>
    </div>
    </div>
  );
};

// Web3-themed styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 5, 15, 0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(10px)',
  },
  modal: {
    width: '90%',
    maxWidth: '520px',
    backgroundColor: '#0a0e23',
    borderRadius: '20px',
    border: '1px solid rgba(0, 217, 255, 0.45)',
    padding: '35px 30px 30px',
    boxShadow: '0 0 40px rgba(0, 195, 255, 0.35)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    position: 'relative',
    marginBottom: '25px',
    textAlign: 'center',
  },
  title: {
    color: '#00f0ff',
    fontSize: '2rem',
    margin: 0,
    textShadow: '0 0 15px rgba(0, 240, 255, 0.85)',
    letterSpacing: '0.5px',
    fontWeight: 700,
    background: 'linear-gradient(90deg, #00f0ff, #00ff9c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(0, 240, 255, 0.35) 0%, transparent 70%)',
    zIndex: -1,
    borderRadius: '50%',
  },
  message: {
    color: '#b0f5ff',
    fontSize: '1.1rem',
    lineHeight: 1.7,
    marginBottom: '30px',
    textAlign: 'center',
  },
  error: {
    color: '#ff4d6d',
    margin: '20px 0',
    textAlign: 'center',
    textShadow: '0 0 10px rgba(255, 77, 109, 0.7)',
    fontSize: '1rem',
    padding: '10px',
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    borderRadius: '8px',
  },
  button: {
    background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
    color: 'white',
    border: 'none',
    padding: '18px 32px',
    fontSize: '1.15rem',
    borderRadius: '15px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold',
    letterSpacing: '1px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 25px rgba(0, 198, 255, 0.7)',
    marginBottom: '15px',
    fontFamily: 'inherit',
  },
  spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s linear infinite',
    marginRight: '12px',
    verticalAlign: 'middle',
  },
  footer: {
    marginTop: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
  pulseCircle: {
    width: '14px',
    height: '14px',
    backgroundColor: '#00ff9c',
    borderRadius: '50%',
    boxShadow: '0 0 15px #00ff9c',
    marginRight: '12px',
    animation: 'pulse 1.5s infinite',
  },
  web3Text: {
    color: '#00ff9c',
    fontSize: '0.95rem',
    letterSpacing: '1.5px',
    fontWeight: 500,
  },
};

export default LocationPopup;