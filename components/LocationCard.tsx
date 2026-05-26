import type { MapLocation } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

export default function LocationCard({ location }: { location: MapLocation }) {
  const category = getMetafieldValue(location.metadata?.category);
  const description = getMetafieldValue(location.metadata?.description);
  const coverImage = location.metadata?.cover_image;
  const linkedDevices = location.metadata?.linked_devices || [];

  return (
    <a
      href={`/locations/${location.slug}`}
      className="block bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-purple-500 rounded-lg overflow-hidden transition-all group"
    >
      {coverImage ? (
        <div className="h-40 overflow-hidden">
          <img
            src={`${coverImage.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
            alt={location.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-purple-600 to-brand-700 flex items-center justify-center text-5xl">
          📍
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
            {location.title}
          </h3>
          {category && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
              {category}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-slate-300 line-clamp-2 mb-3">{description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">
            {location.metadata?.latitude !== undefined && location.metadata?.longitude !== undefined
              ? `${location.metadata.latitude.toFixed(3)}, ${location.metadata.longitude.toFixed(3)}`
              : 'No coordinates'}
          </span>
          {linkedDevices.length > 0 && (
            <span className="text-brand-500">{linkedDevices.length} device{linkedDevices.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </a>
  );
}