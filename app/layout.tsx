import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { GlobalToastProvider } from '@/components/ui/alert';

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
         <body className="bg-white [font-family:Avenir_Next,Montserrat,Segoe_UI,sans-serif] dark:bg-gray-900">
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
