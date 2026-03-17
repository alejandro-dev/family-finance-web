
export default function NotFound() {
   return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
         <p className="text-sm font-medium uppercase tracking-wide text-gray-500">404</p>
         <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Page not found</h1>
         <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            The resource you were looking for does not exist or is no longer available.
         </p>
      </main>
   );
}
