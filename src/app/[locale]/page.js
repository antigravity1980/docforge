import { getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Fetch prices from DB
  const { data: settingsData } = await supabaseAdmin
    .from('settings')
    .select('key, value');

  const settings = settingsData?.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const prices = {
    starter: settings.priceStarter || '29',
    pro: settings.pricePro || '79'
  };
  const p = dict.page;

  const DOCUMENT_TYPES = [
    {
      category: p.features.categories.legal,
      icon: '⚖️',
      color: '#6366f1',
      items: [
        { ...p.features.items.nda, slug: 'nda-generator' },
        { ...p.features.items.privacy, slug: 'privacy-policy-generator' },
        { ...p.features.items.tos, slug: 'terms-of-service-generator' },
        { ...p.features.items.freelance, slug: 'freelance-contract-generator' },
      ]
    },
    {
      category: p.features.categories.business,
      icon: '💼',
      color: '#8b5cf6',
      items: [
        { ...p.features.items.invoice, slug: 'invoice-generator' },
        { ...p.features.items.proposal, slug: 'business-proposal-generator' },
        { ...p.features.items.sow, slug: 'sow' },
      ]
    },
    {
      category: p.features.categories.seo,
      icon: '🚀',
      color: '#10b981',
      items: [
        { ...p.features.items.meta, slug: 'meta-tags-generator' },
        { ...p.features.items.blog, slug: 'seo-blog-outline-generator' },
      ]
    }
  ];

  const STATS = p.stats.map((s, i) => ({
    ...s,
    value: ['12k+', '5k+', '4.9/5', '30s'][i] // Values remain same
  }));

  const STEPS = p.howItWorks.steps.map((s, i) => ({
    ...s,
    num: ['01', '02', '03'][i],
    icon: ['📝', '⚡', '📄'][i]
  }));

  const TESTIMONIALS = p.testimonials.list.map((t, i) => ({
    ...t,
    rating: 5
  }));

  const PRICING_PLANS = [
    {
      name: dict.pricing_page.plans.free.name,
      price: '0',
      period: `/${dict.pricing_page.period_month}`,
      features: dict.pricing_page.plans.free.features,
      cta: dict.pricing_page.plans.free.cta,
      popular: false
    },
    {
      name: dict.pricing_page.plans.starter.name,
      price: prices.starter,
      period: `/${dict.pricing_page.period_month}`,
      features: dict.pricing_page.plans.starter.features,
      cta: dict.pricing_page.plans.starter.cta,
      popular: true
    },
    {
      name: dict.pricing_page.plans.pro.name,
      price: prices.pro,
      period: `/${dict.pricing_page.period_month}`,
      features: dict.pricing_page.plans.pro.features,
      cta: dict.pricing_page.plans.pro.cta,
      popular: false
    }
  ];

  const FAQS = p.faq.list;

  return (
    <>
      {/* ===== HERO ===== */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroGrid} />
        <div className="container" style={s.heroContent}>
          <div className="badge animate-fade-in-up" style={{ marginBottom: '16px' }}>
            {p.hero.badge}
          </div>
          <h1 style={s.heroTitle} className="animate-fade-in-up delay-1">
            {dict.hero.title.split(p.hero.titleAccent)[0]}
            <span className="gradient-text">{p.hero.titleAccent}</span>
            {dict.hero.title.split(p.hero.titleAccent)[1]}
          </h1>
          <p style={s.heroSubtitle} className="animate-fade-in-up delay-2">
            {dict.hero.subtitle}
          </p>
          <div style={s.heroCtas} className="animate-fade-in-up delay-3">
            <Link href={`/${locale}/auth/signup`} className="btn btn-primary btn-lg">
              {dict.hero.cta} →
            </Link>
            <Link href={`/${locale}/#how-it-works`} className="btn btn-secondary btn-lg">
              {p.hero.seeHow}
            </Link>
          </div>
          <div style={s.heroTrust} className="animate-fade-in-up delay-4">
            <span style={s.trustStars}>★★★★★</span>
            <span style={s.trustText}>{p.hero.trust}</span>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={s.statsBar}>
        <div className="container">
          <div className="grid-4" style={s.statsGrid}>
            {STATS.map((stat, i) => (
              <div key={i} style={s.statItem}>
                <span style={s.statValue}>{stat.value}</span>
                <span style={s.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES / TOOLS ===== */}
      <section id="features" className="section">
        <div className="container">
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>{p.features.title}<br /><span className="gradient-text">{p.features.titleAccent}</span></h2>
            <p style={s.sectionSubtitle}>{p.features.subtitle}</p>
          </div>

          <div className="grid-3">
            {DOCUMENT_TYPES.map((cat, i) => (
              <div key={i} className="card" style={s.featureCard}>
                <div style={s.featureCardHeader}>
                  <span style={{ fontSize: '32px' }}>{cat.icon}</span>
                  <h3 style={s.featureCardTitle}>{cat.category}</h3>
                </div>
                <div style={s.featureItems}>
                  {cat.items.map((item, j) => (
                    <Link
                      key={j}
                      href={`/${locale}/tools/${item.slug}`}
                      style={s.featureItem}
                      className="feature-hover-item mobile-stack"
                    >
                      <span style={s.featureItemName}>{item.name}</span>
                      <span style={s.featureItemDesc}>{item.desc}</span>
                      <span style={s.featureArrow} className="item-arrow mobile-hide">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section-alt">
        <div className="container">
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>{p.howItWorks.title}</h2>
            <p style={s.sectionSubtitle}>{p.howItWorks.subtitle}</p>
          </div>

          <div className="grid-3">
            {STEPS.map((step, i) => (
              <div key={i} className="card" style={s.stepCard}>
                <div style={s.stepNum}>{step.num}</div>
                <div style={{ fontSize: '40px', marginBottom: '24px' }}>{step.icon}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section">
        <div className="container">
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>{dict.nav.pricing}</h2>
            <p style={s.sectionSubtitle}>{p.pricing.subtitle}</p>
          </div>

          <div className="grid-3" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {PRICING_PLANS.map((plan, i) => (
              <div
                key={i}
                className="card"
                style={{
                  ...s.pricingCard,
                  ...(plan.popular ? s.pricingPopular : {})
                }}
              >
                {plan.popular && <div style={s.popularBadge}>{p.pricing.plans.popular}</div>}
                <div style={s.planName}>{plan.name}</div>
                <div style={s.planPrice}>
                  <span style={s.planPriceSmall}>$</span>
                  {plan.price}
                  <span style={s.planPeriod}>{plan.period}</span>
                </div>
                <ul style={s.planFeatures}>
                  {plan.features.map((feat, j) => (
                    <li key={j} style={s.planFeature}>✓ {feat}</li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/auth/signup`}
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                  style={{ width: '100%' }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-alt">
        <div className="container">
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>{p.testimonials.title}</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={s.testimonialCard}>
                <div style={s.testimonialStars}>{'★'.repeat(t.rating)}</div>
                <p style={s.testimonialText}>&quot;{t.text}&quot;</p>
                <div style={s.testimonialAuthor}>
                  <div style={s.testimonialAvatar}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={s.testimonialName}>{t.name}</div>
                    <div style={s.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" id="faq">
        <div className="container">
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>{p.faq.title}</h2>
          </div>
          <div className="grid-2" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={s.faqItem}>
                <h3 style={s.faqQuestion}>{faq.q}</h3>
                <p style={s.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={s.ctaSection}>
        <div className="container" style={s.ctaInner}>
          <h2 style={s.ctaTitle}>{p.cta.title}</h2>
          <p style={s.ctaSubtitle}>{p.cta.subtitle}</p>
          <Link href={`/${locale}/auth/signup`} className="btn btn-primary btn-lg">
            {p.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}

const s = {
  /* Hero */
  hero: {
    position: 'relative',
    padding: '100px 0 80px',
    overflow: 'hidden',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    background: 'radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a0f 70%)',
  },
  heroGlow: {
    position: 'absolute',
    top: '-200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    height: '800px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
  },
  heroContent: {
    position: 'relative',
    textAlign: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    marginBottom: '24px',
    color: '#f0f0f5',
  },
  heroSubtitle: {
    fontSize: '18px',
    lineHeight: 1.7,
    color: '#a0a0b8',
    maxWidth: '600px',
    margin: '0 auto 40px',
  },
  heroCtas: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  heroTrust: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  trustStars: {
    color: '#f59e0b',
    fontSize: '16px',
    letterSpacing: '2px',
  },
  trustText: {
    fontSize: '14px',
    color: '#6b6b80',
  },

  /* Stats Bar */
  statsBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '40px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
    textAlign: 'center',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b6b80',
  },

  /* Section Headers */
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '64px',
  },
  sectionTitle: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#a0a0b8',
    maxWidth: '560px',
    margin: '0 auto',
    lineHeight: 1.6,
  },

  /* Features Grid */
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  featureCard: {
    padding: '32px',
  },
  featureCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  featureCardTitle: {
    fontSize: '20px',
    fontWeight: 700,
  },
  featureItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  featureItemName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f0f0f5',
  },
  featureItemDesc: {
    fontSize: '13px',
    color: '#6b6b80',
    lineHeight: '1.4',
  },
  featureArrow: {
    fontSize: '14px',
    color: '#6b6b80',
    opacity: 0,
    transform: 'translateX(-4px)',
    transition: 'all 0.2s ease',
  },

  /* Steps */
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
  },
  stepCard: {
    textAlign: 'center',
    padding: '40px 32px',
  },
  stepNum: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#6366f1',
    marginBottom: '16px',
    letterSpacing: '2px',
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  stepDesc: {
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#a0a0b8',
  },

  /* Pricing */
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  pricingCard: {
    padding: '32px',
    textAlign: 'center',
    position: 'relative',
  },
  pricingPopular: {
    borderColor: '#6366f1',
    boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '4px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 700,
  },
  planName: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#a0a0b8',
  },
  planPrice: {
    fontSize: '48px',
    fontWeight: 800,
    marginBottom: '24px',
    color: '#f0f0f5',
  },
  planPriceSmall: {
    fontSize: '24px',
  },
  planPeriod: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#6b6b80',
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    textAlign: 'left',
  },
  planFeature: {
    fontSize: '14px',
    color: '#a0a0b8',
  },
  planFeatureDisabled: {
    fontSize: '14px',
    color: '#4a4a5c',
  },

  /* Testimonials */
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  testimonialCard: {
    padding: '32px',
  },
  testimonialStars: {
    color: '#f59e0b',
    fontSize: '18px',
    letterSpacing: '3px',
    marginBottom: '16px',
  },
  testimonialText: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#a0a0b8',
    marginBottom: '20px',
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  testimonialAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    color: 'white',
  },
  testimonialName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f0f0f5',
  },
  testimonialRole: {
    fontSize: '13px',
    color: '#6b6b80',
  },

  /* FAQ */
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  faqItem: {
    padding: '24px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  faqQuestion: {
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#f0f0f5',
  },
  faqAnswer: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#a0a0b8',
  },

  /* CTA */
  ctaSection: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
    borderTop: '1px solid rgba(99, 102, 241, 0.2)',
  },
  ctaInner: {
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
    fontWeight: 800,
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: '#a0a0b8',
    marginBottom: '32px',
  },
};
