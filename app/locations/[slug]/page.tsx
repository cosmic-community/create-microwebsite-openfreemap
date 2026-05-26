// app/locations/[slug]/page.tsx
import { getMapLocation, getMetafieldValue } from '@/lib/cosmic';
import { notFound } from 'next/navigation';

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = await getMapLocation(slug);

  if (!location) {
    notFound();
  }

  const category = getMetafieldValue(location.metadata?.category);
  const description = getMetafieldValue(location.metadata?.description);
  const coverImage = location.metadata?.cover_image;
  const linkedDevices = location.metadata?.linked_devices || [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <a href="/locations" className="text-brand-500 hover:text-brand-600 text-sm mb-2 inline-block">
          ← Back to Locations
        </a>
        <h1 className="text-3xl font-bold text-white mt-2">{location.title}</h1>
        {category && (
          <span className="inline-block mt-2 px-3 py-1 bg-brand-500/20 text-brand-500 text-xs rounded-full">
            {category}
          </span>
        )}
      </div>

      {coverImage && (
        <div className="rounded-lg overflow-hidden mb-6 border border-slate-700">
          <img
            src={`${coverImage.imgix_url}?w=1600&h=800&fit=crop&auto=format,compress`}
            alt={location.title}
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      {description && (
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <p className="text-slate-200 leading-relaxed">{description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Latitude</div>
          <div className="text-white font-mono mt-1">
            {location.metadata?.latitude ?? 'N/A'}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Longitude</div>
          <div className="text-white font-mono mt-1">
            {location.metadata?.longitude ?? 'N/A'}
          </div>
        </div>
      </div>

      {linkedDevices.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Linked Devices</h2>
          <div className="space-y-3">
            {linkedDevices.map((device) => (
              <a
                key={device.id}
                href={`/devices/${device.slug}`}
                className="block bg-slate-800 hover:bg-slate-700 rounded-lg p-4 border border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">{device.title}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {getMetafieldValue(device.metadata?.device_type)}
                    </div>
                  </div>
                  <span className="text-brand-500">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}