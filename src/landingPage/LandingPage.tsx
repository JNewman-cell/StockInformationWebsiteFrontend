import { Link } from 'react-router-dom';
import { useUser, useStackApp } from '@stackframe/react';
import { useEffect } from 'react';
import { stockAPI } from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const user = useUser();
  const app = useStackApp();

  useEffect(() => {
    stockAPI.startup();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span>Open Source • Free Forever</span>
          </div>
          <h1 className="hero-title">
            Stock Market Data,
            <span className="gradient-text"> Reimagined</span>
          </h1>
          <p className="hero-subtitle">
            A modern, open-source platform delivering Yahoo Finance data through clean, 
            focused interfaces. Built to showcase enterprise-grade backend architecture 
            and full-stack engineering excellence.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Explore Dashboard
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => app.redirectToSignIn()}
                className="btn btn-primary"
              >
                Sign In to Access Dashboard
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
            <a 
              href="https://github.com/JNewman-cell/StockInformationWebsiteBackend" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View Source
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-header">
              <div className="status-indicator"></div>
              <span>Live Data</span>
            </div>
            <div className="metric-value">5,000+</div>
            <div className="metric-label">Stock Tickers</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-header">
              <div className="status-indicator status-success"></div>
              <span>Database</span>
            </div>
            <div className="metric-value">Daily</div>
            <div className="metric-label">Auto Updates</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-header">
              <div className="status-indicator status-info"></div>
              <span>API</span>
            </div>
            <div className="metric-value">RESTful</div>
            <div className="metric-label">Endpoints</div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="section-container overview-section">
        <div className="section-header">
          <span className="section-badge">The Vision</span>
          <h2 className="section-title">Why This Project Exists</h2>
          <p className="section-description">
            Financial data should be accessible, organized, and free. This project reimagines 
            stock market information delivery through modern web technologies and clean architecture.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="feature-title">Real-Time Yahoo Finance Data</h3>
            <p className="feature-description">
              Direct integration with Yahoo Finance APIs providing market cap, P/E ratios, 
              dividend yields, and comprehensive stock metrics updated daily.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="feature-title">Open Source & Free Forever</h3>
            <p className="feature-description">
              Fully transparent codebase with MIT license. No paywalls, no premium tiers—just 
              clean, accessible financial data for everyone.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="feature-title">Focused, Organized Interface</h3>
            <p className="feature-description">
              No clutter, no ads—just the data you need. Advanced filtering, sorting, and 
              search capabilities designed for efficient market research.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="section-container architecture-section">
        <div className="section-header">
          <span className="section-badge">Engineering Excellence</span>
          <h2 className="section-title">Built for Scale & Performance</h2>
          <p className="section-description">
            Enterprise-grade architecture showcasing modern backend development practices, 
            microservices patterns, and automated data pipelines.
          </p>
        </div>

        <div className="architecture-grid">
          {/* Backend Stack */}
          <div className="architecture-card">
            <div className="architecture-header">
              <div className="architecture-icon backend-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="architecture-title">Backend API</h3>
                <a 
                  href="https://github.com/JNewman-cell/StockInformationWebsiteBackend" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="architecture-link"
                >
                  View Repository →
                </a>
              </div>
            </div>
            
            <div className="tech-stack">
              <div className="tech-item">
                <span className="tech-badge java">Java 21</span>
                <p>Modern language features & performance</p>
              </div>
              <div className="tech-item">
                <span className="tech-badge spring">Spring Boot 3.2</span>
                <p>Industry-standard framework with JPA/Hibernate</p>
              </div>
              <div className="tech-item">
                <span className="tech-badge postgres">PostgreSQL</span>
                <p>Production database hosted on Neon DB</p>
              </div>
              <div className="tech-item">
                <span className="tech-badge api">RESTful API</span>
                <p>OpenAPI documented endpoints with validation</p>
              </div>
            </div>

            <div className="architecture-features">
              <h4>Key Implementations</h4>
              <ul>
                <li><strong>JPA/Hibernate ORM:</strong> Entity relationships with foreign keys (CIK lookup)</li>
                <li><strong>MapStruct:</strong> Compile-time DTO mappers for type-safe transformations</li>
                <li><strong>Pagination & Filtering:</strong> Efficient data retrieval with JPA Specifications</li>
                <li><strong>Global Exception Handling:</strong> Centralized error responses with proper HTTP codes</li>
                <li><strong>H2 Dev Database:</strong> In-memory testing environment</li>
              </ul>
            </div>
          </div>

          {/* Data Pipeline */}
          <div className="architecture-card">
            <div className="architecture-header">
              <div className="architecture-icon pipeline-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="architecture-title">Automated Data Pipeline</h3>
                <a 
                  href="https://github.com/JNewman-cell/StockInformationWebsiteGithubActions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="architecture-link"
                >
                  View Repository →
                </a>
              </div>
            </div>
            
            <div className="tech-stack">
              <div className="tech-item">
                <span className="tech-badge python">Python</span>
                <p>Data processing & validation scripts</p>
              </div>
              <div className="tech-item">
                <span className="tech-badge github">GitHub Actions</span>
                <p>Scheduled workflows & CI/CD automation</p>
              </div>
              <div className="tech-item">
                <span className="tech-badge yahoo">Yahoo Finance API</span>
                <p>Primary data source via yahooquery library</p>
              </div>
              <div className="tech-item">
                <span className="tech-badge nasdaq">NASDAQ API</span>
                <p>Ticker discovery & validation</p>
              </div>
            </div>

            <div className="architecture-features">
              <h4>Pipeline Capabilities</h4>
              <ul>
                <li><strong>Daily Synchronization:</strong> Automated 7 AM UTC runs to sync 5,000+ tickers</li>
                <li><strong>Three-Way Analysis:</strong> ADD/UPDATE/DELETE operations based on source data</li>
                <li><strong>Batch Processing:</strong> 50 symbols/batch with 6 concurrent workers</li>
                <li><strong>Retry Logic:</strong> Handles API errors & invalid crumb responses</li>
                <li><strong>Data Integrity:</strong> Timestamp tracking for audit trails & change detection</li>
                <li><strong>Rate Limiting:</strong> Conservative delays to respect API quotas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accomplishments */}
      <section className="section-container accomplishments-section">
        <div className="section-header">
          <span className="section-badge">Impact & Achievements</span>
          <h2 className="section-title">What's Been Accomplished</h2>
        </div>

        <div className="accomplishments-grid">
          <div className="accomplishment-card">
            <div className="accomplishment-icon">📊</div>
            <h3>Database Architecture</h3>
            <p>
              Designed and implemented PostgreSQL schema with <strong>STOCKS</strong> and 
              <strong>TICKER_SUMMARY</strong> tables, featuring foreign key relationships, 
              indexes for performance, and automated timestamp tracking for audit compliance.
            </p>
          </div>

          <div className="accomplishment-card">
            <div className="accomplishment-icon">⚡</div>
            <h3>Performance Optimization</h3>
            <p>
              Reduced GitHub Actions runtime from <strong>~6 minutes to ~5 minutes</strong> (16.67% improvement) 
              through optimized batch processing, efficient environment setup, and streamlined data persistence.
            </p>
          </div>

          <div className="accomplishment-card">
            <div className="accomplishment-icon">🔧</div>
            <h3>Open Source Contributions</h3>
            <p>
              Fixed critical bugs in <strong>yahooquery</strong> (Python Yahoo Finance wrapper) and created 
              <strong>Improved-US-Stock-Symbols</strong> fork addressing NASDAQ API issues affecting data integrity.
            </p>
          </div>

          <div className="accomplishment-card">
            <div className="accomplishment-icon">🏗️</div>
            <h3>Microservice Architecture</h3>
            <p>
              Transitioned from monolithic structure to microservice-based repo management, enabling 
              <strong>60% faster development</strong> for new tables and workflows through modular design.
            </p>
          </div>

          <div className="accomplishment-card">
            <div className="accomplishment-icon">🧪</div>
            <h3>Comprehensive Testing</h3>
            <p>
              Implemented full test coverage with H2 in-memory database, repository integration tests, 
              service layer unit tests, and controller endpoint validation.
            </p>
          </div>

          <div className="accomplishment-card">
            <div className="accomplishment-icon">📚</div>
            <h3>API Documentation</h3>
            <p>
              Integrated SpringDoc OpenAPI for interactive API documentation (Swagger UI), enabling 
              easy testing and clear contract definitions for frontend integration.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Summary */}
      <section className="section-container tech-stack-section">
        <div className="section-header">
          <span className="section-badge">Complete Stack</span>
          <h2 className="section-title">Technologies & Tools</h2>
        </div>

        <div className="tech-categories">
          <div className="tech-category">
            <h3>Backend</h3>
            <div className="tech-tags">
              <span className="tech-tag">Java 21</span>
              <span className="tech-tag">Spring Boot</span>
              <span className="tech-tag">Spring Data JPA</span>
              <span className="tech-tag">Hibernate</span>
              <span className="tech-tag">MapStruct</span>
              <span className="tech-tag">Maven</span>
            </div>
          </div>

          <div className="tech-category">
            <h3>Frontend</h3>
            <div className="tech-tags">
              <span className="tech-tag">React 18</span>
              <span className="tech-tag">TypeScript</span>
              <span className="tech-tag">Vite</span>
              <span className="tech-tag">React Query</span>
              <span className="tech-tag">React Router</span>
            </div>
          </div>

          <div className="tech-category">
            <h3>Data & APIs</h3>
            <div className="tech-tags">
              <span className="tech-tag">PostgreSQL</span>
              <span className="tech-tag">Yahoo Finance API</span>
              <span className="tech-tag">NASDAQ API</span>
              <span className="tech-tag">RESTful Services</span>
              <span className="tech-tag">OpenAPI</span>
            </div>
          </div>

          <div className="tech-category">
            <h3>DevOps & Automation</h3>
            <div className="tech-tags">
              <span className="tech-tag">GitHub Actions</span>
              <span className="tech-tag">Python Scripts</span>
              <span className="tech-tag">Docker</span>
              <span className="tech-tag">Render</span>
              <span className="tech-tag">Neon DB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-container cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            {user ? 'Ready to Explore?' : 'Join the Community'}
          </h2>
          <p className="cta-description">
            {user
              ? 'Dive into the dashboard to search, filter, and analyze stock data. Or explore the source code to see how it\'s all built.'
              : 'Create an account to access the full dashboard with advanced stock analysis tools. Explore the open source code to see how it\'s built.'
            }
          </p>
          <div className="cta-buttons">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Open Dashboard
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => app.redirectToSignUp()}
                className="btn btn-primary btn-lg"
              >
                Create Account
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>
            )}
            <a 
              href="https://github.com/JNewman-cell" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              View GitHub Profile
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Stock Information Website</h3>
            <p>Open source financial data platform • Built with ❤️ by Jackson Newman</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/JNewman-cell/StockInformationWebsiteBackend" target="_blank" rel="noopener noreferrer">
              Backend Repo
            </a>
            <a href="https://github.com/JNewman-cell/StockInformationWebsiteGithubActions" target="_blank" rel="noopener noreferrer">
              Data Pipeline
            </a>
            <a href="https://github.com/JNewman-cell/StockInformationWebsiteFrontend" target="_blank" rel="noopener noreferrer">
              Frontend Repo
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Jackson Newman • MIT License • Free Forever</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
