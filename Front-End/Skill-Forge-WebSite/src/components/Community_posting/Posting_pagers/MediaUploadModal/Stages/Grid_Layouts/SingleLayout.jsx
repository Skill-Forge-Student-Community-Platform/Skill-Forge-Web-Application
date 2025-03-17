import React from 'react';
import { Box } from '@mui/material';
import { MediaContainer, GridBox } from './shared/GridComponents';
import MediaRenderer from '../../../../MediaRenderer';
import { gridConfigs } from './shared/GridConfigs';

const SingleLayout = ({ media, isPreview = false }) => {
  if (!media || media.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
        No media available
      </Box>
    );
  }

  const item = media[0];
  const mediaType = item.type || 'image';
  // Either use isImage in your code or remove it
  // const isImage = mediaType === 'image' || mediaType.startsWith('image/');

  return (
    <GridBox sx={gridConfigs.single}>
      <MediaContainer>
        <MediaRenderer
          file={item}
          url={item.url || (item.file && item.file.url)}
          type={mediaType}
          isPreview={isPreview}
        />
      </MediaContainer>
    </GridBox>
  );
};

export default SingleLayout;
