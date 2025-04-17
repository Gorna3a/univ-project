import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
    <div className="text-xl font-bold">LearnCode</div>
    <nav>
      <Link to="/" className="ml-4 hover:text-gray-200">Home</Link>
      <Link to="/features" className="ml-4 hover:text-gray-200">Features</Link>
      <Link to="/contact" className="ml-4 hover:text-gray-200">Contact</Link>
    </nav>
  </header>
);

export default Header;
