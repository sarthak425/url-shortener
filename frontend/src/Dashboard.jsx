import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl, getUserUrls } from './api';
import './Dashboard.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8083';

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await getUserUrls();
      setUrls(response.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await shortenUrl(newUrl);
      setNewUrl('');
      fetchUrls(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || 'Failed to shorten URL');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>LinkShortener</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-main">
        <div className="shorten-card">
          <h2>Create New Short Link</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleShorten} className="shorten-form">
            <input 
              type="url" 
              placeholder="Enter your long URL here (e.g., https://example.com/very/long/path)" 
              value={newUrl} 
              onChange={(e) => setNewUrl(e.target.value)} 
              required 
            />
            <button type="submit" className="primary-btn">Shorten!</button>
          </form>
        </div>

        <div className="urls-list-card">
          <h2>Your Links</h2>
          {urls.length === 0 ? (
            <p className="no-urls">You haven't shortened any URLs yet.</p>
          ) : (
            <table className="urls-table">
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Short URL</th>
                  <th>Clicks</th>
                  <th>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {urls.map(url => (
                  <tr key={url.id}>
                    <td className="truncate-text" title={url.originalUrl}>
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                        {url.originalUrl}
                      </a>
                    </td>
                    <td>
                      <a href={`${BACKEND_URL}/${url.shortUrl}`} target="_blank" rel="noopener noreferrer" className="short-link">
                        {`${BACKEND_URL}/${url.shortUrl}`}
                      </a>
                    </td>
                    <td><span className="click-count">{url.clickCount}</span></td>
                    <td>{new Date(url.createdDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
