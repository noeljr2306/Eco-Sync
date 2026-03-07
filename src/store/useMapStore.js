import { create } from "zustand";

export const useMapStore = create((set) => ({
    selectedNode: null,
    hoveredNode: null,
    setSelectedNode: (node) => set({ selectedNode: node }),
    setHoveredNode: (node) => set({ hoveredNode: node }),
    clearSelection: () => set({ selectedNode: null, hoveredNode: null }),
    setActiveFilter: (filter) => set({activeFilter: filter})
}))