import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import type { Metadata } from "next";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { GlobalToastProvider } from '@/components/ui/alert';

export const metadata: Metadata = {
   metadataBase: new URL("https://family-finance.local"),
   title: {
      default: "Family Finance",
      template: "%s | Family Finance",
   },
   description:
      "Family Finance es una aplicacion para gestionar gastos, ingresos, miembros de la familia y seguimiento financiero desde un unico panel.",
};

const outfit = Outfit({
   subsets: ["latin"],
});

const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      var theme = savedTheme === 'light' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (error) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <head>
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
         </head>
         <body className={`${outfit.className} bg-white dark:bg-gray-900`}>
            <ThemeProvider>
               <SidebarProvider>
                  <GlobalToastProvider>
                     {children}
                  </GlobalToastProvider>
               </SidebarProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
