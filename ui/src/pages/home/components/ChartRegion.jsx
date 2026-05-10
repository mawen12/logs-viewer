import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Chart from "./Chart";
import "uplot/dist/uPlot.min.css";
import useResizeObserver from "../../../hooks/useResizeObserver";
import { useRef, useState } from "preact/compat";

const ChartRegion = () => {
  return (
    <Box
      sx={{
        m: 2,
        p: 2,
        border: "1px solid grey",
        borderRadius: 2,
      }}
    >
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="subtitle1">Query time:</Typography>
        </Stack>

        <Chart/>
      </Stack>
    </Box>
  );
};

export default ChartRegion;
