import PropTypes from 'prop-types'
Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
}
import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center'
  
  const variants = {
    primary: 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10',
    success: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-700',
    ghost: 'text-gray-300 hover:bg-gray-800'
  }
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button