import type { Device } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

export default function DeviceCard({ device }: { device: Device }) {
  const status = getMetafieldValue(device.metadata?.status);
  const isOnline = status.toLowerCase() === 'online';
  const deviceType = getMetafieldValue(device.metadata?.device_type);
  const description = getMetafieldValue(device.metadata?.description);

  return (
    <a
      href={`/devices/${device.slug}`}
      className="block bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-brand-500 rounded-lg p-5 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {device.metadata?.icon ? (
            <img
              src={`${device.metadata.icon.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
              alt={device.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-lg">
              📡
            </div>
          )}
          <div>
            <h3 className="text-white font-semibold group-hover:text-brand-500 transition-colors">
              {device.title}
            </h3>
            <div className="text-xs text-slate-400">{deviceType || 'Device'}</div>
          </div>
        </div>
        <span
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
            isOnline
              ? 'bg-green-500/20 text-green-400'
              : 'bg-slate-700 text-slate-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
            }`}
          ></span>
          {status || 'Unknown'}
        </span>
      </div>

      {description && (
        <p className="text-sm text-slate-300 mb-3 line-clamp-2">{description}</p>
      )}

      <div className="text-xs text-slate-500 font-mono truncate">
        {getMetafieldValue(device.metadata?.subscribe_topic) || 'No topic'}
      </div>
    </a>
  );
}