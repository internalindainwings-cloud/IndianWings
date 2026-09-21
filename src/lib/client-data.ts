export interface ClientDestinationsResponse {
  success: boolean;
  destinations?: Array<{
    name: string;
    slug: string;
    tagline?: string;
    category?: string;
    [key: string]: unknown;
  }>;
}

export interface ClientPackagesResponse {
  success: boolean;
  packages?: Array<{
    title: string;
    slug: string;
    [key: string]: unknown;
  }>;
}

let destinationsPromise: Promise<ClientDestinationsResponse> | null = null;
let packagesPromise: Promise<ClientPackagesResponse> | null = null;

/**
 * Shared in-memory memoized client fetch for public destinations.
 * Deduplicates concurrent calls from DesktopNavigation, Footer, and page components.
 */
export function fetchClientDestinations(): Promise<ClientDestinationsResponse> {
  if (!destinationsPromise) {
    destinationsPromise = fetch('/api/destinations')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ClientDestinationsResponse>;
      })
      .catch((err) => {
        destinationsPromise = null;
        throw err;
      });
  }
  return destinationsPromise;
}

/**
 * Shared in-memory memoized client fetch for public packages.
 * Deduplicates concurrent calls across components.
 */
export function fetchClientPackages(): Promise<ClientPackagesResponse> {
  if (!packagesPromise) {
    packagesPromise = fetch('/api/packages')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ClientPackagesResponse>;
      })
      .catch((err) => {
        packagesPromise = null;
        throw err;
      });
  }
  return packagesPromise;
}
