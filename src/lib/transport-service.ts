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
let hasCleanedMockVehicles = false;

export async function cleanupMockVehicles(): Promise<void> {
  if (hasCleanedMockVehicles) return;
  try {
    await prisma.transportVehicle.deleteMany({
      where: {
        slug: {
          in: [
            'swift-dzire',
            'innova-crysta',
            'fortuner-4x4',
            'force-urbania',
            'tempo-traveller',
            'thar-4x4',
          ],
        },
      },
    });
    hasCleanedMockVehicles = true;
  } catch (err) {
    console.warn('[TransportService] Mock vehicles cleanup error (skipped):', err);
  }
}

export async function ensureTransportSeeded(): Promise<void> {
  if (hasSeededTransport) return;
  try {
    // Note: Auto-seeding mock vehicles is disabled to keep UI & DB dynamic and clean

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
    if ('transportVehicle' in prisma) {
      const records = await (prisma as any).transportVehicle.findMany({
        where: includeDrafts ? {} : { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      if (records && records.length > 0) {
        return records.map((r: any) => ({
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
    }
  } catch (err) {
    console.warn('[TransportService] DB vehicles query failed, using fallback:', err);
  }

  // Fallback to verified 1-card-per-category fleet
  return VEHICLE_FLEET.map((v, idx) => ({
    ...v,
    slug: v.id,
    pricePerDay: v.pricePerDay || 3500,
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
