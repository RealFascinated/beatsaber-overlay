import create from "zustand";

interface DataState {
	mounted: boolean;
	loadedDuringSong: boolean;

	setMounted: (isMounted: boolean) => void;
	setLoadedDuringSong: (loadedDuringSong: boolean) => void;
}

export const useDataStore = create<DataState>()((set) => ({
	mounted: false,
	loadedDuringSong: false,

	setMounted: (isMounted: boolean) => set(() => ({ mounted: isMounted })),
	setLoadedDuringSong: (loadedDuringSong: boolean) =>
		set(() => ({ loadedDuringSong: loadedDuringSong })),
}));
