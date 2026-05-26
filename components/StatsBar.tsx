import type { Device, MapLocation } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

export default function StatsBar({
  devices,
  locations,
}: {
  devices: Device[];
  locations: MapLocation[];
}) {
  const onlineDevices = devices.filter(
    (d) => getMetafieldValue(d.metadata?.status).toLowerCase() === 'online'
  ).length;

  const stats = [
    { label: 'Total Devices', value: devices.length, color: 'text-blue-400' },
    { label: 'Online', value: onlineDevices, color: 'text-green-400' },
    { label: 'Offline', value: devices.length - onlineDevices, color: 'text-slate-400' },
    { label: 'Locations', value: locations.length, color: 'text-purple-400' },
  ];

  return (
    <div className="bg-slate-800/30 border-b border-slate-700 px-6 py-3">
      <div className="flex items-center gap-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-xs text-slate-400 uppercase tracking-wide">
              {stat.label}
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}