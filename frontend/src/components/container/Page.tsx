import { IContainerProps } from "./Container.interface";

function PageContainer({ children }: IContainerProps) {
  return (
    <div className="mx-auto max-w-9xl sm:px-6 lg:px-8">
      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl xl:max-w-9xl lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageContainer;
