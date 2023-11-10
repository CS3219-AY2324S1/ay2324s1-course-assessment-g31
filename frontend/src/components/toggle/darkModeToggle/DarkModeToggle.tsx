import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";

import { DarkModeContext } from "../../../context/DarkModeContext";
import Toggle from "../Toggle";

function DarkModeToggle() {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  return (
    <Toggle
      currentState={isDarkMode}
      leftComponent={
        <SunIcon className="h-6 w-5 flex-none text-gray-600 dark:text-gray-400" />
      }
      rightComponent={
        <MoonIcon className="h-6 w-5 flex-none text-gray-600 dark:text-gray-400" />
      }
      setState={setIsDarkMode}
    />
  );
}

export default DarkModeToggle;
