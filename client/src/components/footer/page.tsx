'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: "About Us", path: "/about" },
            { name: "Our Mission", path: "/mission" },
            { name: "Careers", path: "/careers" },
            { name: "Press", path: "/press" }
        ],
        services: [
            { name: "Sustainable Farming", path: "/services/farming" },
            { name: "Waste Management", path: "/services/waste" },
            { name: "Consultation", path: "/services/consultation" },
            { name: "Training", path: "/services/training" }
        ],
        resources: [
            { name: "Blog", path: "/blog" },
            { name: "Research", path: "/research" },
            { name: "Case Studies", path: "/case-studies" },
            { name: "FAQ", path: "/faq" }
        ],
        legal: [
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Terms of Service", path: "/terms" },
            { name: "Cookie Policy", path: "/cookies" },
            { name: "Accessibility", path: "/accessibility" }
        ]
    };

    const socialMedia = [
        { name: "Facebook", icon: "📘", url: "https://facebook.com" },
        { name: "Twitter", icon: "🐦", url: "https://twitter.com" },
        { name: "Instagram", icon: "📸", url: "https://instagram.com" },
        { name: "LinkedIn", icon: "💼", url: "https://linkedin.com" },
        { name: "YouTube", icon: "🎬", url: "https://youtube.com" }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-bold mb-4">
                                <span className="text-green-400">Green</span> Met
                            </h2>
                        </Link>
                        <p className="text-gray-300 mb-6 max-w-md">
                            Cultivating a sustainable future through innovative environmental solutions
                            and community-driven initiatives since 2018.
                        </p>

                        {/* Newsletter Subscription */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-white"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 whitespace-nowrap"
                                >
                                    Subscribe
                                </motion.button>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                            <div className="flex space-x-4">
                                {socialMedia.map((social, index) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5, scale: 1.1 }}
                                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition duration-300"
                                        aria-label={social.name}
                                    >
                                        <span className="text-lg">{social.icon}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-lg font-semibold mb-4 capitalize">
                                {category.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <ul className="space-y-2">
                                {links.map((link, linkIndex) => (
                                    <motion.li
                                        key={link.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (linkIndex * 0.05) }}
                                        viewport={{ once: true }}
                                    >
                                        <Link
                                            href={link.path}
                                            className="text-gray-300 hover:text-green-400 transition duration-300 hover:pl-2 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 mb-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-sm mb-4 md:mb-0"
                    >
                        © {currentYear} Green Met. All rights reserved.
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex items-center"
                        >
                            <span className="text-green-400 mr-2">🌍</span>
                            <span className="text-gray-300 text-sm">Carbon Neutral Since 2020</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="flex items-center"
                        >
                            <span className="text-green-400 mr-2">🏆</span>
                            <span className="text-gray-300 text-sm">B Corp Certified</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex items-center"
                        >
                            <span className="text-green-400 mr-2">🌱</span>
                            <span className="text-gray-300 text-sm">1% for the Planet</span>
                        </motion.div>
                    </div>
                </div>

                {/* Back to Top */}
                <motion.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition duration-300 z-40"
                    aria-label="Back to top"
                >
                    <span className="text-xl">↑</span>
                </motion.button>
            </div>
        </footer>
    );
};

export default Footer;