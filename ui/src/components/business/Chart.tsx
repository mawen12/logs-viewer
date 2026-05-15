import { useResizeObserver, type Size } from "@/hooks/useResizeObserver";
import { useLogStore } from "@/store/useLogStore";
import { useEffect, useMemo, useRef, useState } from "react";
import uPlot, { type AlignedData, type Options } from "uplot";
import "uplot/dist/uPlot.min.css";

export function Chart() {
    const containerRef = useRef<HTMLDivElement>(null);
    const uplotRef = useRef<HTMLDivElement>(null);

    const [uplotInst, setUplotInst] = useState<uPlot | null>(null);

    const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
    
    const {stats} = useLogStore();

    const options: Options = {
        width: containerSize.width || window.innerWidth / 2,
        height: containerSize.height || window.innerHeight / 4,
        scales: {
            x: {
                time: true,
            },
        },
        series: [
            {},
            {
                stroke: "green",
                // fill: "rgba(0, 255, 0, 0.3)",
                spanGaps: false,
            },
        ],
        // 不展示底部的内容
        legend: {
            show: false,
        },
    }

    const data = useMemo<AlignedData>(() => {
        const x = stats.map(s => s.time);
        const y = stats.map(s => s.count);

        return [x, y]
    }, [stats])

    // const data = useMemo<AlignedData>(() => [
    //     [1778708280],
    //     [9],
    // ], [])

    useEffect(() => {
        if (!uplotRef.current) return;        

        const uplot = new uPlot(options, data, uplotRef.current);
        setUplotInst(uplot);

        return () => {
            uplot.destroy();
        };
    }, [uplotRef]);

    useEffect(() => {
        if (!uplotInst) return;

        uplotInst.setSize({
            width: containerSize.width || window.innerWidth / 2,
            height: containerSize.height || window.innerHeight / 4,
        })

        // uplotInst.redraw();
    }, [containerSize]);

    useEffect(() => {
        if (!uplotInst) return;
        
        uplotInst.setData(data);

        // uplotInst.redraw();
    }, [data]);

    useResizeObserver({ ref: containerRef, onResize: setContainerSize })

    return (
        <div ref={containerRef}
            className="h-full w-full"
        >
            <div ref={uplotRef}>

            </div>
        </div>
    )
}