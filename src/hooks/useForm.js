import { useState } from 'react'
import { FORM_CONFIG } from '@utils/constants'

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = (fieldsToValidate = Object.keys(values)) => {
    const newErrors = {}

    fieldsToValidate.forEach(field => {
      const value = values[field]
      
      // Required validation
      if (!value || value.trim() === '') {
        newErrors[field] = FORM_CONFIG.messages.required
        return
      }

      // Specific validations
      switch (field) {
        case 'email':
          if (!FORM_CONFIG.validation.email.test(value)) {
            newErrors[field] = FORM_CONFIG.messages.email
          }
          break
        case 'phone':
          if (!FORM_CONFIG.validation.phone.test(value)) {
            newErrors[field] = FORM_CONFIG.messages.phone
          }
          break
        case 'name':
          if (!FORM_CONFIG.validation.name.test(value)) {
            newErrors[field] = FORM_CONFIG.messages.name
          }
          break
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (onSubmit, fieldsToValidate) => {
    setIsSubmitting(true)
    
    const isValid = validate(fieldsToValidate)
    
    if (isValid) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }
    
    setIsSubmitting(false)
    return isValid
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validate,
    reset
  }
}