'use client';

import React from 'react';
import { BedDouble, Car, Shield, Flame, Compass, HeartHandshake } from 'lucide-react';

export const PackageStayTransport: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#0B1F2A]">
          Stays & Transport Fleet Standards
        </h2>
        <p className="text-xs text-[#64748B] mt-1 font-manrope">
          Curated specifically for Himalayan mountain comfort and seamless road journeys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hotel & Houseboat Card */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d98f5b]/10 text-[#d98f5b]">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-playfair text-base font-bold text-[#0B1F2A]">
                Handpicked Boutique Stays & Houseboats
              </h3>
              <p className="text-[11px] text-[#64748B]">Personally vetted for hygiene & warmth</p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-manrope text-[#475569]">
            <div className="flex items-start gap-2">
              <Flame className="h-4 w-4 text-[#d98f5b] shrink-0 mt-0.5" />
              <span><strong>Winter Heated Comfort:</strong> Central heating, electric bed warmers, or traditional Kashmiri bukhari in all mountain rooms.</span>
            </div>
            <div className="flex items-start gap-2">
              <Compass className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Scenic Locations:</strong> Dal Lake / Nigeen waterfronts in Srinagar, pine glades in Pahalgam, and mountain-view resorts in Gulmarg.</span>
            </div>
            <div className="flex items-start gap-2">
              <HeartHandshake className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Customizable Upgrades:</strong> Flexible choice between 3-Star Deluxe, 4-Star Premium, or 5-Star Luxury resorts upon enquiry.</span>
            </div>
          </div>
        </div>

        {/* Private Vehicle Card */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-playfair text-base font-bold text-[#0B1F2A]">
                Dedicated Private Sanitized Vehicle
              </h3>
              <p className="text-[11px] text-[#64748B]">Complete point-to-point sightseeing without sharing</p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-manrope text-[#475569]">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Vehicle Fleet Options:</strong> Toyota Innova Crysta, Swift Dzire, Etios, or Tempo Traveller for larger groups.</span>
            </div>
            <div className="flex items-start gap-2">
              <Compass className="h-4 w-4 text-[#d98f5b] shrink-0 mt-0.5" />
              <span><strong>Local Mountain Specialists:</strong> Courteous, non-smoking, police-verified chauffeurs with decades of mountain snow driving expertise.</span>
            </div>
            <div className="flex items-start gap-2">
              <Car className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>All-Inclusive Transit:</strong> Fuel, inter-state tolls, commercial parking fees, and driver allowances are 100% pre-covered.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
