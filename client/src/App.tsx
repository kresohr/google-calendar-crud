import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <h1>Google Calendar Crud</h1>
      <p className="email-wrapper">Logged in as: {user.email}</p>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
      <main>
        <Outlet />
      </main>
    </>
  );
}
