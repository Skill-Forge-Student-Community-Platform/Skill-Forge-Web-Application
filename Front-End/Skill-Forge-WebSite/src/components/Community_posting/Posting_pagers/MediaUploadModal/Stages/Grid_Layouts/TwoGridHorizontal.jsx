import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox } from './shared/GridComponents';
import MediaRenderer from './shared/MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const TwoGridHorizontal = ({ media }) => {
  if (!media || media.length < 2) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        Need at least 2 media items
      </Box>
    );
  }

  return (
    <GridBox sx={gridConfigs.twoHorizontal}>
      {media.slice(0, 2).map((file, index) => (
        <MediaContainer key={index}>
          <MediaRenderer file={file} />
        </MediaContainer>
      ))}
    </GridBox>
  );
};

export default TwoGridHorizontal;
