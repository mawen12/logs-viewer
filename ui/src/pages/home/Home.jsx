import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import ChartRegion from "./components/ChartRegion";
import LogDataTableRegion from "./components/LogDataTableRegion";
import QueryRegion from "./components/QueryRegion";
import LogTableRegion from "./components/LogTableRegion";

const Home = () => {
  return (
    <Box
      sx={{
        m: 2,
        height: "100%",
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{
          height: "100%",
        }}
      >
        {/* query region */}
        <QueryRegion />

        {/* chart region */}
        <ChartRegion />

        {/* log table region */}
        {/* <LogTableRegion/> */}
        <LogDataTableRegion
          sx={{
            height: "100%",
          }}
        />
      </Stack>
    </Box>
  );
};

export default Home;
