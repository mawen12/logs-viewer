import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import NumberField from "../../../components/NumberField";
import Box from "@mui/material/Box";

const QueryRegion = () => {
  return (
    <Box
      sx={{
        p: 1,
        border: "1px solid grey",
        borderRadius: 2,
      }}
    >
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField label="Query" variant="outlined" fullWidth size="small"/>
          <NumberField label="Limit" size="small"/>
        </Stack>

        <Stack spacing={2} sx={{ alignItems: "flex-end" }}>
          <Button startIcon={<PlayArrowIcon />} variant="contained" size="small">
            Execute
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default QueryRegion;
