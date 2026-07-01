import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl, getUserUrls, updateUrl, deleteUrl, getUrlAnalytics } from './api';
import './Dashboard.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8083';

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Modal States
  const [editingUrl, setEditingUrl] = useState(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState('');
  const [editCustomAlias, setEditCustomAlias] = useState('');
  const [editError, setEditError] = useState('');

  const [statsUrl, setStatsUrl] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
      await shortenUrl(newUrl, customAlias);
      setNewUrl('');
      setCustomAlias('');
      fetchUrls(); // Refresh the list
    } catch (err) {
      const errMsg = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || 'Failed to shorten URL');
      setError(errMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this short URL? All history and analytics will be permanently removed.')) {
      try {
        await deleteUrl(id);
        fetchUrls();
      } catch (err) {
        alert(err.response?.data || 'Failed to delete URL');
      }
    }
  };

  const openEditModal = (url) => {
    setEditingUrl(url);
    setEditOriginalUrl(url.originalUrl);
    setEditCustomAlias(url.shortUrl);
    setEditError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      await updateUrl(editingUrl.id, editOriginalUrl, editCustomAlias);
      setEditingUrl(null);
      fetchUrls();
    } catch (err) {
      setEditError(err.response?.data || 'Failed to update URL');
    }
  };

  const openStatsModal = async (url) => {
    setStatsUrl(url);
    setLoadingStats(true);
    setAnalyticsData(null);
    try {
      const response = await getUrlAnalytics(url.id);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <span className="logo-icon">🔗</span>
          <h1>LinkShortener</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-main">
        <div className="shorten-card">
          <h2>Create New Short Link</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleShorten} className="shorten-form">
            <div className="form-group">
              <label htmlFor="originalUrl">Destination URL</label>
              <input 
                id="originalUrl"
                type="url" 
                placeholder="Enter your long URL here (e.g., https://example.com/very/long/path)" 
                value={newUrl} 
                onChange={(e) => setNewUrl(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="customAlias">Custom Alias (Optional)</label>
              <div className="alias-input-wrapper">
                <span className="alias-prefix">{BACKEND_URL}/</span>
                <input 
                  id="customAlias"
                  type="text" 
                  placeholder="custom-slug" 
                  value={customAlias} 
                  onChange={(e) => setCustomAlias(e.target.value)} 
                  pattern="^[a-zA-Z0-9-_/]+$"
                  title="Only letters, numbers, hyphens, underscores, and slashes are allowed."
                />
              </div>
            </div>
            <button type="submit" className="primary-btn">Shorten!</button>
          </form>
        </div>

        <div className="urls-list-card">
          <h2>Your Links</h2>
          {urls.length === 0 ? (
            <p className="no-urls">You haven't shortened any URLs yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="urls-table">
                <thead>
                  <tr>
                    <th>Original URL</th>
                    <th>Short URL</th>
                    <th>Clicks</th>
                    <th>Date Created</th>
                    <th>Actions</th>
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
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => openEditModal(url)} className="action-btn edit-btn" title="Edit Link">✏️</button>
                          <button onClick={() => openStatsModal(url)} className="action-btn stats-btn" title="View Stats">📊</button>
                          <button onClick={() => handleDelete(url.id)} className="action-btn delete-btn" title="Delete Link">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingUrl && (
        <div className="modal-overlay" onClick={() => setEditingUrl(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Link</h2>
              <button className="close-btn" onClick={() => setEditingUrl(null)}>&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              {editError && <div className="error-message">{editError}</div>}
              <div className="form-group">
                <label>Destination URL</label>
                <input 
                  type="url" 
                  value={editOriginalUrl} 
                  onChange={(e) => setEditOriginalUrl(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Custom Alias</label>
                <div className="alias-input-wrapper">
                  <span className="alias-prefix">{BACKEND_URL}/</span>
                  <input 
                    type="text" 
                    value={editCustomAlias} 
                    onChange={(e) => setEditCustomAlias(e.target.value)} 
                    required
                    pattern="^[a-zA-Z0-9-_/]+$"
                    title="Only letters, numbers, hyphens, underscores, and slashes are allowed."
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setEditingUrl(null)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats/Analytics Modal */}
      {statsUrl && (
        <div className="modal-overlay" onClick={() => setStatsUrl(null)}>
          <div className="modal-content stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Link Analytics</h2>
              <button className="close-btn" onClick={() => setStatsUrl(null)}>&times;</button>
            </div>
            <div className="stats-details">
              <p><strong>Short Link:</strong> {`${BACKEND_URL}/${statsUrl.shortUrl}`}</p>
              <p className="truncate-text"><strong>Destination:</strong> {statsUrl.originalUrl}</p>
              <p><strong>Total Clicks:</strong> <span className="click-badge">{statsUrl.clickCount}</span></p>
              
              <div className="analytics-section">
                <h3>Clicks over time (Daily)</h3>
                {loadingStats ? (
                  <p>Loading analytics data...</p>
                ) : analyticsData && Object.keys(analyticsData).length > 0 ? (
                  <div className="analytics-chart">
                    {Object.entries(analyticsData).map(([date, count]) => {
                      // Simple bar width calculation
                      const maxCount = Math.max(...Object.values(analyticsData));
                      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      return (
                        <div key={date} className="chart-bar-row">
                          <span className="chart-date">{date}</span>
                          <div className="chart-bar-container">
                            <div className="chart-bar" style={{ width: `${percentage}%` }}>
                              <span className="chart-count-label">{count}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-stats">No clicks recorded yet. Share your short link to collect data!</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="primary-btn" onClick={() => setStatsUrl(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
