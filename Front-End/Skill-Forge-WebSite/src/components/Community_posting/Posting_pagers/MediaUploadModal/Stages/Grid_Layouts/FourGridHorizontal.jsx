import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox, MediaOverlay } from './shared/GridComponents';
import MediaRenderer from './shared/MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const FourGridHorizontal = ({ media }) => {
  if (!media || media.length < 4) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        Need at least 4 media items
      </Box>
    );
  }

  return (
    <GridBox sx={gridConfigs.fourHorizontal}>
      <MediaContainer>
        <MediaRenderer file={media[0]} />
      </MediaContainer>
      <Box className="secondary-media-row">
        {media.slice(1, 4).map((file, index) => (
          <MediaContainer key={index}>
            <MediaRenderer file={file} />
            {index === 2 && media.length > 4 && (
              <MediaOverlay>
                <span>+{media.length - 4}</span>
              </MediaOverlay>
            )}
          </MediaContainer>
        ))}
      </Box>
    </GridBox>
  );
};

export default FourGridHorizontal;
