import React, { useState, useEffect } from 'react'

const UrgencyTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const getNextFriday = () => {
      const now = new Date()
      const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7
      const nextFriday = new Date(now)
      nextFriday.setDate(now.getDate() + daysUntilFriday)
      nextFriday.setHours(23, 59, 59, 999)
      return nextFriday
    }

    const updateTimer = () => {
      const now = new Date()
      const target = getNextFriday()
      const diff = target - now

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
      <p className="text-red-400 font-semibold text-sm text-center">
        ⏰ OFERTA ESPECIAL TERMINA EN: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </p>
      <p className="text-red-300 text-xs text-center mt-1">
        Solo quedan 3 cupos disponibles esta semana
      </p>
    </div>
  )
}

export default UrgencyTimer