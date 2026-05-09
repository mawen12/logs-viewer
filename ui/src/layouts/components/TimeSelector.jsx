import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Popper,
    Stack
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "preact/compat";
import useBoolean from "../../hooks/useBoolean";

const TimeSelector = () => {
  const {
    value: openOptions,
    toggle: toggleOpenOptions,
    setFalse: handleCloseOptions,
  } = useBoolean(false);

  const [from, setFrom] = useState(dayjs("2025-05-15T17:50"));
  const [to, setTo] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    toggleOpenOptions();
  };

  const times = [
    "Last 5 minutes",
    "Last 15 minutes",
    "Last 30 minutes",
    "Last 1 hour",
    "Last 3 hours",
    "Last 6 hours",
    "Last 12 hours",
    "Last 24 hours",
    "Last 2 days",
    "Last 7 days",
    "Last 30 days",
  ];

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AccessTimeIcon />}
        onClick={handleClick}
      >
        Last 5 minutes
      </Button>
      <Popper
        open={openOptions}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{
          height: 200,
          borderRadius: '2px',
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal,
          bgcolor: "background.paper" 
        }}
      >
        <Box sx={{ border: 1, p: 1}}>
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

            <Box
              sx={{
                height: 250,
                overflow: "auto",
                borderLeft: "1px solid grey",
              }}
            >
              <List>
                {times &&
                  times.map((t) => {
                    return (
                      <ListItem disablePadding key={t}>
                        <ListItemButton>
                          <ListItemText primary={t} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
              </List>
            </Box>
          </Stack>
        </Box>
      </Popper>
    </>
  );
};

export default TimeSelector;
