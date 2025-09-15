import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="w-full max-w-6xl mx-auto p-4 flex justify-between items-center">
             <a href="https://www.vinet.co.za/" target="_blank" rel="noopener noreferrer">
                <img 
                    src="https://static.vinet.co.za/Vinet%20Logo%20Png_Full%20Logo.png" 
                    alt="Vinet Logo" 
                    className="h-16"
                />
            </a>
            <div className="flex items-center space-x-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.5 13.5L8.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.5 10.5C16.6046 10.5 17.5 9.60457 17.5 8.5C17.5 7.39543 16.6046 6.5 15.5 6.5C14.3954 6.5 13.5 7.39543 13.5 8.5C13.5 9.60457 14.3954 10.5 15.5 10.5Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-lg font-bold text-gray-800">Vinet Internet Solution Speed Test</span>
            </div>
        </header>
    );
};

export default Header;