import React, { useState } from 'react';
import API from '../api/api';

export default function UploadPage() {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/files/upload', formData);
      alert(res.data.message);
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="form-container">
      <h2>⬆️ Upload File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
