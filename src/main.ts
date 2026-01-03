import './style.css'

// Reveal page after CSS is loaded and parsed (prevents FOUC)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('loading')
  })
})

// ============================================
// Hero Spotlight Effect (follows mouse)
// ============================================
const heroSpotlight = document.getElementById('hero-spotlight')
const hero = document.querySelector('.hero')

if (heroSpotlight && hero) {
  hero.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent
    const rect = (hero as HTMLElement).getBoundingClientRect()
    const x = mouseEvent.clientX - rect.left
    const y = mouseEvent.clientY - rect.top
    heroSpotlight.style.left = `${x}px`
    heroSpotlight.style.top = `${y}px`
    heroSpotlight.style.transform = 'translate(-50%, -50%)'
  })
}

// ============================================
// Parallax Effect for Hero Shapes
// ============================================
const parallaxShapes = document.querySelectorAll('[data-parallax]')
let lastScrollY = 0
let parallaxTicking = false

const updateParallax = () => {
  parallaxShapes.forEach((shape) => {
    const el = shape as HTMLElement
    const speed = parseFloat(el.dataset.parallax || '0')
    const yPos = lastScrollY * speed
    el.style.transform = `translateY(${yPos}px)`
  })
  parallaxTicking = false
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax)
    parallaxTicking = true
  }
}, { passive: true })

// ============================================
// Animated Counters
// ============================================
const counters = document.querySelectorAll('.stat-number[data-count]')
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement
      const target = parseInt(el.dataset.count || '0', 10)
      const suffix = el.textContent?.replace(/[\d,]/g, '') || ''
      animateCounter(el, target, suffix)
      counterObserver.unobserve(el)
    }
  })
}, { threshold: 0.5 })

counters.forEach(counter => counterObserver.observe(counter))

function animateCounter(el: HTMLElement, target: number, suffix: string) {
  const duration = 2000
  const start = performance.now()
  const startValue = 0

  el.classList.add('counting')

  const update = (currentTime: number) => {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(startValue + (target - startValue) * eased)

    el.textContent = current.toString() + suffix

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      el.classList.remove('counting')
    }
  }

  requestAnimationFrame(update)
}

// ============================================
// Magnetic Buttons
// ============================================
const magneticButtons = document.querySelectorAll('.btn-magnetic')

magneticButtons.forEach(btn => {
  const el = btn as HTMLElement
  const btnText = el.querySelector('.btn-text') as HTMLElement

  el.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    const pullStrength = 0.2
    el.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`

    if (btnText) {
      btnText.style.transform = `translate(${x * pullStrength * 0.5}px, ${y * pullStrength * 0.5}px)`
    }
  })

  el.addEventListener('mouseleave', () => {
    el.style.transform = ''
    if (btnText) {
      btnText.style.transform = ''
    }
  })
})

// ============================================
// Scroll Progress Bar
// ============================================
const scrollProgress = document.getElementById('scroll-progress')
const updateScrollProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100
  if (scrollProgress) {
    scrollProgress.style.width = `${scrollPercent}%`
  }
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')

      // Animate meter when visible
      if (entry.target.querySelector('#meter-fill')) {
        setTimeout(() => {
          document.getElementById('meter-fill')?.classList.add('animated')
        }, 300)
      }
    }
  })
}, { threshold: 0.1 })

requestAnimationFrame(() => {
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-children').forEach(el => {
    observer.observe(el)
  })
})

// ============================================
// Header Scroll Effect
// ============================================
const header = document.querySelector('.header')
let scrollTicking = false

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      header?.classList.toggle('scrolled', window.scrollY > 50)
      updateScrollProgress()
      scrollTicking = false
    })
    scrollTicking = true
  }
}, { passive: true })

// ============================================
// Enhanced Card Tilt Effect
// ============================================
const cards = document.querySelectorAll('.feature-card, .module-card, .extension-card, .demo-preview-card, .score-card')

cards.forEach(card => {
  const el = card as HTMLElement

  el.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  })

  el.addEventListener('mouseleave', () => {
    el.style.transform = ''
  })
})

// ============================================
// Smooth Scroll (delegated)
// ============================================
document.addEventListener('click', (e) => {
  const anchor = (e.target as HTMLElement).closest('a[href^="#"]')
  if (!anchor) return

  const href = anchor.getAttribute('href')
  if (href && href !== '#') {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

// ============================================
// PRIVACY SHIELD UNIQUE: Threat Counter Animation
// ============================================
const threatIndicators = document.querySelectorAll('.threat-indicator')
let threatCount = 0

const threatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      threatCount++
      const el = entry.target as HTMLElement
      el.style.animationDelay = `${threatCount * 0.15}s`
      el.classList.add('threat-visible')
      threatObserver.unobserve(el)
    }
  })
}, { threshold: 0.3 })

threatIndicators.forEach(indicator => {
  threatObserver.observe(indicator)
})

// Add threat-visible animation style
const threatStyle = document.createElement('style')
threatStyle.textContent = `
  .threat-indicator {
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .threat-indicator.threat-visible {
    opacity: 1;
    transform: translateX(0);
  }
`
document.head.appendChild(threatStyle)

// ============================================
// PRIVACY SHIELD UNIQUE: Radar Animation Enhancements
// ============================================
const radarContainer = document.querySelector('.radar-container')
if (radarContainer) {
  const radarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('radar-active')
        radarObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  radarObserver.observe(radarContainer)
}

// ============================================
// PRIVACY SHIELD UNIQUE: Shield Pulse on Scroll
// ============================================
const shieldElements = document.querySelectorAll('.shield-container')

shieldElements.forEach(shield => {
  const shieldObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shield-active')
      }
    })
  }, { threshold: 0.5 })

  shieldObserver.observe(shield)
})

// ============================================
// PRIVACY SHIELD UNIQUE: Fingerprint Detection Animation
// ============================================
const fingerprintVisuals = document.querySelectorAll('.fingerprint-visual')

fingerprintVisuals.forEach(fp => {
  fp.addEventListener('mouseenter', () => {
    const rings = fp.querySelectorAll('.fingerprint-ring')
    rings.forEach((ring, index) => {
      (ring as HTMLElement).style.animationDelay = `${index * 0.1}s`
    })
  })
})

// ============================================
// PRIVACY SHIELD UNIQUE: Network Blocking Animation
// ============================================
const createNetworkVisualization = () => {
  const networkVisual = document.querySelector('.network-visual')
  if (!networkVisual) return

  // Create random nodes and lines
  for (let i = 0; i < 6; i++) {
    const node = document.createElement('div')
    node.className = 'network-node'
    node.style.left = `${10 + Math.random() * 80}%`
    node.style.top = `${10 + Math.random() * 80}%`
    if (Math.random() > 0.5) node.classList.add('blocked')
    networkVisual.appendChild(node)
  }
}

// Initialize network visualization if element exists
createNetworkVisualization()
