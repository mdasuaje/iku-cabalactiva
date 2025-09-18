import { useState } from 'react'
import { motion } from 'framer-motion'
import ContactModal from '../common/ContactModal'
import FAQAccordion from '../common/FAQAccordion'

/**
 * Sección de Preguntas Frecuentes
 *
 * @component
 * @returns {JSX.Element} Componente de sección de FAQ
 */
const FAQSection = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <section
      id="faq"
      className="py-20 bg-slate-900 bg-[url('/images/tree-of-life-bg.svg')] bg-fixed bg-blend-overlay bg-opacity-10"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Preguntas <span className="text-amber-500">Frecuentes</span>
          </h2>
          <p className="text-xl text-amber-100/80 max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestras herramientas cabalísticas
          </p>
        </motion.div>

        <FAQAccordion />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-amber-200 mb-6">
            ¿Tienes preguntas más específicas sobre tu situación particular?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-6 py-3 rounded-md shadow-lg hover:shadow-amber-500/30 font-semibold transition duration-300 transform hover:scale-105 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Consulta Privada por Email
            </button>
            <a
              href="https://wa.me/34612345678?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20las%20herramientas%20cabalísticas"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-amber-500 text-amber-400 hover:bg-amber-500/10 px-6 py-3 rounded-md font-semibold transition duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18.403,5.633C16.708,3.936,14.454,3.001,12.053,3C7.062,3,3.002,7.054,3,12.047 c0,1.532,0.39,3.029,1.135,4.35L3,21l4.709-1.233c1.275,0.695,2.714,1.064,4.18,1.064c5.042,0,9.103-4.102,9.103-9.146 c0-2.397-0.934-4.652-2.631-6.35L18.403,5.633z M12.05,18.446c-1.398,0-2.756-0.367-3.936-1.058l-0.285-0.168L5.584,17.778l0.558-2.04 L5.952,15.46c-0.742-1.208-1.133-2.6-1.132-4.037C4.821,8.385,8.086,5.126,12.05,5.126c1.999,0,3.876,0.778,5.288,2.192 c1.413,1.412,2.192,3.29,2.19,5.286C19.527,16.217,16.264,18.446,12.05,18.446z"
                />
                <path
                  fillRule="evenodd"
                  d="M16.461,14.628l-1.519-0.767c-0.193-0.098-0.439-0.082-0.619,0.042 c-0.179,0.125-0.446,0.361-0.71,0.629c-0.158,0.167-0.356,0.257-0.556,0.257c-0.173,0-0.351-0.046-0.545-0.138 c-0.741-0.353-1.395-0.816-1.947-1.366c-0.556-0.551-1.021-1.205-1.373-1.946c-0.171-0.363-0.175-0.714,0.001-0.984 c0.046-0.069,0.131-0.183,0.277-0.334c0.347-0.354,0.553-0.672,0.614-0.912c0.057-0.229-0.01-0.419-0.077-0.559l-0.773-1.513 c-0.203-0.402-0.702-0.566-1.114-0.365c-0.353,0.17-0.699,0.346-0.877,0.496c-0.407,0.35-0.668,0.85-0.733,1.407 c-0.065,0.558,0.023,1.359,0.563,2.392c0.576,1.104,1.399,2.238,2.384,3.223c0.979,0.979,2.12,1.794,3.223,2.382 c0.626,0.33,1.184,0.519,1.657,0.519c0.248,0,0.476-0.036,0.684-0.106c0.56-0.062,1.058-0.321,1.408-0.727 c0.175-0.203,0.346-0.535,0.496-0.877C17.026,15.328,16.863,14.831,16.461,14.628z"
                />
              </svg>
              WhatsApp Directo
            </a>
          </div>
        </motion.div>

        <ContactModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          herramienta="Consulta FAQ"
        />
      </div>
    </section>
  )
}

export default FAQSection
