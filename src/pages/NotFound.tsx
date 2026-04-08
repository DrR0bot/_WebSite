import { Home, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/common/SEO'
import { Button } from '@/components/ui/button'

export const NotFound = () => {
  return (
    <>
      <SEO title="404 - Page Not Found" description="The page you're looking for doesn't exist." noindex />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 Illustration */}
          <div className="relative">
            <h1 className="text-[200px] font-bold text-gray-200 leading-none select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
                <h2 className="text-4xl font-bold">Page Not Found</h2>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted,
            or perhaps it never existed.
          </p>

          {/* Navigation Options */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link to="/">
                <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Go to Homepage
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Here are some helpful links:</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
              <Link to="/haptic-matrix" className="text-primary hover:underline">
                Haptic Matrix
              </Link>
              <Link to="/industries/aerospace" className="text-primary hover:underline">
                Aerospace
              </Link>
              <Link to="/industries/automotive" className="text-primary hover:underline">
                Automotive
              </Link>
              <Link to="/industries/digital-twinning-ihm" className="text-primary hover:underline">
                Digital Twinning & IHM
              </Link>
              <Link to="/about" className="text-primary hover:underline">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
