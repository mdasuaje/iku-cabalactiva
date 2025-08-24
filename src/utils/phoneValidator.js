// Validador de número de teléfono para WhatsApp
export const CORRECT_PHONE_NUMBER = '+1 929-833-6069'
export const CORRECT_PHONE_DIGITS = '19298336069'

// Función para validar que el número esté correcto
export const validatePhoneNumber = (phoneNumber) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
  return cleanNumber === CORRECT_PHONE_DIGITS
}

// Función para formatear el número correctamente
export const formatPhoneNumber = (format = 'whatsapp') => {
  switch (format) {
    case 'whatsapp':
      return CORRECT_PHONE_DIGITS
    case 'display':
      return CORRECT_PHONE_NUMBER
    case 'international':
      return '+1 (929) 833-6069'
    default:
      return CORRECT_PHONE_DIGITS
  }
}

// Función para verificar el número en runtime
export const checkPhoneNumber = (phoneFromConstants) => {
  if (!validatePhoneNumber(phoneFromConstants)) {
    console.error('❌ NÚMERO DE WHATSAPP INCORRECTO')
    console.error('Actual:', phoneFromConstants)
    console.error('Correcto:', CORRECT_PHONE_NUMBER)
    return false
  }
  return true
}