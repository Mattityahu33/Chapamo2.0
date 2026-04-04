import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../restAPI/api";
import "../AuthContainer.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear related errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (serverError) setServerError(null);
    if (emailExists && name === "email") setEmailExists(false);
    if (usernameExists && name === "username") setUsernameExists(false);

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const { username, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    setEmailExists(false);
    setUsernameExists(false);

    try {
      const res = await api.post('/auth/register', formData);
      
      if (res.data.success) {
        // Redirect to login page after successful registration
        navigate('/login', { state: { registrationSuccess: true } });
      }
    } catch (err) {
      if (err.response) {
        // Handle email already exists case
        if (err.response.status === 409 && err.response.data.error?.includes("email")) {
          setEmailExists(true);
          setErrors(prev => ({ ...prev, email: "This email is already registered" }));
        } 
        // Handle username already exists
        else if (err.response.status === 409 && err.response.data.error?.includes("username")) {
          setUsernameExists(true);
          setErrors(prev => ({ ...prev, username: "This username is already taken" }));
        }
        else if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else {
          setServerError(err.response.data.message || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        setServerError("Network error. Please check your connection.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <header className="register-header">
          <h1>Create Your Account</h1>
          <p>Join our community today</p>
        </header>

        {serverError && (
          <div className="alert alert-error">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username Field */}
          <div className={`form-group ${errors.username || usernameExists ? "has-error" : ""}`}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={errors.username || usernameExists ? "error" : ""}
              aria-describedby="username-error"
            />
            {errors.username && (
              <span id="username-error" className="error-message">
                {errors.username}
              </span>
            )}
            {usernameExists && !errors.username && (
              <div className="username-exists-warning">
                <span className="warning-icon">⚠️</span>
                <span>This username is already taken. </span>
                <a href="/login" className="login-suggestion">Try a different one</a>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className={`form-group ${errors.email || emailExists ? "has-error" : ""}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email || emailExists ? "error" : ""}
              aria-describedby="email-error"
            />
            {errors.email && (
              <span id="email-error" className="error-message">
                {errors.email}
              </span>
            )}
            {emailExists && !errors.email && (
              <div className="email-exists-warning">
                <span className="warning-icon">⚠️</span>
                <span>This email is already registered. </span>
                <a href="/login" className="login-suggestion">Want to login instead?</a>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={errors.password ? "error" : ""}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="error-message">
                {errors.password}
              </span>
            )}
            <div className="password-hints">
              <span className={formData.password.length >= 8 ? "valid" : ""}>• 8+ characters</span>
              <span className={/(?=.*[a-z])/.test(formData.password) ? "valid" : ""}>• Lowercase</span>
              <span className={/(?=.*[A-Z])/.test(formData.password) ? "valid" : ""}>• Uppercase</span>
              <span className={/(?=.*\d)/.test(formData.password) ? "valid" : ""}>• Number</span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className={`form-group ${errors.confirmPassword ? "has-error" : ""}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "error" : ""}
              aria-describedby="confirmPassword-error"
            />
            {errors.confirmPassword && (
              <span id="confirmPassword-error" className="error-message">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="login-redirect">
          <p>
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;