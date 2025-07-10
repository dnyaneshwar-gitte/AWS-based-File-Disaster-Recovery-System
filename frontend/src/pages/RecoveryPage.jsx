import React, { useState } from 'react';
import API from '../api/api';
import './recoveryPage.css'; // Optional: add styles here or use inline CSS

export default function RecoveryPage() {
  const [fileName, setFileName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      const res = await API.get(`/files/download/${fileName}`);
      if (res.data?.url) {
        setSuccess(true);
        window.open(res.data.url, '_blank');
      } else {
        setError('File not found in both buckets');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Recovery failed');
    }
  };

  return (
    <div className="form-container">
      <h2>🔁 Recover File</h2>
      <form onSubmit={handleRecover}>
        <input
          placeholder="Enter file name to recover"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          required
        />
        <button type="submit">Recover</button>
      </form>

      {success && (
        <div className="success-message">
          ✅ File recovered successfully!
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
