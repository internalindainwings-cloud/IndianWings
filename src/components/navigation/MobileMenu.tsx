'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  ImageIcon,
} from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

interface SubNavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  isAction?: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: SubNavItem[];
}

const mobileNavLinks: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { 
    name: 'Destinations', 
    href: '/destinations',
    icon: MapPin,
    children: [
      { name: 'Iconic Valleys', href: '/destinations', icon: MapPin },
      { name: 'Alpine Meadows', href: '/destinations', icon: Snowflake },
      { name: 'Off-Beat Kashmir', href: '/destinations', icon: Compass },
      { name: 'View All Destinations', href: '/destinations', icon: ArrowRight, isAction: true },
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
      { name: 'View All Packages', href: '/packages', icon: ArrowRight, isAction: true },
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
      { name: 'View All Transport', href: '/transport', icon: ArrowRight, isAction: true },
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
      { name: 'View All Adventures', href: '/activities', icon: ArrowRight, isAction: true },
    ]
  },
  { 
    name: 'Kashmir Bucket List', 
    href: '/bucket-list',
    icon: Sparkles,
    children: [
      { name: 'Travel Information', href: '/bucket-list/travel-information', icon: Info },
      { name: 'Shopping List', href: '/bucket-list/shopping', icon: ShoppingBag },
      { name: 'Things to Do', href: '/bucket-list/things-to-do', icon: CheckSquare },
    ]
  },
  {
    name: 'Gallery',
    href: '/#gallery',
    icon: ImageIcon,
  },
];

const MobileMenuContent = ({ onClose }: { onClose: () => void }) => {
  const pathname = usePathname();
  const { openModal } = useEnquiryModal();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const toggleSection = (name: string) => {
    setExpandedSection((prev) => (prev === name ? null : name));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '-100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[45] bg-midnight text-warm-white flex flex-col pt-24 px-6 pb-28 overflow-y-auto"
      style={{
        backgroundColor: 'var(--color-midnight)'
      }}
    >
      <nav className="flex-1 mt-6">
        <ul className="flex flex-col gap-4 font-manrope">
          {mobileNavLinks.map((link, idx) => {
            const hasChildren = Boolean(link.children && link.children.length > 0);
            const isExpanded = expandedSection === link.name;
            const isCurrent =
              pathname === link.href ||
              (hasChildren && link.children?.some((c) => pathname === c.href));
            const Icon = link.icon;

            return (
              <motion.li
                key={link.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + idx * 0.04, duration: 0.25 }}
                className="border-b border-warm-white/10 pb-3 last:border-b-0"
              >
                {hasChildren ? (
                  <div>
                    {/* Parent Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(link.name)}
                      className={`w-full text-[22px] font-light tracking-wide hover:text-saffron transition-colors flex items-center justify-between py-1 text-left cursor-pointer ${
                        isCurrent || isExpanded ? 'text-saffron font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-[23px] h-[23px] shrink-0 text-current" />
                        <span>{link.name}</span>
                      </div>
                      <ChevronDown
                        className={`w-[20px] h-[20px] transition-transform duration-300 shrink-0 text-current ${
                          isExpanded ? 'rotate-180 text-saffron' : 'text-warm-white/50'
                        }`}
                      />
                    </button>

                    {/* Collapsible Dropdown Items */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden pl-4 mt-2.5 flex flex-col gap-2.5 border-l-2 border-saffron/30 ml-2"
                        >
                          {link.children?.map((child) => {
                            const isChildActive = pathname === child.href;
                            const ChildIcon = child.icon;
                            return (
                              <li key={child.name}>
                                <Link
                                  href={child.href}
                                  onClick={onClose}
                                  className={`text-base font-normal hover:text-saffron transition-colors flex items-center gap-2.5 py-1 ${
                                    isChildActive
                                      ? 'text-saffron font-semibold'
                                      : 'text-warm-white/80'
                                  } ${
                                    child.isAction
                                      ? 'text-saffron font-bold pt-1 border-t border-warm-white/10'
                                      : ''
                                  }`}
                                >
                                  {ChildIcon && (
                                    <ChildIcon className="w-[19px] h-[19px] shrink-0 text-current" />
                                  )}
                                  <span>{child.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Standalone Navigation Link */
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`text-[22px] font-light tracking-wide hover:text-saffron transition-colors flex items-center justify-between py-1 ${
                      isCurrent ? 'text-saffron font-medium' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-[23px] h-[23px] shrink-0 text-current" />
                      <span>{link.name}</span>
                    </div>
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col gap-4"
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            openModal({ source: 'mobile_drawer_cta' });
          }}
          className="w-full inline-flex items-center justify-center gap-2 font-manrope font-bold text-midnight bg-[#C5A45E] px-6 py-3.5 rounded-full hover:bg-[#b5944e] transition-all text-base active:scale-98 cursor-pointer"
        >
          <span>Plan Your Trip</span>
          <ArrowRight className="w-[19px] h-[19px] shrink-0 text-current" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && <MobileMenuContent onClose={onClose} />}
    </AnimatePresence>
  );
};
