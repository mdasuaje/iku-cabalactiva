'use client'

import React, { useState } from 'react'

type FormData = {
  email: string;
  password: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Datos del formulario tipados:', formData)
    
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Respuesta de la API:', data)
      setResult(data)
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      setResult({ success: false, error: 'Error de conexión' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Registro de Usuario
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}