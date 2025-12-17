import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, PieChart, Wallet, Zap, Shield, Globe } from 'lucide-react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const LandingPage = () => {
    const { user } = useUser();
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const handleGetStarted = () => {
        if (user) {
            // Already logged in, let Link handle navigation or programmatically navigate
            // But since we wrap button in Link conditionally, we can just handle the click for non-user
        } else {
            window.location.href = 'http://localhost:5000/auth/google';
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-blue-50 to-white" />
                <div className="absolute top-0 left-0 -z-10 w-1/2 h-full bg-gradient-to-br from-indigo-50/50 to-white" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-sm font-semibold text-blue-700">New Generation of Finance Tracking</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
                            Master Your Money with <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">AI-Powered Insights</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Experience the smartest way to track expenses. Issai.ai automatically categorizes your spending and provides actionable financial intelligence in seconds.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {user ? (
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center"
                                    >
                                        Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                    </motion.button>
                                </Link>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleGetStarted}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center"
                                >
                                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            )}
                            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                                Watch Demo
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="mt-20 relative"
                    >
                        <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full -z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"
                            alt="Dashboard Preview"
                            className="rounded-2xl shadow-2xl border-4 border-white/50 w-full max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to grow your wealth</h2>
                        <p className="text-lg text-gray-600">Powerful features designed to give you complete control over your financial life.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-8 w-8 text-amber-500" />}
                            title="Instant Tracking"
                            description="Log expenses in seconds. Our AI automatically handles the categorization for you."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<BarChart2 className="h-8 w-8 text-blue-500" />}
                            title="Advanced Analytics"
                            description="Visualize your spending patterns with beautiful charts and deep insights."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-green-500" />}
                            title="Secure & Private"
                            description="Bank-grade encryption ensures your financial data stays private and secure."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20" />
                <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 text-center">
                        <Stat number="50K+" label="Active Users" />
                        <Stat number="$2M+" label="Tracked Monthly" />
                        <Stat number="4.9/5" label="User Rating" />
                        <Stat number="99%" label="Security Score" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 lg:p-20 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32" />

                        <h2 className="text-4xl font-bold mb-6 relative z-10">Ready to take control?</h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
                            Join thousands of smart users who are managing their finances better with Issai.ai.
                        </p>
                        {user ? (
                            <Link to="/dashboard" className="relative z-10">
                                <button className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                                    Go to Dashboard
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={handleGetStarted}
                                className="relative z-10 px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Start Your Journey Now
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    I
                                </div>
                                <span className="text-xl font-bold text-gray-900">Issai.ai</span>
                            </div>
                            <p className="text-gray-500">Making personal finance intelligent and effortless for everyone.</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600">Integrations</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-blue-600">About</a></li>
                                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} Issai.ai. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
    >
        <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

const Stat = ({ number, label }) => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
    >
        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">{number}</h3>
        <p className="text-gray-400 font-medium">{label}</p>
    </motion.div>
);

export default LandingPage;
