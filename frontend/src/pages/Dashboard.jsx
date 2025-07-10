import React, { useEffect, useState } from 'react';
import API from '../api/api';
import './dashboard.css';

export default function Dashboard() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await API.get('/files/list');
      setFiles(res.data.files);
    } catch (err) {
      console.error('Failed to load files:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      const res = await API.post('/files/delete', { fileName });
      console.log(res.data.message);
      // Refresh file list after deletion
      fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      alert('Failed to delete file');
    }
  };

  return (
    <div className="dashboard">
      <h2>📂 Your Files (Primary - Mumbai)</h2>
      <div className="file-grid">
        {files.map((file) => (
          <div className="file-card" key={file.name}>
            <p>{file.name}</p>
            <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
            <button onClick={() => handleDelete(file.name)} className="delete-btn">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
