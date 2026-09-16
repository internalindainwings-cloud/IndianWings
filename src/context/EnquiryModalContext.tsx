'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ModalContextData {
  defaultTripType?: string;
  packageTitle?: string;
  source?: string;
}

interface EnquiryModalContextType {
  isModalOpen: boolean;
  modalData: ModalContextData;
  openModal: (data?: ModalContextData | React.MouseEvent) => void;
  closeModal: () => void;
}

const defaultModalData: ModalContextData = {
  defaultTripType: undefined,
  packageTitle: undefined,
  source: 'global_modal',
};

const EnquiryModalContext = createContext<EnquiryModalContextType | undefined>(undefined);

export const EnquiryModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalContextData>(defaultModalData);

  const openModal = (data?: ModalContextData | React.MouseEvent) => {
    // Check if passed argument is our custom ModalContextData object (not a React SyntheticEvent)
    if (
      data &&
      typeof data === 'object' &&
      !('nativeEvent' in data) &&
      ('defaultTripType' in data || 'packageTitle' in data || 'source' in data)
    ) {
      const customData = data as ModalContextData;
      setModalData({
        defaultTripType: customData.defaultTripType,
        packageTitle: customData.packageTitle,
        source: customData.source || 'global_modal',
      });
    } else {
      setModalData(defaultModalData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalData(defaultModalData);
    }, 300);
  };

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <EnquiryModalContext.Provider value={{ isModalOpen, modalData, openModal, closeModal }}>
      {children}
    </EnquiryModalContext.Provider>
  );
};

export const useEnquiryModal = (): EnquiryModalContextType => {
  const context = useContext(EnquiryModalContext);
  if (!context) {
    throw new Error('useEnquiryModal must be used within an EnquiryModalProvider');
  }
  return context;
};
