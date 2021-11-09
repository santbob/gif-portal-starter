import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect } from 'react';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;
      if (solana) {
        if(solana.isPhantom) {
          console.log('Phantom wallet is found');
          const response = await solana.connect({onlyIfTrusted: true});
          console.log("Connected with public key ", response.publicKey.toString());
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

  useEffect(()=>{
    window.addEventListener('load', async (event) => {
      await checkIfWalletIsConnected();
    });
  }, [])

  return (

    <div className="App">
      <div className="curves">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </div>
      <div className="container">
        <div className="header-container">
          <p className="header">PixelArt Portal</p>
          <p className="sub-text">
            View your Pixel Art collection in the metaverse based on the seed word✨
          </p>
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
