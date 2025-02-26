import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox, MediaOverlay } from './shared/GridComponents';
import MediaRenderer from './shared/MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const FiveGridHorizontal = ({ media }) => {
  if (!media || media.length < 5) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        Need at least 5 media items
      </Box>
    );
  }

  return (
    <GridBox sx={gridConfigs.fiveHorizontal}>
      <Box className="main-media-row" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        {media.slice(0, 2).map((file, index) => (
          <MediaContainer key={index}>
            <MediaRenderer file={file} />
          </MediaContainer>
        ))}
      </Box>
      <Box className="secondary-media-row" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
        {media.slice(2, 5).map((file, index) => (
          <MediaContainer key={index}>
            <MediaRenderer file={file} />
            {index === 2 && media.length > 5 && (
              <MediaOverlay>
                <span>+{media.length - 5}</span>
              </MediaOverlay>
            )}
          </MediaContainer>
        ))}
      </Box>
    </GridBox>
  );
};

export default FiveGridHorizontal;
