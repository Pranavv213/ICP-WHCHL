import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const LiquidityDashboard = () => {
  // BSC Testnet addresses
  const PANCAKE_ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';

  // State variables
  const [tokenAddress, setTokenAddress] = useState('');
  const [amountToken, setAmountToken] = useState('100');
  const [amountBNB, setAmountBNB] = useState('0.1');
  const [swapAmount, setSwapAmount] = useState('10');
  const [pairAddress, setPairAddress] = useState('');
  const [liquidity, setLiquidity] = useState({ token: 0, bnb: 0 });
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [activeTab, setActiveTab] = useState('liquidity');
  const [tokenInfo, setTokenInfo] = useState({ name: '', symbol: '', decimals: 18 });
  const [estimatedSwap, setEstimatedSwap] = useState('');

  // Contract ABIs
  const routerABI = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
    "function factory() external view returns (address)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"
  ];

  const tokenABI = [
    "function approve(address spender, uint amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint)",
    "function name() external view returns (string)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)"
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

  // Fetch token info
  const fetchTokenInfo = async () => {
    if (!tokenAddress) return;
    
    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const [name, symbol, decimals] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals()
      ]);
      
      setTokenInfo({ name, symbol, decimals });
    } catch (err) {
      console.error('Error fetching token info:', err);
      setTokenInfo({ name: 'Unknown', symbol: 'UNK', decimals: 18 });
    }
  };

  // Check token approval
  const checkApproval = async () => {
    if (!tokenAddress || !window.ethereum) return;

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const userAddress = await signer.getAddress();
      
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const allowance = await tokenContract.allowance(userAddress, PANCAKE_ROUTER_ADDRESS);
      const amountTokenWei = ethers.utils.parseUnits(amountToken, tokenInfo.decimals);
      
      setIsApproved(allowance.gte(amountTokenWei));
    } catch (err) {
      console.error('Error checking approval:', err);
    }
  };

  // Approve token
  const approveToken = async () => {
    if (!tokenAddress) {
      setError('Please enter a token address');
      return;
    }

    try {
      setApproveLoading(true);
      setError('');

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const amountTokenWei = ethers.utils.parseUnits(amountToken, tokenInfo.decimals);

      const tx = await tokenContract.approve(PANCAKE_ROUTER_ADDRESS, amountTokenWei);
      setTxHash(tx.hash);
      setSuccess('Approval transaction sent. Waiting for confirmation...');

      await tx.wait();
      setSuccess('Token approval successful!');
      setIsApproved(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to approve token');
    } finally {
      setApproveLoading(false);
    }
  };

  // Add liquidity
  const addLiquidity = async () => {
    if (!tokenAddress || !amountToken || !amountBNB) {
      setError('Please fill all fields');
      return;
    }

    if (!isApproved) {
      setError('Please approve the token first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, signer);

      const amountTokenWei = ethers.utils.parseUnits(amountToken, tokenInfo.decimals);
      const amountTokenMin = amountTokenWei.mul(90).div(100);
      const amountBNBMin = ethers.utils.parseEther(amountBNB).mul(90).div(100);
      const deadline = Math.floor(Date.now() / 1000) + 1200;

      const tx = await router.addLiquidityETH(
        tokenAddress,
        amountTokenWei,
        amountTokenMin,
        amountBNBMin,
        await signer.getAddress(),
        deadline,
        { value: ethers.utils.parseEther(amountBNB) }
      );

      console.log(tx.hash)
      alert(tx.hash)

      setTxHash(tx.hash);
      setSuccess('Liquidity addition transaction sent. Waiting for confirmation...');

      const receipt = await tx.wait();
      setSuccess('Liquidity successfully added!');

      const factoryAddress = await router.factory();
      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      const pairAddr = await factory.getPair(tokenAddress, WBNB_ADDRESS);
      alert(pairAddr)
      setPairAddress(pairAddr);

      await checkReserves(pairAddr);

    } catch (err) {
      console.error('Error:', err);
      // setError(err.message || 'Failed to add liquidity');
    } finally {
      setLoading(false);
    }
  };

  // Check reserves
  const checkReserves = async (pairAddr) => {
    try {
      const pairContract = new ethers.Contract(pairAddr, pairABI, provider);
      const [reserves, token0Address] = await Promise.all([
        pairContract.getReserves(),
        pairContract.token0()
      ]);

      const isToken0WBNB = token0Address.toLowerCase() === WBNB_ADDRESS.toLowerCase();
      
      setLiquidity({
        token: ethers.utils.formatUnits(isToken0WBNB ? reserves.reserve1 : reserves.reserve0, tokenInfo.decimals),
        bnb: ethers.utils.formatUnits(isToken0WBNB ? reserves.reserve0 : reserves.reserve1, 18)
      });

    } catch (err) {
      console.error('Error checking reserves:', err);
    }
  };

  // Estimate swap
  const estimateSwap = async () => {
    if (!tokenAddress || !swapAmount) return;
    
    try {
      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, provider);
      
      const amountIn = ethers.utils.parseUnits(swapAmount, tokenInfo.decimals);
      const path = [tokenAddress, WBNB_ADDRESS];
      
      const amounts = await router.getAmountsOut(amountIn, path);
      const amountOut = ethers.utils.formatEther(amounts[1]);
      
      setEstimatedSwap(amountOut);
    } catch (err) {
      console.error('Error estimating swap:', err);
      setEstimatedSwap('Error estimating');
    }
  };

  // Swap tokens for WBNB
  const swapTokens = async () => {
    if (!tokenAddress || !swapAmount) {
      setError('Please fill all fields');
      return;
    }

    if (!isApproved) {
      setError('Please approve the token first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, routerABI, signer);
      
      const deadline = Math.floor(Date.now() / 1000) + 300;
      const userAddress = await signer.getAddress();
      
      const amountIn = ethers.utils.parseUnits(swapAmount, tokenInfo.decimals);
      const amountOutMin = ethers.utils.parseEther(estimatedSwap).mul(95).div(100); // 5% slippage
      const path = [tokenAddress, WBNB_ADDRESS];
      
      const tx = await router.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        path,
        userAddress,
        deadline
      );

      setTxHash(tx.hash);
      setSuccess('Swap transaction sent. Waiting for confirmation...');

      await tx.wait();
      setSuccess('Swap successful!');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to execute swap');
    } finally {
      setLoading(false);
    }
  };

  // Check approval when token address or amount changes
  useEffect(() => {
    fetchTokenInfo();
    checkApproval();
    if (tokenAddress && swapAmount) {
      estimateSwap();
    }
  }, [tokenAddress, amountToken, swapAmount]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a237e', marginBottom: '10px' }}>
          BEP20 Token Liquidity Dashboard
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#5c6bc0' }}>
          Add liquidity or swap tokens on PancakeSwap (BSC Testnet)
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#f5f7ff', 
        borderRadius: '15px', 
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
          <button 
            onClick={() => setActiveTab('liquidity')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'liquidity' ? '#1a237e' : 'transparent',
              color: activeTab === 'liquidity' ? 'white' : '#1a237e',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              marginRight: '5px'
            }}
          >
            Add Liquidity
          </button>
          <button 
            onClick={() => setActiveTab('swap')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'swap' ? '#1a237e' : 'transparent',
              color: activeTab === 'swap' ? 'white' : '#1a237e',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Swap Tokens
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1a237e', fontWeight: '500' }}>
            Token Address:
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '10px',
              border: '1px solid #c5cae9',
              fontSize: '1rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s',
              backgroundColor: '#fff'
            }}
          />
          {tokenInfo.name && (
            <div style={{ marginTop: '8px', color: '#3949ab', fontSize: '0.9rem' }}>
              Token: {tokenInfo.name} ({tokenInfo.symbol})
            </div>
          )}
        </div>

        {activeTab === 'liquidity' ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a237e', fontWeight: '500' }}>
                  Amount of Token to Add:
                </label>
                <input
                  type="text"
                  value={amountToken}
                  onChange={(e) => setAmountToken(e.target.value)}
                  placeholder="100"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '10px',
                    border: '1px solid #c5cae9',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1a237e', fontWeight: '500' }}>
                  Amount of BNB to Add:
                </label>
                <input
                  type="text"
                  value={amountBNB}
                  onChange={(e) => setAmountBNB(e.target.value)}
                  placeholder="0.1"
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '10px',
                    border: '1px solid #c5cae9',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
            </div>

            {!isApproved ? (
              <button 
                onClick={approveToken} 
                disabled={approveLoading || !tokenAddress}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#3949ab',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  opacity: approveLoading || !tokenAddress ? 0.7 : 1
                }}
              >
                {approveLoading ? 'Approving...' : 'Approve Token'}
              </button>
            ) : (
              <button 
                onClick={addLiquidity} 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #1a237e, #3949ab)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
              </button>
            )}
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1a237e', fontWeight: '500' }}>
                Amount of Token to Swap:
              </label>
              <input
                type="text"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                placeholder="100"
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '10px',
                  border: '1px solid #c5cae9',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#fff'
                }}
              />
            </div>

            {estimatedSwap && (
              <div style={{ 
                backgroundColor: '#e8eaf6', 
                padding: '15px', 
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#1a237e', fontWeight: '500' }}>Estimated WBNB:</span>
                  <span style={{ color: '#1a237e', fontWeight: '600' }}>{estimatedSwap} WBNB</span>
                </div>
              </div>
            )}

            {!isApproved ? (
              <button 
                onClick={approveToken} 
                disabled={approveLoading || !tokenAddress}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#3949ab',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  opacity: approveLoading || !tokenAddress ? 0.7 : 1
                }}
              >
                {approveLoading ? 'Approving...' : 'Approve Token'}
              </button>
            ) : (
              <button 
                onClick={swapTokens} 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #1a237e, #3949ab)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Swapping...' : 'Swap to WBNB'}
              </button>
            )}
          </div>
        )}

        {(error || success) && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '10px',
            marginBottom: '20px',
            backgroundColor: error ? '#ffebee' : '#e8f5e9',
            border: `1px solid ${error ? '#f44336' : '#4caf50'}`
          }}>
            <div style={{ color: error ? '#f44336' : '#4caf50', fontWeight: '500' }}>
              {error || success}
              {txHash && (
                <div style={{ marginTop: '10px' }}>
                  <a 
                    href={`https://testnet.bscscan.com/tx/${txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#1a237e' }}
                  >
                    View on BscScan
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {pairAddress && (
          <div style={{ 
            backgroundColor: '#e8eaf6', 
            padding: '20px', 
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <h3 style={{ color: '#1a237e', marginTop: '0', marginBottom: '15px' }}>Liquidity Pair Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <div style={{ color: '#5c6bc0', marginBottom: '5px' }}>Pair Address:</div>
                <div style={{ wordBreak: 'break-all', fontWeight: '500' }}>{pairAddress}</div>
              </div>
              <div>
                <div style={{ color: '#5c6bc0', marginBottom: '5px' }}>Token Reserve:</div>
                <div style={{ fontWeight: '500' }}>{liquidity.token} {tokenInfo.symbol}</div>
              </div>
              <div>
                <div style={{ color: '#5c6bc0', marginBottom: '5px' }}>BNB Reserve:</div>
                <div style={{ fontWeight: '500' }}>{liquidity.bnb} BNB</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: '#e8eaf6', 
        borderRadius: '15px', 
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <h3 style={{ color: '#1a237e', marginTop: '0' }}>Important Information</h3>
        <ul style={{ paddingLeft: '20px', color: '#5c6bc0' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Any wallet holder can add liquidity</strong> - You don't need to be the token creator
          </li>
          <li style={{ marginBottom: '10px' }}>
            Ensure you're connected to <strong>Binance Smart Chain Testnet</strong> (chainId: 97)
          </li>
          <li style={{ marginBottom: '10px' }}>
            You need test BNB for gas fees and token balances for swaps
          </li>
          <li>
            Token approval is required before adding liquidity or swapping
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LiquidityDashboard;