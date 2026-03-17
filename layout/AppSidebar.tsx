"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HorizontaLDots } from "../icons/index";
import { useAppSidebar } from "@/hooks/useAppSidebar";
import { SidebarMenu } from "@/components/sidebar/SidebarMenu";
import { mainNavItems, adminNavItems } from "@/config/navigation";
import { User } from "@/types/User";

type AppSidebarProps = {
	user: User;
};

const AppSidebar: React.FC<AppSidebarProps> = ({ user }) => {
	const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useAppSidebar();
	const userMenuItems = user.isAdmin ? [] : mainNavItems;
	const adminMenuItems = user.isAdmin ? adminNavItems : [];

	return (
		<aside
			className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
					? "w-72.5"
					: isHovered
						? "w-72.5"
						: "w-22.5"
				}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
			onMouseEnter={() => !isExpanded && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={`py-5 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
					}`}
			>
				<Link href="/">
					{isExpanded || isHovered || isMobileOpen ? (
						<>
							<Image
								className="dark:hidden"
								src="/images/logo/logo.svg"
								alt="Logo"
								width={250}
								height={40}
							/>
							<Image
								className="hidden dark:block"
								src="/images/logo/logo-dark.svg"
								alt="Logo"
								width={250}
								height={40}
							/>
						</>
					) : (
						<Image
							src="/images/logo/logo-icon.svg"
							alt="Logo"
							width={64}
							height={64}
						/>
					)}
				</Link>
			</div>
			<div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
				<nav className="mb-6">
					<div className="flex flex-col gap-4">
						
						{userMenuItems.length > 0 && (
							<div>
								<h2
									className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${!isExpanded && !isHovered
											? "lg:justify-center"
											: "justify-start"
										}`}
								>
									{isExpanded || isHovered || isMobileOpen ? (
										"Menu"
									) : (
										<HorizontaLDots />
									)}
								</h2>
								<SidebarMenu
									items={userMenuItems}
									menuType="user"
									isExpanded={isExpanded}
									isMobileOpen={isMobileOpen}
									isHovered={isHovered}
								/>
							</div>
						)}

						{adminMenuItems.length > 0 && (
							<div className="">
								<h2
									className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${!isExpanded && !isHovered
											? "lg:justify-center"
											: "justify-start"
										}`}
								>
									{isExpanded || isHovered || isMobileOpen ? (
										"Admin"
									) : (
										<HorizontaLDots />
									)}
								</h2>
								<SidebarMenu
									items={adminMenuItems}
									menuType="admin"
									isExpanded={isExpanded}
									isMobileOpen={isMobileOpen}
									isHovered={isHovered}
								/>
							</div>
						)}
					</div>
				</nav>
			</div>
		</aside>
	);
};

export default AppSidebar;
