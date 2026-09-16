'use client';

import React from 'react';
import { 
  Wifi, 
  Plane, 
  Car, 
  CableCar, 
  Shirt, 
  CreditCard, 
  HeartPulse, 
  Check, 
  AlertCircle, 
  Info, 
  Lightbulb, 
  PhoneCall 
} from 'lucide-react';
import { TRAVEL_INFO_SECTIONS, TravelInfoSection } from '@/data/travel-information';

const getSectionIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wifi':
      return <Wifi size={22} className="text-saffron" />;
    case 'Plane':
      return <Plane size={22} className="text-sky-400" />;
    case 'Car':
      return <Car size={22} className="text-emerald-400" />;
    case 'CableCar':
      return <CableCar size={22} className="text-amber-400" />;
    case 'Shirt':
      return <Shirt size={22} className="text-purple-400" />;
    case 'CreditCard':
      return <CreditCard size={22} className="text-teal-400" />;
    case 'HeartPulse':
    default:
      return <HeartPulse size={22} className="text-rose-400" />;
  }
};

const renderAlert = (alert?: { type: 'warning' | 'info' | 'tip'; text: string }) => {
  if (!alert) return null;

  switch (alert.type) {
    case 'warning':
      return (
        <div className="mt-3.5 p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="font-manrope text-xs sm:text-[13px] text-amber-900 leading-relaxed font-medium">
            {alert.text}
          </p>
        </div>
      );
    case 'tip':
      return (
        <div className="mt-3.5 p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
          <Lightbulb size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="font-manrope text-xs sm:text-[13px] text-emerald-900 leading-relaxed font-medium">
            {alert.text}
          </p>
        </div>
      );
    case 'info':
    default:
      return (
        <div className="mt-3.5 p-3 sm:p-4 rounded-xl bg-sky-50 border border-sky-200/80 flex items-start gap-3">
          <Info size={16} className="text-sky-600 shrink-0 mt-0.5" />
          <p className="font-manrope text-xs sm:text-[13px] text-sky-900 leading-relaxed font-medium">
            {alert.text}
          </p>
        </div>
      );
  }
};

export const TravelInfoDetailedSections: React.FC = () => {
  return (
    <div className="w-full bg-background">
      {TRAVEL_INFO_SECTIONS.map((section: TravelInfoSection) => {
        return (
          <section
            key={section.id}
            id={section.id}
            className="w-full py-14 sm:py-20 lg:py-24 border-b border-black/[0.08] scroll-mt-28 relative bg-background"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
              {/* Section Header */}
              <div className="text-left mb-8 sm:mb-12 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-black/5 shrink-0 shadow-2xs">
                    {getSectionIcon(section.icon)}
                  </div>
                  <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
                    {section.navTitle}
                  </span>
                </div>

                <h2 className="font-manrope text-2xl sm:text-3xl lg:text-4xl text-midnight font-extrabold leading-tight">
                  {section.title}
                </h2>

                <p className="font-manrope text-xs sm:text-sm lg:text-base text-slate-600 max-w-3xl leading-relaxed">
                  {section.subtitle}
                </p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-7 rounded-2xl bg-white border border-black/[0.08] shadow-xs hover:shadow-md hover:border-black/15 transition-all duration-300 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <h3 className="font-manrope text-lg sm:text-xl font-bold text-midnight flex items-center gap-2">
                        <span>{item.title}</span>
                      </h3>

                      <p className="font-manrope text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Bullets if present */}
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="space-y-2 pt-1">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5 font-manrope text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                              <span className="mt-1 w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                                <Check size={11} />
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Alert Box if present */}
                    {renderAlert(item.alert)}
                  </div>
                ))}
              </div>

              {/* Special Helpline Callout for Health & Safety Section */}
              {section.id === 'health-safety' && (
                <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white border border-saffron/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-manrope font-bold uppercase tracking-widest text-saffron block">
                      EMERGENCY TOURIST ASSISTANCE
                    </span>
                    <h4 className="font-manrope font-bold text-base sm:text-lg text-midnight">
                      Jammu &amp; Kashmir 24/7 Dedicated Tourist Helpline
                    </h4>
                    <p className="font-manrope text-xs text-slate-600">
                      Direct police and medical response stationed at TRC Srinagar and all resort checkpoints.
                    </p>
                  </div>
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs sm:text-sm hover:scale-105 transition-transform shrink-0"
                  >
                    <PhoneCall size={14} />
                    <span>Dial Emergency: 112</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default TravelInfoDetailedSections;
