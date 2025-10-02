import ContactForm from './components/ContactForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          IKU - Cábala Activa v3.5
        </h1>
        <p className="text-center text-gray-600 mb-8">
          El Pórtico Iluminado - Next.js + TypeScript
        </p>
        
        <ContactForm />
      </div>
    </main>
  )
}