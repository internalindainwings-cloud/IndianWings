import { NextResponse } from 'next/server';
import { getAllVehicles, getAllRoutes } from '@/lib/transport-service';

export async function GET() {
  try {
    const [vehicles, routes] = await Promise.all([
      getAllVehicles(false),
      getAllRoutes(false),
    ]);

    return NextResponse.json({
      success: true,
      vehicles,
      routes,
    });
  } catch (err) {
    console.error('[API /api/transport GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch transport data' }, { status: 500 });
  }
}
