import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import Flicking, { useFlickingReactiveAPI } from '@egjs/react-flicking'
import '@egjs/react-flicking/dist/flicking.css'

interface VideoData {
  src: string
  webmSrc?: string // Optional WebM source for transparency support
  title: string
  description: string
}

const videos: VideoData[] = [
  {
    src: '/models/3d_animations/A320.mp4',
    webmSrc: '/models/3d_animations/A320.webm',
    title: 'Aerospace',
    description: 'Advanced pressure sensing for aircraft optimization',
  },
  {
    src: '/models/3d_animations/F1-Car.mp4',
    webmSrc: '/models/3d_animations/F1-Car.webm',
    title: 'Automotive',
    description: 'Real-time aerodynamic analysis for peak performance',
  },
  {
    src: '/models/3d_animations/Wind-Turbine.mp4',
    webmSrc: '/models/3d_animations/Wind-Turbine.webm',
    title: 'Energy',
    description: 'Structural health monitoring for renewable energy',
  },
]

const VideoPanel: React.FC<{
  video: VideoData
  style: React.CSSProperties
}> = ({ video, style }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden"
      style={style}
    >
      {/* Very subtle transparent background */}
      <div className="absolute inset-0 bg-hyve-background/5" />
      
      {/* Subtle mesh pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #4B9BFF 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
      
      <video
        ref={videoRef}
        className="relative w-full h-full object-contain z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        {video.webmSrc && <source src={video.webmSrc} type="video/webm" />}
        <source src={video.src} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-hyve-background/50 via-transparent to-transparent z-20" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center z-30">
        <h3 className="text-2xl font-light text-hyve-text mb-2">{video.title}</h3>
        <p className="text-sm text-hyve-text/80 font-light">{video.description}</p>
      </div>
    </div>
  )
}

export const FlickingCoverFlow: React.FC = () => {
  const flickingRef = useRef<Flicking>(null)
  const { indexProgress } = useFlickingReactiveAPI(flickingRef)

  const length = videos.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      <Flicking
        ref={flickingRef}
        circular={true}
        className="flicking-coverflow"
        panelsPerView={1}
        align="center"
        moveType="freeScroll"
        autoResize={true}
      >
        {videos.map((video, index) => {
          const childProgress = ((index - indexProgress + length * 1.5) % length) - length * 0.5
          const scale = Math.max(0, 0.85 - Math.abs(childProgress) * 0.25)
          const opacity = Math.max(0.5, 1 - Math.abs(childProgress) * 0.3)

          return (
            <div key={index} className="flicking-panel" style={{ width: '700px', height: '550px' }}>
              <VideoPanel
                video={video}
                style={{
                  transformOrigin: `${50 - childProgress * 50}% 50%`,
                  transform: `rotateY(${-childProgress * 45}deg) scale(${scale})`,
                  opacity,
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                }}
              />
            </div>
          )
        })}
      </Flicking>

      {/* Custom CSS for Flicking */}
      <style jsx global>{`
        .flicking-coverflow {
          padding: 0;
        }

        .flicking-coverflow .flicking-viewport {
          overflow: visible;
        }

        .flicking-coverflow .flicking-camera {
          transform-style: preserve-3d;
        }

        .flicking-coverflow .flicking-panel {
          transform-style: preserve-3d;
        }

        /* Hide default navigation dots */
        .flicking-pagination {
          display: none;
        }

        /* Custom navigation styling if needed */
        .flicking-arrow-prev,
        .flicking-arrow-next {
          display: none;
        }
      `}</style>
    </motion.div>
  )
}
