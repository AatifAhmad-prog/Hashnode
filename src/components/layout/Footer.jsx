import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-grid">
          <div className="footer-intro">
            <Link to="/" className="footer-brand">
              <span className="brand-mark">H</span>
              <span>hash<span style={{ color: "#d6a0a7" }}>node</span></span>
            </Link>
            <p className="footer-description">A developer-first home for thoughtful technical writing, ideas, and knowledge.</p>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>

            <Link to="/">Explore</Link>

            <Link to="/tag/javascript">
              Topics
            </Link>

            <Link to="/register">
              Create account
            </Link>
          </div>

          <div className="footer-column">
            <h4>Built with</h4>

            <span>React.js</span>
            <span>Express.js</span>
            <span>MongoDB</span>
            <span>Node.js</span>
          </div>

        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Hashnode Platform
          </span>

          <span>
            Built for developers.
          </span>
        </div>

      </div>
    </footer>
  );
}
