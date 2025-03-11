import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox , MediaOverlay  } from './shared/GridComponents';
import MediaRenderer from './shared/MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const ThreeGridMasonry = ({ media }) => {
  if (!media || media.length < 3) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        Need at least 3 media items
      </Box>
    );
  }

  return (
    <GridBox sx={gridConfigs.threeMasonry}>
      <MediaContainer>
        <MediaRenderer file={media[0]} />
      </MediaContainer>
      <Box className="secondary-media-row">
        {media.slice(1, 3).map((file, index) => (
          <MediaContainer key={index}>
            <MediaRenderer file={file} />
            {/* {index === 1 && media.length > 3 && (
                <MediaOverlay>
                  <span>+{media.length - 3}</span>
                </MediaOverlay>
              )} */}
          </MediaContainer>
        ))}
      </Box>
    </GridBox>
  );
};

export default ThreeGridMasonry;
