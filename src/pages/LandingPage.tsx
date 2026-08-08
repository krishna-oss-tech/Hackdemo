import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Shield, Zap, ArrowRight, ChevronDown,
  Sun, Moon, Menu, X, Globe, BarChart3, Users, Award,
  Check, Star, Activity, Map, Target, Layers
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
};

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 backdrop-blur-xl border-b'
          : 'py-5'
      }`}
      style={{
        background: scrolled ? 'var(--bg-glass)' : 'transparent',
        borderColor: scrolled ? 'var(--border-color)' : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
            Terra<span className="text-gradient-primary">Aid</span> AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}>
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="btn-primary hidden md:flex text-sm py-2.5 px-5">
            Launch Dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 mx-6 p-4 rounded-2xl"
          style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
          {['Features', 'How It Works', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, '-')}`}
              className="block py-3 px-4 text-sm font-medium rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
          <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
            className="btn-primary w-full mt-3 justify-center text-sm py-2.5">
            Launch Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 graticule-bg">
      {/* Background */}
      <div className="absolute inset-0 scan-sweep pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 60%)'
        }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}
          >
            <Zap className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              TerraAid AI Disaster Intelligence
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            <span style={{ color: 'var(--text-primary)' }}>Detect. Quantify. Explain.</span>
            <br />
            <span className="text-gradient-primary">Prioritize. Act.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-mono-data"
            style={{ color: 'var(--text-secondary)' }}>
            Compare before/after satellite imagery to detect floods, wildfires, and crop stress. 
            Turn planetary telemetry into actionable decision-intelligence for responders on the ground.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => navigate('/dashboard/analyze')}
              className="btn-primary text-base py-3.5 px-8 font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-200" /> Start Live Analysis
            </button>
            <button onClick={() => navigate('/dashboard/analyze?demo=true')} className="btn-outline text-base py-3.5 px-8">
              View Demo Scenario <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6" style={{ color: 'var(--text-tertiary)' }} />
        </motion.div>
      </div>
    </section>
  );
}



function FeaturesSection() {
  const featureCards = [
    { icon: <Shield className="w-8 h-8 text-cyan-400" />, title: 'Disaster Detection', description: 'Spot floods and wildfires instantly using Sentinel-1 SAR and optical imagery.' },
    { icon: <Map className="w-8 h-8 text-cyan-400" />, title: 'Affected Area', description: 'Quantify exact square kilometers impacted using our precise polygon engine.' },
    { icon: <Layers className="w-8 h-8 text-cyan-400" />, title: 'Explainable AI', description: 'Never guess why. We provide confidence scores and the exact evidence behind every detection.' },
    { icon: <Target className="w-8 h-8 text-cyan-400" />, title: 'Priority Response', description: 'Generates zones and actionable recommendations for first responders.' },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>CAPABILITIES</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            Actionable Intelligence
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to monitor, detect, and respond to environmental changes from space.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featureCards.map((feature, i) => (
            <motion.div key={i} variants={item}
              className="glass-card p-6 group cursor-pointer"
              whileHover={{ y: -4 }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { step: '01', title: 'Detect', desc: 'Continuous satellite monitoring identifies anomalies in SAR and optical data.' },
    { step: '02', title: 'Quantify', desc: 'AI calculates exact affected area and severity levels automatically.' },
    { step: '03', title: 'Explain', desc: 'Transparent reporting of the satellite evidence backing the detection.' },
    { step: '04', title: 'Prioritize', desc: 'Risk zones are mapped to identify where help is needed most.' },
    { step: '05', title: 'Act', desc: 'Generate actionable response plans for emergency teams.' },
  ];

  return (
    <section id="how-it-works" className="py-24 relative border-t border-b" style={{ borderColor: 'var(--border-color)' }}>
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <BarChart3 className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>WORKFLOW</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            The TerraAid Workflow
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From satellite scan to actionable intelligence in 5 straightforward steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5"
            style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center relative"
            >
              <div className="text-xs font-bold mb-2 tracking-wide font-mono-data"
                style={{ color: 'var(--color-primary)' }}>
                STEP {step.step}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyTerraAidSection() {
  const reasons = [
    { icon: <Shield className="w-5 h-5" />, title: 'Military-Grade Accuracy', desc: '99.2% detection accuracy trained on 50,000+ labeled disaster events.' },
    { icon: <Zap className="w-5 h-5" />, title: 'Real-Time Processing', desc: 'Get results in under 3 seconds with our optimized AI pipeline.' },
    { icon: <Users className="w-5 h-5" />, title: 'Trusted by Agencies', desc: 'Used by government disaster response agencies and agricultural departments.' },
    { icon: <Award className="w-5 h-5" />, title: 'Open & Transparent', desc: 'Full AI explainability — understand why every detection was made.' },
  ];

  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <Star className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>WHY CHOOSE US</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              Why TerraAid AI?
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Built by satellite imaging experts and AI researchers, TerraAid AI combines cutting-edge
              deep learning with decades of remote sensing experience to deliver the most reliable
              environmental monitoring platform available.
            </p>
            <div className="space-y-4">
              {reasons.map((r, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl transition-all"
                  style={{ background: 'var(--bg-hover)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-primary)' }}>
                    {r.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{r.title}</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent)' }} />

            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Platform at a Glance
            </h3>

            <div className="space-y-5">
              {[
                { label: 'Disaster Detection', value: 99.2, color: '#ef4444' },
                { label: 'Crop Analysis', value: 97.5, color: '#22c55e' },
                { label: 'Area Estimation', value: 95.8, color: '#3b82f6' },
                { label: 'Response Time', value: 98.1, color: '#eab308' },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{metric.label}</span>
                    <span className="text-sm font-bold" style={{ color: metric.color }}>{metric.value}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: metric.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--bg-hover)' }}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                      style={{
                        borderColor: 'var(--bg-card-solid)',
                        background: `hsl(${160 + i * 40}, 70%, 50%)`,
                        color: 'white'
                      }}>
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    200+ Organizations
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Trust TerraAid for disaster monitoring
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t" style={{ borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                TerraAid AI
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Transforming satellite data into intelligent disaster and crop decisions.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Dashboard', 'API', 'Pricing'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>{col.title}</h4>
              <div className="space-y-2">
                {col.links.map((link) => (
                  <a key={link} href="#" className="block text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-tertiary)' }}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            © 2026 TerraAid AI. All rights reserved. Built for India Hackathon 2026.
          </p>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <Check key={i} className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
            ))}
            <span className="text-xs ml-1" style={{ color: 'var(--text-tertiary)' }}>SOC 2 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyTerraAidSection />
      <Footer />
    </div>
  );
}
