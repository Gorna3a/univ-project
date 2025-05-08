import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;