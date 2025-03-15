# WEB3 Task Wiser DAPP 

This is a React-based project that integrates **Web3Modal** and **ethers.js** for wallet connections and **Firebase** for user profile management.

## Features
- Connect wallet using **Web3Modal**
- Display user's profile picture after successful wallet connection
- Store and retrieve user data from **Firebase Firestore**
- Smooth animations for the form pop-up
- Responsive and modern UI with a **dark-themed** modal

## Tech Stack
- React.js
- ethers.js
- Web3Modal
- Firebase Firestore
- lucide-react (for icons)
- CSS Modules / SCSS for styling

## Installation

### Prerequisites
Make sure you have **Node.js** installed on your system.

### Steps
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo-name.git
   cd your-repo-name
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up Firebase And PINATA API**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Firestore Database**
   - Get your **Firebase config** and add it to a `.env` file:
     ```env
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```
   - Initialize Firebase in `firebase.js`

4. **Run the project**
   ```sh
   npm start
   ```

## Usage
- Click **Connect Wallet** (top-right corner)
- If the user is new, they will be prompted to fill out a profile form
- If the user exists, their **profile picture** replaces the button
- The profile form has smooth animations and a dark-themed background

## Dependencies
- **ethers.js**: `npm install ethers`
- **Web3Modal**: `npm install web3modal`
- **Firebase**: `npm install firebase`
- **lucide-react** (for icons): `npm install lucide-react`

## Folder Structure
```
/src
  ├── components
  │   ├── ProfileForm.js
  │   ├── UserProfile.js
  ├── styles
  │   ├── formStyles.css
  │   ├── buttonStyles.css
  ├── firebase.js
  ├── App.js
  ├── index.js
```

## Future Enhancements
- Add support for multiple wallets
- Improve animations and UI responsiveness
- Store profile images in Firebase Storage

## License
MIT License
