import PostCard from "./PostCard";

export default function PostList({ posts = [], featured = false }) {
  if (!posts.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✦</div>
        <h3>No articles found</h3>
        <p>Try another search or check back later for new developer stories.</p>
      </div>
    );
  }

  return (
    <div className={featured ? "post-grid post-grid-featured" : "post-grid"}>
      {posts.map((post, index) => <PostCard key={post._id || post.id || index} post={post} featured={featured && index === 0} />)}
    </div>
  );
}