import { motion } from 'framer-motion';

export default function ArticleCard({ leadMagnet, onClick, className = '' }) {
  return (
    <motion.div
      className={`bg-gradient-to-br from-purple-800/50 to-indigo-800/50 rounded-xl p-6 border border-yellow-400/20 cursor-pointer group hover:border-yellow-400/40 transition-all ${className}`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(leadMagnet)}
    >
      <div className="text-center">
        <div className="text-3xl mb-3">{leadMagnet.icon}</div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {leadMagnet.title}
        </h3>
        <p className="text-gray-300 text-sm mb-4">{leadMagnet.description}</p>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all">
          {leadMagnet.buttonText}
        </button>
      </div>
    </motion.div>
  );
}