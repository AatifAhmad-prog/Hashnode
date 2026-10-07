import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Write button logic
  const handleWrite = () => {
    if (user) {
      navigate("/editor/new");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="site-header">
      <div className="nav-container">

        {/* LOGO */}
        <Link to="/" className="brand">
          <span className="brand-mark">H</span>

          <span className="brand-name">
            hash<span>node</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="desktop-nav">
          <NavLink to="/" end>
            Explore
          </NavLink>

          <NavLink to="/tag/javascript">
            Topics
          </NavLink>

          {user && (
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="nav-actions">

          {/* SEARCH */}
          <div className="nav-search">
            <span className="search-icon">⌕</span>

            <input
              aria-label="Search articles"
              placeholder="Search articles"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = e.currentTarget.value.trim();

                  if (value) {
                    navigate(
                      `/?search=${encodeURIComponent(value)}`
                    );
                  }
                }
              }}
            />
          </div>

          {status === "loading" ? (
            <div className="nav-skeleton" />
          ) : (
            <>
              {/* WRITE BUTTON — ALWAYS VISIBLE */}
              <button
                type="button"
                className="button button-primary button-small write-button"
                onClick={handleWrite}
              >
                <span className="write-icon">＋</span>
                Write
              </button>

              {/* LOGGED IN */}
              {user ? (
                <div className="profile-menu">

                  <Link
                    to={`/profile/${user._id || user.id}`}
                    className="avatar avatar-small"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                      />
                    ) : (
                      (user.name || "U").charAt(0).toUpperCase()
                    )}
                  </Link>

                  <button
                    className="icon-button"
                    title="Log out"
                    onClick={handleLogout}
                  >
                    ↪
                  </button>

                </div>
              ) : (
                /* LOGGED OUT */
                <>
                  <Link
                    to="/login"
                    className="button button-ghost button-small"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    className="button button-primary button-small"
                  >
                    Get started
                  </Link>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </header>
  );
}