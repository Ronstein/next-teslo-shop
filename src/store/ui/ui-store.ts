import { create } from 'zustand'

interface State {
    isSideMenuOpen: boolean;
    isSearchBarOpen: boolean;
    openSideMenu: () => void;
    closeSideMenu: () => void;
    toggleSearchBar: () => void;
    closeSearchBar: () => void;

}

export const useUIStore = create<State>()((set) => ({
    isSideMenuOpen: false,
    isSearchBarOpen: false,
    openSideMenu: () => set({ isSideMenuOpen: true }),
    closeSideMenu: () => set({ isSideMenuOpen: false }),
    toggleSearchBar: () => set((state) => ({ isSearchBarOpen: !state.isSearchBarOpen })),
    closeSearchBar: () => set({ isSearchBarOpen: false })
}));