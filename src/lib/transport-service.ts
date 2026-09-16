import { prisma } from '@/lib/database/prisma';
import { VEHICLE_FLEET, PICKUP_DROP_ROUTES, VehicleFleetItem, PickupDropRoute } from '@/data/transport-data';

export interface EnrichedVehicle extends VehicleFleetItem {
  slug: string;
  pricePerDay: number;
  isActive: boolean;
  sortOrder: number;
}

export interface EnrichedRoute extends PickupDropRoute {
  startingPrice: number;
  isActive: boolean;
  sortOrder: number;
}

let hasSeededTransport = false;

export async function ensureTransportSeeded(): Promise<void> {
  if (hasSeededTransport) return;
  try {
    const vCount = await prisma.transportVehicle.count();
    if (vCount === 0) {
      for (let i = 0; i < VEHICLE_FLEET.length; i++) {
        const v = VEHICLE_FLEET[i];
        const slug = v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await prisma.transportVehicle.upsert({
          where: { slug },
          update: {},
          create: {
            name: v.name,
            slug,
            category: v.category,
            seats: v.seats,
            bags: v.bags,
            ac: v.ac,
            fuel: v.fuel,
            imageUrl: v.imageUrl,
            tags: v.tags || [],
            badge: v.badge || null,
            pricePerDay: v.category.includes('Luxury') ? 4500 : v.category.includes('VIP') ? 6500 : 3000,
            isActive: true,
            sortOrder: i + 1,
          },
        });
      }
    }

    const rCount = await prisma.transportRoute.count();
    if (rCount === 0) {
      for (let i = 0; i < PICKUP_DROP_ROUTES.length; i++) {
        const r = PICKUP_DROP_ROUTES[i];
        await prisma.transportRoute.create({
          data: {
            origin: r.origin,
            destination: r.destination,
            routeTitle: r.routeTitle,
            via: r.via,
            distance: r.distance,
            duration: r.duration,
            startingPrice: 2500,
            highlights: r.highlights || [],
            cabs: r.cabs,
            isPopular: Boolean(r.isPopular),
            isActive: true,
            sortOrder: i + 1,
          },
        });
      }
    }
    hasSeededTransport = true;
  } catch (err) {
    console.warn('[TransportService] Seed skipped or DB offline; using fallback:', err);
  }
}

export async function getAllVehicles(includeDrafts = false): Promise<EnrichedVehicle[]> {
  try {
    await ensureTransportSeeded();
    const records = await prisma.transportVehicle.findMany({
      where: includeDrafts ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    if (records && records.length > 0) {
      return records.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        category: r.category as VehicleFleetItem['category'],
        seats: r.seats,
        bags: r.bags,
        ac: r.ac,
        fuel: r.fuel,
        imageUrl: r.imageUrl,
        tags: r.tags,
        badge: r.badge || undefined,
        pricePerDay: r.pricePerDay,
        isActive: r.isActive,
        sortOrder: r.sortOrder,
      }));
    }
  } catch (err) {
    console.warn('[TransportService] DB vehicles query failed, using fallback:', err);
  }

  // Fallback
  return VEHICLE_FLEET.map((v, idx) => ({
    ...v,
    slug: v.id,
    pricePerDay: 3500,
    isActive: true,
    sortOrder: idx + 1,
  }));
}

export async function getAllRoutes(includeDrafts = false): Promise<EnrichedRoute[]> {
  try {
    await ensureTransportSeeded();
    const records = await prisma.transportRoute.findMany({
      where: includeDrafts ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    if (records && records.length > 0) {
      return records.map((r) => ({
        id: r.id,
        origin: r.origin as PickupDropRoute['origin'],
        destination: r.destination,
        routeTitle: r.routeTitle,
        via: r.via,
        distance: r.distance,
        duration: r.duration,
        startingPrice: r.startingPrice,
        highlights: r.highlights,
        cabs: r.cabs,
        isPopular: r.isPopular,
        isActive: r.isActive,
        sortOrder: r.sortOrder,
      }));
    }
  } catch (err) {
    console.warn('[TransportService] DB routes query failed, using fallback:', err);
  }

  // Fallback
  return PICKUP_DROP_ROUTES.map((r, idx) => ({
    ...r,
    startingPrice: 2500,
    isActive: true,
    sortOrder: idx + 1,
  }));
}
