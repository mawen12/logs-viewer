import { useEffect, useRef, useState, type RefObject } from "react";
import { useIsMounted } from "./useIsMounted";

export type Size = {
    width: number | undefined
    height: number | undefined
}

const initialSize: Size = {
    width: undefined,
    height: undefined,
}

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
    ref: RefObject<T | null>,
    onResize?: (size: Size) => void,
    box?: "border-box" | "content-box" | "device-pixel-content-box",
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(options: UseResizeObserverOptions<T>): Size {
    const [{ width, height }, setSize] = useState<Size>(initialSize);
    const isMounted = useIsMounted();
    const previousSize = useRef<Size>({ ...initialSize });
    const onResize = useRef<((size: Size) => void) | undefined>(undefined);
    onResize.current = options.onResize;

    const { ref, box = "content-box" } = options;

    useEffect(() => {
        if (!ref.current) return;

        if (typeof window === "undefined" || !("ResizeObserver" in window)) return;

        const observer = new ResizeObserver(([entry]) => {
            const boxProp = "borderBoxSize";

            const newWidth = extractSize(entry, boxProp, "inlineSize");
            const newHeight = extractSize(entry, boxProp, "blockSize");

            const hasChanged = previousSize.current.width !== newWidth || previousSize.current.height !== newHeight;
            if (!hasChanged) return;

            const newSize: Size = { width: newWidth, height: newHeight };
            previousSize.current.width = newWidth;
            previousSize.current.height = newHeight;

            if (onResize.current) {
                onResize.current(newSize)
            } else {
                if (isMounted()) {
                    setSize(newSize);
                }
            }
        })

        observer.observe(ref.current, { box })

        return () => {
            observer.disconnect()
        };
    }, [box, ref, isMounted])

    return { width, height };
}

type BoxSizesKey = keyof Pick<ResizeObserverEntry, "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize">

function extractSize(entry: ResizeObserverEntry, box: BoxSizesKey, sizeType: keyof ResizeObserverSize) {
    if (!entry[box]) {
        if (box === "contentBoxSize") {
            return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"];
        }
        return undefined;
    }

    // @ts-expect-error Support Firefox's non-standard behavior
    return Array.isArray(entry[box]) ? entry[box][0][sizeType] : entry[box][sizeType] as number
}