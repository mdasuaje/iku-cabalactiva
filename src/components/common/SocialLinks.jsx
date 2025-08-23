import React from 'react'
import { SOCIAL_LINKS } from '@utils/constants'

const SocialLinks = ({ variant = 'default', className = '' }) => {
  const socialPlatforms = [
    {
      name: 'WhatsApp',
      url: SOCIAL_LINKS.whatsapp.channel,
      icon: '💬',
      color: 'hover:text-green-500'
    },
    {
      name: 'Instagram',
      url: SOCIAL_LINKS.instagram,
      icon: '📷',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Facebook',
      url: SOCIAL_LINKS.facebook.institute,
      icon: '📘',
      color: 'hover:text-blue-500'
    },
    {
      name: 'YouTube',
      url: SOCIAL_LINKS.youtube,
      icon: '📺',
      color: 'hover:text-red-500'
    },
    {
      name: 'TikTok',
      url: SOCIAL_LINKS.tiktok,
      icon: '🎵',
      color: 'hover:text-purple-500'
    },
    {
      name: 'Telegram',
      url: SOCIAL_LINKS.telegram,
      icon: '✈️',
      color: 'hover:text-blue-400'
    }
  ]

  const baseClasses = variant === 'footer' 
    ? 'flex space-x-4' 
    : 'flex flex-wrap gap-3'

  return (
    <div className={`${baseClasses} ${className}`}>
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-300 ${platform.color} transition-colors duration-200 flex items-center space-x-2`}
          title={`Síguenos en ${platform.name}`}
        >
          <span className="text-xl">{platform.icon}</span>
          {variant === 'extended' && (
            <span className="text-sm">{platform.name}</span>
          )}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks