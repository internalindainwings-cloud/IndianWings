import React from 'react';
import { Users, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const HeroFeatureHighlights = () => {
  const features = [
    {
      icon: <Users size={22} strokeWidth={1.5} className="text-saffron shrink-0" />,
      boldText: "500+",
      lightText: "Happy Families",
      visibility: "flex",
    },
    {
      icon: <Clock size={22} strokeWidth={1.5} className="text-saffron shrink-0" />,
      boldText: "15+ Yrs",
      lightText: "Experience",
      visibility: "flex",
    },
    {
      icon: <ShieldCheck size={22} strokeWidth={1.5} className="text-saffron shrink-0" />,
      boldText: "24/7",
      lightText: "Trip Support",
      visibility: "hidden sm:flex",
    },
    {
      icon: <MapPin size={22} strokeWidth={1.5} className="text-saffron shrink-0" />,
      boldText: "Srinagar",
      lightText: "Based Locally",
      visibility: "hidden md:flex",
    }
  ];

  return (
    <div className="w-full bg-[#0B1F2A] py-3.5 md:py-5 border-t border-white/10 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 overflow-hidden">
          {features.map((feat, idx) => (
            <div key={idx} className={`${feat.visibility} items-center gap-2 md:gap-3 justify-center whitespace-nowrap`}>
              {feat.icon}
              <div className="font-manrope text-[12px] sm:text-[13px] md:text-[15px] text-[#F8F6F0]">
                <span className="font-bold">{feat.boldText}</span>{' '}
                <span className="text-[#F8F6F0]/80 font-medium">{feat.lightText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
