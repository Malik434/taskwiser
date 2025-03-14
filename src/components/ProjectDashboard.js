import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/ProjectDashboard.css"; // Ensure the CSS file is imported

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjects(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchProjects();
  }, []);

  const createProject = async () => {
    if (!projectName.trim()) return;
    const docRef = await addDoc(collection(db, "projects"), {
      name: projectName,
    });
    setProjects([...projects, { id: docRef.id, name: projectName }]);
    setProjectName("");
  };

  return (
    <div className="dashboard-container">
      <h2>Project Dashboard</h2>
      <input
        type="text"
        className="project-input"
        placeholder="New Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <button className="create-project-btn" onClick={createProject}>
        Create Project
      </button>
      <ul className="project-list">
        {projects.map((project) => (
          <li
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDashboard;
