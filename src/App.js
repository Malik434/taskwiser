import { useState } from "react";
import { BrowserProvider } from "ethers";
import Web3Modal from "web3modal";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import ProfileForm from "./components/ProfileForm";
import UserProfile from "./components/UserProfile";
import { AnimatePresence } from "framer-motion";
import "./styles/App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new BrowserProvider(connection);
    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    const message = `Login authentication at ${new Date().toISOString()}`;
    const signature = await signer.signMessage(message);

    console.log("Signed Message:", signature);

    setWalletAddress(address);

    const userRef = doc(db, "users", address);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserProfile(userSnap.data());
    } else {
      setShowForm(true);
    }
  };

  return (
    <div>
      {/* <button className="connect-btn" onClick={connectWallet}>
        {walletAddress
          ? `Connected: ${walletAddress.slice(0, 4)}`
          : "Connect Wallet"}
      </button> */}

      <div className="top-right">
        {userProfile ? (
          <img
            src={`https://ipfs.io/ipfs/${userProfile.profilePic}`}
            alt="Profile"
            className="profile-pic"
          />
        ) : (
          <button className="connect-btn" onClick={connectWallet}>
            {walletAddress
              ? `Connected: ${walletAddress.slice(0, 4)}...`
              : "Connect"}
          </button>
        )}
      </div>

      {userProfile ? (
        <UserProfile userProfile={userProfile} />
      ) : (
        <AnimatePresence>
          {showForm && (
            <ProfileForm
              walletAddress={walletAddress}
              closeForm={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;
