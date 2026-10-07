import { Link } from "react-router-dom";
import TagPill from "./TagPill";

function formatDate(date) {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function PostCard({ post, featured = false }) {
  const author = post.author || {};
  return (
    <article className={`post-card ${featured ? "post-card-featured" : ""}`}>
      {post.coverImage && (
        <Link to={`/post/${post.slug}`} className="post-cover">
          <img src={post.coverImage} alt="" />
        </Link>
      )}

      <div className="post-card-content">
        <div className="post-meta">
          <Link to={`/profile/${author._id || author.id || "author"}`} className="author-mini">
            <span className="avatar avatar-tiny">
              {author.avatarUrl ? <img src={author.avatarUrl} alt="" /> : (author.name || "A").charAt(0)}
            </span>
            <span>{author.name || "Anonymous Developer"}</span>
          </Link>
          <span className="dot">·</span>
          <time>{formatDate(post.createdAt)}</time>
        </div>

        <Link to={`/post/${post.slug}`} className="post-title-link">
          <h2>{post.title}</h2>
        </Link>

        <p className="post-excerpt">{post.excerpt || "A technical article from the Hashnode community."}</p>

        <div className="post-card-bottom">
          <div className="tag-list">
            {(post.tags || []).slice(0, 3).map((tag) => <TagPill key={tag._id || tag.slug || tag} tag={tag} />)}
          </div>
          <span className="read-time">{post.readingTime || "5 min"} read</span>
        </div>
      </div>
    </article>
  );
}