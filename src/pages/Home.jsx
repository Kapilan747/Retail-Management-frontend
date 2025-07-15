import React, { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import heroImg from '../images/hero.jpg';
import aboutImg from '../images/about.png';
import featuresImg from '../images/features.png';
import testimonialsImg from '../images/testimonials.jpg';
import partnersImg from '../images/partners.png';
import ctaImg from '../images/cta.jpg';
import process1Img from '../images/process1.png';
import process2Img from '../images/process2.png';
import process3Img from '../images/process3.png';
import { FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';
import './Home.css';

const AnimatedText = ({ text, variant, as = 'span', perLetter = false, ...rest }) => {
  const Tag = as;
  return (
    <motion.span
      style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'pre-wrap' }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      initial="hidden"
      animate="visible"
    >
      {perLetter
        ? text.split('').map((char, i) => (
            <motion.span
              key={i}
              variants={variant}
              style={{ display: 'inline-block', marginRight: char === ' ' ? 6 : 0 }}
            >{char}</motion.span>
          ))
        : text.split(' ').map((word, i) => (
            <motion.span
              key={i}
              variants={variant}
              style={{ display: 'inline-block', marginRight: 6 }}
            >{word}</motion.span>
          ))}
    </motion.span>
  );
};

const illustrations = {
  hero: heroImg,
  about: aboutImg,
  features: featuresImg,
  testimonials: testimonialsImg,
  partners: partnersImg,
  cta: ctaImg,
  process1: process1Img,
  process2: process2Img,
  process3: process3Img,
  tech1: process1Img,
  tech2: process2Img,
  tech3: process3Img,
  tech4: process1Img,
};

const whitesmoke = '#f5f7fa';
const blue = '#2563eb';
const darkBlue = '#23405c';
const cardShadow = '0 2px 12px rgba(35,99,235,0.06)';
const cardRadius = 16;
const sectionGap = 80;
const cardGap = 40;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.08
    }
  }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 14, duration: 0.7 }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 70, damping: 16, mass: 0.7, duration: 0.9, ease: [0.4, 0, 0.2, 1] }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 18, duration: 0.8 }
  }
};
const fadeInWord = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 16, mass: 0.7, duration: 0.7 }
  }
};
const fadeInLetter = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 14, mass: 0.7, duration: 0.5 }
  }
};

const paragraphVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 18, mass: 0.7, duration: 0.9, ease: [0.4, 0, 0.2, 1] }
  }
};

const listItemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 18, mass: 0.7, duration: 0.9, ease: [0.4, 0, 0.2, 1] }
  }
};

const testimonialTextVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 18, mass: 0.7, duration: 0.9, ease: [0.4, 0, 0.2, 1] }
  }
};

const testimonialAuthorVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 18, mass: 0.7, duration: 0.9, ease: [0.4, 0, 0.2, 1] }
  }
};

