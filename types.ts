export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

export interface Device extends CosmicObject {
  type: 'devices';
  metadata: {
    device_name?: string;
    description?: string;
    device_id?: string;
    device_type?: string;
    mqtt_broker_url?: string;
    subscribe_topic?: string;
    publish_topic?: string;
    latitude?: number;
    longitude?: number;
    status?: string;
    icon?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface MapLocation extends CosmicObject {
  type: 'map-locations';
  metadata: {
    location_name?: string;
    description?: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    linked_devices?: Device[];
    cover_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface SiteSettings extends CosmicObject {
  type: 'site-settings';
  metadata: {
    site_title?: string;
    tagline?: string;
    default_latitude?: number;
    default_longitude?: number;
    default_zoom?: number;
    map_style_url?: string;
    default_mqtt_broker?: string;
    logo?: {
      url: string;
      imgix_url: string;
    };
  };
}

export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}