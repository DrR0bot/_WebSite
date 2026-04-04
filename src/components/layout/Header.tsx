import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Menu,
  ChevronRight,
  Plane,
  Car,
  Combine,
  Bot,
  FileText,
  Calendar,
  Mail,
  Newspaper,
  AlertCircle,
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getPublicAssetPath } from '@/lib/assets'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Logo component
const Logo = () => (
  <Link to="/" className="flex items-center space-x-2" aria-label="Hyve Dynamics Home">
    <img src={getPublicAssetPath('HD-Logo-dk.svg')} alt="Hyve Dynamics" className="h-10 w-auto" />
  </Link>
)

// Custom navigation link component
const NavLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<typeof Link>>(
  ({ className, ...props }, ref) => (
    <Link
      ref={ref}
      className={cn(
        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200',
        'hover:bg-hyve-content hover:text-hyve-text-dark focus:bg-hyve-content focus:text-hyve-text-dark',
        'group hover:scale-[1.02]',
        className
      )}
      {...props}
    />
  )
)
NavLink.displayName = 'NavLink'

// Form validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

// Contact Form Component
const ContactForm = () => {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur', // Validate on blur for better UX
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Server error')
      }

      toast.success('Demo request sent!', {
        description: "We'll be in touch shortly to schedule your demo.",
        duration: 5000,
      })

      reset()
      setOpen(false)
    } catch {
      toast.error('Failed to send request', {
        description: 'Please try again or email us directly at info@hyvedynamics.com',
        duration: 5000,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        setOpen(value)
        if (!value) {
          reset() // Reset form when dialog closes
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-hyve-text hover:bg-hyve-text-dark text-white font-body flex items-center gap-2"
          data-contact-trigger
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Book Demo</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] bg-hyve-background"
        aria-describedby="contact-form-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-body font-light text-hyve-header">
            Book a Demo
          </DialogTitle>
          <DialogDescription id="contact-form-description" className="text-hyve-text/70 font-body">
            <strong>See the Haptic Matrix in action.</strong> <br /> <br /> Whether you have a specific application in mind or are
            simply exploring what&apos;s possible, we&apos;d love to show you what real-time,
            high-density sensing can do for your industry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-body font-medium text-hyve-text">
              Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Your name"
              className={cn(
                'font-body border-hyve-content focus:border-hyve-accent',
                errors.name && 'border-red-500 focus:border-red-500'
              )}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-body font-medium text-hyve-text">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className={cn(
                'font-body border-hyve-content focus:border-hyve-accent',
                errors.email && 'border-red-500 focus:border-red-500'
              )}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-body font-medium text-hyve-text">
              Message
            </Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us about your application or what you'd like to explore in the demo..."
              rows={4}
              className={cn(
                'font-body border-hyve-content focus:border-hyve-accent resize-none',
                errors.message && 'border-red-500 focus:border-red-500'
              )}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 font-body border-hyve-content text-hyve-text hover:bg-hyve-content"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-hyve-text hover:bg-hyve-text-dark text-white font-body"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Requesting...</span>
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Request Demo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Navigation structure
const industriesItems = [
  {
    name: 'Aerospace',
    href: '/industries/aerospace',
    icon: Plane,
    description: 'Advanced sensing for aviation and space applications',
  },
  {
    name: 'Automotive',
    href: '/industries/automotive',
    icon: Car,
    description: 'Real-time aerodynamic data for racing performance',
  },
  {
    name: 'Digital Twinning & IHM',
    href: '/industries/digital-twinning-ihm',
    icon: Combine,
    description: 'Digital twins and integrated health monitoring for energy and infrastructure',
  },
  {
    name: 'Robotics',
    href: '/industries/robotics',
    icon: Bot,
    description: 'Intelligent tactile sensing for autonomous systems',
  },
]

const insightsItems = [
  {
    name: 'News & Blog',
    href: '/insights/news',
    icon: Newspaper,
    description: 'Latest news, press releases, and technology updates',
  },
  {
    name: 'Newsletter',
    href: '/insights/newsletter',
    icon: Mail,
    description: 'Monthly updates and industry insights',
  },
  {
    name: 'White Papers',
    href: '/insights/white-papers',
    icon: FileText,
    description: 'Technical deep dives and research',
  },
]

// Desktop Navigation
const DesktopNavigation = () => (
  <NavigationMenu className="hidden lg:flex">
    <NavigationMenuList className="space-x-2">
      {/* Home */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to="/"
            className={cn(
              'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
              'hover:bg-hyve-content hover:text-hyve-text-dark focus:bg-hyve-content focus:text-hyve-text-dark focus:outline-none',
              'font-body text-hyve-text'
            )}
          >
            Home
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {/* Technology */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to="/haptic-matrix"
            className={cn(
              'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
              'hover:bg-hyve-content hover:text-hyve-text-dark focus:bg-hyve-content focus:text-hyve-text-dark focus:outline-none',
              'font-body text-hyve-text'
            )}
          >
            Technology
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {/* Industries Dropdown */}
      <NavigationMenuItem>
        <NavigationMenuTrigger className="font-body text-hyve-text hover:bg-hyve-content hover:text-hyve-text-dark">
          Industries
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-hyve-background">
            {industriesItems.map(item => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <NavigationMenuLink asChild>
                    <NavLink to={item.href}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-hyve-accent/20 group-hover:bg-hyve-accent/30 transition-colors">
                          <Icon className="h-4 w-4 text-hyve-text group-hover:text-hyve-text-dark" />
                        </div>
                        <div className="text-sm font-medium leading-none">{item.name}</div>
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-hyve-text/70 group-hover:text-hyve-text-dark/70">
                        {item.description}
                      </p>
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              )
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      {/* About */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to="/about"
            className={cn(
              'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
              'hover:bg-hyve-content hover:text-hyve-text-dark focus:bg-hyve-content focus:text-hyve-text-dark focus:outline-none',
              'font-body text-hyve-text'
            )}
          >
            About
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {/* Insights Dropdown */}
      <NavigationMenuItem>
        <NavigationMenuTrigger className="font-body text-hyve-text hover:bg-hyve-content hover:text-hyve-text-dark">
          Insights
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-hyve-background">
            {insightsItems.map(item => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <NavigationMenuLink asChild>
                    <NavLink to={item.href}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-hyve-interactive/20 group-hover:bg-hyve-interactive/30 transition-colors">
                          <Icon className="h-4 w-4 text-hyve-text group-hover:text-hyve-text-dark" />
                        </div>
                        <div className="text-sm font-medium leading-none">{item.name}</div>
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-hyve-text/70 group-hover:text-hyve-text-dark/70">
                        {item.description}
                      </p>
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              )
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)

// Mobile Navigation
const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [industriesOpen, setIndustriesOpen] = useState(false)
  const [insightsOpen, setInsightsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-hyve-content h-11 w-11">
            <Menu className="h-5 w-5 text-hyve-text" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-hyve-background">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-8">
            {/* Home */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                'text-lg font-medium py-2 px-4 rounded-md transition-colors',
                'hover:bg-hyve-content hover:text-hyve-text-dark',
                'font-body text-hyve-text'
              )}
            >
              Home
            </Link>

            {/* Technology */}
            <Link
              to="/haptic-matrix"
              onClick={() => setIsOpen(false)}
              className={cn(
                'text-lg font-medium py-2 px-4 rounded-md transition-colors',
                'hover:bg-hyve-content hover:text-hyve-text-dark',
                'font-body text-hyve-text'
              )}
            >
              Technology
            </Link>

            {/* Industries Dropdown */}
            <div>
              <button
                onClick={() => setIndustriesOpen(!industriesOpen)}
                className={cn(
                  'w-full text-lg font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-between',
                  'hover:bg-hyve-content hover:text-hyve-text-dark',
                  'font-body text-hyve-text'
                )}
              >
                Industries
                <ChevronRight
                  className={cn('h-4 w-4 transition-transform', industriesOpen && 'rotate-90')}
                />
              </button>
              {industriesOpen && (
                <div className="mt-2 space-y-1 pl-4">
                  {industriesItems.map(item => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-2 text-sm py-2 px-4 rounded-md transition-colors',
                          'hover:bg-hyve-content hover:text-hyve-text-dark',
                          'font-body text-hyve-text/80'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* About */}
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={cn(
                'text-lg font-medium py-2 px-4 rounded-md transition-colors',
                'hover:bg-hyve-content hover:text-hyve-text-dark',
                'font-body text-hyve-text'
              )}
            >
              About
            </Link>

            {/* Insights Dropdown */}
            <div>
              <button
                onClick={() => setInsightsOpen(!insightsOpen)}
                className={cn(
                  'w-full text-lg font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-between',
                  'hover:bg-hyve-content hover:text-hyve-text-dark',
                  'font-body text-hyve-text'
                )}
              >
                Insights
                <ChevronRight
                  className={cn('h-4 w-4 transition-transform', insightsOpen && 'rotate-90')}
                />
              </button>
              {insightsOpen && (
                <div className="mt-2 space-y-1 pl-4">
                  {insightsItems.map(item => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-2 text-sm py-2 px-4 rounded-md transition-colors',
                          'hover:bg-hyve-content hover:text-hyve-text-dark',
                          'font-body text-hyve-text/80'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Contact Button - Mobile */}
          <div className="mt-8 px-4">
            <Button
              onClick={() => {
                setIsOpen(false)
                // Open demo booking form
                const contactButton = document.querySelector(
                  '[data-contact-trigger]'
                ) as HTMLButtonElement
                if (contactButton) contactButton.click()
              }}
              className="w-full bg-hyve-text hover:bg-hyve-text-dark text-white font-body flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Book Demo
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Main Header Component
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-hyve-background/95 backdrop-blur-md shadow-hyve border-b border-hyve-content'
          : 'bg-hyve-background/80 backdrop-blur-sm'
      )}
    >
      <div className="hyve-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Logo />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <DesktopNavigation />
            <ContactForm />
          </div>

          {/* Mobile Navigation and Contact */}
          <div className="flex lg:hidden items-center gap-2">
            <ContactForm />
            <MobileNavigation />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
