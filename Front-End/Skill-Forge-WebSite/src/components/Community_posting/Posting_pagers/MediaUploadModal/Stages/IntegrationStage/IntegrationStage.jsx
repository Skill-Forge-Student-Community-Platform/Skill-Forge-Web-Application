import React, { useState } from 'react';
import { FaThLarge, FaThList, FaImages, FaLayerGroup } from 'react-icons/fa';
import SingleLayout from '../Grid_Layouts/SingleLayout';
import TwoGridVertical from '../Grid_Layouts/TwoGridVertical';
import TwoGridHorizontal from '../Grid_Layouts/TwoGridHorizontal';
import ThreeGridVertical from '../Grid_Layouts/ThreeGridVertical';
import ThreeGridMasonry from '../Grid_Layouts/ThreeGridMasonry';
import FourGridHorizontal from '../Grid_Layouts/FourGridHorizontal';
import FourGridVertical from '../Grid_Layouts/FourGridVertical';
import FourGridSquare from '../Grid_Layouts/FourGridSquare';
import FiveGridHorizontal from '../Grid_Layouts/FiveGridHorizontal';
import FiveGridVertical from '../Grid_Layouts/FiveGridVertical';
import '../shared/Stages.css';
import './IntegrationStage.css';

const GRID_LAYOUTS = {
  SINGLE: 'single',
  GRID_2_VERTICAL: 'grid-2-vertical',
  GRID_2_HORIZONTAL: 'grid-2-horizontal',
  GRID_3_VERTICAL: 'grid-3-vertical',
  GRID_3_MASONRY: 'grid-3-masonry',
  GRID_4_HORIZONTAL: 'grid-4-horizontal',
  GRID_4_VERTICAL: 'grid-4-vertical',
  GRID_4_SQUARE: 'grid-4-square',
  GRID_5_HORIZONTAL: 'grid-5-horizontal',
  GRID_5_VERTICAL: 'grid-5-vertical',
};

