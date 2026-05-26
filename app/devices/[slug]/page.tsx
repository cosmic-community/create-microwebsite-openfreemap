// app/devices/[slug]/page.tsx
import { getDevice } from '@/lib/cosmic';
import { notFound } from 'next/navigation';
import DeviceControl from '@/components/DeviceControl';
import { getMetafieldValue } from '@/lib/cosmic';

export default async function DevicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const device = await getDevice(slug);

  if (!device) {
    notFound();
  }

  const status = getMetafieldValue(device.metadata?.status) || 'Unknown';
  const deviceType = getMetafieldValue(device.metadata?.device_type) || 'Generic';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <a href="/devices" className="text-brand-500 hover:text-brand-600 text-sm mb-2 inline-block">
          ← Back to Devices
        </a>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{device.title}</h1>
            <p className="text-slate-400 mt-1">
              {getMetafieldValue(device.metadata?.description)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status.toLowerCase() === 'online'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-slate-700 text-slate-300 border border-slate-600'
          }`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Device ID</div>
          <div className="text-white font-mono mt-1 truncate">
            {getMetafieldValue(device.metadata?.device_id) || 'N/A'}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Type</div>
          <div className="text-white mt-1">{deviceType}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Location</div>
          <div className="text-white mt-1 font-mono text-sm">
            {device.metadata?.latitude !== undefined && device.metadata?.longitude !== undefined
              ? `${device.metadata.latitude.toFixed(4)}, ${device.metadata.longitude.toFixed(4)}`
              : 'N/A'}
          </div>
        </div>
      </div>

      <DeviceControl device={device} />
    </div>
  );
}