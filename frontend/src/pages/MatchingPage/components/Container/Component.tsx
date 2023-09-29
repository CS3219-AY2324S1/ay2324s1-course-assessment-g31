import React from "react";
import { IContainerProps } from "./Container.interface";

function ComponentContainer({ children }: IContainerProps) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
    </div>
  );
}

export default ComponentContainer;
