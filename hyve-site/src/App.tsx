// src/App.tsx - Hyve Dynamics with Header and Navigation
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Vision } from '@/components/sections/Vision'
import { CustomMeshBackground } from '@/components/ui/CustomMeshBackground'

function App() {
  // 🎛️ EASY DISABLE: Set to false to disable mesh background
  const enableMeshBackground = true

  return (
    <Layout>
      <div className="min-h-screen relative">
        <CustomMeshBackground
          enabled={enableMeshBackground}
          className="min-h-screen"
        >
          {/* Hero section with proper pointer-events handling */}
          <Hero />

          {/* Vision section */}
          <Vision />

          <div className="min-h-[60vh]" />
        </CustomMeshBackground>
      </div>
    </Layout>
  )
}

export default App
