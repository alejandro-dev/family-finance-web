"use client";

import { DependencyList, useCallback, useEffect, useRef, useState } from "react";
import { ErrorCode } from "@/services/errors/ErrorCode";

interface UseQueryOptions<TData> {
	queryFn: () => Promise<TData>;
	deps?: DependencyList;
	enabled?: boolean;
	initialData?: TData | null;
	skipInitialFetch?: boolean;
	onSuccess?: (data: TData) => void;
	onError?: (error: ErrorCode) => void;
}

interface UseQueryResult<TData> {
	data: TData | null;
	error: ErrorCode | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
	refetch: () => Promise<void>;
	reset: () => void;
}

export function useQuery<TData>({
	queryFn,
	deps = [],
	enabled = true,
	initialData = null,
	skipInitialFetch = false,
	onSuccess,
	onError,
}: UseQueryOptions<TData>): UseQueryResult<TData> {
	const [data, setData] = useState<TData | null>(initialData);
	const [error, setError] = useState<ErrorCode | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);

	// Controla si estamos en el primer render para poder omitir el primer fetch.
	const isFirstRunRef = useRef(true);

	// Identificador incremental para descartar respuestas antiguas.
	const requestIdRef = useRef(0);

	const executeQuery = useCallback(async () => {
		const currentRequestId = ++requestIdRef.current;

		setIsLoading(true);
		setIsSuccess(false);
		setIsError(false);
		setError(null);

		try {
			const result = await queryFn();

			// Solo actualizamos estado si esta respuesta sigue siendo la más reciente.
			if (currentRequestId === requestIdRef.current) {
				setData(result);
				setIsSuccess(true);
				onSuccess?.(result);
			}

		} catch (e) {
			// Homologamos el error al tipo ErrorCode para mantener una API consistente.
			const normalizedError = e instanceof ErrorCode ? e : new ErrorCode("Error desconocido", 500);

			if (currentRequestId === requestIdRef.current) {
				setError(normalizedError);
				setIsError(true);
				onError?.(normalizedError);
			}

		} finally {
			if (currentRequestId === requestIdRef.current) setIsLoading(false);

		}
	}, [queryFn, onSuccess, onError]);

	const reset = useCallback(() => {
		setData(initialData);
		setError(null);
		setIsLoading(false);
		setIsSuccess(false);
		setIsError(false);
	}, [initialData]);

	useEffect(() => {
		if (!enabled) return;

		// Cuando hay datos iniciales (SSR), podemos evitar el doble fetch al montar.
		if (skipInitialFetch && isFirstRunRef.current) {
			isFirstRunRef.current = false;
			return;
		}

		isFirstRunRef.current = false;
		void executeQuery();
		
	}, [enabled, executeQuery, skipInitialFetch, deps]);

	return {
		data,
		error,
		isLoading,
		isSuccess,
		isError,
		refetch: executeQuery,
		reset,
	};
}
