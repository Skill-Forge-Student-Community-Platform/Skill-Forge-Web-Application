import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox, MediaOverlay } from './shared/GridComponents';
import MediaRenderer from './shared/MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const FourGridSquare = ({ media }) => {
  if (!media || media.length < 4) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        Need at least 4 media items
      </Box>
    );
  }

  return (
    <GridBox sx={gridConfigs.fourSquare}>
      {media.slice(0, 4).map((file, index) => (
        <MediaContainer key={index}>
          <MediaRenderer file={file} />
          {index === 3 && media.length > 4 && (
            <MediaOverlay>
              <span>+{media.length - 4}</span>
            </MediaOverlay>
          )}
        </MediaContainer>
      ))}
    </GridBox>
  );
};

export default FourGridSquare;
