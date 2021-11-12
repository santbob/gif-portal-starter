import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import idl from './idl.json';
import kp from './keypair.json'

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the Pixel data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);

// create the PublicKey instance of the ProgramID by using address from idl metadata
const programID = new PublicKey(idl.metadata.address);

// set the network as devnet
const network = clusterApiUrl('devnet');

// controls how we want to acknowledge when a transaction is done
const opts = {
  preflightCommitment: "processed"
}

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [seedWord, setSeedWord] = useState('');
  const [pixelArtList, setPixelArtList] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet is found');
          const response = await solana.connect({ onlyIfTrusted: true });
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
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with public key ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  }

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const onSeedWordChange = (event) => {
    const { value } = event.target;
    setSeedWord(value);
  };

  const sendSeed = async () => {
    if (seedWord.length === 0) {
      console.log('Empty input. Try again.');
      return;
    }
    console.log('Pixel link:', `https://avatars.dicebear.com/api/pixel-art/${seedWord}.svg`);
    
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.addPixelArt(seedWord, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        }
      });
      console.log("Pixel Seed sucesfully sent to program", seedWord);
      await getPixelArtList();
    } catch (error) {
      console.error('Error sending seedWord ', error);
    }
    // reset the seed word
    setSeedWord('');
  };

  const renderConnectedContainer = () => {
    if (pixelArtList === null) {
      return (
        <div className="connected-container">
          <button className="cta-button submit-art-button" onClick={createPixelArtAccount}>
            Do One-Time Initialization For Art Program Account
          </button>
        </div>
      )
    }
    else {
      return (
        <div className="connected-container">
          <input type="text"
            placeholder="Enter the seed word"
            value={seedWord}
            onChange={onSeedWordChange} />
          <button className="cta-button submit-art-button" onClick={sendSeed}>Submit</button>
          <div className="art-list">
            {pixelArtList.map(({pixelSeed}, index) => (
              <div className="art-item" key={index}>
                <img src={`https://avatars.dicebear.com/api/pixel-art/${pixelSeed}.svg`} alt={pixelSeed} />
                <div className="seed">{pixelSeed} <i></i></div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  const createPixelArtAccount = async () => {
    try {
      const provider = await getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())

      await getPixelArtList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  const getPixelArtList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log('fetched the account ', account);
      setPixelArtList(account.pixelArtList);
    } catch (error) {
      console.log(error);
      setPixelArtList(null);
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [])

  useEffect(() => {
    if (walletAddress) {

      console.log("Fetching the pixel art list...")
      // access solana blockchain and get the pixel art list
      getPixelArtList();
    }
  }, [walletAddress])

  return (

    <div className="App">
      <div className="curves">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </div>
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">PixelArt Portal</p>
          <div className="sub-text">
            A collection of seed word based pixel art ✨
          </div>
        </div>
        {!walletAddress && renderNotConnectedContainer()}
        {walletAddress && renderConnectedContainer()}
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
