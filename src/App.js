import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_PIXEL_ARTS = [
	'https://avatars.dicebear.com/api/pixel-art/santhosh.svg',
	'https://avatars.dicebear.com/api/pixel-art/ramya.svg',
	'https://avatars.dicebear.com/api/pixel-art/meera.svg',
	'https://avatars.dicebear.com/api/pixel-art/migan.svg'
]


const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);


  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;
      if (solana) {
        if(solana.isPhantom) {
          console.log('Phantom wallet is found');
          const response = await solana.connect({onlyIfTrusted: true});
          console.log("Connected with public key ", response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        } else {
          console.log('Please get a phantom wallet');
        }
      } else {
        console.log('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {
    const {solana} = window;

    if(solana) {
      const response = await solana.connect();
      console.log("Connected with public key ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  }

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <div className="gif-grid">
        {TEST_PIXEL_ARTS.map(art => (
          <div className="gif-item" key={art}>
            <img src={art} alt={art} />
          </div>
        ))}
      </div> 
    </div>
  );

  useEffect(()=>{
   const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [])

  return (

    <div className="App">
      <div className="curves">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </div>
      <div className={walletAddress? 'authed-container': 'container'}>
        <div className="header-container">
          <p className="header">PixelArt Portal</p>
          <p className="sub-text">
            View your Pixel Art collection in the metaverse based on the seed word✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
