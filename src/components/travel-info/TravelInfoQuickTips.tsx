'use client';

import React from 'react';
import { 
  Smartphone, 
  Plane, 
  CableCar, 
  Car, 
  Banknote, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { TRAVEL_QUICK_TIPS, TravelQuickTip } from '@/data/travel-information';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone size={20} className="text-saffron" />;
    case 'Plane':
      return <Plane size={20} className="text-sky-400" />;
    case 'CableCar':
      return <CableCar size={20} className="text-amber-400" />;
    case 'Car':
      return <Car size={20} className="text-emerald-400" />;
    case 'Banknote':
      return <Banknote size={20} className="text-green-400" />;
    case 'ShieldCheck':
    default:
      return <ShieldCheck size={20} className="text-indigo-400" />;
  }
};

const getBadgeClasses = (type?: TravelQuickTip['badgeType']) => {
  switch (type) {
    case 'warning':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'success':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'info':
    default:
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
  }
};

export const TravelInfoQuickTips: React.FC = () => {
  return (
    <section id="quick-tips" className="w-full bg-background py-12 sm:py-16 border-b border-black/[0.08] scroll-mt-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-left mb-8 sm:mb-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-saffron rounded-full"></span>
            <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
              AT A GLANCE
            </span>
          </div>
          <h2 className="font-manrope text-2xl sm:text-3xl lg:text-4xl text-midnight font-extrabold leading-tight">
            6 Golden Rules Before You Land in Kashmir
          </h2>
          <p className="font-manrope text-xs sm:text-sm text-slate-600 max-w-2xl">
            Save time, avoid unexpected surprises, and ensure smooth travel with these non-negotiable fundamentals.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {TRAVEL_QUICK_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.08] shadow-xs hover:shadow-md hover:border-black/15 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-black/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(tip.icon)}
                  </div>
                  {tip.badge && (
                    <span className={`text-[10px] sm:text-[11px] font-manrope font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClasses(tip.badgeType)}`}>
                      {tip.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-manrope text-base sm:text-lg font-bold text-midnight group-hover:text-saffron transition-colors">
                  {tip.title}
                </h3>

                <p className="font-manrope text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  {tip.shortDesc}
                </p>
              </div>

              {tip.id === 'sim' && (
                <div className="pt-2 border-t border-black/[0.06] flex items-center gap-1.5 text-[11px] font-manrope text-amber-600 font-medium">
                  <AlertTriangle size={12} className="shrink-0 text-amber-500" />
                  <span>Prepaid roaming is non-functional</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelInfoQuickTips;
