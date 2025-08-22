import React, { useState, useEffect } from 'react';
import './ProjectBoard.css';

function ProjectBoard() {
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Fetch projects from the backend
    fetch('http://localhost:5000/api/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        alert('File uploaded successfully!');
        setProjects([...projects, data.project]);
      })
      .catch(error => console.error('Error uploading file:', error));
  };

  return (
    <div className="project-board">
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload PDF</button>
      </div>
      {projects.map(project => (
        <div key={project._id} className="project">
          <h2>{project.title}</h2>
          <div className="tasks">
            {project.mainTasks.map(task => (
              <div key={task.name} className="task">
                <h3>{task.name}</h3>
                <ul>
                  {task.subtasks.map((subtask, index) => (
                    <li key={index} className="subtask">
                      <span>{subtask}</span>
                      <select>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="finished">Finished</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectBoard;
