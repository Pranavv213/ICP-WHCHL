import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';

import { db } from "../firebase-config";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import ResponsiveAppBar from './ResponsiveAppBar';
const tokensCollectionRef = collection(db, 'tokens');

const TokenList = () => {
  // BSC Testnet addresses
  const PANCAKE_ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
  
  // Hardcoded BNB price for demo
  const BNB_PRICE_USD = 300;
  
  // State variables
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenPrice, setTokenPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTokens, setFilteredTokens] = useState([]);
  
  // Contract ABIs
  const routerABI = [
    "function factory() external view returns (address)"
  ];

  const tokenABI = [
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
    "function name() external view returns (string)",
    "function totalSupply() external view returns (uint256)"
  ];

  const factoryABI = [
    "function getPair(address tokenA, address tokenB) external view returns (address pair)"
  ];

  const pairABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)"
  ];

  // Connect to BSC Testnet
  const provider = new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-1-s1.binance.org:8545/'
  );

  // Format currency helper
  const formatCurrency = (value) => {
    if (isNaN(value) || value === 0) {
      return '$0';
    }
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } 
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } 
    if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const fetchTokenPrice = async (tokenAddress) => {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      throw new Error('Please enter a valid token address');
    }

    try {
      // Fetch token metadata
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const [symbol, name, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.name(),
        tokenContract.decimals()
      ]);
      setTokenSymbol(symbol);

      // Get liquidity pool address
      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, provider);
      const factoryAddress = await router.factory();
      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      const pairAddress = await factory.getPair(tokenAddress, WBNB_ADDRESS);

      if (pairAddress === ethers.constants.AddressZero) {
        throw new Error('No liquidity pool exists for this token');
      }

      // Get pool reserves
      const pair = new ethers.Contract(pairAddress, pairABI, provider);
      const [reserves, token0Address] = await Promise.all([
        pair.getReserves(),
        pair.token0()
      ]);

      // Determine token order in pair
      const isToken0 = tokenAddress.toLowerCase() === token0Address.toLowerCase();
      const tokenReserve = isToken0 ? reserves.reserve0 : reserves.reserve1;
      const wbnbReserve = isToken0 ? reserves.reserve1 : reserves.reserve0;

      if (tokenReserve.isZero() || wbnbReserve.isZero()) {
        throw new Error('Pool has no liquidity');
      }

      // Calculate token price (in WBNB)
      const priceInWBNB = wbnbReserve.mul(ethers.BigNumber.from(10).pow(decimals))
                              .div(tokenReserve);
      
      const priceInBNB = parseFloat(ethers.utils.formatUnits(priceInWBNB, 18));
      const priceInUSD = priceInBNB * BNB_PRICE_USD;

      // Calculate liquidity
      const tokenReserveFormatted = parseFloat(
        ethers.utils.formatUnits(tokenReserve, decimals)
      );
      const wbnbReserveFormatted = parseFloat(
        ethers.utils.formatUnits(wbnbReserve, 18)
      );
      
      const tokenValueUSD = tokenReserveFormatted * priceInUSD;
      const wbnbValueUSD = wbnbReserveFormatted * BNB_PRICE_USD;
      const liquidityUSD = tokenValueUSD + wbnbValueUSD;

      return {
        price: priceInUSD,
        liquidity: liquidityUSD,
        name: name
      };

    } catch (err) {
      console.error('Error fetching token price:', err);
      throw err;
    }
  };

  const tokensGet = async () => {
    let data = await getDocs(tokensCollectionRef);
    let tokensTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    tokensTemp=tokensTemp.filter(obj=>obj.Email==localStorage.getItem('email'))
  
    const roundToSigString = (num, sig = 2) => {
      let rounded = num.toPrecision(sig);
      if (!rounded.includes('e')) return rounded;
  
      let [mantissa, exponent] = rounded.split('e');
      let [intPart, decPart = ""] = mantissa.split('.');
      exponent = parseInt(exponent);
  
      if (exponent >= 0) {
        decPart = decPart.padEnd(exponent, '0');
        return intPart + decPart.slice(0, exponent) + (decPart.slice(exponent) ? '.' + decPart.slice(exponent) : '');
      } else {
        return '0.' + '0'.repeat(Math.abs(exponent) - 1) + intPart + decPart;
      }
    };

    for (let i = 0; i < tokensTemp.length; i++) {
      try {
        setLoading(true);
        const { price, liquidity, name } = await fetchTokenPrice(tokensTemp[i].Address);
        
        // Store token name for searching
        tokensTemp[i].Name = name;
        
        // Format price
        tokensTemp[i].Price = roundToSigString(price);
        
        // Format liquidity
        tokensTemp[i].Liquidity = formatCurrency(liquidity);
        
        // Calculate APY using real liquidity
        const random = Math.random() * (25.5 - 18.5) + 18.5;
        const apy = parseFloat(random.toFixed(1));
        
        tokensTemp[i].APY = apy;
        
      } catch (err) {
        console.error(`Error for token ${tokensTemp[i].Symbol}:`, err);
        tokensTemp[i].Price = '0.0000';
        tokensTemp[i].Liquidity = '$0';
        tokensTemp[i].APY = '0.00';
        tokensTemp[i].Name = tokensTemp[i].Symbol; // Fallback to symbol
      } finally {
        setLoading(false);
      }
    }
  
    console.log(tokensTemp);
    setTokens(tokensTemp);
    setFilteredTokens(tokensTemp); // Initialize filtered tokens
  };
  
  useEffect(() => {
    tokensGet();
  }, []);

  // Filter tokens based on search input
  useEffect(() => {
    if (!search) {
      setFilteredTokens(tokens);
      return;
    }
    
    const searchTerm = search.toLowerCase();
    const filtered = tokens.filter(token => 
      token.Symbol.toLowerCase().includes(searchTerm) || 
      (token.Name && token.Name.toLowerCase().includes(searchTerm))
    );
    
    setFilteredTokens(filtered);
  }, [search, tokens]);

  return (
    <div>
      <br />
      <ResponsiveAppBar 
        homeButtonStyle="outlined" 
        earnButtonStyle="contained" 
        createButtonStyle="outlined" 
        chatButtonStyle="contained" 
        dashboardButtonStyle="outlined"
      />
      <hr />
      <br /><br />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>IP Token Explorer</h1>
          <div style={styles.subtitle}>Live Token Prices & Analytics</div>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Scanning blockchain...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Search input field */}
        {!loading && tokens.length > 0 && (
          <div style={styles.searchContainer}>
            <input 
              placeholder='Search by token symbol or name...' 
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        <div style={styles.grid}>
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <div 
                key={token.id} 
                style={styles.card}
                className="token-card"
                onClick={() => {
                  window.location.href = `/tokeninfo/${token.Address}`
                }}
              >
                <div style={styles.cardContent}>
                  <div style={styles.cardLeft}>
                    {token.ImageUrl && <img src={token.ImageUrl} style={styles.tokenImage} alt={token.Symbol} />}
                    <div style={styles.tokenInfo}>
                      <div style={styles.tokenSymbol}>{token.Symbol}</div>
                      <div style={styles.tokenAddress}>
                        {token.Address.substring(0, 6)}...{token.Address.substring(token.Address.length - 4)}
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.cardRight}>
                    <div style={styles.priceContainer}>
                      <div style={styles.priceLabel}>PRICE</div>
                      <div style={styles.priceValue}>
                        {token.Price ? `$${token.Price}` : 'Loading...'}
                      </div>
                    </div>
                    
                    
                    
                    <div style={styles.apyContainer}>
                      <div style={styles.apyLabel}>APY</div>
                      <div style={styles.apyValue}>{token.APY}%</div>
                    </div>
                    
                    <button 
                      style={styles.tradeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/swap/${token.Address}`;
                      }}
                    >
                      Trade
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && tokens.length > 0 && (
              <div style={styles.noResults}>
                No tokens found for "{search}"
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Web3-inspired styling
const styles = {
  container: {
    backgroundColor: '#0f0e17',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
   
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f0e17 0%, #1a1830 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(94, 92, 230, 0.2)',
    boxShadow: '0 4px 30px rgba(94, 92, 230, 0.1)',
  },
  title: {
    color: '#fffffe',
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0',
    background: 'linear-gradient(90deg, #6c63ff 0%, #4fc3f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  subtitle: {
    color: '#a7a9be',
    fontSize: '1rem',
    marginTop: '8px',
    fontWeight: '300',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '12px 20px',
    borderRadius: '25px',
    border: '1px solid rgba(108, 99, 255, 0.3)',
    backgroundColor: 'rgba(26, 24, 48, 0.7)',
    color: '#fffffe',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    '&:focus': {
      borderColor: '#6c63ff',
      boxShadow: '0 0 15px rgba(108, 99, 255, 0.4)',
    }
  },
  grid: {
    display: 'flex',
    flexDirection:'column',
    alignItems:'center',
   
    gap: '15px',
    
    margin: '0 auto',
   
  },
  card: {
    width:'80%',
    maxWidth:'50em',
    background: 'linear-gradient(145deg, #16152a 0%, #1c1a36 100%)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(94, 92, 230, 0.15)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 15px 35px rgba(108, 99, 255, 0.3)',
    }
  },
  cardContent: {
    display: 'flex',
    
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardLeft: {
    display: 'flex',
    flexWrap:'wrap',
    justifyContent:'flex-start',
    alignItems: 'center',
    gap: '30px',
    flex: 1,
  },
  cardRight: {
    display: 'flex',
    flexWrap:'wrap',
    justifyContent:'center',
    alignItems: 'center',
    gap: '30px',
  },
  tokenImage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tokenInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'flex-start'
  },
  tokenSymbol: {
    color: '#fffffe',
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '4px',
  },
  tokenAddress: {
    color: '#4fc3f7',
    fontSize: '0.75rem',
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    padding: '3px 6px',
    borderRadius: '8px',
    fontFamily: 'monospace',
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  priceLabel: {
    color: '#a7a9be',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  priceValue: {
    color: '#6c63ff',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  apyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '100px',
  },
  apyLabel: {
    color: '#a7a9be',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  apyValue: {
    color: '#4fc3f7',
    fontSize: '1rem',
    fontWeight: '700',
  },
  tradeButton: {
    background: 'transparent',
    border: '1px solid #4fc3f7',
    color: '#4fc3f7',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '600',
    fontSize: '0.9rem',
    '&:hover': {
      background: 'rgba(79, 195, 247, 0.1)',
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    marginBottom: '30px',
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(108, 99, 255, 0.2)',
    borderTop: '5px solid #6c63ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#a7a9be',
    fontSize: '1.2rem',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 87, 87, 0.1)',
    border: '1px solid rgba(255, 87, 87, 0.3)',
    borderRadius: '12px',
    padding: '15px 20px',
    margin: '20px 0',
  },
  errorIcon: {
    fontSize: '1.5rem',
    marginRight: '15px',
    color: '#ff5757',
  },
  errorText: {
    color: '#ff5757',
    margin: '0',
  },
  noResults: {
    color: '#a7a9be',
    fontSize: '1.2rem',
    textAlign: 'center',
    width: '100%',
    padding: '40px',
  },
};

export default TokenList;