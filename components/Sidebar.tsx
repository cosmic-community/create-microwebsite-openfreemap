import type { SiteSettings } from '@/types';

export default function Sidebar({ settings }: { settings: SiteSettings | null }) {
  const navItems = [
    { href: '/', label: 'Map', icon: '🗺️' },
    { href: '/devices', label: 'Devices', icon: '📡' },
    { href: '/locations', label: 'Locations', icon: '📍' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {settings?.metadata?.logo ? (
            <img
              src={`${settings.metadata.logo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
              alt="Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xl">
              🗺️
            </div>
          )}
          <div className="min-w-0">
            <div className="text-white font-bold text-sm truncate">
              {settings?.metadata?.site_title || 'OpenFreeMap'}
            </div>
            <div className="text-slate-400 text-xs truncate">MQTT Control</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-slate-300">Powered by</span>
          </div>
          <a
            href="https://openfreemap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 hover:text-brand-600 text-xs font-semibold mt-1 block"
          >
            OpenFreeMap →
          </a>
        </div>
      </div>
    </aside>
  );
}