import { FC, SVGProps } from "react";
import ListIcon from "@/icons/table.svg";
import UsersIcon from "@/icons/users.svg";
import GridIcon from "@/icons/grid.svg";
import ChevronDownIcon from "@/icons/chevron-down.svg";

export type IconComponent = FC<SVGProps<SVGSVGElement>>;

export type NavItem = {
	name: string;
	icon: IconComponent;
	path?: string;
	subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export type NavSection = {
	title?: string;
	items: NavItem[];
};

export const mainNavItems: NavItem[] = [
	{
		icon: GridIcon,
		name: "Dashboard",
		path: "/dashboard",
	},
	{
		icon: ListIcon,
		name: "Expenses",
		path: "/expenses",
	},
	{
		icon: ListIcon,
		name: "Incomes",
		path: "/incomes",
	},
	{
		icon: UsersIcon,
		name: "Family members",
		path: "/family-members",
	},
];

export const adminNavItems: NavItem[] = [
	{
		icon: UsersIcon,
		name: "Users",
		path: "/admin/users",
	},
	{
		icon: GridIcon,
		name: "Categories",
		path: "/admin/categories",
	},
];

export const navSections: NavSection[] = [
	{
		items: mainNavItems,
	},
	{
		title: "Administration",
		items: adminNavItems,
	},
];

export { ChevronDownIcon };
