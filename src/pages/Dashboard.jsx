import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const deletePost = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    try {
      await api.delete(`/posts/${post._id}`);
      setPosts((current) => current.filter((item) => item._id !== post._id));
    } catch (error) {
      window.alert(error.response?.data?.message || "Unable to delete this post.");
    }
  };

  useEffect(() => {
    api.get("/posts/mine")
      .then(({ data }) => setPosts(data.posts || data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <section className="dashboard-section">
      <div className="dashboard-top">
        <div>
          <span className="section-kicker">YOUR WORKSPACE</span>
          <h1>Good to see you, {user?.name?.split(" ")[0] || "developer"}.</h1>
          <p>Manage your drafts, published stories, and your next idea.</p>
        </div>
        <Link to="/editor/new" className="button button-primary">＋ New post</Link>
      </div>

      <div className="stat-grid">
        <Stat value={posts.length} label="Total posts" />
        <Stat value={published.length} label="Published" />
        <Stat value={drafts.length} label="Drafts" />
      </div>

      <div className="dashboard-panel">
        <div className="panel-heading"><div><span className="section-kicker">CONTENT</span><h2>Your posts</h2></div></div>
        {loading ? <LoadingSpinner label="Loading your posts…" /> : posts.length === 0 ? (
          <div className="empty-dashboard"><span>✎</span><h3>Your writing starts here.</h3><p>Create your first technical article and share it with the community.</p><Link to="/editor/new" className="button button-primary">Write your first post</Link></div>
        ) : (
          <div className="dashboard-table">
            {posts.map((post) => (
              <div className="dashboard-row" key={post._id}>
                <div><span className={`status-badge ${post.status}`}>{post.status}</span><h3>{post.title}</h3><p>Updated {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}</p></div>
                <div className="row-actions"><Link to={`/editor/${post._id}`} className="button button-ghost button-small">Edit</Link><button type="button" className="button button-danger button-small" onClick={() => deletePost(post)}>Delete</button></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return <div className="stat-card"><strong>{value}</strong><span>{label}</span></div>;
}
