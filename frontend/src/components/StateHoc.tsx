import React from "react";

interface StateHocProps {
  isLoading: boolean;
  isSuccess: boolean;
  loadingComponent: React.ReactNode;
  successComponent: React.ReactNode;
  failureComponent: React.ReactNode;
}

function StateHoc({
  isLoading,
  isSuccess,
  loadingComponent,
  successComponent,
  failureComponent,
}: StateHocProps) {
  if (isLoading) {
    return loadingComponent;
  }
  if (isSuccess) {
    return successComponent;
  }
  return failureComponent;
}

export default StateHoc;
