import React from 'react';
import './Landing.css';

const FanFiLanding = () => {
  return (
    <div className="fanfi-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">FanFi</div>
        <ul className="navbar-links">
          <li><a href="#what-is">What is FanFi?</a></li>
          <li><a href="#creators">For Creators</a></li>
          <li><a href="#fans">For Fans</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#cta">Get Started</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="neon-text">FanFi</span> - Tokenizing Entertainment
          </h1>
          <p className="hero-subtitle">
            The decentralized platform where fans become stakeholders in the culture they love
          </p>
          <div className="hero-buttons">
            <button className="primary-button">Launch App</button>
            <button className="secondary-button">Read Whitepaper</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="nft-card">
            <div className="nft-image"></div>
            <div className="nft-info">
              <h4>Avengers: Endgame FIP Token</h4>
              <p>Own a piece of cinematic history</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is FanFi */}
      <section id="what-is" className="what-is-section">
        <div className="section-header">
          <h2>What is FanFi?</h2>
          <p className="section-subtitle">
            FanFi is a decentralized entertainment finance platform that bridges Web3 and the creator economy
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Tokenized IP</h3>
            <p>Creators launch FIP Tokens representing ownership in their movies, shows, or music.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Built-in DEX</h3>
            <p>Trade FIP Tokens in our decentralized exchange with creator-aligned incentives.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>Web3 Ticketing</h3>
            <p>Book tickets using crypto or fiat, with token-based discounts and rewards.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Token-Gated Access</h3>
            <p>Exclusive communities and content for token holders.</p>
          </div>
        </div>
      </section>

      {/* For Creators */}
      <section id="creators" className="creators-section">
        <div className="section-header">
          <h2>For Creators</h2>
          <p className="section-subtitle">
            Empower your audience and monetize your IP like never before
          </p>
        </div>
        <div className="creator-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Tokenize Your IP</h3>
            <p>Launch FIP Tokens representing your movies, shows, or music in minutes.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Run a Presale</h3>
            <p>Raise early capital from your most loyal fans before public listing.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>List on DEX</h3>
            <p>Enable trading with liquidity pools and earn from every transaction.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Engage Your Fans</h3>
            <p>Offer token-gated content, rewards, and real-world perks.</p>
          </div>
        </div>
      </section>

      {/* For Fans */}
      <section id="fans" className="fans-section">
        <div className="section-header">
          <h2>For Fans</h2>
          <p className="section-subtitle">
            Become more than a consumer - become a stakeholder in the culture you love
          </p>
        </div>
        <div className="fan-cards">
          <div className="fan-card">
            <div className="fan-icon">💰</div>
            <h3>Invest in Culture</h3>
            <p>Buy FIP Tokens tied to your favorite movies, shows, or artists.</p>
          </div>
          <div className="fan-card">
            <div className="fan-icon">🎁</div>
            <h3>Earn Rewards</h3>
            <p>Get $FNF tokens for attending events and participating.</p>
          </div>
          <div className="fan-card">
            <div className="fan-icon">🔓</div>
            <h3>Exclusive Access</h3>
            <p>Unlock token-gated communities and content.</p>
          </div>
          <div className="fan-card">
            <div className="fan-icon">🎟️</div>
            <h3>Ticket Perks</h3>
            <p>Get discounts or free tickets based on your token holdings.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How FanFi Works</h2>
          <p className="section-subtitle">
            The decentralized entertainment economy in three simple layers
          </p>
        </div>
        <div className="layers">
          <div className="layer-card">
            <div className="layer-header">
              <div className="layer-number">1</div>
              <h3>Token Infrastructure</h3>
            </div>
            <ul>
              <li>FIP Token creation</li>
              <li>Presale module</li>
              <li>Built-in DEX</li>
              <li>Liquidity staking</li>
            </ul>
          </div>
          <div className="layer-card">
            <div className="layer-header">
              <div className="layer-number">2</div>
              <h3>Utility & Experience</h3>
            </div>
            <ul>
              <li>Web3 ticketing</li>
              <li>Token-gated communities</li>
              <li>Creator dashboards</li>
              <li>Fan portals</li>
            </ul>
          </div>
          <div className="layer-card">
            <div className="layer-header">
              <div className="layer-number">3</div>
              <h3>Engagement & Loyalty</h3>
            </div>
            <ul>
              <li>Attend-to-Earn</li>
              <li>Rewards engine</li>
              <li>Fan analytics</li>
              <li>Community tools</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What is an FIP Token?</h3>
            <p>FIP Tokens (FanFi Intellectual Property Tokens) represent fractional ownership or stake in entertainment IP like movies, shows, or music.</p>
          </div>
          <div className="faq-item">
            <h3>How do creators benefit?</h3>
            <p>Creators can raise funds through presales, earn from trading fees, and build deeper relationships with their most engaged fans.</p>
          </div>
          <div className="faq-item">
            <h3>Is FanFi only for crypto users?</h3>
            <p>No! Our ticketing system supports both crypto and fiat payments, making it accessible to all fans.</p>
          </div>
          <div className="faq-item">
            <h3>What can I do with $FNF tokens?</h3>
            <p>$FNF tokens can be staked for rewards, used for platform features, or traded on our DEX.</p>
          </div>
          <div className="faq-item">
            <h3>How do token-gated communities work?</h3>
            <p>By holding a creator's FIP Token, you gain access to exclusive content, events, and interactions with the creator.</p>
          </div>
          <div className="faq-item">
            <h3>What blockchains does FanFi support?</h3>
            <p>FanFi is currently built on Ethereum with plans to expand to other EVM-compatible chains.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-section">
        <div className="cta-content">
          <h2>Ready to revolutionize entertainment?</h2>
          <p>Join FanFi today and be part of the decentralized entertainment revolution.</p>
          <div className="cta-buttons">
            <button className="primary-button">Get Started</button>
            <button className="secondary-button">Contact Us</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="fanfi-footer">
        <div className="footer-logo">
          <h3>FanFi</h3>
          <p>Tokenizing Entertainment, Monetizing Culture</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">How it works</a>
            <a href="#">Pricing</a>
          </div>
          <div className="link-group">
            <h4>Resources</h4>
            <a href="#">Whitepaper</a>
            <a href="#">Documentation</a>
            <a href="#">Blog</a>
          </div>
          <div className="link-group">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="link-group">
            <h4>Connect</h4>
            <a href="#">Twitter</a>
            <a href="#">Discord</a>
            <a href="#">Telegram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 FanFi. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FanFiLanding;
