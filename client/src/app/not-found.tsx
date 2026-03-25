'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const NotFound: React.FC = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ left: number; top: number }>>([]);

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    // Generate random positions once on mount
    const generatedParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-green-forest-background-1275-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-background-1275-large.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-emerald-900/30 to-black/70"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
          className="max-w-2xl w-full text-center"
        >
          {/* Animated 404 Text with Glow Effect */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <h1 className="text-[180px] font-bold text-emerald-500/20 select-none">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="text-[180px] font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                    404
                  </h1>
                </div>
              </motion.div>

              {/* Orbiting circles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                    style={{
                      left: `${50 + 45 * Math.cos((i * Math.PI) / 4)}%`,
                      top: `${50 + 45 * Math.sin((i * Math.PI) / 4)}%`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Main Message with Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="text-emerald-400">Lost</span> in the Digital{' '}
              <span className="text-emerald-300">Wilderness</span>
            </h2>
            <p className="text-xl text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
              The path you&apos;re looking for seems to have been reclaimed by nature.
              But don&apos;t worry, we can guide you back to civilization!
            </p>
          </motion.div>

          {/* Interactive Forest Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 mb-10 border border-emerald-500/20 shadow-2xl"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-4"
              >
                <span className="text-4xl">🧭</span>
              </motion.div>
              <h3 className="text-2xl font-bold text-white">
                Your Digital Compass
              </h3>
            </div>

            {/* Navigation Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  href="/"
                  className="block bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 hover:from-emerald-600/30 hover:to-emerald-800/30 border border-emerald-500/30 rounded-xl p-6 transition-all duration-300 group-hover:border-emerald-400/60"
                >
                  <div className="text-3xl mb-3">🏠</div>
                  <h4 className="font-semibold text-white mb-2">Return Home</h4>
                  <p className="text-sm text-emerald-200/70">
                    Head back to familiar territory
                  </p>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <button
                  onClick={handleGoBack}
                  className="w-full bg-gradient-to-br from-blue-600/20 to-blue-800/20 hover:from-blue-600/30 hover:to-blue-800/30 border border-blue-500/30 rounded-xl p-6 transition-all duration-300 group-hover:border-blue-400/60"
                >
                  <div className="text-3xl mb-3">↩️</div>
                  <h4 className="font-semibold text-white mb-2">Go Back</h4>
                  <p className="text-sm text-blue-200/70">
                    Retrace your steps
                  </p>
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <button
                  onClick={handleRefresh}
                  className="w-full bg-gradient-to-br from-purple-600/20 to-purple-800/20 hover:from-purple-600/30 hover:to-purple-800/30 border border-purple-500/30 rounded-xl p-6 transition-all duration-300 group-hover:border-purple-400/60"
                >
                  <div className="text-3xl mb-3">🔄</div>
                  <h4 className="font-semibold text-white mb-2">Refresh</h4>
                  <p className="text-sm text-purple-200/70">
                    Try a new path
                  </p>
                </button>
              </motion.div>
            </div>

            {/* Help Links */}
            <div className="text-center">
              <p className="text-emerald-200/80 mb-4">
                Still lost? Our guides are here to help
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-emerald-600/30 hover:bg-emerald-600/50 text-white rounded-lg border border-emerald-500/50 transition-all duration-300 hover:scale-105"
                >
                  Contact Support
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 bg-emerald-800/30 hover:bg-emerald-800/50 text-white rounded-lg border border-emerald-700/50 transition-all duration-300 hover:scale-105"
                >
                  Learn About Us
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Animated Forest Creatures */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex justify-center space-x-8 mb-12"
          >
            {[
              { emoji: "🦉", delay: 0 },
              { emoji: "🦌", delay: 0.2 },
              { emoji: "🐿️", delay: 0.4 },
              { emoji: "🦊", delay: 0.6 },
            ].map((creature, index) => (
              <motion.div
                key={index}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: creature.delay,
                }}
                className="text-4xl"
              >
                {creature.emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-emerald-300/50 text-sm"
          >
            <p className="flex items-center justify-center">
              <span className="mr-2">✨</span>
              Remember: Every wrong turn is a new discovery
              <span className="ml-2">🌿</span>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Audio Toggle (Optional) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-600/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-emerald-500/50 z-20"
        onClick={() => {
          const video = document.querySelector('video');
          if (video) video.muted = !video.muted;
        }}
      >
        <span className="text-xl">🔊</span>
      </motion.button>
    </div>
  );
};

export default NotFound;