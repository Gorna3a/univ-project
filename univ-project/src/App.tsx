import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    
    <AuthProvider>
      <Router>
      <Toaster position="top-center" reverseOrder={false} />
        <ThemeProvider>
        <AppRoutes />
        
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
