import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, googleProvider, githubProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import '../../App.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        toast.success(`Welcome back, ${userDoc.data().displayName || 'User'}!`);
        navigate('/main');
      } else {
        toast.error('User data not found.');
      }
    } catch (error) {
      toast.error('Failed to load user data.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleLoginSuccess(userCredential.user.uid);
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleLoginSuccess(result.user.uid);
    } catch (error) {
      toast.error('Google sign-in failed');
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await handleLoginSuccess(result.user.uid);
    } catch (error) {
      toast.error('GitHub sign-in failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
