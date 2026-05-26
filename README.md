# OpenFreeMap MQTT Control Center

![App Preview](https://imgix.cosmicjs.com/d6510c80-58a5-11f1-876b-2597f2099e23-autopilot-photo-1451187580459-43490279c0fa-1779760471360.jpeg?w=1200&h=630&fit=crop&auto=format,compress)

A modern Next.js microwebsite that combines [OpenFreeMap](https://openfreemap.org) (free vector map tiles) with real-time MQTT device interaction. Control IoT devices, view them on an interactive map, and manage everything through [Cosmic](https://www.cosmicjs.com).

## Features

- 🗺️ **Interactive Map** powered by OpenFreeMap and MapLibre GL JS
- 📡 **Real-time MQTT** communication via WebSocket
- 🎛️ **Device Dashboard** with live status and message feed
- 📍 **Location Browser** with category filtering
- ⚙️ **Site Settings** managed through Cosmic CMS
- 📱 **Fully Responsive** modern UI with Tailwind CSS
- ⚡ **Server Components** for optimal performance
- 🎨 **Beautiful Design** with smooth animations

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6a14fd07f2c683f5f2b328e7&clone_repository=6a14fe2af2c683f5f2b32911)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for: Create microwebsite for openfreemap , interact with MQTT devices"

### Code Generation Prompt

> Create microwebsite for openfreemap , interact with MQTT devices

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **MapLibre GL JS** - Open-source mapping library
- **OpenFreeMap** - Free vector map tiles
- **MQTT.js** - MQTT client for WebSocket connections
- **Cosmic SDK** - Headless CMS integration

## Getting Started

### Prerequisites

- Bun (or Node.js 18+)
- Cosmic account with bucket configured

### Installation

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Cosmic SDK Examples

```typescript
import { cosmic } from '@/lib/cosmic'

// Fetch all devices
const { objects: devices } = await cosmic.objects
  .find({ type: 'devices' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Fetch locations with linked devices
const { objects: locations } = await cosmic.objects
  .find({ type: 'map-locations' })
  .depth(1)
```

## Cosmic CMS Integration

This app uses three Cosmic object types:
- **Devices** - MQTT-enabled IoT devices
- **Map Locations** - Geographic points of interest
- **Site Settings** - Global app configuration

## Deployment Options

Deploy to Vercel, Netlify, or any Node.js host. Set these environment variables:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`

<!-- README_END -->