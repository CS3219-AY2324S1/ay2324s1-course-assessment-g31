import { Switch } from "@headlessui/react";
import { useState } from "react";

import classNames from "../../util/ClassNames";
import ToggleProps from "./Toggle.interface";

export default function Toggle({
  currentState,
  leftComponent,
  rightComponent,
  setState,
}: ToggleProps) {
  return (
    <div className="flex flex-row gap-x-4">
      {leftComponent}
      <Switch
        checked={currentState}
        onChange={setState}
        className={classNames(
          currentState ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={classNames(
            currentState ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          )}
        />
      </Switch>
      {rightComponent}
    </div>
  );
}
