import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userRaw = searchParams.get("user");
    if (userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        loginWithToken(user);
        navigate(user.role === "admin" ? "/admin" : "/shop", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Signing in...
    </div>
  );
}
