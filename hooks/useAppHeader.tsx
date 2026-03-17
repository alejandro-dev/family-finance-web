import { useSidebar } from "@/context/SidebarContext";
import { useState ,useEffect,useRef} from "react";

export const useAppHeader = () => {
   const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if ((event.metaKey || event.ctrlKey) && event.key === "k") {
         event.preventDefault();
         inputRef.current?.focus();
         }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, []);

   return { handleToggle, isMobileOpen, toggleApplicationMenu, inputRef, isApplicationMenuOpen };
}