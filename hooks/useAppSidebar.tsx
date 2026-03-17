"use client";

import { useSidebar } from "@/context/SidebarContext";

export const useAppSidebar = () => {
	const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

	return {
		isExpanded,
		isMobileOpen,
		isHovered,
		setIsHovered,
	};
};
