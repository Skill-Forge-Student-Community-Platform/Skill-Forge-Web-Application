import React from 'react';
import SingleLayout from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/SingleLayout';  
import TwoGridVertical from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/TwoGridVertical';
import TwoGridHorizontal from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/TwoGridHorizontal';
import ThreeGridVertical from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/ThreeGridVertical';
import ThreeGridMasonry from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/ThreeGridMasonry';
import FourGridHorizontal from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FourGridHorizontal';
import FourGridVertical from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FourGridVertical';
import FourGridSquare from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FourGridSquare';
import FiveGridHorizontal from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FiveGridHorizontal';
import FiveGridVertical from '../../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FiveGridVertical';
import './ImageRender.css';

const ImageRender = ({ media }) => {
  // Return early if no media
  if (!media || !media.layout) return null;

  // Critical fix: Handle both backend format (media.files) and frontend format (media.media)
  const mediaFiles = media.files || media.media;

  if (!mediaFiles || !Array.isArray(mediaFiles) || mediaFiles.length === 0) {
    console.log("No media files to render:", media);
    return null;
  }

  console.log("Rendering media:", media);

  const renderLayout = () => {
    // Normalize data structure for layout components
    const normalizedMedia = mediaFiles.map(item => {
      // Normalize type for components - handle both MIME types and simple types
      const simpleType = (item.type === 'image' || item.type === 'video') ?
        item.type :
        item.type?.startsWith('image/') ? 'image' : 'video';

      return {
        url: item.url,
        type: simpleType,
        file: {
          url: item.url,
          type: simpleType
        }
      };
    });

    const layoutProps = {
      media: normalizedMedia,
      isPreview: false,
      showOverlay: false
    };

    switch (media.layout) {
      case 'single': return <SingleLayout {...layoutProps} />;
      case 'twoVertical': return <TwoGridVertical {...layoutProps} />;
      case 'twoHorizontal': return <TwoGridHorizontal {...layoutProps} />;
      case 'threeVertical': return <ThreeGridVertical {...layoutProps} />;
      case 'threeMasonry': return <ThreeGridMasonry {...layoutProps} />;
      case 'fourHorizontal': return <FourGridHorizontal {...layoutProps} />;
      case 'fourVertical': return <FourGridVertical {...layoutProps} />;
      case 'fourSquare': return <FourGridSquare {...layoutProps} />;
      case 'fiveHorizontal': return <FiveGridHorizontal {...layoutProps} />;
      case 'fiveVertical': return <FiveGridVertical {...layoutProps} />;
      default: return null;
    }
  };

  return (
    <div
      className="posted-media-grid"
      data-layout={media.layout === 'single' ? 'single' : 'grid'}
    >
      {renderLayout()}
    </div>
  );
};

export default ImageRender;
