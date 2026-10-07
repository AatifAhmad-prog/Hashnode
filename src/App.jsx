import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import TagPage from "./pages/TagPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostEditor from "./pages/PostEditor";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/tag/:slug" element={<TagPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:id" element={<Profile />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor/new" element={<PostEditor />} />
            <Route path="/editor/:id" element={<PostEditor />} />
            <Route path="/settings" element={<ProfileSettings />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
