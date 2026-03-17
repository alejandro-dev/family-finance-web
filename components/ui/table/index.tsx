import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
	children: ReactNode;
	className?: string;
}

// Props for TableHeader
interface TableHeaderProps {
	children: ReactNode;
	className?: string;
}

// Props for TableBody
interface TableBodyProps {
	children: ReactNode;
	className?: string;
}

// Props for TableRow
interface TableRowProps {
	children: ReactNode;
	className?: string;
}

// Props for TableCell
interface TableCellProps {
	children: ReactNode;
	isHeader?: boolean;
	className?: string;
	badge?: boolean;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
	return (
		<table className={`min-w-full border-collapse border-0 ${className}`}>
			{children}
		</table>
	);
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
	return (
		<thead className={`border-b border-gray-100 dark:border-white/5 ${className}`}>
			{children}
		</thead>
	);
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
	return (
		<tbody className={`bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
			{children}
		</tbody>
	);
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
	return (
		<tr className={`${className}`}>
			{children}
		</tr>
	);
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
	children,
	isHeader = false,
	className,
}) => {
	const CellTag = isHeader ? "th" : "td";
	const baseClasses = isHeader
		? "px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
		: "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 bg-gray-50/3";
		
	
	return (
		<CellTag className={`${baseClasses} ${className}`}>
			{children}
		</CellTag>
	);
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
