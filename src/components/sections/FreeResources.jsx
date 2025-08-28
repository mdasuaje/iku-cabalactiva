import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArticleCard, LeadMagnetModal } from '../lead-magnets';
import { leadMagnets } from '../../data/leadMagnets';

export default function FreeResources() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleLeadClick = (leadMagnet) => {
    setSelectedLead(leadMagnet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Recursos <span className="text-yellow-400">Gratuitos</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descarga contenido exclusivo y comienza tu transformación espiritual hoy mismo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {leadMagnets.map((leadMagnet, index) => (
            <motion.div
              key={leadMagnet.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <ArticleCard
                leadMagnet={leadMagnet}
                onClick={handleLeadClick}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <LeadMagnetModal
        isOpen={showModal}
        onClose={closeModal}
        leadMagnet={selectedLead}
      />
    </section>
  );
}