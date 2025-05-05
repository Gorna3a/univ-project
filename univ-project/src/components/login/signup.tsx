import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { app, db, auth, googleProvider, githubProvider } from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import '../../App.css'; // Make sure your retro styles are included
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


function Signup() {
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const navigate = useNavigate(); // 🔥 add this

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      authProvider: 'email',
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || '',
      photoURL: userCredential.user.photoURL || '',
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
    toast.success(' Successfully signed up! ');
    setEmail('');
    setPassword('');
    navigate('/main'); // 🔥 Redirect after successful signup
  } catch (error) {
    let errorMessage = 'An error occurred during sign up.';
    if (error instanceof FirebaseError) {
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
    toast.error(` ${errorMessage}`);
  }
};

const handleSocialLogin = async (provider: any) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        authProvider: provider.providerId === 'google.com' ? 'google' : 'github',
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
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
      toast.success('Successfully signed up! Redirecting...');
    } 
    navigate('/main'); // 🔥 Redirect after successful social login
  } catch (error) {
    console.error('Social login error:', error);
    toast.error('Sign-up failed. Please try again.');
  }
};

  return (
    <div className="App">
      <div className='buttonBack' style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
        <Link to="/">
          <button className="back-button" style={{ backgroundColor: '#212385', padding: '5px 10px', borderRadius: '5px', color: 'white', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
        Back to main page
          </button>
        </Link>
      </div>
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
        

        <button type="submit" className="signup-button">
          Create Account
        </button>

        <div className="alternative-auth">
          <span>Or continue with</span>
          <div className="social-buttons">
            <button type="button" className="social-button" onClick={() => handleSocialLogin(googleProvider)}>
            <FontAwesomeIcon icon={faGoogle} style={{ color: '#212385', fontSize: '24px' }} />
            </button>
            <button type="button" className="social-button" onClick={() => handleSocialLogin(githubProvider)}>
            <FontAwesomeIcon icon={faGithub} style={{ color: '#212385', fontSize: '24px' }} />
            </button>
          </div>
          <p style={{ marginTop: '1rem' }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </form>
    </div>
    </div>
  </div>
  
  
  );
}

export default Signup;
