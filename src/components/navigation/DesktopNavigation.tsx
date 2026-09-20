'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Home,
  MapPin,
  Luggage,
  Car,
  Compass,
  Sparkles,
  ArrowRight,
  Snowflake,
  Trees,
  Sun,
  Calendar,
  Plane,
  HelpCircle,
  Waves,
  Wind,
  Mountain,
  Info,
  ShoppingBag,
  CheckSquare,
  LucideIcon,
} from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

interface SubNavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  isViewAll?: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: SubNavItem[];
}

const navLinks: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { 
    name: 'Destinations', 
    href: '/destinations',
    icon: MapPin,
    children: [
      { name: 'Iconic Valleys', href: '/destinations', icon: MapPin },
      { name: 'Alpine Meadows', href: '/destinations', icon: Snowflake },
      { name: 'Off-Beat Kashmir', href: '/destinations', icon: Compass },
      { name: 'View All Destinations', href: '/destinations', icon: ArrowRight, isViewAll: true }
    ]
  },
  { 
    name: 'Packages', 
    href: '/packages',
    icon: Luggage,
    children: [
      { name: 'Featured Packages', href: '/packages#featured', icon: Sparkles },
      { name: 'Seasonal Packages', href: '/packages#seasonal', icon: Calendar },
      { name: 'Off-Beat Packages', href: '/packages#off-beat', icon: Compass },
      { name: 'View All Packages', href: '/packages', icon: ArrowRight, isViewAll: true }
    ]
  },
  { 
    name: 'Transport', 
    href: '/transport',
    icon: Car,
    children: [
      { name: 'Vehicle Fleet', href: '/transport#fleet', icon: Car },
      { name: 'Airport & Transfers', href: '/transport#fleet', icon: Plane },
      { name: 'Pricing & FAQs', href: '/transport#faqs', icon: HelpCircle },
      { name: 'View All Transport', href: '/transport', icon: ArrowRight, isViewAll: true }
    ]
  },
  { 
    name: 'Adventure', 
    href: '/activities',
    icon: Mountain,
    children: [
      { name: 'Snow & Winter Sports', href: '/activities#activities-grid', icon: Snowflake },
      { name: 'Water Sports', href: '/activities#activities-grid', icon: Waves },
      { name: 'Aerial & Paragliding', href: '/activities#activities-grid', icon: Wind },
      { name: 'Trails & Off-Road ATV', href: '/activities#activities-grid', icon: Compass },
      { name: 'View All Adventures', href: '/activities', icon: ArrowRight, isViewAll: true }
    ]
  },
  { 
    name: 'Kashmir Bucket List', 
    href: '/bucket-list',
    icon: Sparkles,
    children: [
      { name: 'Travel Information', href: '/bucket-list/travel-information', icon: Info },
      { name: 'Shopping List', href: '/bucket-list/shopping', icon: ShoppingBag },
      { name: 'Things to Do', href: '/bucket-list/things-to-do', icon: CheckSquare }
    ]
  },
];

