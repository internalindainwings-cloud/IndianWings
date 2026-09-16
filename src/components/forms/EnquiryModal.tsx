'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { EnquiryForm } from './EnquiryForm';

export const EnquiryModal: React.FC = () => {
  const { isModalOpen, closeModal, modalData } = useEnquiryModal();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const isPackageSpecific = Boolean(modalData.packageTitle);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto bg-midnight/80 backdrop-blur-sm transition-all animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-lg bg-[#FBF9F4] rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl border-t sm:border border-midnight/15 transform transition-all max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile MMT Bottom Sheet Pull Indicator */}
        <div className="w-12 h-1.5 bg-midnight/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={closeModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-lg bg-midnight/5 hover:bg-midnight/10 text-midnight/70 hover:text-midnight flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-saffron cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8 pb-3 border-b border-midnight/10">
          <div className="flex items-center gap-1.5 text-[11px] font-manrope font-bold uppercase tracking-[0.2em] text-saffron mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron inline-block" />
            <span>
              {isPackageSpecific ? 'Selected Kashmir Package' : 'Fast Response'}
            </span>
          </div>
          <h2
            id="modal-title"
            className="font-playfair text-xl sm:text-2xl font-bold text-midnight leading-tight"
          >
            {isPackageSpecific
              ? modalData.packageTitle
              : 'Plan Your Handcrafted Kashmir Trip'}
          </h2>
          <p className="font-manrope text-xs sm:text-sm text-midnight/65 mt-1">
            {isPackageSpecific
              ? 'Our destination specialist in Srinagar will customize this itinerary and send your best price quote on WhatsApp.'
              : 'Share your trip dates and preferences. Our Srinagar team will prepare your custom itinerary in 15 mins.'}
          </p>
        </div>

        {/* Form Body with Dynamic Context */}
        <EnquiryForm
          onSuccess={closeModal}
          isCompact={true}
          source={modalData.source || 'global_modal'}
          defaultTripType={modalData.defaultTripType}
          defaultPackageTitle={modalData.packageTitle}
        />
      </div>
    </div>
  );
};
