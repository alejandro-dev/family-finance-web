"use client";

import React from "react";
import Link from "next/link";
import { NavItem, ChevronDownIcon } from "@/config/navigation";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";

interface SidebarMenuProps {
	items: NavItem[];
	menuType: "user" | "admin";
	isExpanded: boolean;
	isMobileOpen: boolean;
	isHovered: boolean;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
	items,
	menuType,
	isExpanded,
	isMobileOpen,
	isHovered,
}) => {
	const {
		isActive,
		handleSubmenuToggle,
		setSubMenuRef,
		getSubMenuHeight,
		isSubmenuOpen,
	} = useSidebarMenu({ items, menuType });

	const showText = isExpanded || isHovered || isMobileOpen;

	return (
		<ul className="flex flex-col gap-4">
			{items.map((nav, index) => {
				const IconComponent = nav.icon;
				return (
					<li key={nav.name}>
						{nav.subItems ? (
							<button
								onClick={() => handleSubmenuToggle(index, menuType)}
								className={`menu-item group ${isSubmenuOpen(menuType, index)
										? "menu-item-active"
										: "menu-item-inactive"
									} cursor-pointer ${!isExpanded && !isHovered
										? "lg:justify-center"
										: "lg:justify-start"
									}`}
							>
								<span
									className={`${isSubmenuOpen(menuType, index)
											? "menu-item-icon-active"
											: "menu-item-icon-inactive"
										}`}
								>
									<IconComponent
										className="w-5 h-5"
									/>
								</span>
								{showText && <span className="menu-item-text">{nav.name}</span>}
								{showText && (
									<ChevronDownIcon
										className={`ml-auto transition-transform duration-200 w-5 h-5 ${isSubmenuOpen(menuType, index) ? "rotate-180" : ""
											}`}
									/>
								)}
							</button>
						) : (
							nav.path && (
								<Link
									href={nav.path}
									className={`menu-item group ${isActive(nav.path)
											? "menu-item-active"
											: "menu-item-inactive"
										}`}
								>
									<span
										className={`${isActive(nav.path)
												? "menu-item-icon-active"
												: "menu-item-icon-inactive"
											}`}
									>
										<IconComponent
											className="w-5 h-5"
										/>
									</span>
									{showText && (
										<span className="menu-item-text">{nav.name}</span>
									)}
								</Link>
							)
						)}
						{nav.subItems && showText && (
							<div
								ref={setSubMenuRef(`${menuType}-${index}`)}
								className="overflow-hidden transition-all duration-300"
								style={{
									height: isSubmenuOpen(menuType, index)
										? `${getSubMenuHeight(menuType, index)}px`
										: "0px",
								}}
							>
								<ul className="mt-2 space-y-1 ml-9">
									{nav.subItems.map((subItem) => (
										<li key={subItem.name}>
											<Link
												href={subItem.path}
												className={`menu-dropdown-item ${isActive(subItem.path)
														? "menu-dropdown-item-active"
														: "menu-dropdown-item-inactive"
													}`}
											>
												{subItem.name}
												<span className="flex items-center gap-1 ml-auto">
													{subItem.new && (
														<span
															className={`ml-auto ${isActive(subItem.path)
																	? "menu-dropdown-badge-active"
																	: "menu-dropdown-badge-inactive"
																} menu-dropdown-badge`}
														>
															new
														</span>
													)}
													{subItem.pro && (
														<span
															className={`ml-auto ${isActive(subItem.path)
																	? "menu-dropdown-badge-active"
																	: "menu-dropdown-badge-inactive"
																} menu-dropdown-badge`}
														>
															pro
														</span>
													)}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
					</li>
				);
			})}
		</ul>
	);
};
