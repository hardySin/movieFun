import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Envelope, Lock, Person, ArrowRight, Eye, EyeSlash, CameraReels } from 'react-bootstrap-icons';
import firebase from '../service/firebase';
import Loader from '../loader/loader';
import { useNavigate } from 'react-router-dom';
import './create.css';
import { colors } from '@mui/material';

interface AccountState {
  name: string;
  email: string;
  password: string;
}

function Account(props: any) {
  const [account, setAccount] = useState<AccountState>({ name: "", email: "", password: "" });
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!account.email || !account.password || !confirmPass) {
      setMessage("Please fill all required fields");
      setShowAlert(true);
      return;
    }

    if (account.password !== confirmPass) {
      setMessage("Passwords do not match");
      setShowAlert(true);
      return;
    }

    if (account.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setShowAlert(true);
      return;
    }

    try {
      await firebase.register(account.email, account.password);
      navigate("/viewMovies");
    } catch (error: any) {
      setMessage(error.message);
      setShowAlert(true);
      setLoader(false);
      console.error("Registration error:", error);
    }
  }

  const isFormValid = account.email && account.password && confirmPass &&
    account.password === confirmPass &&
    account.password.length >= 6;

  function setIsErrorOpen(isOpen: boolean): void {
    setShowAlert(isOpen);
  }
  return (
    <div className="signup-container">
      {/* Background with gradient overlay */}
      <div className="signup-background">
        <div className="signup-background-overlay"></div>
      </div>

      <div className="signup-content">
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <div className="signup-logo">
              <CameraReels className="signup-logo-icon" />
              <span className="signup-logo-text">MovieFun</span>
            </div>
            <h1 className="signup-title">Create Your Account</h1>
            <p className="signup-subtitle">Join our community of movie enthusiasts</p>
          </div>

          {/* Alerts */}
          {showAlert && (
            <div className="signup-alert">
              <span>{message}</span>
              <button className="signup-alert-close" onClick={() => setIsErrorOpen(false)}>×</button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-input-group">
              <Envelope className="signup-input-icon" />
              <input
                type="email"
                id="floatingEmail"
                placeholder="Email address"
                name="email"
                value={account.email}
                onChange={changeHandler}
                className="signup-form-control"
              />
            </div>

            <div className="signup-input-group">
              <Lock className="signup-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="floatingPassword"
                placeholder="Password"
                name="password"
                value={account.password}
                onChange={changeHandler}
                className="signup-form-control"

                minLength={6}
              />
              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </button>
            </div>

            <div className="signup-input-group">
              <Lock className="signup-input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="floatingConfirmPassword"
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)}
                className="signup-form-control"

                minLength={6}
              />
              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={account.password !== confirmPass}
            >
              {loader ? (
                <div className="signup-btn-loader">
                  <div className="signup-spinner"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="signup-btn-content">
                  Create Account
                  <ArrowRight className="signup-btn-icon" />
                </div>
              )}
            </button>
          </form>


          {/* Footer */}
          <div className="signup-footer">
            <p className="signup-footer-text">
              Already have an account?{' '}
              <button
                type="button"
                className="signup-link-btn"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {loader && <Loader state={loader} />}
    </div>
  );
}

export default Account;