'use client'

import Lottie from 'lottie-react'
import animationData from '@/assets/animations/loading-profile.json'

export function Animation() {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      style={{ height: 200, width: 200 }}
    />
  )
}
