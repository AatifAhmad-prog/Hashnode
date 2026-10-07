import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import PostList from "../components/post/PostList";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function TagPage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/tags/${slug}/posts`);
        setPosts(data.posts || data);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  return (
    <section className="content-section narrow-section">
      <Link to="/" className="back-link">← Explore all</Link>
      <div className="tag-hero">
        <div className="tag-symbol">#</div>
        <div>
          <span className="section-kicker">TOPIC</span>
          <h1>{slug}</h1>
          <p>Explore published articles tagged with <strong>#{slug}</strong>.</p>
        </div>
      </div>
      <div className="section-heading">
        <h2>{loading ? "Articles" : `${posts.length} articles`}</h2>
      </div>
      {loading ? <LoadingSpinner /> : <PostList posts={posts} />}
    </section>
  );
}