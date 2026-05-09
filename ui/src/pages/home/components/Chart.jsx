import Box from "@mui/material/Box";
import { useEffect, useMemo, useRef, useState } from "preact/compat";
import uPlot from "uplot";
import useResizeObserver from "../../../hooks/useResizeObserver";

const Chart = () => {
  const uPlotRef = useRef(null);
  const [uPlotInst, setUPlotInst] = useState();

  // const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({width: undefined, height: undefined});

  useResizeObserver({ref: uPlotRef, onResize: setContainerSize})
    

  const options = useMemo(() => {
    return {
      series: [
        {},
        {
          label: "A",
          storke: "red",
        },
      ],
      bands: [],
      width: containerSize.width || window.innerWidth / 2,
      height: containerSize.height || 200,
      cursor: {
        points: {
          width: 0,
          size: 0,
        },
      },
      scales: {
        x: {
          time: true,
          range: () => [1778317086181 / 1000, 1778317086189 / 1000],
        },
      },
      legend: { show: false },
      axes: [
        {
          size: 30,
        },
        {
          size: 50,
          side: 3,
        },
      ],
      tzDate: (ts) => uPlot.tzDate(new Date(Math.round(ts * 1000)), "utc"),
    };
  }, [uPlotRef, containerSize]);

  const data = useMemo(() => {
    return [
      [1778317086181, 1778317086182],
      [1, 10],
    ];
  }, []);

  useEffect(() => {
    if (!uPlotRef.current) return;

    const inst = new uPlot(options, data, uPlotRef.current);
    setUPlotInst(inst);
    return () => inst.destroy();
  }, [uPlotRef, options, data]);

  return <Box ref={uPlotRef}></Box>;
};

export default Chart;
