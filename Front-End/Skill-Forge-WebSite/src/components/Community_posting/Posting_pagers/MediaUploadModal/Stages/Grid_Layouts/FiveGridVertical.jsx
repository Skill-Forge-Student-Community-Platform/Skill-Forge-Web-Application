import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox, MediaOverlay } from './shared/GridComponents';
import MediaRenderer from './shared/MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const FiveGridVertical = ({ media }) => {
  if (!media || media.length < 5) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        Need at least 5 media items
      </Box>
    );
  }

  return (
    <GridBox sx={gridConfigs.fiveVertical}>
      <Box className="main-media-column" >
        {media.slice(0, 2).map((file, index) => (
          <MediaContainer key={index}>
            <MediaRenderer file={file} />
          </MediaContainer>
        ))}
      </Box>
      <Box className="secondary-media-column">
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

export default FiveGridVertical;
