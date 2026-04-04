import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../AuthContainer.css";
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const { login, loading, error: authError, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (authError) {
      setError(null);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { username, password } = formData;
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const responsePayload = await login(formData);
      
      // ✅ Correctly handle the nested response from Axios/Backend
      const userRole = responsePayload?.data?.role || responsePayload?.role;

      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <header className="register-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </header>

        {authError && (
          <div className="alert alert-error">
            {typeof authError === "string"
              ? authError
              : authError.message || authError.error || "An unexpected error occurred"}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.username ? "has-error" : ""}`}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={errors.username ? "error" : ""}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <span id="username-error" className="error-message">
                {errors.username}
              </span>
            )}
          </div>

          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "error" : ""}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="error-message">
                {errors.password}
              </span>
            )}

            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-redirect">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="login-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
