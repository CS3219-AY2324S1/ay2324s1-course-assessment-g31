import React, { useContext } from "react";

import {
  FilterSortContext,
  sortingFields,
  sortingOptions,
} from "../../../context/FilterSortContext";
import { CategoryMap, Difficulties } from "../../../types/question";

interface IFilterSortProps {
  handleSearch: () => void;
}

export default function FilterSort({ handleSearch }: IFilterSortProps) {
  const {
    searchFilter,
    setSearchFilter,
    difficultyFilter,
    updateDifficultyFilter,
    categoryFilter,
    updateCategoryFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    clearAllFilter,
  } = useContext(FilterSortContext);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row max-w-full">
        <input
          className="grow rounded-tl-xl border-2 border-indigo-500 bg-gray-100"
          placeholder="Search..."
          id="search-field"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          className="w-16 block rounded-tr-xl bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col gap-1 border-indigo-500 border-x-2 px-3 py-2 bg-gray-100">
          <span className="font-semibold">Difficulty</span>
          {Difficulties.map((difficulty) => (
            <div key={difficulty} className="flex flex-row gap-1 items-center">
              <input
                className="border-indigo-500 rounded text-indigo-500"
                type="checkbox"
                id={difficulty}
                value={difficulty}
                onChange={(e) => updateDifficultyFilter(e.target.value)}
                checked={difficultyFilter === difficulty}
              />
              <label className="text-slate-600" htmlFor={difficulty}>
                {difficulty}
              </label>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center border-indigo-500 px-3 py-2 bg-gray-100">
          <span className="font-semibold">Category</span>
          <div className="flex flex-col flex-wrap max-h-28 gap-1">
            {Object.values(CategoryMap).map((category) => (
              <div key={category} className="flex flex-row gap-1 items-center">
                <input
                  className="border-indigo-500 rounded text-indigo-500"
                  type="checkbox"
                  id={category}
                  value={category}
                  onChange={(e) => updateCategoryFilter(e.target.value)}
                  checked={categoryFilter.includes(category)}
                />
                <label className="text-slate-600" htmlFor={category}>
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row w-16 items-center border-x-2 border-indigo-500 px-3 py-2 bg-gray-100">
          <button
            className="self-center max-h-8 block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="button"
            onClick={clearAllFilter}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center border-2 border-indigo-500 rounded-b-xl py-2 bg-gray-100">
        <span className="font-semibold">Sort</span>
        <div className="flex flex-row justify-center gap-3">
          {sortingFields.map((field) => (
            <div key={field} className="flex flex-row gap-1 items-center">
              <input
                className="border-indigo-500 rounded text-indigo-500"
                type="checkbox"
                id={field}
                value={field}
                onChange={() => setSortBy(field)}
                checked={sortBy === field}
              />
              <label className="text-slate-600" htmlFor={field}>
                {field}
              </label>
            </div>
          ))}
          {sortingOptions.map((option) => (
            <div key={option} className="flex flex-row gap-1 items-center">
              <input
                className="border-indigo-500 rounded text-indigo-500"
                type="checkbox"
                id={option}
                value={option}
                onChange={() => setSortOrder(option)}
                checked={sortOrder === option}
              />
              <label className="text-slate-600" htmlFor={option}>
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
