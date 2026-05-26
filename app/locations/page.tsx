import { getMapLocations } from '@/lib/cosmic';
import LocationCard from '@/components/LocationCard';

export default async function LocationsPage() {
  const locations = await getMapLocations();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Map Locations</h1>
        <p className="text-slate-400 mt-2">
          {locations.length} location{locations.length !== 1 ? 's' : ''} on the map
        </p>
      </div>

      {locations.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <p className="text-slate-400">No locations added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  );
}