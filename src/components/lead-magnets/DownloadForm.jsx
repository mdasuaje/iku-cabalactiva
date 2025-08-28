import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import contactService from '../../services/contactService';

export default function DownloadForm({ leadMagnet, onSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await contactService.enviarLeadMagnet({
        email,
        source: `lead-magnet-${leadMagnet.id}`,
        leadMagnet: leadMagnet.title
      });

      toast.success('¡Descarga iniciada! Revisa tu email.');
      
      // Iniciar descarga
      const link = document.createElement('a');
      link.href = leadMagnet.file;
      link.download = `${leadMagnet.id}.pdf`;
      link.click();

      onSuccess?.(email);
    } catch (error) {
      toast.error('Error al procesar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{leadMagnet.icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{leadMagnet.title}</h3>
        <p className="text-gray-300 text-sm">{leadMagnet.description}</p>
      </div>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu email para recibir el PDF"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !email}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Enviando...' : leadMagnet.buttonText}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Al descargar aceptas recibir contenido exclusivo sobre Cábala
      </p>
    </motion.form>
  );
}