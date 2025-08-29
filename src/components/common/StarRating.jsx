import React, { memo } from 'react'
import PropTypes from 'prop-types'

const StarRating = memo(({ rating }) => {
  return (
    <div className="flex items-center mb-4">
      {Array.from({length: rating}, (_, i) => (
        <span key={i} className="text-yellow-500 text-xl">★</span>
      ))}
    </div>
  )
})
 
StarRating.propTypes = {
  rating: PropTypes.number.isRequired
}

StarRating.displayName = 'StarRating'

export default StarRating