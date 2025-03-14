import { useState } from "react";
import axios from "axios";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { X } from "lucide-react";

<<<<<<< HEAD
const ProfileForm = ({ walletAddress, closeForm }) => {
=======
const ProfileForm = ({ walletAddress, closeForm, onProfileCreated }) => {
>>>>>>> e6ecf1410d338323742a88f79d2a3e44ed708c94
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  };

  const registerUser = async () => {
    if (!username || !profilePic) return alert("Fill all fields");

    setLoading(true);

    // Upload profile picture to IPFS
    const ipfsCID = await uploadToIPFS(profilePic);

    const userProfileData = {
      username: username,
      profilePic: ipfsCID,
    };

    // Store in Firebase
    await setDoc(doc(db, "users", walletAddress), {
      username: username,
      profilePic: ipfsCID,
    });

    alert("Profile created successfully!");
    onProfileCreated(userProfileData);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="form-container"
      >
        <button onClick={closeForm} className="close-btn">
          <X size={24} />
        </button>
        <h2 className="form-title">Complete Your Profile</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />
        <p>Connected Wallet: {walletAddress.slice(0, 6)}....</p>
        <button className="save-btn" onClick={registerUser} disabled={loading}>
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </motion.div>
    </div>
  );
};

export default ProfileForm;
