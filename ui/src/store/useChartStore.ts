import { create } from "zustand";

type ChartStore = {
    showChart: boolean,
    toggleShow: () => void,
}

export const useChartStore = create<ChartStore>((set) => ({
    showChart: true,
    toggleShow: () => set((state) => ({ showChart: !state.showChart })),
}))