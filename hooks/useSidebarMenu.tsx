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

	// Estado que controla el submenu abierto manualmente por el usuario
	const [manualOpenSubmenu, setManualOpenSubmenu] = useState<{
		type: "user" | "admin";
		index: number;
	} | null>(null);

	// Referencias a los submenus para poder calcular su altura
	const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Determinar si algún submenu coincide con la ruta actual
	const activeSubmenu = useMemo(() => {
		for (const [index, nav] of items.entries()) {
			if (!nav.subItems) continue;

			const hasActiveSubitem = nav.subItems.some(
				(subItem) => subItem.path === pathname
			);

			// Si encontramos un subitem que coincide con la ruta actual,
			// abrimos automáticamente ese submenu
			if (hasActiveSubitem) {
				return { type: menuType, index } as const;
			}
		}

		// Si ningún submenu coincide con la ruta, no hay submenu activo por ruta
		return null;
	}, [items, menuType, pathname]);

	// El submenu abierto será:
	// 1️⃣ El que coincida con la ruta actual
	// 2️⃣ Si no hay coincidencia, el que haya abierto el usuario manualmente
	const openSubmenu = activeSubmenu ?? manualOpenSubmenu;

	// Comprobar si una ruta está activa
	const isActive = (path: string) => path === pathname;

	// Manejador para abrir/cerrar un submenu manualmente
	const handleSubmenuToggle = (index: number, type: "user" | "admin") => {
		setManualOpenSubmenu((prev) => {
			// Si el submenu ya está abierto, cerrarlo
			if (prev && prev.type === type && prev.index === index) {
				return null;
			}

			// Si no está abierto, abrirlo
			return { type, index };
		});
	};

	// Guardar la referencia del submenu para poder calcular su altura
	const setSubMenuRef = (key: string) => (el: HTMLDivElement | null) => {
		subMenuRefs.current[key] = el;
	};

	// Obtener la altura real del submenu para animaciones
	const getSubMenuHeight = (menuType: "user" | "admin", index: number) => {
		const key = `${menuType}-${index}`;
		return subMenuRefs.current[key]?.scrollHeight ?? 0;
	};

	// Comprobar si un submenu está abierto
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