import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, useSearchParams } from "react-router-dom";
export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    let result;
    if (isRegister) {
      result = await register(name, email, password);
    } else {
      result = await login(email, password);
    }
    setLoading(false);
    if (result.success) {
      setSuccess(isRegister ? "Registration Successful!" : "Login Successful!");
      setTimeout(() => {
        if (!isRegister && email === "admin@admin.com") {
          navigate("/admin");
        } else {
          navigate("/shop");
        }
      }, 1500);
    } else {
      setError(result.error);
    }
  };
  return (
    <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="container px-4 max-w-[400px]">
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">
            {isRegister ? t("auth", "registerTitle") : t("auth", "loginTitle")}
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                  {t("auth", "name")}
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {name.length > 0 && !/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,50}$/.test(name) && (
                  <p className="text-xs text-red-500 mt-1">
                    • Only letters allowed, 2-50 characters
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">
                {t("auth", "email")}
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
              {isRegister && email.length > 0 && ["test.com", "example.com", "mailinator.com", "tempmail.com", "guerrillamail.com"].includes(email.split("@")[1]) && (
                <p className="text-xs text-red-500 mt-1">
                  • Please use a valid email address
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">
                {t("auth", "password")}
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isRegister && (
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li className={password.length >= 8 ? "text-green-500" : ""}>
                    {password.length >= 8 ? "✓" : "•"} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                    {/[A-Z]/.test(password) ? "✓" : "•"} One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
                    {/[a-z]/.test(password) ? "✓" : "•"} One lowercase letter
                  </li>
                  <li className={/\d/.test(password) ? "text-green-500" : ""}>
                    {/\d/.test(password) ? "✓" : "•"} One number
                  </li>
                  <li className={/[!@#$%^&*]/.test(password) ? "text-green-500" : ""}>
                    {/[!@#$%^&*]/.test(password) ? "✓" : "•"} One special character (!@#$%^&*)
                  </li>
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary transition-colors"
              disabled={loading}
            >
              {loading
                ? "..."
                : isRegister
                  ? t("auth", "submitRegister")
                  : t("auth", "submit")}
            </button>
          </form>
          <div className="text-center mt-6">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:underline font-semibold text-sm bg-transparent border-none cursor-pointer"
              type="button"
            >
              {isRegister ? t("auth", "loginText") : t("auth", "registerText")}
            </button>
            {!isRegister && null}
          </div>
        </div>
      </div>
    </div>
  );
}
