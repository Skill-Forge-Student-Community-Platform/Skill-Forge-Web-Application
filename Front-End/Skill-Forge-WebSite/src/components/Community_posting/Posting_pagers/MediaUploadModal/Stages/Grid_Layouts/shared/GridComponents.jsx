import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const MediaContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  // padding: theme.spacing(),
  // borderRadius: "10px",
  overflow: "hidden",
  position: "relative",
  height: "100%",
  '& img, & video': {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
}));

export const GridBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "grid",
  gap: theme.spacing(0.375),
  // padding: theme.spacing(0.5),
  // '& .main-media-row, & .secondary-media-row': {
  //   display: 'grid',
  //   gap: theme.spacing(0.5),
  //   height: '100%'
  // },
  // '& .main-media-row': {
  //   gridTemplateColumns: 'repeat(2, 1fr)',
  //   marginBottom: theme.spacing(0.5)
  // },
  // '& .secondary-media-row': {
  //   gridTemplateColumns: 'repeat(3, 1fr)'
  // }
}));

export const MediaOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px"
}));
