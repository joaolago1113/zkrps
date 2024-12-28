import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to the Rock Paper Scissors Game!</h1>
            <p>Get started by navigating to the game page.</p>
            <Link 
                href="/RockPaperScissors" 
                style={{ fontSize: '20px', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            >
                Go to Game
            </Link>
        </div>
    );
};

export default Home;