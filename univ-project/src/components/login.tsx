import { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { googleProvider, githubProvider } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';
import '../App.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError('Google sign-in failed');
    }
  };

  // GitHub Sign-In
  const handleGitHubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      setError('GitHub sign-in failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
    <div className="AppLogin">
      <div className='login-section'>
      <div className="login-container">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="signup-button">
            Log In
          </button>

          <div className="alternative-auth">
            <span>Or continue with</span>
            <div className="social-buttons">
              <button type="button" className="social-button" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGoogle} style={{ color: '#212385', fontSize: '24px' }} />
              </button>
              <button type="button" className="social-button" onClick={handleGitHubSignIn}>
                <FontAwesomeIcon icon={faGithub} style={{ color: '#212385', fontSize: '24px' }} />
              </button>
            </div>
            <p style={{ marginTop: '1rem' }}>
              New user? <Link to="/signup">Create account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    </div>
    </motion.div>
  );
}