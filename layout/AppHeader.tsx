"use client";

import { useAppHeader } from "@/hooks/useAppHeader";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import Image from "next/image";
import Link from "next/link";
import CloseIcon from "@/icons/close.svg";
import MenuIcon from "@/icons/menu.svg";
import HorizontalDotsIcon from "@/icons/horizontal-dots.svg";
import { User } from "@/types/User";

type AppHeaderProps = {
	user: User
}

const AppHeader: React.FC<AppHeaderProps> = ({ user }) => {

	const { handleToggle, isMobileOpen, toggleApplicationMenu, isApplicationMenuOpen } = useAppHeader();

	return (
		<header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
			<div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
				<div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
					<button
						className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
						onClick={handleToggle}
						aria-label="Toggle Sidebar"
					>
						{isMobileOpen ? (
							<CloseIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
						) : (
							<MenuIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
						)}
					</button>

					<Link href="/" className="lg:hidden">
						<Image
							width={250}
							height={32}
							className="dark:hidden"
							src="./images/logo/logo-icon.svg"
							alt="Logo"
						/>
						<Image
							width={250}
							height={32}
							className="hidden dark:block"
							src="./images/logo/logo-dark.svg"
							alt="Logo"
						/>
					</Link>

					<button
						onClick={toggleApplicationMenu}
						className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
					>
						<HorizontalDotsIcon className="w-6 h-6 text-gray-700 dark:text-gray-400" />
					</button>
				</div>
				<div
					className={`${isApplicationMenuOpen ? "flex" : "hidden"
						} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
				>
					<div className="flex items-center gap-2 2xsm:gap-3">
						{/* <!-- Dark Mode Toggler --> */}
						<ThemeToggleButton />
						{/* <!-- Dark Mode Toggler --> */}

					</div>
					{/* <!-- User Area --> */}
					<UserDropdown user={user} />

				</div>
			</div>
		</header>
	);
};

export default AppHeader;