export const DesktopNavigation = ({ isScrolled: _isScrolled = false }: { isScrolled?: boolean }) => {
  const pathname = usePathname();
  const { openModal } = useEnquiryModal();
  const [destSubItems, setDestSubItems] = React.useState<SubNavItem[]>([
    { name: 'View All Destinations', href: '/destinations', icon: ArrowRight, isViewAll: true }
  ]);

  React.useEffect(() => {
    let isMounted = true;
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.destinations) && data.destinations.length > 0) {
          const items: SubNavItem[] = data.destinations.slice(0, 5).map((d: any) => ({
            name: d.name,
            href: `/destinations/${d.slug}`,
            icon: MapPin,
          }));
          items.push({ name: 'View All Destinations', href: '/destinations', icon: ArrowRight, isViewAll: true });
          setDestSubItems(items);
        } else {
          setDestSubItems([
            { name: 'View All Destinations', href: '/destinations', icon: ArrowRight, isViewAll: true }
          ]);
        }
      })
      .catch(() => {
        // Keep default
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const linksToRender = React.useMemo(() => {
    return navLinks.map(link => {
      if (link.name === 'Destinations') {
        return {
          ...link,
          children: destSubItems,
        };
      }
      return link;
    });
  }, [destSubItems]);

  return (
    <nav className="flex items-center gap-1 lg:gap-2 xl:gap-3 shrink-0">
      <ul className="flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 font-manrope text-[11px] lg:text-[12px] xl:text-[12.5px] font-semibold tracking-wide transition-all duration-300 rounded-full px-2 lg:px-2.5 xl:px-3 py-1 lg:py-1.5 border border-warm-white/10 bg-midnight/60 backdrop-blur-md text-warm-white">
        {linksToRender.map((link) => {
          const isActive = pathname === link.href || link.children?.some(child => pathname === child.href);
          const Icon = link.icon;
          return (
            <li key={link.name} className="relative group whitespace-nowrap py-0.5">
              <Link
                href={link.href}
                className={`inline-flex items-center gap-1.5 transition-all duration-200 px-2 lg:px-2.5 xl:px-3 py-0.5 lg:py-1 rounded-full ${
                  isActive 
                    ? 'bg-[#C5A45E] text-midnight font-bold shadow-[0_4px_16px_rgba(197,164,94,0.6),0_2px_4px_rgba(0,0,0,0.3)]' 
                    : 'text-warm-white/90 hover:text-[#C5A45E] hover:bg-warm-white/10 hover:shadow-[0_3px_10px_rgba(197,164,94,0.45)]'
                }`}
              >
                <Icon className={`w-[17px] h-[17px] shrink-0 text-current ${
                  isActive 
                    ? 'drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.45)]' 
                    : 'drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]'
                }`} />
                <span>{link.name}</span>
                {link.children && (
                  <ChevronDown 
                    className={`w-[15px] h-[15px] shrink-0 transition-transform duration-200 text-current group-hover:rotate-180 ${
                      isActive 
                        ? 'drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.45)]' 
                        : 'drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]'
                    }`} 
                    aria-hidden="true"
                  />
                )}
              </Link>
              
              {/* Dropdown Menu */}
              {link.children && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-50">
                  <div className="bg-midnight/95 backdrop-blur-md rounded-lg shadow-[0_16px_36px_rgba(0,0,0,0.7),0_4px_12px_rgba(0,0,0,0.5)] border border-warm-white/10 py-2 min-w-[190px] lg:min-w-[210px] flex flex-col">
                    {link.children.map(child => {
                      const ChildIcon = child.icon;
                      return (
                        <Link 
                          key={child.name} 
                          href={child.href}
                          className={`flex items-center gap-2 px-3.5 py-1.5 text-[11px] lg:text-[12px] xl:text-[12.5px] transition-colors hover:bg-warm-white/5 whitespace-nowrap group/item ${
                            child.isViewAll
                              ? 'font-bold text-saffron border-t border-white/10 mt-1 pt-1.5 hover:brightness-110'
                              : 'text-warm-white hover:text-saffron'
                          }`}
                        >
                          {ChildIcon && (
                            <ChildIcon className={`w-[17px] h-[17px] shrink-0 text-current drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)] transition-transform duration-150 ${
                              child.isViewAll ? 'group-hover/item:translate-x-0.5' : ''
                            }`} />
                          )}
                          <span>{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      
      <div className="flex items-center pl-1.5 lg:pl-2.5 xl:pl-3 border-l border-warm-white/30 shrink-0">
        <button
          type="button"
          onClick={() => openModal({ source: 'desktop_nav_cta' })}
          className="inline-flex items-center gap-1.5 font-manrope text-[11px] lg:text-[12px] xl:text-[13px] font-bold text-midnight bg-[#C5A45E] rounded-full hover:bg-[#b5944e] transition-all shadow-[0_4px_16px_rgba(197,164,94,0.6),0_2px_6px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_22px_rgba(197,164,94,0.75)] whitespace-nowrap hover:-translate-y-0.5 shrink-0 cursor-pointer group px-3.5 py-1.5 lg:px-4 lg:py-1.5 xl:px-4.5 xl:py-1.5"
        >
          <span>Plan Your Trip</span>
          <ArrowRight className="w-[17px] h-[17px] shrink-0 text-current drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </nav>
  );
};
