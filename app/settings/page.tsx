import { getSiteSettings, getMetafieldValue } from '@/lib/cosmic';

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  if (!settings) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <div className="mt-6 bg-slate-800 rounded-lg p-12 text-center">
          <p className="text-slate-400">No site settings configured.</p>
        </div>
      </div>
    );
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Site Title', value: getMetafieldValue(settings.metadata?.site_title) },
    { label: 'Tagline', value: getMetafieldValue(settings.metadata?.tagline) },
    { label: 'Default Latitude', value: String(settings.metadata?.default_latitude ?? '') },
    { label: 'Default Longitude', value: String(settings.metadata?.default_longitude ?? '') },
    { label: 'Default Zoom', value: String(settings.metadata?.default_zoom ?? '') },
    { label: 'Map Style URL', value: getMetafieldValue(settings.metadata?.map_style_url) },
    { label: 'Default MQTT Broker', value: getMetafieldValue(settings.metadata?.default_mqtt_broker) },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
      <p className="text-slate-400 mb-8">Global configuration for the application.</p>

      {settings.metadata?.logo && (
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <div className="text-xs text-slate-400 uppercase mb-3">Logo</div>
          <img
            src={`${settings.metadata.logo.imgix_url}?w=400&h=400&fit=max&auto=format,compress`}
            alt="Site Logo"
            className="h-24 object-contain"
          />
        </div>
      )}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {rows.map((row, idx) => (
          <div
            key={row.label}
            className={`px-6 py-4 flex items-center justify-between ${
              idx !== rows.length - 1 ? 'border-b border-slate-700' : ''
            }`}
          >
            <div className="text-sm text-slate-400">{row.label}</div>
            <div className="text-white font-mono text-sm text-right max-w-md truncate">
              {row.value || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}