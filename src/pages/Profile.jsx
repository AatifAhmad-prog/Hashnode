import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import PostList from "../components/post/PostList";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(({ data }) => setProfile(data.user || data))
      .catch(() => setProfile({ name: "Developer", bio: "Building, learning, and sharing with the community.", posts: [] }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="center-page"><LoadingSpinner /></div>;

  return (
    <section className="content-section narrow-section">
      <div className="profile-hero">
        <div className="avatar avatar-large">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : (profile.name || "D").charAt(0)}</div>
        <div className="profile-info">
          <span className="section-kicker">DEVELOPER PROFILE</span>
          <h1>{profile.name}</h1>
          <p>{profile.bio || "No bio yet."}</p>
          <span className="profile-meta">Member since {new Date(profile.createdAt || Date.now()).getFullYear()}</span>
        </div>
      </div>
      <div className="section-heading"><h2>Published articles</h2></div>
      <PostList posts={profile.posts || []} />
    </section>
  );
}