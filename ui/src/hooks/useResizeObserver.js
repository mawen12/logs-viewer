import { useEffect, useRef, useState } from "preact/compat";
import useIsMounted from "./useIsMounted";

const initialState = {
  width: undefined,
  height: undefined,
};

function extractSize(entry, box, sizeType) {
  if (!entry[box]) {
    if (box === "contentBoxSize") {
        return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"];
    }
    return undefined;
  }

  return Array.isArray(entry[box]) ? entry[box][0][sizeType] : (entry[box][sizeType])
}

const useResizeObserver = (options) => {
  const { ref, box = "content-box" } = options;
  const [{ width, height }, setSize] = useState(initialState);
  const previousState = useRef({ ...initialState });
  const onResize = useRef(undefined);
  onResize.current = options.onResize;
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!ref.current) return;

    if (typeof window === "undefined" || !("ResizeObserver" in window)) return;

    const observer = new ResizeObserver(([entry]) => {
      const boxProp = "borderBoxSize";

      const newWidth = extractSize(entry, boxProp, "inlineSize");
      const newHeight = extractSize(entry, boxProp, "blockSize");

      const hasChanged = previousState.current.width !== newWidth || previousState.current.height !== newHeight;

      if (hasChanged) {
        const newSize = {width: newWidth, height: newHeight};
        previousState.current.width = newWidth;
        previousState.current.height = newHeight;

        if (onResize.current) {
            onResize.current(newSize)
        } else {
            if (isMounted()) {
                setSize(newSize);
            }
        }
      }
    });

    observer.observe(ref.current, { box });

    return () => observer.disconnect();
  }, [box, ref, isMounted]);

  return { width, height };
};

export default useResizeObserver;
