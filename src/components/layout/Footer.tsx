import { motion } from 'framer-motion'
import { Mail, Linkedin, Building, Hash } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'
import { getPublicAssetPath } from '@/lib/assets'

// Logo component for footer
const FooterLogo = () => (
  <div className="flex items-center space-x-2">
    <img
      src={getPublicAssetPath('logo_white.svg')}
      alt="Hyve Dynamics Holdings"
      className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
    />
  </div>
)

// Company information
const companyInfo = {
  name: 'Hyve Dynamics Holdings',
  email: 'info@hyvedynamics.com',
  companyNumber: '12258323',
  linkedin: 'https://uk.linkedin.com/company/hyve-dynamics',
}

// Footer navigation sections
const footerSections = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Technology', href: '/haptic-matrix' },
      { name: 'Industries', href: '/#industries' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { name: 'Aerospace', href: '/industries/aerospace' },
      { name: 'Automotive', href: '/industries/automotive' },
      { name: 'Digital Twinning & IHM', href: '/industries/digital-twinning-ihm' },
      { name: 'Robotics', href: '/industries/robotics' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'News & Blog', href: '/insights/news' },
      { name: 'Newsletter', href: '/insights/newsletter' },
      { name: 'White Papers', href: '/insights/white-papers' },
    ],
  },
]

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  // 🎨 FOOTER BACKGROUND COLOR: Change 'bg-hyve-header' to modify footer background
  return (
    <footer className="bg-hyve-header text-hyve-background border-t border-hyve-content/20">
      <div className="hyve-container">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Company Information - Left Column */}
            <motion.div
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FooterLogo />

              <div className="space-y-4">
                <p className="font-body text-hyve-background/80 leading-relaxed">
                  Transforming industries through real-world intelligence. We envision a future
                  where data replaces assumptions, enabling smarter and more efficient technological
                  advancements.
                </p>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 group">
                    <Mail className="h-4 w-4 text-hyve-accent" />
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="font-sans text-sm text-hyve-background/80 hover:text-hyve-accent transition-colors"
                    >
                      {companyInfo.email}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-hyve-accent" />
                    <span className="font-sans text-sm text-hyve-background/80">
                      {companyInfo.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Hash className="h-4 w-4 text-hyve-accent" />
                    <span className="font-sans text-sm text-hyve-background/80">
                      Company No: {companyInfo.companyNumber}
                    </span>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-center space-x-4 pt-2">
                  <a
                    href={companyInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-10 h-10 rounded-lg bg-hyve-background/10 hover:bg-hyve-accent transition-all duration-200"
                  >
                    <Linkedin className="h-5 w-5 text-hyve-background group-hover:text-white" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Navigation Sections - Right Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {footerSections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-heading text-lg font-semibold text-hyve-background">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map(link => (
                        <li key={link.name}>
                          {link.href.startsWith('/') ? (
                            <Link
                              to={link.href}
                              className="font-sans text-sm text-hyve-background/70 hover:text-hyve-accent transition-colors duration-200"
                            >
                              {link.name}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              className="font-sans text-sm text-hyve-background/70 hover:text-hyve-accent transition-colors duration-200"
                            >
                              {link.name}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-hyve-background/20" />

        {/* Bottom Footer */}
        <motion.div
          className="py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p className="font-sans text-sm text-hyve-background/60">
              © {currentYear} {companyInfo.name}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="font-sans text-sm text-hyve-background/60">
                For data, privacy, or licensing enquiries, contact{' '}
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="hover:text-hyve-accent transition-colors underline-offset-2 hover:underline"
                >
                  {companyInfo.email}
                </a>
              </span>
            </div>
          </div>

          <div className="font-sans text-sm text-hyve-background/60">
            Registered in England & Wales
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
