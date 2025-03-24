import { useState, useEffect } from 'react';

const test = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    './slide1.jpg',
    './slide2.jpg',
    './slide3.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Form Section */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <form className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          {/* Your existing form fields here */}
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border rounded-lg"
          />
          <button 
            type="submit" 
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
            <p className="text-lg mb-8">Preview of our awesome features</p>
          </div>
        </div>
        <div className="relative h-screen">
          {images.map((image, index) => (
            <div 
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default test;