import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox } from './shared/GridComponents';
import MediaRenderer from './shared/MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const SingleLayout = ({ media }) => {
  if (!media || media.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        No media available
      </Box>
    );
  }

  return (
    <GridBox sx={gridConfigs.single}>
      <MediaContainer>
        <MediaRenderer file={media[0]} />
      </MediaContainer>
    </GridBox>
  );
};

export default SingleLayout;
