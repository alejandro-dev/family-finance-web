"use client";

import React from "react";
import ChevronLeftIcon from "@/icons/chevron-left.svg";
import ChevronRightIcon from "@/icons/chevron-right.svg";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	pageSize,
	totalItems,
	onPageChange,
	onPageSizeChange,
}: PaginationProps) {
	const startEntry = (currentPage - 1) * pageSize + 1;
	const endEntry = Math.min(currentPage * pageSize, totalItems);

	// Generar array de páginas a mostrar
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];

		if (totalPages <= 10) {
			// Si hay 10 o menos páginas, mostrar todas
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Si hay más de 10 páginas
			pages.push(1);

			if (currentPage > 4) {
				pages.push("...");
			}

			// Páginas alrededor de la actual
			const startPage = Math.max(2, currentPage - 2);
			const endPage = Math.min(totalPages - 1, currentPage + 2);

			for (let i = startPage; i <= endPage; i++) {
				if (!pages.includes(i)) {
					pages.push(i);
				}
			}

			if (currentPage < totalPages - 3) {
				pages.push("...");
			}

			if (!pages.includes(totalPages)) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="border-t border-gray-200 py-4 px-4 dark:border-gray-800">
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				{/* Left: Entry counter and PageSize selector */}
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
					<p className="text-center text-sm text-gray-500 dark:text-gray-400 xl:text-left">
						Showing <span className="font-medium">{startEntry}</span> to{" "}
						<span className="font-medium">{endEntry}</span> of{" "}
						<span className="font-medium">{totalItems}</span> entries
					</p>

					{/* PageSize selector */}
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-500 dark:text-gray-400">Rows per page:</span>
						<select
							value={pageSize}
							onChange={(e) => onPageSizeChange(Number(e.target.value))}
							className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
						>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={15}>15</option>
						</select>
					</div>
				</div>

				{/* Right: Pagination controls */}
				<div className="flex items-center justify-center gap-1 xl:justify-end">
					{/* Previous button */}
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="mr-2 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3"
						aria-label="Previous page"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</button>

					{/* Page numbers */}
					<div className="flex items-center gap-1">
						{pageNumbers.map((page, index) => (
							<React.Fragment key={index}>
								{page === "..." ? (
									<span className="flex h-10 w-10 items-center justify-center text-gray-500 dark:text-gray-400">
										...
									</span>
								) : (
									<button
										onClick={() => onPageChange(page as number)}
										className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
												? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
												: "text-gray-700 hover:bg-blue-500/10 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-500/20 dark:hover:text-blue-400"
											}`}
									>
										{page}
									</button>
								)}
							</React.Fragment>
						))}
					</div>

					{/* Next button */}
					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3"
						aria-label="Next page"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
}
