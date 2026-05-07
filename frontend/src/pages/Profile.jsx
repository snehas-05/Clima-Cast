import TopBar from '../components/layout/TopBar';

export default function Profile() {
  return (
    <>
      <TopBar title="Profile" />
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-10 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-[var(--spacing-card-gap)]">
          
          {/* Profile Header Card */}
          <div className="col-span-12 lg:col-span-8 glass-card rounded-[32px] p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img
                alt="User profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqJz1v4-r4QGBzChuMxeFSpHyI9rGKlmV4wj-1RAQsah8lNOImJGvqCw1tXuwWSXtYsR6pNB_uVwFtx1kee2Xm11q9bLv5HoTF7hPk0mgJw6Qw-bXWo91qkf8ccdYC5OhawRN7AwehKrxTULthXDP4bJvWTB2QKLBCSAIizg8Ldi3l2GP3x8CmkaQcroFHyshFFzXxa4-tk3hsN7ykOv6Pri522qVndA-Pn_gDv7UhLjZhUesFc1zwWpqGiKxmiIdx3k7cgF_F0SIe"
              />
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-h2-dashboard text-on-surface">Alexander Vance</h3>
                  <p className="text-on-surface-variant flex items-center justify-center md:justify-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    alexander.v@climacast.ai
                  </p>
                </div>
                <button className="border border-outline-variant text-on-surface-variant text-label-caps px-6 py-2 rounded-full hover:bg-surface-container-low transition-colors">
                  Edit Profile
                </button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-secondary-container/20 text-center">
                  <p className="text-label-caps text-primary mb-1">Reports</p>
                  <p className="text-h3-card-title text-on-surface">124</p>
                </div>
                <div className="p-4 rounded-2xl bg-tertiary-container/20 text-center">
                  <p className="text-label-caps text-tertiary mb-1">Alerts</p>
                  <p className="text-h3-card-title text-on-surface">18</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary-container/20 text-center">
                  <p className="text-label-caps text-primary mb-1">Impact</p>
                  <p className="text-h3-card-title text-on-surface">High</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences (Side) */}
          <div className="col-span-12 lg:col-span-4 glass-card rounded-[32px] p-8 flex flex-col">
            <h4 className="text-h3-card-title text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              Preferences
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">thermostat</span>
                  <span className="text-body-main">Units</span>
                </div>
                <span className="text-primary font-bold">Celsius</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">notifications_active</span>
                  <span className="text-body-main">Alert Style</span>
                </div>
                <span className="text-primary font-bold">Critical Only</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">map</span>
                  <span className="text-body-main">Map View</span>
                </div>
                <span className="text-primary font-bold">Satellite</span>
              </div>
            </div>
            <button className="mt-auto pt-6 w-full text-center text-primary text-label-caps hover:underline">
              View All Settings
            </button>
          </div>

          {/* Recent Activity Timeline */}
          <div className="col-span-12 lg:col-span-7 glass-card rounded-[32px] p-8">
            <h4 className="text-h3-card-title text-on-surface mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Activity
            </h4>
            <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-primary text-[20px]">download</span>
                </div>
                <p className="text-body-main text-on-surface">Downloaded Weekly Forecast: <span className="font-semibold">North Atlantic Region</span></p>
                <p className="text-on-surface-variant text-[14px] mt-1">2 hours ago</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">warning</span>
                </div>
                <p className="text-body-main text-on-surface">Updated notification threshold for <span className="font-semibold">High Wind Warnings</span></p>
                <p className="text-on-surface-variant text-[14px] mt-1">Yesterday at 4:32 PM</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-secondary text-[20px]">star</span>
                </div>
                <p className="text-body-main text-on-surface">Saved <span className="font-semibold">Reykjavik, Iceland</span> to favorites</p>
                <p className="text-on-surface-variant text-[14px] mt-1">Oct 12, 2024</p>
              </div>
            </div>
          </div>

          {/* Climate Mission Card */}
          <div className="col-span-12 lg:col-span-5 glass-card rounded-[32px] p-0 overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img
                alt="Climate Mission"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK9BPKHekjFboPmnRp3REzAutx7ot1AY0-fyS6cWtEtizEGaRrh0pY58uMTHW9dok64BM-M1N5cjnWCmyr7ZYRMLvRkZ0J7Nhs7rcl-lIfY4Epo3r94A-RzYK_QN4kivZyQU6TmRUFn_TNM3_1B9DI9-Te5Lo8r9qfBApMdRvBvkvTNHn6Ro6AuToKYdh69W5FJt1_LJIikDUDJtzpe_y3dGeATm4srcEOQRKQjCOrNV7BB4mDqfnkCI6KKh9cYb9h3lnLPn6kU2LV"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <p className="text-label-caps text-white/80">Climate Mission</p>
                <h4 className="text-h3-card-title text-white">Your Resiliency Score</h4>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-h1-hero text-primary leading-none">85</span>
                <span className="text-on-surface-variant text-label-caps mb-1">/ 100</span>
              </div>
              <p className="text-on-surface-variant text-body-main mb-6">
                You are in the top 5% of users effectively utilizing climate intelligence for operational safety.
              </p>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%]" />
              </div>
              <button className="mt-8 flex items-center justify-center gap-2 text-primary text-label-caps hover:gap-3 transition-all">
                Explore Sustainability Insights
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
