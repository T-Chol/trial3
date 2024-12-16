import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.js';
import { Eye, EyeOff, Lock, User, AlertCircle, Database, Shield, Activity } from 'lucide-react';
import './Login.css';
import { API_URL } from '../config/api.js';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const MAX_LOGIN_ATTEMPTS = 3;
  const LOCK_DURATION = 300; // 5 minutes in seconds

  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const formatLockTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRoleBasedRedirect = (role) => {
    switch (role) {
      case 'deputyDirector':
        return '/admin-dashboard';
      case 'principalOfficer':
        return '/principal-officer-dashboard';
      case 'seniorOfficer':
        return '/senior-officer-dashboard';
      default:
        return '/officer-dashboard';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/user-management/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.username, data.role);
        setLoginAttempts(0);
        const redirectPath = getRoleBasedRedirect(data.role);
        navigate(redirectPath);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          setIsLocked(true);
          setLockTimer(LOCK_DURATION);
          setError(`Account temporarily locked. Please try again in ${formatLockTimer(LOCK_DURATION)}`);
        } else {
          setError(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, title: 'Secure Access', description: 'Enterprise-grade security protocols' },
    { icon: Database, title: 'Data Management', description: 'Centralized remuneration data' },
    { icon: Activity, title: 'Real-time Analytics', description: 'Instant performance insights' }
  ];

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="animated-background">
          <div className="gradient-overlay"></div>
          <div className="content-overlay">
            <div className="brand-logo">
              <div className="logo-animation"></div>
              <h1>RemuNet</h1>
            </div>
            <p className="tagline">Next-Generation Remuneration Management</p>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <feature.icon className="feature-icon" />
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-circle">
                <div className="logo-pulse"></div>
              </div>
              <h2>Welcome to RemuNet</h2>
            </div>
            {/* {error && (
              <div className="error-alert">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )} */}
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-field">
              <div className="input-wrapper">
                <User className="field-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username"
                  disabled={isLocked}
                />
                <div className="input-focus-effect"></div>
              </div>
            </div>

            <div className="form-field">
              <div className="input-wrapper">
                <Lock className="field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  disabled={isLocked}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                <div className="input-focus-effect"></div>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" disabled={isLocked} />
                <span className="checkmark"></span>
                Remember me
              </label>
              <button type="button" className="forgot-link">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''} ${isLocked ? 'locked' : ''}`}
              disabled={isLoading || isLocked}
            >
              <span className="btn-text">
                {isLocked 
                  ? `Locked (${formatLockTimer(lockTimer)})` 
                  : isLoading ? 'Signing in...' : 'Sign in'}
              </span>
              <span className="btn-loader"></span>
            </button>
          </form>

          {/* <div className="support-section">
            <p>Need help? <button className="support-btn">Contact IT Support</button></p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;