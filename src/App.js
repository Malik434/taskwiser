// src/App.js
import { useState } from "react";
import { BrowserProvider, verifyMessage } from "ethers";
import Web3Modal from "web3modal";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import ProfileForm from "./components/ProfileForm";
import UserProfile from "./components/UserProfile";
import KanbanBoard from "./components/KanbanBoard"; // Import your Kanban board component
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectDashboard from "./components/ProjectDashboard";
import "./styles/App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new BrowserProvider(connection);
    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    const message = `Login authentication at ${new Date().toISOString()}`;
    const signature = await signer.signMessage(message);
    const recoveredAddress = verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      console.error("Signature verification failed!");
      return;
    }

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

  const logout = () => {
    setWalletAddress("");
    setUserProfile(null);
    setDropdownOpen(false);
  };

  return (
    <div>
      <div className="top-right">
        {userProfile ? (
          <div className="profile-container">
            <img
              src={`https://ipfs.io/ipfs/${userProfile.profilePic}`}
              alt="Profile"
              className="profile-pic"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => alert("Settings Clicked!")}>
                  Settings
                </button>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>
            {walletAddress
              ? `Connected: ${walletAddress.slice(0, 4)}...`
              : "Connect"}
          </button>
        )}
      </div>

      {userProfile ? (
        <div>
          <UserProfile userProfile={userProfile} />

          <Router>
            <Routes>
              <Route path="/" element={<ProjectDashboard />} />
              <Route path="/project/:projectId" element={<KanbanBoard />} />
            </Routes>
          </Router>
        </div>
) : (
  <AnimatePresence>
    {showForm && (
      <ProfileForm
        walletAddress={walletAddress}
        onProfileCreated={handleProfileCreated}
        closeForm={() => setShowForm(false)}
      />
    )}
  </AnimatePresence>
)}
</div>
  );
}

export default App;