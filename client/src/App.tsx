import { Navigate, Outlet } from "react-router-dom";
import "./App.css";

export default function App() {
  if (false) {
    return (
      <>
        <h1>Google Calendar Crud</h1>
        <main>
          <Outlet />
        </main>
      </>
    );
  } else {
    return <Navigate to="/login" replace />;
  }
}
