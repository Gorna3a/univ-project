import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword ,signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app'; // Add this import
import { app, db ,auth} from '../firebase'; // Make sure db is exported from your firebase config
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { googleProvider, githubProvider } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../App.css';
import { genkit } from 'genkit';
import deepseek, { deepseekChat } from 'genkitx-deepseek';


function signup() {

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError('Google sign-up failed');
    }
  };

  const handleGitHubSignUp = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      setError('GitHub sign-up failed');
    }
  };
  const [activeImage, setActiveImage] = useState(0);
  const images = [
    './slide1.jpg',
    './slide2.jpg',
    './slide3.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      // Create user authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date(), // Client-side timestamp
        lastActive: new Date(),
        completedLessons: [], // Empty array for lessons
        totalXP: 0, // Starting experience points
        streak: 0, // Daily login streak
        isAdmin: false, // Default admin status
        learningPath: 'beginner', // Default learning path
        achievements: [], // Empty array for achievements
        preferences: {
          darkMode: false, // Default UI preference
          difficulty: 'normal' // Default difficulty level
        }
      });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        authProvider: userCredential.user.providerData[0]?.providerId || 'email', // Determine provider ID
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        createdAt: new Date(),
        lastActive: new Date(),
        completedLessons: [],
        totalXP: 0,
        streak: 0,
        preferences: {
          darkMode: false,
          difficulty: 'normal'
        }
      });

      console.log('User created and document added:', userCredential.user.uid);
      setSuccessMessage('Successfully signed up! You can now log in.');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Full error:', error);
  let errorMessage = 'An error occurred during sign up.';
  
  if (error instanceof FirebaseError) { // Change to FirebaseError
    const errorMap: Record<string, string> = {
      'auth/email-already-in-use': 'Email already registered',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/invalid-email': 'Invalid email address',
      'auth/network-request-failed': 'Network error - check connection',
      'permission-denied': 'Database permissions issue'
    };

    errorMessage = errorMap[error.code] || error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  setError(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="signup-section"
    >
    <div className="App">
      <div className='signup-section'>
    <div className="signup-container">
      <h2>Start Learning Java</h2>
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
        
        {error && (
          <div className="error-message">
            
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message"> 
            
            {successMessage}
          </div>
        )}

        <button type="submit" className="signup-button">
          Create Account
        </button>

        <div className="alternative-auth">
          <span>Or continue with</span>
          <div className="social-buttons">
            <button type="button" className="social-button" onClick={handleGoogleSignUp}>
            <FontAwesomeIcon icon={faGoogle} style={{ color: '#6A9C89', fontSize: '24px' }} />
            </button>
            <button type="button" className="social-button" onClick={handleGitHubSignUp}>
            <FontAwesomeIcon icon={faGithub} style={{ color: '#6A9C89', fontSize: '24px' }} />
            </button>
          </div>
          <p style={{ marginTop: '1rem' }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </form>
    </div>
    </div>
    <div className="preview-section">
        <div className="background-overlay">
          <h1>hello</h1>
          </div>
        <div className="preview-images">
          {images.map((img, index) => (
            <div
              key={img}
              className={`image ${index === activeImage ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${img})`,
                opacity: index === activeImage ? 1 : 0, // Ensure smooth transitions
                transition: 'opacity 1s ease-in-out', // Add fade effect
              }}
            />
          ))}
        </div>
      </div>
  </div>
  </motion.div>
  );
}

export default signup;
