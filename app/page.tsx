import { getDevices, getMapLocations, getSiteSettings } from '@/lib/cosmic';
import MapView from '@/components/MapView';
import StatsBar from '@/components/StatsBar';

export default async function HomePage() {
  const [devices, locations, settings] = await Promise.all([
    getDevices(),
    getMapLocations(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          {settings?.metadata?.site_title || 'OpenFreeMap Control Center'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {settings?.metadata?.tagline || 'Real-time MQTT device map'}
        </p>
      </div>
      <StatsBar devices={devices} locations={locations} />
      <div className="flex-1 relative">
        <MapView devices={devices} locations={locations} settings={settings} />
      </div>
    </div>
  );
}