import React from 'react';
import { InternalSystem } from './InternalSystem';
import { StoreCustomizationSettings } from '../../types';

interface AdminCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreCustomizationSettings;
  onUpdateSettings: (newSettings: StoreCustomizationSettings) => void;
  onResetDefaults: () => void;
  previewMode: 'desktop' | 'mobile';
  onChangePreviewMode: (mode: 'desktop' | 'mobile') => void;
}

export const AdminCustomizer: React.FC<AdminCustomizerProps> = (props) => {
  return <InternalSystem {...props} />;
};

export { InternalSystem };
