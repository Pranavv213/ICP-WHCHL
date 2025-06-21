import React, { useRef, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import backgroundVideo from '../assets/images/eventBackgroundVideo.mp4'
import { useParams } from 'react-router-dom';
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { SocialIcon } from 'react-social-icons';
import ShareIcon from '@mui/icons-material/Share';

const contractAddress = "0x9Eda1223DD91FFc18BB3Be08C0C889F0C87351e5";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const PoapCertificate = () => {


  const usersCollectionRef = collection(db, "events");
  const usersCollectionRef1 = collection(db, "user");
  const usersCollectionRef5 = collection(db, "nft");
  const canvasRef = useRef(null);

 const {user_name,event_id}=useParams()


  const [eventName,setEventName] = useState('Web3 Gala');
  const [eventImg,setEventImg] = useState('https://res.cloudinary.com/getsetcourse/image/upload/v1746639424/jtfzuxiwihwpp97whhoo.jpg');
  const [events,setEvents]=useState([])
  const [users,setUsers]=useState([])


  const [imageURL, setImageURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isBlurred, setIsBlurred] = useState(true);


   const getEvents = async () => {

   


        
         let data = await getDocs(usersCollectionRef);
         
          let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
         
          let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
          console.log(filteredArray)
          setEvents(filteredArray);

          if(filteredArray.length!=0)
          {
            setEventName(filteredArray[0].Name)
            setEventImg(filteredArray[0].Image)
          }
  
        
          
          data = await getDocs(usersCollectionRef1);

          let users=[]
         
          let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          
          console.log(usersTemp)
          
          if(user_name && user_name.length!=0)
          {
            filteredArray=usersTemp.filter(obj=>obj.UserName && obj.UserName.toLowerCase()==user_name.toLowerCase() && obj.EventsAttended.includes(event_id))

            users=filteredArray
          }

          if(filteredArray.length==0)
            {
   
   
               window.location.href="/errorpage/404"
               return;
            }
        
          if(filteredArray.length!=0)
          {

          
          data=await getDocs(usersCollectionRef5);

          let nftsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

          filteredArray=nftsTemp.filter(obj=>obj.UserEmail==filteredArray[0].Email && obj.EventId==event_id)

          if(filteredArray.length!=0)
          {
            setSuccessMsg(filteredArray[0].Txn)

            setIsBlurred(false)
          }
          else if(!(localStorage.getItem('email') && users.length!=0 && users[0].Email==localStorage.getItem('email')))
          {
            window.location.href="/errorpage/404"
            return;
          }


         

          }


        
        };


  useEffect(()=>{

    getEvents()

  },[])

  // Generate the certificate image on canvas
  useEffect(() => {
    generateImage();
  }, [user_name, eventName, eventImg]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 794;
    canvas.height = 1588;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e003b');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#bb86fc';
    ctx.lineWidth = 10;
    ctx.shadowColor = '#9b4dff';
    ctx.shadowBlur = 20;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.shadowBlur = 0;

    // Text
    ctx.fillStyle = '#e0b3ff';
    ctx.font = 'bold 45px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🪩 Proof of Attendance', canvas.width / 2, 100);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#ccccff';
    ctx.textAlign = 'center';
    ctx.fillText('This certifies that', canvas.width / 2, 200);

    ctx.font = 'bold 56px Orbitron, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(user_name, canvas.width / 2, 260);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#ccccff';
    ctx.fillText('attended and participated in', canvas.width / 2, 320);

    ctx.font = 'bold 56px monospace';
    ctx.fillStyle = '#9b4dff';
    ctx.fillText(eventName, canvas.width / 2, 380);

    if (eventImg) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = eventImg;

      img.onload = () => {
        const imgWidth = canvas.width * 0.8;
        const imgHeight = canvas.height * 0.6;
        const x = (canvas.width - imgWidth) / 2;
        const y = 420;
        ctx.drawImage(img, x, y, imgWidth, imgHeight);

        drawFooter(ctx, canvas);
      };

      img.onerror = () => drawFooter(ctx, canvas);
    } else {
      drawFooter(ctx, canvas);
    }
  };

  const drawFooter = (ctx, canvas) => {
    const currentDate = new Date().toLocaleDateString();

    ctx.font = '36px Arial';
    ctx.fillStyle = '#ccccff';
    ctx.textAlign = 'left';
    ctx.fillText(`Date: ${currentDate}`, 40, canvas.height - 60);

    ctx.textAlign = 'right';
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#bb86fc';
    ctx.fillText('ConnectVerse', canvas.width - 40, canvas.height - 60);

    const dataURL = canvas.toDataURL('image/png');
    setImageURL(dataURL);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async () => {
    setUploading(true);
    setError('');
    try {
      // Convert base64 imageURL to Blob
      const res = await fetch(imageURL);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', 'my_unsigned_preset');  // Replace
      formData.append('cloud_name', 'getsetcourse');           // Replace

      const response = await fetch('https://api.cloudinary.com/v1_1/getsetcourse/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setUploading(false);
        return data.secure_url;  // Return the Cloudinary URL
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Image upload failed: ' + err.message);
      setUploading(false);
      return null;
    }
  };

  // Mint NFT by calling smart contract
  const mintCertificate = async (tokenURI) => {
    setMinting(true);
    setError('');
    setSuccessMsg('');

    try {
      if (!window.ethereum) {
        setError('MetaMask not detected. Please install MetaMask.');
        setMinting(false);
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const address = await signer.getAddress();

      console.log("tokenURI",tokenURI)

      console.log("address",address)

      const tx = await contract.mint(address,tokenURI);  // Adjust mint params if needed

      await tx.wait();

      await addDoc(usersCollectionRef5, {UserEmail:localStorage.getItem('email'),EventId:event_id,Txn:tx.hash});

      setSuccessMsg(`${tx.hash}`);
      setIsBlurred(false)
    } catch (err) {
      setError('Minting failed: ' + (err.data?.message || err.message || err));
    } finally {
      setMinting(false);
    }
  };

  // Handler to upload then mint
  const handleMint = async () => {
    if (!imageURL) {
      setError('Certificate not generated yet.');
      return;
    }
    setError('');
    const uploadedURL = await uploadImageToCloudinary();
    if (uploadedURL) {
      await mintCertificate(uploadedURL);
    }
  };

  return (
    <div style={{ padding: 20, color: 'white', backgroundColor: 'black', minHeight: '100vh' }}>

        <center>

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
                          zIndex: 0,
                        }}
                        src={backgroundVideo}
                      />
      <h2>🎓 POAP Certificate</h2>

      {imageURL ? (
        <img
          src={imageURL}
          alt="POAP Certificate"
          style={{
            width: '20em',
            height: '37em',
            border: '2px solid #bb86fc',
            borderRadius: '8px',
            display: 'block',
            marginTop: '1em',
            filter:  isBlurred? 'blur(8px)' : 'blur(0)'
          }}
        />
      ) : (
        <p>Loading certificate...</p>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

<center>
      {successMsg.length==0 && <button
        onClick={handleMint}
        disabled={uploading || minting}
        style={{
            position:'relative',
          top: '-350px',
         
          padding: '10px 20px',
          fontSize: 18,
          backgroundColor: '#9b4dff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: uploading || minting ? 'not-allowed' : 'pointer',
        }}
      >
        {uploading ? 'Generating POAP...' : minting ? 'Minting...' : 'Mint Certificate'}
      </button>
    }
    </center>
    <br></br>

      {/* {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      {successMsg.length!=0 && <div  style={{ position:'relative', zIndex:1,color: 'lightgreen', gap:'5px',display:'flex',justifyContent:'center' }}><l><b>Txn: </b></l><l>{successMsg.slice(0, 6)}...{successMsg.slice(-6)}</l>
      
	 
      <ContentCopyIcon fontSize="small" onClick={()=>{
        navigator.clipboard.writeText(successMsg)
        .then(() => {
          console.log("Text copied to clipboard!");
         
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
     }}/>

	 <br></br>

	 
      </div>} */}
	 

	  
	  
	  <h3 style={{color:'white',position:'relative',zIndex:1}}>Share</h3>

	  {successMsg.length!=0 && <div  style={{ position:'relative', zIndex:1, display:'flex',justifyContent:'center',alignItems:'center',cursor:'pointer'}}>
	  <SocialIcon
  url="https://x.com/pranavv213"
  onClick={(e) => {
    e.preventDefault(); // This stops the default navigation
    e.stopPropagation();

    const tweetText = encodeURIComponent(`I just earned a ConnectVerse Poap! https://v2-six-puce.vercel.app/nft/${user_name}/${event_id}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
  }}
/>


	  &nbsp;  &nbsp;
	  
	<ShareIcon onClick={()=>{
       navigator.clipboard.writeText(`https://v2-six-puce.vercel.app/nft/${user_name}/${event_id}`)
        .then(() => {
          console.log("Text copied to clipboard!");
         
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
     }}/>
	
	</div>}
	  

      </center>
    </div>
  );
};

export default PoapCertificate;
