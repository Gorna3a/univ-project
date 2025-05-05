import { useState } from 'react';
import { AuthContext } from './authContext';
import { auth, googleProvider, githubProvider } from '../firebase'; // make sure the paths are correct
import { signInWithPopup } from 'firebase/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Error logging in with GitHub", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
