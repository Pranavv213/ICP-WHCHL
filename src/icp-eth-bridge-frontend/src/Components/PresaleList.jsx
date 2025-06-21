import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import ResponsiveAppBar from './ResponsiveAppBar';

const tokensCollectionRef = collection(db, 'tokens');
const presaleCollectionRef = collection(db, 'presale');

function PresaleList() {
    const [presaleInfoList, setPresaleInfoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const tokensGet = async () => {
        try {
            setIsLoading(true);
            let data = await getDocs(presaleCollectionRef);
            let presaleTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            
            data = await getDocs(tokensCollectionRef);
            let tokensTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            for(let i = 0; i < presaleTemp.length; i++) {
                for(let j = 0; j < tokensTemp.length; j++) {
                    if(presaleTemp[i].TokenAddress == tokensTemp[j].Address) {
                        presaleTemp[i].Name = tokensTemp[j].Name;
                        presaleTemp[i].Symbol = tokensTemp[j].Symbol;
                        if(tokensTemp[j].ImageUrl)
                        {
                            presaleTemp[i].ImageUrl=tokensTemp[j].ImageUrl
                        }
                        break;
                    }
                }
            }

            setPresaleInfoList(presaleTemp);
        } catch (error) {
            console.error("Error fetching presale data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        tokensGet();
    }, []);

    return (
        <div >
            <ResponsiveAppBar   homeButtonStyle="outlined" 
          earnButtonStyle="outlined" 
          createButtonStyle="outlined" 
          chatButtonStyle="outlined" 
          dashboardButtonStyle="outlined" 
          tokenButtonStyle="outlined"
          presaleButtonStyle="contained"/>
            <br></br><br></br><br></br><br></br>
            <div style={{backgroundColor:'rgb(16,14,23)',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <div style={{width:'90%',borderRadius:'20px',color:'white',
                            borderRadius: '16px',
                           
                            boxShadow: '0 4px 30px rgba(94, 92, 230, 0.1)',padding:'1em'}}>
                    <h1 style={{color:'rgb(94,155,249)'}} >ACTIVE PRESALES</h1>
                    <p style={{color:'rgb(136,137,158)',fontSize:'17px',fontWeight:"300"}}>Participate in upcoming IP sales</p>
                    </div>
                   
                    <br></br>
                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading presales...</p>
                        </div>
                    ) : presaleInfoList.length === 0 ? (
                        <div className="no-presales">
                            <p>No active presales available at the moment.</p>
                        </div>
                    ) : (
                        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:'15px',width:'60%',textAlign: 'center',
                           
                           }}>
                            {/* Header */}
                           
                            
                            {/* List Items */}
                            {presaleInfoList.map((x, index) => (
                                <div key={index} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'2em',flexWrap:'wrap',backgroundColor:'rgb(24,23,46)',padding:'1em',borderRadius:'20px',border:'2px solid rgb(38, 36, 73)'}}>
                                    <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
                                        {x.ImageUrl && <img src={x.ImageUrl} className="token-image" />}
                                        <span style={{color:'white',fontSize:'18px'}}><b>{x.Symbol}</b></span>
                                    </div>
                                    <div style={{color: '#6c63ff',
                                                fontSize: '18px',
                                                fontWeight: '300',}}>
                                       {x.Rate} {x.Symbol} / ETH
                                    </div>
                                    <div >
                                        <button 
                                            style={{border:'1px solid rgb(80,194,247)',borderRadius:'10px',color:'rgb(80,194,247)',background:'transparent',height:'3em',width:'7em'}}
                                            onClick={() => {
                                                window.location.href = `/presaleinteraction/${x.PresaleContractAddress}`
                                            }}
                                        >
                                           <b> Participate </b>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
               

                <style jsx>{`
                    .presale-container {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                        color: white;
                        font-family: 'Inter', sans-serif;
                        padding: 2rem;
                       
                    }
                    
                    .presale-content {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 2rem;
                        background: rgba(15, 14, 41, 0.7);
                        border-radius: 16px;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                        backdrop-filter: blur(8px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    
                    .presale-title {
                        font-size: 2.5rem;
                        margin-bottom: 0.5rem;
                        background: linear-gradient(90deg, #00d2ff, #3a7bd5);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-align: center;
                    }
                    
                    .presale-subtitle {
                        color: #a1a1aa;
                        text-align: center;
                        margin-bottom: 2rem;
                        font-size: 1.1rem;
                    }
                    
                    .presale-list {
                        display: flex;
                        flex-direction: column;
                        justtify-content:flex-start;
                        margin-top: 2rem;
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    
                    .presale-header {
                        display: flex;
                        background: rgba(58, 123, 213, 0.2);
                        padding: 1rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        font-size: 0.9rem;
                    }
                    
                    .presale-item {
                        display: flex;
                        padding: 1rem;
                        align-items: center;
                        background: rgba(20, 20, 50, 0.6);
                        transition: all 0.3s ease;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }
                    
                    .presale-item:last-child {
                        border-bottom: none;
                    }
                    
                    .presale-item:hover {
                        background: rgba(30, 30, 70, 0.8);
                    }
                    
                    .header-item, .item-detail {
                        flex: 1;
                        padding: 0 0.5rem;
                    }
                    
                    .token-header, .token-detail {
                        flex: 2;
                    }
                    
                    .token-detail {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    
                    .token-image {
                        width: 3em;
                        height: 3em;
                        object-fit: cover;
                        border-radius: 50%;
                    }
                    
                    .token-symbol {
                        font-weight: bold;
                        color: #3a7bd5;
                        font-size: 1.1rem;
                    }
                    
                    .rate-detail {
                        color: #00d2ff;
                        font-weight: 600;
                    }
                    
                    .buy-button {
                        background: linear-gradient(90deg, #3a7bd5, #00d2ff);
                        border: none;
                        color: white;
                        padding: 0.6rem 1.2rem;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        font-size: 0.85rem;
                        min-width: 120px;
                    }
                    
                    .buy-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(58, 123, 213, 0.4);
                    }
                    
                    .loading-spinner {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 1rem;
                        padding: 3rem 0;
                    }
                    
                    .spinner {
                        width: 50px;
                        height: 50px;
                        border: 4px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        border-top-color: #3a7bd5;
                        animation: spin 1s ease-in-out infinite;
                    }
                    
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    
                    .no-presales {
                        text-align: center;
                        padding: 3rem 0;
                        color: #a1a1aa;
                        font-size: 1.1rem;
                    }
                    
                    @media (max-width: 768px) {
                        .presale-content {
                            padding: 1rem;
                        }
                        
                        .presale-header {
                            display: none;
                        }
                        
                        .presale-item {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 1rem;
                            padding: 1.5rem;
                        }
                        
                        .item-detail {
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                        }
                        
                        .item-detail::before {
                            content: attr(data-label);
                            color: #a1a1aa;
                            font-size: 0.9rem;
                        }
                        
                        .token-detail {
                            justify-content: space-between;
                        }
                        
                        .action-detail {
                            justify-content: flex-end;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default PresaleList;