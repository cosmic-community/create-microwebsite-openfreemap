import { getDevices } from '@/lib/cosmic';
import DeviceCard from '@/components/DeviceCard';

export default async function DevicesPage() {
  const devices = await getDevices();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">MQTT Devices</h1>
        <p className="text-slate-400 mt-2">
          {devices.length} device{devices.length !== 1 ? 's' : ''} configured
        </p>
      </div>

      {devices.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <p className="text-slate-400">No devices configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
}