function Home() {
  const useSectionInView = (ref) => {
    return useInView(ref, { margin: '-20% 0px -20% 0px', triggerOnce: true });
  };

  const heroRef = useRef(null);
  const heroInView = useSectionInView(heroRef);
  const howRef = useRef(null);
  const howInView = useSectionInView(howRef);
  const aboutRef = useRef(null);
  const aboutInView = useSectionInView(aboutRef);
  const techRef = useRef(null);
  const techInView = useSectionInView(techRef);
  const achievementsRef = useRef(null);
  const achievementsInView = useSectionInView(achievementsRef);
  const caseStudiesRef = useRef(null);
  const caseStudiesInView = useSectionInView(caseStudiesRef);
  const featuresRef = useRef(null);
  const featuresInView = useSectionInView(featuresRef);
  const testimonialsRef = useRef(null);
  const testimonialsInView = useSectionInView(testimonialsRef);
  const partnersRef = useRef(null);
  const partnersInView = useSectionInView(partnersRef);
  const contactRef = useRef(null);
  const contactInView = useSectionInView(contactRef);
  const scrollTestRef = useRef(null);
  const scrollTestInView = useInView(scrollTestRef, { margin: '-20% 0px -20% 0px', triggerOnce: true });

  const handleInView = (section) => (inView) => {
    if (inView) console.log(`Section in view: ${section}`);
  };

  return (
    <div className="home-page">
      <section className="home-section hero-section">
        <div className="home-section-content">
          <div className="hero-text-container">
            <h1 className="hero-title">
              RMSSS: Retail Management & Supply System
            </h1>
            <p className="hero-description">
              Powering logistics, inventory, and growth for modern businesses. <br /> Trusted by 1,200+ companies worldwide.
            </p>
            <div className="stats-container">
              <motion.div variants={popIn} style={{ background: '#eaf0fb', color: darkBlue, borderRadius: cardRadius, padding: '18px 32px', fontWeight: 700, fontSize: 22, minWidth: 180, textAlign: 'center', boxShadow: cardShadow }}>
                2.5M+<br />Goods Transported
              </motion.div>
              <motion.div variants={popIn} style={{ background: '#f0f3fa', color: blue, borderRadius: cardRadius, padding: '18px 32px', fontWeight: 700, fontSize: 22, minWidth: 180, textAlign: 'center', boxShadow: cardShadow }}>
                99.8%<br />Customer Satisfaction
              </motion.div>
              <motion.div variants={popIn} style={{ background: '#eaf6fa', color: darkBlue, borderRadius: cardRadius, padding: '18px 32px', fontWeight: 700, fontSize: 22, minWidth: 180, textAlign: 'center', boxShadow: cardShadow }}>
                1,200+<br />Businesses Served
              </motion.div>
            </div>
          </div>
          <motion.div className="hero-image-container" variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.img
              src={illustrations.hero}
              alt="Logistics"
              layoutId="main-logo"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              style={{ width: '100%', maxWidth: 420, borderRadius: 18, boxShadow: '0 4px 24px rgba(35,99,235,0.08)', background: whitesmoke }}
            />
          </motion.div>
        </div>
      </section>

      <section className="home-section how-it-works-section">
        <h2 className="how-it-works-title">
          How It Works
        </h2>
        <div className="how-it-works-grid">
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 260, background: '#eaf0fb', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow }}>
            <motion.img variants={slideInLeft} src={illustrations.process1} alt="Step 1" style={{ width: 80, marginBottom: 18 }} />
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 20, color: darkBlue, marginBottom: 8 }}>1. Register & Set Up</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontSize: 16, color: '#555' }}>Create your business profile, add products, and configure your supply chain in minutes.</motion.p>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 260, background: '#f0f3fa', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow }}>
            <motion.img variants={slideInLeft} src={illustrations.process2} alt="Step 2" style={{ width: 80, marginBottom: 18 }} />
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 20, color: blue, marginBottom: 8 }}>2. Automate & Track</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontSize: 16, color: '#555' }}>Automate orders, inventory, and logistics. Track everything in real time with smart dashboards.</motion.p>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 260, background: '#eaf6fa', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow }}>
            <motion.img variants={slideInLeft} src={illustrations.process3} alt="Step 3" style={{ width: 80, marginBottom: 18 }} />
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 20, color: darkBlue, marginBottom: 8 }}>3. Grow & Optimize</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontSize: 16, color: '#555' }}>Analyze performance, optimize operations, and scale your business with actionable insights.</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="home-section about-section">
        <div className="about-content">
          <motion.img variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} src={illustrations.about} alt="About RMSSS" style={{ width: '100%', maxWidth: 340, borderRadius: cardRadius, marginBottom: 0, background: whitesmoke, boxShadow: cardShadow, marginTop: 140 }} />
        </div>
        <div className="about-text-container">
          <h2 style={{ fontWeight: 800, fontSize: 32, color: blue, marginBottom: 16 }}>
            About RMSSS
          </h2>
          <motion.p
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={paragraphVariant}
            style={{ fontSize: 19, color: '#3a4656', marginBottom: 18, lineHeight: 1.5 }}
          >
            RMSSS is a leading platform for retail and supply chain management, trusted by top brands and fast-growing startups. Our mission is to empower businesses with seamless logistics, real-time analytics, and world-class support.
          </motion.p>
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            style={{ fontSize: 17, color: '#444', lineHeight: 1.7, marginLeft: 18, marginBottom: 0 }}
          >
            <motion.li variants={listItemVariant}>Founded in 2020, now serving 1,200+ businesses worldwide</motion.li>
            <motion.li variants={listItemVariant}>Automated 10M+ inventory transactions</motion.li>
            <motion.li variants={listItemVariant}>Integrated with 50+ e-commerce and logistics partners</motion.li>
            <motion.li variants={listItemVariant}>ISO 9001 certified for quality and reliability</motion.li>
          </motion.ul>
        </div>
      </section>

      <section className="home-section tech-stack-section">
        <h2 style={{ fontWeight: 800, fontSize: 32, color: blue, marginBottom: 32, textAlign: 'center' }}>
          Our Tech Stack
        </h2>
        <div className="tech-stack-grid">
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 200, background: '#eaf0fb', borderRadius: cardRadius, padding: 28, textAlign: 'center', boxShadow: cardShadow }}>
            <FaReact size={48} color="#61dafb" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 700, color: darkBlue, fontSize: 18 }}>React</div>
            <div style={{ color: '#555', fontSize: 15 }}>Modern UI & SPA</div>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 200, background: '#f0f3fa', borderRadius: cardRadius, padding: 28, textAlign: 'center', boxShadow: cardShadow }}>
            <FaNodeJs size={48} color="#3c873a" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 700, color: blue, fontSize: 18 }}>Node.js</div>
            <div style={{ color: '#555', fontSize: 15 }}>Fast, scalable backend</div>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 200, background: '#eaf6fa', borderRadius: cardRadius, padding: 28, textAlign: 'center', boxShadow: cardShadow }}>
            <SiMongodb size={48} color="#47A248" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 700, color: darkBlue, fontSize: 18 }}>MongoDB</div>
            <div style={{ color: '#555', fontSize: 15 }}>Flexible NoSQL database</div>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 200, background: '#eaf0fb', borderRadius: cardRadius, padding: 28, textAlign: 'center', boxShadow: cardShadow }}>
            <FaDocker size={48} color="#2496ed" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 700, color: blue, fontSize: 18 }}>Docker</div>
            <div style={{ color: '#555', fontSize: 15 }}>Containerized deployment</div>
          </motion.div>
        </div>
      </section>

      <section className="home-section achievements-section">
        <h2 style={{ fontWeight: 800, fontSize: 32, color: blue, marginBottom: 24, textAlign: 'center', display: 'inline-block' }}>
          Our Achievements
        </h2>
        <div className="achievements-grid">
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 260, background: '#eaf0fb', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow, margin: 0 }}>
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 22, color: darkBlue, marginBottom: 8 }}>Awarded Best Logistics Platform 2023</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontSize: 16, color: '#555', margin: 0 }}>Recognized for innovation and customer impact by the Global Logistics Association.</motion.p>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 260, background: '#f0f3fa', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow, margin: 0 }}>
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 22, color: blue, marginBottom: 8 }}>35% Cost Reduction</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontSize: 16, color: '#555', margin: 0 }}>Helped clients save millions by optimizing supply chains and automating workflows.</motion.p>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 260, background: '#eaf6fa', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow, margin: 0 }}>
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 22, color: darkBlue, marginBottom: 8 }}>Global Reach</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontSize: 16, color: '#555', margin: 0 }}>Operations in 20+ countries and 100+ cities, supporting local and international businesses.</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="home-section case-studies-section">
        <h2 style={{ fontWeight: 800, fontSize: 32, color: blue, marginBottom: 32, textAlign: 'center', perspective: 800 }}>
          Case Studies
        </h2>
        <div className="case-studies-grid">
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 320, background: '#eaf0fb', borderRadius: cardRadius, padding: 32, boxShadow: cardShadow }}>
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 20, color: darkBlue, marginBottom: 8 }}>FastMart</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16, marginBottom: 8 }}><b>Challenge:</b> Inefficient supply chain, high costs.</motion.p>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16, marginBottom: 8 }}><b>Solution:</b> RMSSS automated inventory and logistics.</motion.p>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16 }}><b>Result:</b> 35% cost reduction, 2x faster delivery, 99.8% satisfaction.</motion.p>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 320, background: '#f0f3fa', borderRadius: cardRadius, padding: 32, boxShadow: cardShadow }}>
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 20, color: blue, marginBottom: 8 }}>ShopEase</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16, marginBottom: 8 }}><b>Challenge:</b> Manual order processing, slow analytics.</motion.p>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16, marginBottom: 8 }}><b>Solution:</b> RMSSS real-time dashboards & automation.</motion.p>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16 }}><b>Result:</b> 4x faster order processing, actionable insights, happier customers.</motion.p>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 320, background: '#eaf6fa', borderRadius: cardRadius, padding: 32, boxShadow: cardShadow }}>
            <motion.h3 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ fontWeight: 700, fontSize: 20, color: darkBlue, marginBottom: 8 }}>SupplyChain Pro</motion.h3>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16, marginBottom: 8 }}><b>Challenge:</b> Complex inventory management across locations.</motion.p>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16, marginBottom: 8 }}><b>Solution:</b> RMSSS centralized inventory & analytics platform.</motion.p>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ color: '#555', fontSize: 16 }}><b>Result:</b> 40% inventory reduction, real-time tracking, seamless operations.</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="home-section features-section">
        <div className="features-content">
          <h2 style={{ fontWeight: 800, fontSize: 32, color: blue, marginBottom: 16, borderBottom: '4px solid #2563eb', display: 'inline-block' }}>
            Why Choose RMSSS?
          </h2>
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            style={{ fontSize: 18, color: '#444', lineHeight: 1.7, marginLeft: 18, marginBottom: 0 }}
          >
            <motion.li variants={listItemVariant}>Real-time inventory and sales analytics</motion.li>
            <motion.li variants={listItemVariant}>Automated order processing and fulfillment</motion.li>
            <motion.li variants={listItemVariant}>Seamless integration with e-commerce and POS systems</motion.li>
            <motion.li variants={listItemVariant}>Customizable dashboards and reporting</motion.li>
            <motion.li variants={listItemVariant}>AI-powered demand forecasting</motion.li>
            <motion.li variants={listItemVariant}>Dedicated account managers and 24/7 support</motion.li>
          </motion.ul>
        </div>
        <div className="features-image-container">
          <motion.img variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} src={illustrations.features} alt="Features" style={{ width: '70%', maxWidth: 340, borderRadius: cardRadius, background: whitesmoke, boxShadow: cardShadow, marginTop: 160 }} />
        </div>
      </section>

      <section className="home-section testimonials-section">
        <h2 style={{ fontWeight: 800, fontSize: 32, color: blue, marginBottom: 24, textAlign: 'center' }}>
          What Our Clients Say
        </h2>
        <div className="testimonials-grid">
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 320, background: '#eaf0fb', borderRadius: cardRadius, padding: 32, boxShadow: cardShadow, margin: 0 }}>
            <motion.p
              key="testimonial-1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={testimonialTextVariant}
              style={{ fontSize: 17, color: '#333', fontStyle: 'italic', marginBottom: 8, marginTop: 0 }}>
                <AnimatedText text="“RMSSS transformed our supply chain. We cut costs, improved delivery times, and our customers are happier than ever!”" variant={testimonialTextVariant} as="span" />
            </motion.p>
            <motion.div
              key="testimonial-1-author"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={testimonialAuthorVariant}
              style={{ fontWeight: 700, color: darkBlue }}>
              — Priya S., CEO, FastMart
            </motion.div>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 320, background: '#f0f3fa', borderRadius: cardRadius, padding: 32, boxShadow: cardShadow, margin: 0 }}>
            <motion.p
              key="testimonial-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={testimonialTextVariant}
              style={{ fontSize: 17, color: '#333', fontStyle: 'italic', marginBottom: 8, marginTop: 0 }}>
                <AnimatedText text="“The analytics and automation features are a game changer. RMSSS is a must-have for any growing retailer.”" variant={testimonialTextVariant} as="span" />
            </motion.p>
            <motion.div
              key="testimonial-2-author"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={testimonialAuthorVariant}
              style={{ fontWeight: 700, color: blue }}>
              — John D., COO, ShopEase
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="home-section partners-section">
        <h2 style={{ fontWeight: 800, fontSize: 32, color: blue, marginBottom: 24, textAlign: 'center' }}>
          Our Partners
        </h2>
        <div className="partners-grid">
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 220, background: '#eaf6fa', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow, margin: 0 }}>
            <motion.img variants={slideInLeft} src={illustrations.partners} alt="Partner" style={{ width: 80, marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 18, color: darkBlue }}>LogiPro</div>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 220, background: '#eaf0fb', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow, margin: 0 }}>
            <motion.img variants={slideInLeft} src={illustrations.partners} alt="Partner" style={{ width: 80, marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 18, color: blue }}>RetailX</div>
          </motion.div>
          <motion.div variants={popIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} style={{ flex: 1, minWidth: 220, background: '#f0f3fa', borderRadius: cardRadius, padding: 32, textAlign: 'center', boxShadow: cardShadow, margin: 0 }}>
            <motion.img variants={slideInLeft} src={illustrations.partners} alt="Partner" style={{ width: 80, marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 18, color: blue }}>SupplyNet</div>
          </motion.div>
        </div>
      </section>

      <section className="home-section cta-section">
        <div className="cta-content">
          <h2 style={{ fontWeight: 900, fontSize: 32, color: blue, marginBottom: 18 }}>
            Ready to Transform Your Business?
          </h2>
          <motion.p
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={paragraphVariant}
            style={{ fontSize: 19, color: '#3a4656', marginBottom: 24, lineHeight: 1.5, textAlign: 'center', maxWidth: 600, width: '100%' }}
          >
            Join 1,200+ businesses who trust RMSSS for their retail and supply chain needs. Contact us today to schedule a free demo or consultation!
          </motion.p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 400, width: '100%', margin: '0 auto', alignItems: 'center' }} onSubmit={e => { e.preventDefault(); alert('Thank you! We will contact you soon.'); }}>
            <input type="text" placeholder="Your Name" required style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #c3d0e8', fontSize: 16, width: '100%' }} />
            <input type="email" placeholder="Your Email" required style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #c3d0e8', fontSize: 16, width: '100%' }} />
            <textarea placeholder="How can we help you?" required rows={3} style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #c3d0e8', fontSize: 16, resize: 'vertical', width: '100%' }} />
            <button type="submit" style={{ background: blue, color: '#fff', padding: '12px 0', borderRadius: 8, fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', marginTop: 8, transition: 'background 0.2s', width: '100%' }}>Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home; 