const IntegrationStage = ({ media, onComplete, onBack }) => {
  const [selectedLayout, setSelectedLayout] = useState(() => {
    // Set default layouts based on media count
    switch (media.length) {
      case 1:
        return GRID_LAYOUTS.SINGLE;
      case 2:
        return GRID_LAYOUTS.GRID_2_VERTICAL;  // Default for 2 images
      case 3:
        return GRID_LAYOUTS.GRID_3_MASONRY;   // Default for 3 images
      case 4:
        return GRID_LAYOUTS.GRID_4_HORIZONTAL; // Default for 4 images
      default:
        return GRID_LAYOUTS.GRID_5_HORIZONTAL; // Default for 5+ images
    }
  });

  const getLayoutKey = (layout) => {
    const layoutMap = {
      [GRID_LAYOUTS.SINGLE]: 'single',
      [GRID_LAYOUTS.GRID_2_VERTICAL]: 'twoVertical',
      [GRID_LAYOUTS.GRID_2_HORIZONTAL]: 'twoHorizontal',
      [GRID_LAYOUTS.GRID_3_VERTICAL]: 'threeVertical',
      [GRID_LAYOUTS.GRID_3_MASONRY]: 'threeMasonry',
      [GRID_LAYOUTS.GRID_4_HORIZONTAL]: 'fourHorizontal',
      [GRID_LAYOUTS.GRID_4_VERTICAL]: 'fourVertical',
      [GRID_LAYOUTS.GRID_4_SQUARE]: 'fourSquare',
      [GRID_LAYOUTS.GRID_5_HORIZONTAL]: 'fiveHorizontal',
      [GRID_LAYOUTS.GRID_5_VERTICAL]: 'fiveVertical'
    };
    return layoutMap[layout];
  };

  const handleComplete = () => {
    const layoutKey = getLayoutKey(selectedLayout);
    const mediaData = {
      media: media,
      layout: layoutKey
    };
    console.log('Sending media data:', mediaData); // Debug log
    onComplete(mediaData);
  };

  const hasLayoutOptions = media.length > 1;

  const renderLayout = () => {
    // eslint-disable-next-line default-case
    switch (selectedLayout) {
      case GRID_LAYOUTS.SINGLE:
        return <SingleLayout media={media} />;
      case GRID_LAYOUTS.GRID_2_VERTICAL:
        return <TwoGridVertical media={media} />;
      case GRID_LAYOUTS.GRID_2_HORIZONTAL:
        return <TwoGridHorizontal media={media} />;
      case GRID_LAYOUTS.GRID_3_VERTICAL:
        return <ThreeGridVertical media={media} />;
      case GRID_LAYOUTS.GRID_3_MASONRY:
        return <ThreeGridMasonry media={media} />;
      case GRID_LAYOUTS.GRID_4_HORIZONTAL:
        return <FourGridHorizontal media={media} />;
      case GRID_LAYOUTS.GRID_4_VERTICAL:
        return <FourGridVertical media={media} />;
      case GRID_LAYOUTS.GRID_4_SQUARE:
        return <FourGridSquare media={media} />;
      case GRID_LAYOUTS.GRID_5_HORIZONTAL:
        return <FiveGridHorizontal media={media} />;
      case GRID_LAYOUTS.GRID_5_VERTICAL:
        return <FiveGridVertical media={media} />;
    }
  };

  return (
    <div className="integration-stage">
      <div className={`layout-content ${!hasLayoutOptions ? 'no-sidebar' : ''}`}>
        {hasLayoutOptions && (
          <div className="layout-sidebar">
            <h3>Layout Options</h3>
            {media.length === 2 && (
              <div className="layout-options-vertical">
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_2_VERTICAL ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_2_VERTICAL)}
                >
                  <FaThList /> Two Grid Vertical
                </button>
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_2_HORIZONTAL ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_2_HORIZONTAL)}
                >
                  <FaThLarge /> Two Grid Horizontal
                </button>
              </div>
            )}
            {media.length === 3 && (
              <div className="layout-options-vertical">
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_3_VERTICAL ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_3_VERTICAL)}
                >
                  <FaThList /> Three Grid Vertical
                </button>
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_3_MASONRY ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_3_MASONRY)}
                >
                  <FaLayerGroup /> Three Grid Masonry
                </button>
              </div>
            )}
            {media.length === 4 && (
              <div className="layout-options-vertical">
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_4_HORIZONTAL ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_4_HORIZONTAL)}
                >
                  <FaThLarge /> Four Grid Horizontal
                </button>
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_4_VERTICAL ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_4_VERTICAL)}
                >
                  <FaThList /> Four Grid Vertical
                </button>
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_4_SQUARE ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_4_SQUARE)}
                >
                  <FaImages /> Four Grid Square
                </button>
              </div>
            )}
            {media.length > 4 && (
              <div className="layout-options-vertical">
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_4_HORIZONTAL ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_4_HORIZONTAL)}
                >
                  <FaThLarge /> Four Grid Horizontal
                </button>
                <button
                  className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_4_VERTICAL ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_4_VERTICAL)}
                >
                  <FaThList /> Four Grid Vertical
                </button>
                {media.length >= 5 && (
                  <>
                    <button
                      className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_5_HORIZONTAL ? 'active' : ''}`}
                      onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_5_HORIZONTAL)}
                    >
                      <FaThLarge /> Five Grid Horizontal
                    </button>
                    <button
                      className={`layout-btn ${selectedLayout === GRID_LAYOUTS.GRID_5_VERTICAL ? 'active' : ''}`}
                      onClick={() => setSelectedLayout(GRID_LAYOUTS.GRID_5_VERTICAL)}
                    >
                      <FaThList /> Five Grid Vertical
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className={`preview-section ${!hasLayoutOptions ? 'full-width' : ''}`}>
          <div className={`preview-container ${!hasLayoutOptions ? 'no-sidebar' : ''}`}>
            {renderLayout()}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="cancel-btn" onClick={onBack}>
          Back
        </button>
        <button className="primary-btn" onClick={handleComplete}>
          Done
        </button>
      </div>
    </div>
  );
};

export default IntegrationStage;
