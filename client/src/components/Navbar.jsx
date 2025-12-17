import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-700 transition-colors">
                            I
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Issai.ai
                        </span>
                    </Link>

                    {/* CTA Button / Auth State */}
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <div className="flex items-center space-x-4">
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
                                    >
                                        Dashboard
                                    </motion.button>
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center"
                                >
                                    Sign In
                                </motion.button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
