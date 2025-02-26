export const gridConfigs = {
  single: {
    gridTemplateColumns: "100%",
    gridTemplateRows: "100%"
  },
  twoVertical: {
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr"
  },
  twoHorizontal: {
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr"
  },
  threeVertical: {
    gridTemplateColumns: "65% 35%",
    gridTemplateRows: "1fr",
    "& .secondary-media-container": {
      display: "grid",
      gridTemplateRows: "1fr 1fr",
      gap: "3px"
    }
  },
  threeMasonry: {
    gridTemplateRows: "60% 39%",
    "& .secondary-media-row": {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "3px"
    }

  },
  fourSquare: {
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    gap: "3px"
  },
  fourVertical: {
    gridTemplateColumns: "60% 40%",
    gridTemplateRows: "100%",
    "& .secondary-media-column": {
      display: "grid",
      gridTemplateRows: "repeat(3, 1fr)",
      gap: "3px"
    }
  },
  fourHorizontal: {
    gridTemplateRows: "70% 30%",
    "& .secondary-media-row": {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "3px"
    }
  },
  fiveVertical: {
    gridTemplateColumns: "50% 50%",
    "& .main-media-column": {
      display: "grid",
      gridTemplateRows: "repeat(2, 32.5%)",
      gap: "3px"
    },
    "& .secondary-media-column": {
      display: "grid",
      gridTemplateRows: "repeat(3, 21.5%)",
      gap: "3px"
    }
  },
  fiveHorizontal: {
    gridTemplateRows: "62% 38%",
    "& .main-media-row": {
      display: "grid",
      gridTemplateColumns: "repeat(2, 50%)",
      gap: "3px"
    },
    "& .secondary-media-row": {
      display: "grid",
      gridTemplateColumns: "repeat(3, 33%)",
      gap: "3px"
    }
  }
};
