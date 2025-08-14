import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login logic: retrieve saved credentials
      const savedUser = JSON.parse(localStorage.getItem('xtimes-user'));
      if (
        savedUser &&
        savedUser.username === username &&
        savedUser.password === password
      ) {
        alert('Login successful!');
        onLogin();
      } else {
        alert('Invalid credentials. Please try again or sign up.');
      }
    } else {
      // Sign-up logic: save credentials
      const newUser = {
        email,
        username,
        password
      };
      localStorage.setItem('xtimes-user', JSON.stringify(newUser));
      alert('Account created! You can now log in.');
      setIsLogin(true); // switch to login form
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center auth-container">
      <div className="card p-4 shadow-lg animate__animated animate__fadeInDown">
        <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-2">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={toggleForm}
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
