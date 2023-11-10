import React from "react";
import List from "./components/List";
import { FilterSortProvider } from "../../context/FilterSortContext";

export default function QuestionsList() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 my-10">
      <FilterSortProvider>
        <List />
      </FilterSortProvider>
    </div>
  );
}
