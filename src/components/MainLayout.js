import { Outlet } from "react-router-dom";
import ProjectDashboard from "./ProjectDashboard";
import "../styles/MainLayout.css"; // Optional styling

const MainLayout = () => {
  return (
    <div className="main-layout">
      <ProjectDashboard />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
