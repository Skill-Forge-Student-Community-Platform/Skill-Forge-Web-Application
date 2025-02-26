import React from 'react';
import SingleLayout from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/SingleLayout';
import TwoGridVertical from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/TwoGridVertical';
import TwoGridHorizontal from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/TwoGridHorizontal';
import ThreeGridVertical from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/ThreeGridVertical';
import ThreeGridMasonry from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/ThreeGridMasonry';
import FourGridHorizontal from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FourGridHorizontal';
import FourGridVertical from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FourGridVertical';
import FourGridSquare from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FourGridSquare';
import FiveGridHorizontal from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FiveGridHorizontal';
import FiveGridVertical from '../Posting_pagers/MediaUploadModal/Stages/Grid_Layouts/FiveGridVertical';
import './ImageRender.css';

const ImageRender = ({ media }) => {
  if (!media || !media.layout || !media.media) return null;

  const renderLayout = () => {
    const mediaFiles = media.media.map(item => ({
      type: item.type,
      url: item.url,
      file: {
        type: item.type,
        url: item.url
      }
    }));

    const layoutProps = {
      media: mediaFiles,
      isPreview: false, // Add this to differentiate from upload preview
      showOverlay: false // Disable overlay in posts
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
