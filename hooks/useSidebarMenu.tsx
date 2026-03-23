"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/navigation";

interface UseSidebarMenuProps {
	items: NavItem[];
	menuType: "user" | "admin";
}

export const useSidebarMenu = ({ items, menuType }: UseSidebarMenuProps) => {
	const pathname = usePathname();

	// Tracks the submenu manually opened by the user
	const [manualOpenSubmenu, setManualOpenSubmenu] = useState<{
		type: "user" | "admin";
		index: number;
	} | null>(null);

	// Stores submenu refs so their rendered height can be measured
	const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Detect whether any submenu matches the current route
	const activeSubmenu = useMemo(() => {
		for (const [index, nav] of items.entries()) {
			if (!nav.subItems) continue;

			const hasActiveSubitem = nav.subItems.some(
				(subItem) => subItem.path === pathname
			);

			// Automatically open the submenu that contains the active route
			if (hasActiveSubitem) {
				return { type: menuType, index } as const;
			}
		}

		// No route-matched submenu is active
		return null;
	}, [items, menuType, pathname]);

	// Prefer the route-matched submenu, otherwise keep the manually opened one
	const openSubmenu = activeSubmenu ?? manualOpenSubmenu;

	// Check whether a route is active
	const isActive = (path: string) => path === pathname;

	// Toggle a submenu manually
	const handleSubmenuToggle = (index: number, type: "user" | "admin") => {
		setManualOpenSubmenu((prev) => {
			// Close it if the same submenu is already open
			if (prev && prev.type === type && prev.index === index) {
				return null;
			}

			// Otherwise open the requested submenu
			return { type, index };
		});
	};

	// Save the submenu ref for height calculations
	const setSubMenuRef = (key: string) => (el: HTMLDivElement | null) => {
		subMenuRefs.current[key] = el;
	};

	// Read the actual submenu height for animations
	const getSubMenuHeight = (menuType: "user" | "admin", index: number) => {
		const key = `${menuType}-${index}`;
		return subMenuRefs.current[key]?.scrollHeight ?? 0;
	};

	// Check whether a submenu is open
	const isSubmenuOpen = (menuType: "user" | "admin", index: number) => {
		return openSubmenu?.type === menuType && openSubmenu?.index === index;
	};

	return {
		isActive,
		handleSubmenuToggle,
		setSubMenuRef,
		getSubMenuHeight,
		isSubmenuOpen,
	};
};
