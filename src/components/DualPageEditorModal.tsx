import React from 'react';
import { VolumeData } from '../types/book';
import { PixelLabEditorModal } from './PixelLabEditorModal';

interface DualPageEditorModalProps {
  volume: VolumeData;
  currentPage: number;
  onClose: () => void;
  onPageChange?: (page: number) => void;
  onVolumeChange?: (volume: VolumeData) => void;
}

export const DualPageEditorModal: React.FC<DualPageEditorModalProps> = (props) => {
  return <PixelLabEditorModal {...props} />;
};

export default DualPageEditorModal;
