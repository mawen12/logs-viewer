import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popper,
  Stack,
  Tooltip,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback, useState } from "preact/compat";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

const TimeSelector = () => {
  const [open, setOpen] = useState(false);
  const setTrue = useCallback(() => setOpen(true), []);
  const setFalse = useCallback(() => setOpen(false), []);
  const toggleOpen = useCallback(() => setOpen((x) => !x), []);

  const [from, setFrom] = useState(dayjs("2025-05-15T17:50"));
  const [to, setTo] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    toggleOpen();
  };

  return (
    <>
      <Tooltip title="Last 5 minutes">
        <Button
          variant="outlined"
          startIcon={<AccessTimeIcon />}
          onClick={handleClick}
        >
          Last 5 minutes
        </Button>
      </Tooltip>
      <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
        <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
          <Stack direction="row" spacing={1}>
            <Stack direction="column" spacing={1}>
              <DateTimePicker
                label="From"
                value={from}
                onChange={setFrom}
                format="YYYY-MM-DD HH:mm:ss"
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    variant: "standard",
                  },
                }}
              />
              <DateTimePicker
                label="To"
                value={to}
                onChange={setTo}
                format="YYYY-MM-DD HH:mm:ss"
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    variant: "standard",
                  },
                }}
              />

              <Button startIcon={<AccessAlarmIcon />}>Switch to now</Button>
            </Stack>

            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="hello" />
                </ListItemButton>
              </ListItem>
            </List>
          </Stack>
        </Box>
      </Popper>
    </>
  );
};

export default TimeSelector;
