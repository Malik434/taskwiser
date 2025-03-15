import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import "../styles/ProjectDashboard.css";

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(false);
  };

  return (
    <div>
      <div className="project-list-container">
        <ul className="project-list">
          <li onClick={() => navigate("/")} className="home-icon">
            <Home />
          </li>
          {projects.map((project) => (
            <li
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              {project.name.charAt(0).toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      <button className="add-project-btn" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && (
        <div className="project-modal-overlay">
          <div className="project-modal-container">
            <h3>Create New Project</h3>
            <input
              type="text"
              className="project-input"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createProject()}
            />
            <button className="create-project-btn" onClick={createProject}>
              Create
            </button>
            <button
              className="project-close-modal-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
