import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface DestinationBreadcrumbProps {
  destinationName: string;
  region?: string;
}

export const DestinationBreadcrumb: React.FC<DestinationBreadcrumbProps> = ({
  destinationName,
  region = 'Jammu & Kashmir',
}) => {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-[13px] font-manrope font-medium text-warm-white/80">
        <li>
          <Link
            href="/"
            className="hover:text-saffron transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-saffron"
          >
            Home
          </Link>
        </li>

        <li aria-hidden="true" className="text-warm-white/40">
          <ChevronRight size={13} />
        </li>

        <li>
          <Link
            href="/destinations"
            className="hover:text-saffron transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-saffron"
          >
            Destinations
          </Link>
        </li>

        <li aria-hidden="true" className="text-warm-white/40">
          <ChevronRight size={13} />
        </li>

        <li className="text-warm-white/70">
          <span>{region}</span>
        </li>

        <li aria-hidden="true" className="text-warm-white/40">
          <ChevronRight size={13} />
        </li>

        <li aria-current="page">
          <span className="text-saffron font-semibold">{destinationName}</span>
        </li>
      </ol>
    </nav>
  );
};
