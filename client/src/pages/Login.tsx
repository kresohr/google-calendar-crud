import { useSearchParams } from "react-router-dom";
import style from "./Login.module.css";

// NOTE: If the URL is set different than localhost:3000, CORS errors and Google API errors may occur
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const Login = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div>
      <h1>Login</h1>

      {error && (
        <p className={style["error-text"]}>
          {error === "auth_failed" &&
            "Authentication failed. Please try again."}
        </p>
      )}

      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};
