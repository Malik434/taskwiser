function UserProfile({ userProfile }) {
  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <h2>Welcome, {userProfile.username}!</h2>
    </div>
  );
}

export default UserProfile;
