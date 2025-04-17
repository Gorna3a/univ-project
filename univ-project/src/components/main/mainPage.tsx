import React from 'react';

const MainPage: React.FC = () => {
    return (
        <div>
            <nav style={{ padding: '10px', backgroundColor: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
                <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0 }}>
                    <li><a href="#home" style={{ textDecoration: 'none', color: '#333' }}>Home</a></li>
                    <li><a href="#about" style={{ textDecoration: 'none', color: '#333' }}>About</a></li>
                    <li><a href="#contact" style={{ textDecoration: 'none', color: '#333' }}>Contact</a></li>
                </ul>
            </nav>
            <main style={{ padding: '20px' }}>
                <h1>Welcome to the Main Page</h1>
                <p>This is a simple page with a navigation menu.</p>
            </main>
        </div>
    );
};

export default MainPage;