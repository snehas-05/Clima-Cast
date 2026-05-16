import { useOutletContext } from 'react-router-dom';
import FeatureItem from '../components/cards/FeatureItem';
import Button from '../components/ui/Button';

const values = [
  { icon: 'verified_user', title: 'Integrity', desc: 'Unbiased data reporting at all scales.' },
  { icon: 'speed', title: 'Latency', desc: 'Real-time processing for urgent needs.' },
  { icon: 'wb_sunny', title: 'Clarity', desc: 'Complex data distilled for everyone.' },
  { icon: 'hub', title: 'Connectivity', desc: 'Bridging sectors for climate resilience.' },
];

export default function About() {
  const { handleContactSales: handlePartnerClick } = useOutletContext();

  return (
    <div className="mesh-gradient min-h-screen">
      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[var(--spacing-container-padding)] pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-card-gap)] items-center">
          <div className="md:col-span-7">
            <span className="text-label-caps text-primary mb-4 block">OUR MISSION</span>
            <h1 className="text-h1-hero text-on-surface mb-8">
              Empowering climate-resilient decisions through{' '}
              <span className="text-primary">Atmospheric Intelligence.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed mb-8 max-w-2xl">
              At Clima-Cast, we believe that the future belongs to those who can see through the storm. Our mission is to transform hyper-accurate environmental data into actionable intelligence, providing a sophisticated digital lens for decision-makers navigating an increasingly complex world.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="glass-card rounded-3xl p-2 rotate-2 overflow-hidden aspect-square flex items-center justify-center relative">
              <img
                alt="Satellite Earth View"
                className="w-full h-full object-cover rounded-2xl opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYKLd5pxMtsTWuZdNM-oVkHJt_Rhv-eCwJ2wIipr85sZmTBFg5oKL14UU5KuTO7VCQwJ0zekUQVLhpuaTIxWqOpuQkR2QgHe38iqZeocbrf7XDH4-vliYztH0HN00I6rs7fHM1EgPBMsVZPVImMkHbYOYhUYLVCdd9Ri_Wna98cigDIemw-8ZqqzZIXPmDVDVSt3sROT8K5IkPxx8kOfdcWZZbLMb8AD8BBTsx3d94zirsQL0KXnjZj2Mknyy7FFxizVLhFnfA7UY5"
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Science + Network + Mission */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[var(--spacing-container-padding)] pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-card-gap)]">
          {/* Our Science */}
          <div className="md:col-span-2 glass-card rounded-3xl p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <h2 className="text-h2-dashboard text-on-surface">Our Science</h2>
              </div>
              <p className="text-body-main text-on-surface-variant mb-8 max-w-lg">
                We utilize proprietary AI models that synthesize multi-spectral satellite imagery and terrestrial sensor arrays. This ensemble approach achieves 94% precision in micro-climate forecasting.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l-2 border-primary/20 pl-6">
                <span className="text-label-caps text-on-surface-variant">AI ENGINE</span>
                <div className="text-h2-dashboard text-primary">Neural-Cast V3</div>
              </div>
              <div className="border-l-2 border-primary/20 pl-6">
                <span className="text-label-caps text-on-surface-variant">ACCURACY RATE</span>
                <div className="text-h2-dashboard text-primary">94.8%</div>
              </div>
            </div>
          </div>

          {/* Global Network */}
          <div className="glass-card rounded-3xl p-10 overflow-hidden relative">
            <div className="relative z-10">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
                <span className="material-symbols-outlined text-primary">explore_nearby</span>
              </div>
              <h3 className="text-h3-card-title text-on-surface mb-4">Global Network</h3>
              <p className="text-body-main text-on-surface-variant">
                Sourcing real-time telemetry from over 12,000 global weather stations and 40+ atmospheric satellites.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none opacity-40">
              <img
                alt="Data Network"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy_FHgCY98HL5BNKCjQBr3TecwqMLIfJWKLva6RubW0w0lXM-MIn6B9MhYwsdGGXG1hF7TE9-nJ8a8GvYjhy5K5P20U6DlbpTL5RhVIbbWb3XxIFwtmOwsCWMSP8p5qQfohgb8h5BS_s0_drSHxTphUBUVNBdaCVkHqmT6irNpGFfB79BqI2GgmV2Cl37nblYjMyc_4YDsxi04Irju1rPOeczAAX2p3EQzyo8HMLVS8b_MT-ZXY4YLy9I6Z5ejQfaZf4ccNcoEGhRm"
              />
            </div>
          </div>

          {/* Climate Mission */}
          <div className="md:col-span-3 glass-card rounded-3xl p-12 bg-primary text-white flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="text-label-caps text-secondary-fixed mb-4 block">IMPACT</span>
              <h2 className="text-h2-dashboard mb-6">The Climate Mission</h2>
              <p className="text-body-lg text-secondary-fixed/80 leading-relaxed">
                Beyond commercial analytics, Clima-Cast is committed to environmental stewardship. We provide our advanced modeling tools to non-profit organizations fighting desertification and coastal erosion.
              </p>
              <Button 
                variant="ghost" 
                className="mt-8 bg-white text-primary hover:bg-secondary-fixed border-none"
                onClick={handlePartnerClick}
              >
                Partner with Us
              </Button>
            </div>
            <div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden bg-surface-container/20 backdrop-blur-xl border border-white/20 p-1">
              <img
                alt="Climate Preservation"
                className="w-full h-full object-cover rounded-xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_A2js1W6Nr-fB5rBhw35fGbTq_oJ2mMIPlbEg4OmB6oFftuNdlImBEcjaq_rYQWXzEZWLCxKEE7ciFae6b0d1UX691LrDT5h9xKsDAih43Vw0VLg-0Mhd6fY9dzO8RyJwwB8xKUZYjpqJ-ZKR79k8o-U7fVCmtXVEJJlvemj_EFjEdArrzBqRkx0kHQy3I3veA-tcgClJxYpz8ZU9KNi9Hbfi9lMm5tS99ffwtl74rjVCxZRsIH1tW3A_zwe4WaQBbej8cUWtHY9o"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[var(--spacing-container-padding)] pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-gutter)]">
          {values.map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">{icon}</span>
              <h4 className="text-h3-card-title mb-2">{title}</h4>
              <p className="text-on-surface-variant text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
