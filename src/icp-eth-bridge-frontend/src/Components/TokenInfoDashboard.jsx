import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import ResponsiveAppBar from './ResponsiveAppBar';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

const TokenInfoDashboard = () => {
  const {token_address} = useParams();
  // BSC Testnet addresses
  const PANCAKE_ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
  
  // Hardcoded BNB price for demo purposes
  const BNB_PRICE_USD = 300;
  
  // State variables
  const [tokenAddress, setTokenAddress] = useState('0x2f9aC69aF261c511352CD0a6B0Aed9D849B5856f');
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [timeInterval, setTimeInterval] = useState('1w'); // Default to 1 week
  
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
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');

  const fetchTokenData = async () => {
    if (!tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      setError('Please enter a valid token address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTokenData(null);
      setHistoricalData([]);
      setVolumeData([]);

      // Fetch token metadata
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const [symbol, name, decimals, totalSupply] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.name(),
        tokenContract.decimals(),
        tokenContract.totalSupply()
      ]);

      // Fetch liquidity pool data
      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, provider);
      const factoryAddress = await router.factory();
      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      const pairAddress = await factory.getPair(tokenAddress, WBNB_ADDRESS);

      if (pairAddress === ethers.constants.AddressZero) {
        setTokenData({
          symbol,
          name,
          decimals,
          totalSupply,
          priceUSD: 0,
          marketCapUSD: 0,
          tvlUSD: 0,
          pairExists: false
        });
        return;
      }

      // Fetch pair reserves
      const pair = new ethers.Contract(pairAddress, pairABI, provider);
      const [reserves, token0Address] = await Promise.all([
        pair.getReserves(),
        pair.token0()
      ]);

      // Determine reserve order
      const isToken0 = tokenAddress.toLowerCase() === token0Address.toLowerCase();
      const tokenReserve = isToken0 ? reserves.reserve0 : reserves.reserve1;
      const wbnbReserve = isToken0 ? reserves.reserve1 : reserves.reserve0;

      // Calculate token price in BNB and USD
      const tokenPriceInBNB = Number(
        ethers.utils.formatUnits(
          wbnbReserve.mul(ethers.BigNumber.from(10).pow(decimals)).div(tokenReserve),
          18
        )
      );
      
      const tokenPriceUSD = tokenPriceInBNB * BNB_PRICE_USD;

      // Calculate market cap
      const totalSupplyFormatted = Number(ethers.utils.formatUnits(totalSupply, decimals));
      const marketCapUSD = totalSupplyFormatted * tokenPriceUSD;

      // Calculate TVL
      const tokenValueUSD = Number(ethers.utils.formatUnits(tokenReserve, decimals)) * tokenPriceUSD;
      const wbnbValueUSD = Number(ethers.utils.formatUnits(wbnbReserve, 18)) * BNB_PRICE_USD;
      const tvlUSD = tokenValueUSD + wbnbValueUSD;

      const tokenInfo = {
        symbol,
        name,
        decimals,
        totalSupply: totalSupplyFormatted,
        priceUSD: tokenPriceUSD,
        marketCapUSD,
        tvlUSD,
        pairExists: true
      };

      setTokenData(tokenInfo);
      
      // Generate mock chart data only if pair exists and price is valid
      if (tokenPriceUSD > 0) {
        generateMockChartData(tokenPriceUSD, timeInterval);
      }

    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to fetch token data. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock historical price and volume data based on interval
  const generateMockChartData = (currentPrice, interval) => {
    const now = Date.now();
    let dataPoints = [];
    let timeUnit = 0;
    let dataPointsCount = 0;
    
    // Determine parameters based on selected interval
    switch(interval) {
      case '1h':
        dataPointsCount = 12; // 12 points for 1 hour (5 min intervals)
        timeUnit = 300000; // 5 minutes in milliseconds
        break;
      case '1d':
        dataPointsCount = 24; // 24 points for 1 day (hourly)
        timeUnit = 3600000; // 1 hour in milliseconds
        break;
      case '1w':
        dataPointsCount = 7; // 7 points for 1 week (daily)
        timeUnit = 86400000; // 1 day in milliseconds
        break;
      case '1m':
        dataPointsCount = 30; // 30 points for 1 month (daily)
        timeUnit = 86400000; // 1 day in milliseconds
        break;
      default:
        dataPointsCount = 7;
        timeUnit = 86400000;
    }

    const priceData = [];
    const volumeData = [];
    
    // Base price with some randomness
    let basePrice = currentPrice * (0.95 + Math.random() * 0.1);
    
    for (let i = dataPointsCount - 1; i >= 0; i--) {
      const timeOffset = i * timeUnit;
      const date = new Date(now - timeOffset);
      
      // Format label based on interval
      let label = '';
      if (interval === '1h') {
        label = date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      } else if (interval === '1d') {
        label = date.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          hour12: false 
        }).replace(':00', '');
      } else if (interval === '1w') {
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        label = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      // Simulate price fluctuations with trend
      const priceChange = (Math.random() - 0.5) * 0.05;
      basePrice = basePrice * (1 + priceChange);
      const price = basePrice;
      
      // Simulate volume (higher volatility for shorter intervals)
      let volume = 0;
      if (interval === '1h') {
        volume = 500 + Math.random() * 1500; // Lower volume for intraday
      } else if (interval === '1d') {
        volume = 10000 + Math.random() * 20000;
      } else {
        volume = 10000 + Math.random() * 490000;
      }
      
      priceData.push({
        name: label,
        price: price,
        date: date.toISOString()
      });
      
      volumeData.push({
        name: label,
        volume: volume,
        date: date.toISOString()
      });
    }
    
    setHistoricalData(priceData);
    setVolumeData(volumeData);
  };

  useEffect(() => {
    fetchTokenData();
  }, [tokenAddress]);

  // Handle time interval change
  const handleIntervalChange = (interval) => {
    setTimeInterval(interval);
    if (tokenData && tokenData.priceUSD > 0) {
      generateMockChartData(tokenData.priceUSD, interval);
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1f2d',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    color: '#e0e7ff'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#ffffff'
  };

  const titleStyle = {
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '10px',
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: '#9fa8da',
    fontWeight: '500'
  };

  const inputContainerStyle = {
    marginBottom: '25px',
    position: 'relative'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#a3b1e0'
  };

  const inputStyle = {
    width: '70%',
    padding: '14px 20px',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '1px solid #2d3753',
    backgroundColor: '#131826',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s'
  };

  const inputFocusStyle = {
    borderColor: '#4a6cf7',
    boxShadow: '0 0 0 3px rgba(74, 108, 247, 0.2)'
  };

  const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const cardStyle = {
    backgroundColor: '#21273a',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s, box-shadow 0.3s'
  };

  const cardTitleStyle = {
    fontSize: '1rem',
    color: '#9fa8da',
    marginBottom: '10px',
    fontWeight: '500'
  };

  const cardValueStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '5px'
  };

  const errorStyle = {
    color: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: '15px',
    borderRadius: '10px',
    marginTop: '20px',
    fontWeight: '500',
    textAlign: 'center'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '150px',
    flexDirection: 'column'
  };

  const spinnerStyle = {
    border: '4px solid rgba(74, 108, 247, 0.3)',
    borderTop: '4px solid #4a6cf7',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  };

  // Chart container style
  const chartContainerStyle = {
    backgroundColor: '#21273a',
    borderRadius: '14px',
    padding: '20px',
    marginTop: '20px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
  };

  const chartTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '15px',
    textAlign: 'center'
  };

  // Time interval selector styles
  const intervalSelectorStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
    gap: '10px'
  };

  const intervalButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#2d3753',
    color: '#9fa8da',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  };

  const activeIntervalButtonStyle = {
    ...intervalButtonStyle,
    backgroundColor: '#4a6cf7',
    color: 'white',
    boxShadow: '0 0 10px rgba(74, 108, 247, 0.5)'
  };

  return (
    <div>
      <br></br>
      <ResponsiveAppBar 
        homeButtonStyle="outlined" 
        earnButtonStyle="contained" 
        createButtonStyle="outlined" 
        chatButtonStyle="contained" 
        dashboardButtonStyle="outlined"
      />
      <hr></hr>
      <br></br><br></br>
      
      <div style={containerStyle}>
        <div style={headerStyle}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>  <h1 style={titleStyle}>Token Analytics Dashboard</h1>
            <button style={{height:'2em',borderRadius:'10px',color:'rgb(80,194,247)',border:'0.5px solid rgb(80,194,247)',backgroundColor:'transparent',cursor:'pointer',width:'5em'}} onClick={()=>{
                window.location.href=`/swap/${token_address}`
            }}>Trade</button></div>
        
        
        </div>

        {/* <div style={inputContainerStyle}>
          <label htmlFor="tokenAddress" style={labelStyle}>Token Address:</label>
          <input
            id="tokenAddress"
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = '#2d3753';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div> */}

        {error && <div style={errorStyle}>{error}</div>}

        {loading && (
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <p>Fetching token data from blockchain...</p>
          </div>
        )}

        {tokenData && (
          <div>
            <div style={cardGridStyle}>
              <div style={cardStyle}>
                <div style={cardTitleStyle}>Price</div>
                <div style={cardValueStyle}>
                  ${tokenData.priceUSD > 0.01 ? tokenData.priceUSD.toFixed(4) : tokenData.priceUSD.toFixed(8)}
                </div>
                <div>
                  {tokenData.pairExists ? (
                    <span style={{ color: '#4ade80' }}>Active Trading</span>
                  ) : (
                    <span style={{ color: '#ff6b6b' }}>No Liquidity Pool</span>
                  )}
                </div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitleStyle}>Market Cap</div>
                <div style={cardValueStyle}>
                  ${tokenData.marketCapUSD > 1000000 
                    ? `${(tokenData.marketCapUSD / 1000000).toFixed(2)}M` 
                    : tokenData.marketCapUSD > 1000 
                      ? `${(tokenData.marketCapUSD / 1000).toFixed(2)}K` 
                      : `${tokenData.marketCapUSD.toFixed(2)}`}
                </div>
                <div>
                  <span style={{ color: '#9fa8da' }}>
                    Supply: {tokenData.totalSupply > 1000000 
                      ? `${(tokenData.totalSupply / 1000000).toFixed(2)}M` 
                      : `${tokenData.totalSupply.toFixed(0)}`}
                  </span>
                </div>
              </div>

              <div style={cardStyle}>
                <div style={cardTitleStyle}>Total Value Locked</div>
                <div style={cardValueStyle}>
                  ${tokenData.tvlUSD > 1000000 
                    ? `${(tokenData.tvlUSD / 1000000).toFixed(2)}M` 
                    : tokenData.tvlUSD > 1000 
                      ? `${(tokenData.tvlUSD / 1000).toFixed(2)}K` 
                      : `${tokenData.tvlUSD.toFixed(2)}`}
                </div>
                {/* <div>
                  <span style={{ color: '#9fa8da' }}>Token: {tokenData.symbol}</span>
                </div> */}
              </div>

              <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
                <div style={cardTitleStyle}></div>
               
              </div>
            </div>

            {/* Charts Section */}
            {tokenData.pairExists && historicalData.length > 0 && (
              <div>
                {/* Time interval selector */}
                <div style={intervalSelectorStyle}>
                  {['1h', '1d', '1w', '1m'].map(interval => (
                    <button
                      key={interval}
                      style={timeInterval === interval ? activeIntervalButtonStyle : intervalButtonStyle}
                      onClick={() => handleIntervalChange(interval)}
                    >
                      {interval}
                    </button>
                  ))}
                </div>

                {/* Price Chart */}
                <div style={chartContainerStyle}>
                  <div style={chartTitleStyle}>
                    Price History ({timeInterval === '1h' ? '1 Hour' : timeInterval === '1d' ? '1 Day' : timeInterval === '1w' ? '1 Week' : '1 Month'})
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3753" />
                      <XAxis

                        dataKey="name"

                        stroke="#9fa8da"

                        interval={

                        timeInterval === '1h' || timeInterval === '1d'

                        ? 'preserveStartEnd'

                        : timeInterval === '1m'

                        ? 2

                        : 0

                        }

                        />
                      <YAxis 
                        stroke="#9fa8da"
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `$${value.toFixed(9)}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toFixed(9)}`, 'Price']}
                        labelFormatter={(label) => {
                          const dataPoint = historicalData.find(d => d.name === label);
                          return dataPoint ? new Date(dataPoint.date).toLocaleString() : label;
                        }}
                        contentStyle={{ backgroundColor: '#1a1f2d', border: '1px solid #2d3753', borderRadius: '8px' }}
                        itemStyle={{ color: '#4a6cf7' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#4a6cf7" 
                        fill="url(#colorPrice)" 
                        fillOpacity={0.3} 
                        strokeWidth={2}
                        name="Price"
                      />
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4a6cf7" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4a6cf7" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Volume Chart */}
                <div style={{ ...chartContainerStyle, marginTop: '20px' }}>
                  <div style={chartTitleStyle}>
                    Trading Volume ({timeInterval === '1h' ? '1 Hour' : timeInterval === '1d' ? '1 Day' : timeInterval === '1w' ? '1 Week' : '1 Month'})
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3753" />
                      <XAxis

                        dataKey="name"

                        stroke="#9fa8da"

                        interval={

                        timeInterval === '1h' || timeInterval === '1d'

                        ? 'preserveStartEnd'

                        : timeInterval === '1m'

                        ? 2

                        : 0

                        }

                        />
                      <YAxis 
                        stroke="#9fa8da"
                        tickFormatter={(value) => value >= 1000000 
                          ? `$${(value/1000000).toFixed(1)}M` 
                          : value >= 1000 
                            ? `$${(value/1000).toFixed(0)}K` 
                            : `$${value}`
                        }
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Volume']}
                        labelFormatter={(label) => {
                          const dataPoint = volumeData.find(d => d.name === label);
                          return dataPoint ? new Date(dataPoint.date).toLocaleString() : label;
                        }}
                        contentStyle={{ backgroundColor: '#1a1f2d', border: '1px solid #2d3753', borderRadius: '8px' }}
                        itemStyle={{ color: '#6a11cb' }}
                      />
                      <Bar 
                        dataKey="volume" 
                        fill="url(#colorVolume)" 
                        name="Volume"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6a11cb" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2575fc" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TokenInfoDashboard;