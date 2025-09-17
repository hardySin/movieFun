import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Envelope, Lock, Eye, EyeSlash, CameraReels, ArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import '../createAccount/login.css';
import firebase from '../service/firebase';
import { Sign } from 'crypto';

interface LoginState {
  email: string;
  password: string;
}

function Login() {
  const [login, setLogin] = useState<LoginState>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!login.email || !login.password) {
      setMessage("Please fill all required fields");
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setLoader(true);

    try {
      setLoader(true);
      setShowAlert(false);

      // Simulate login API call with Firebase
      await firebase.login(login.email, login.password);

      setLoader(false);
      navigate("/viewMovies");

    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error cases
      let errorMessage = "Login failed. Please try again.";

      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = "Invalid email address format.";
            break;
          case 'auth/user-disabled':
            errorMessage = "This account has been disabled.";
            break;
          case 'auth/user-not-found':
            errorMessage = "No account found with this email.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Incorrect password. Please try again.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many failed attempts. Account temporarily locked.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = error.message || "Login failed. Please try again.";
        }
      }

      setMessage(errorMessage);
      setLoader(false);
      setShowAlert(true);
    }
  }

    const isFormValid = login.email && login.password;

  async function SignIn(type: 'google' | 'github' | 'facebook', event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
   
    setLoader(true);
    setShowAlert(false);

    try {
      await firebase.socialLogin(type);
      setLoader(false);
      navigate("/viewMovies");
    } catch (error: any) {
      let errorMessage = "Google sign-in failed. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = "Sign-in popup closed before completing.";
            break;
          case 'auth/cancelled-popup-request':
            errorMessage = "Cancelled previous sign-in attempt.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      setMessage(errorMessage);
      setLoader(false);
      setShowAlert(true);
    }
  }

    return (
      <div className="login-container">
        <div className="login-background">
          <div className="login-background-overlay"></div>
        </div>

        <div className="login-content">
          <div className="login-card">
            {/* Header */}
            <div className="login-header">
              <div className="login-logo">
                <CameraReels className="login-logo-icon" />
                <span className="login-logo-text">MovieFun</span>
              </div>
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to continue your movie journey</p>
            </div>

            {/* Alerts */}
            {showAlert && (
              <div className="login-alert login-alert-warning">
                <div className="login-alert-content">
                  <span>⚠️</span>
                  <p>{message}</p>
                </div>
                <button
                  type="button"
                  className="login-alert-close"
                  onClick={() => setShowAlert(false)}
                >
                  ×
                </button>
              </div>
            )}



            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-input-group">
                <Envelope className="login-input-icon" />
                <input
                  type="email"
                  id="loginEmail"
                  placeholder="Email address"
                  name="email"
                  value={login.email}
                  onChange={changeHandler}
                  className="login-form-control"
                  required
                />
              </div>

              <div className="login-input-group">
                <Lock className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="loginPassword"
                  placeholder="Password"
                  name="password"
                  value={login.password}
                  onChange={changeHandler}
                  className="login-form-control"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </button>
              </div>

              <div className="login-remember-forgot">
                <label className="login-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="login-forgot">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={!isFormValid || loader}
              >
                {loader ? (
                  <div className="login-btn-loader">
                    <div className="login-spinner"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="login-btn-content">
                    Sign In
                    <ArrowRight className="login-btn-icon" />
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span>Or continue with</span>
            </div>

            {/* Social Login */}
            <div className="login-social">
              <button type="button" className="login-social-btn login-google" onClick={(event) => SignIn('google', event)}>
                <svg className="login-social-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>

              {/* <button type="button" className="login-social-btn login-facebook" onClick={(event) => SignIn('facebook', event)}>
                <svg className="login-social-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Sign in with Facebook
              </button>

              <button type="button" className="login-social-btn login-github" onClick={(event) => SignIn('github', event)}>
                <svg className="login-social-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#333" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Sign in with GitHub
              </button> */}
            </div>

            {/* Footer */}
            <div className="login-footer">
              <p className="login-footer-text">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

 

  export default Login;

