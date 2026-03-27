import { motion } from 'framer-motion'

const ATI_ARTICLE_URL =
  'https://www.ati.org.uk/news-events/news/four-highlights-from-sustainable-skies-world-summit-2025-2/'

export const AwardBanner = () => {
  return (
    <section className="relative py-6 lg:py-8 pointer-events-none">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <motion.a
          href={ATI_ARTICLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="pointer-events-auto relative flex items-center justify-center gap-4 sm:gap-8 px-8 py-5 sm:py-6 bg-gradient-to-br from-white/90 to-hyve-content/30 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl border border-transparent hover:border-hyve-accent/30 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-sm sm:text-base font-semibold text-hyve-header tracking-wide">
            Nominated for ATI Innovation Award
          </span>

          <div className="h-8 w-px bg-hyve-content/30 hidden sm:block" />

          <img
            src={`${import.meta.env.BASE_URL}ATI_logo.png`}
            alt="Aerospace Technology Institute"
            className="h-16 sm:h-18 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </motion.a>
      </div>
    </section>
  )
}
