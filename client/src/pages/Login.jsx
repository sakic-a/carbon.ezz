import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

// Google SVG icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.4 5.6-5 7.3v6h8.1c4.8-4.4 7.2-10.9 7.2-17.5z" fill="#4285F4"/>
    <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.2-7.8 2.2-6 0-11.1-4-12.9-9.4H2.7v6.2C6.7 42.9 14.8 48 24 48z" fill="#34A853"/>
    <path d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-6.2H2.7C1 17.3 0 20.5 0 24s1 6.7 2.7 9.7l8.4-4.8z" fill="#FBBC05"/>
    <path d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.6-6.6C35.9 2.5 30.4 0 24 0 14.8 0 6.7 5.1 2.7 12.8l8.4 4.8C12.9 13.5 18 9.5 24 9.5z" fill="#EA4335"/>
  </svg>
);

// Facebook SVG icon
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07z"/>
  </svg>
);

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
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
        if (!isRegister && result.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/shop");
        }
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/facebook";
  };

  const labels = {
    en: {
      googleBtn: "Continue with Google",
      facebookBtn: "Continue with Facebook",
      orDivider: "or",
    },
    bs: {
      googleBtn: "Nastavi s Googleom",
      facebookBtn: "Nastavi s Facebookom",
      orDivider: "ili",
    },
  };
  const lbl = (k) => labels[lang]?.[k] ?? labels.en[k];

  return (
    <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="container px-4 max-w-[420px]">
        <div className="bg-white p-10 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">
            {isRegister ? t("auth", "registerTitle") : t("auth", "loginTitle")}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-sm"
            >
              <GoogleIcon />
              {lbl("googleBtn")}
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-gray-50 text-gray-400 font-semibold py-2.5 px-4 rounded-lg text-sm cursor-not-allowed opacity-60"
            >
              <FacebookIcon />
              {lbl("facebookBtn")}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">{lbl("orDivider")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                  {t("auth", "name")}
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
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
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />

            </div>
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">
                {t("auth", "password")}
              </label>
              <input
                type="password"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
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
              className="w-full bg-primary text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
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
              onClick={() => { setIsRegister(!isRegister); setError(""); setSuccess(""); }}
              className="text-primary hover:underline font-semibold text-sm bg-transparent border-none cursor-pointer"
              type="button"
            >
              {isRegister ? t("auth", "loginText") : t("auth", "registerText")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
