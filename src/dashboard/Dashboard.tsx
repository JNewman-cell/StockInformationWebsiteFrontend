import type { FC } from 'react';
import { useUser } from '@stackframe/react';
import './Dashboard.css';

const Dashboard: FC = () => {
  const user = useUser();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-welcome">
          Welcome back, {user?.displayName || user?.primaryEmail}!
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Your Watchlist</h3>
            <p>Track your favorite stocks here</p>
            <div className="card-placeholder">Coming soon...</div>
          </div>

          <div className="dashboard-card">
            <h3>Recent Searches</h3>
            <p>View your search history</p>
            <div className="card-placeholder">Coming soon...</div>
          </div>

          <div className="dashboard-card">
            <h3>Portfolio</h3>
            <p>Manage your investments</p>
            <div className="card-placeholder">Coming soon...</div>
          </div>

          <div className="dashboard-card">
            <h3>Alerts</h3>
            <p>Price alerts and notifications</p>
            <div className="card-placeholder">Coming soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
