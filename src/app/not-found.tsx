import Link from 'next/link';
import { Home, Compass, MapPin } from 'lucide-react';
import { siteConfig } from '@/config/site-config';

export default function NotFound() {
  return (
    <main className="w-full min-h-[75vh] flex items-center justify-center bg-[#FDFBF7] px-4 py-16 sm:py-24">
      <div className="max-w-xl w-full text-center flex flex-col items-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C54]/10 text-[#0F4C54] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6">
          <MapPin className="w-4 h-4 text-[#F59E0B]" />
          <span>Trail Not Found</span>
        </div>

        {/* 404 Heading */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#0F4C54] tracking-tight mb-4">
          404
        </h1>

        {/* Descriptive message */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-3">
          Looks like this valley is undiscovered!
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mb-8 leading-relaxed">
          The page or itinerary you are looking for might have been moved, updated, or is temporarily unavailable. Let us guide you back on track.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-10">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0F4C54] text-white font-semibold text-sm hover:bg-[#0B393F] transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/packages"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F59E0B] text-black font-semibold text-sm hover:bg-[#D97706] transition-colors shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Packages</span>
          </Link>
        </div>

        {/* Quick Links Grid */}
        <div className="w-full border-t border-gray-200/80 pt-8 mt-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
            Popular Mountain Routes
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <Link
              href="/destinations"
              className="p-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-[#0F4C54] hover:text-[#0F4C54] transition-all font-medium"
            >
              All Destinations
            </Link>
            <Link
              href="/transport"
              className="p-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-[#0F4C54] hover:text-[#0F4C54] transition-all font-medium"
            >
              Private Cabs & Fleet
            </Link>
            <Link
              href="/activities"
              className="p-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-[#0F4C54] hover:text-[#0F4C54] transition-all font-medium col-span-2 sm:col-span-1"
            >
              Adventure Activities
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Need urgent assistance? Reach our 24/7 Srinagar helpline:{' '}
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="text-[#0F4C54] font-semibold underline underline-offset-2"
            >
              {siteConfig.contact.displayPhone}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
