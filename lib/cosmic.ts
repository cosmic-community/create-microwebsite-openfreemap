import { createBucketClient } from '@cosmicjs/sdk';
import type { Device, MapLocation, SiteSettings } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value);
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key);
  }
  return '';
}

export async function getDevices(): Promise<Device[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'devices' })
      .props(['id', 'title', 'slug', 'metadata', 'type'])
      .depth(1);
    return response.objects as Device[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    throw new Error('Failed to fetch devices');
  }
}

export async function getDevice(slug: string): Promise<Device | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'devices', slug })
      .depth(1);
    return response.object as Device;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return null;
    throw new Error('Failed to fetch device');
  }
}

export async function getMapLocations(): Promise<MapLocation[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'map-locations' })
      .props(['id', 'title', 'slug', 'metadata', 'type'])
      .depth(1);
    return response.objects as MapLocation[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    throw new Error('Failed to fetch locations');
  }
}

export async function getMapLocation(slug: string): Promise<MapLocation | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'map-locations', slug })
      .depth(1);
    return response.object as MapLocation;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return null;
    throw new Error('Failed to fetch location');
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await cosmic.objects
      .find({ type: 'site-settings' })
      .props(['id', 'title', 'slug', 'metadata', 'type'])
      .depth(1);
    const settings = response.objects as SiteSettings[];
    return settings[0] || null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return null;
    throw new Error('Failed to fetch site settings');
  }
}