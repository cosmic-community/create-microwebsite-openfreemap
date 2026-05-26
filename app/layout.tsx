import type { Metadata } from 'next';
import './globals.css';
import { getSiteSettings } from '@/lib/cosmic';
import Sidebar from '@/components/Sidebar';
import CosmicBadge from '@/components/CosmicBadge';

export const metadata: Metadata = {
  title: 'OpenFreeMap MQTT Control Center',
  description: 'Interactive map and MQTT device control powered by OpenFreeMap and Cosmic',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🗺️</text></svg>" />
              <script defer src="https://insights.cosmicinsights.dev/script.js" data-project="6a14fd06f2c683f5f2b328e5"></script>
      </head>
      <body className="font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar settings={settings} />
          <main className="flex-1 overflow-y-auto bg-slate-900">
            {children}
          </main>
        </div>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  );
}