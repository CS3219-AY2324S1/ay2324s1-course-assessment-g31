import React, { createContext, useState, useMemo } from "react";

interface IFilterSortContext {
  searchFilter: string;
  difficultyFilter: string;
  categoryFilter: string[];
  sortBy: string;
  sortOrder: string;
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
  updateDifficultyFilter: (difficulty: string) => void;
  updateCategoryFilter: (category: string) => void;
  clearAllFilter: () => void;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
}

export const sortingFields = ["title", "popularity"] as const;
export const sortingOptions = ["asc", "desc"] as const;

export const FilterSortContext = createContext<IFilterSortContext>({
  searchFilter: "",
  difficultyFilter: "",
  categoryFilter: [],
  sortBy: sortingFields[0],
  sortOrder: sortingOptions[0],
  setSearchFilter: () => {},
  updateDifficultyFilter: () => {},
  updateCategoryFilter: () => {},
  clearAllFilter: () => {},
  setSortBy: () => {},
  setSortOrder: () => {},
});

export function FilterSortProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Filtering
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  // Sorting
  const [sortBy, setSortBy] = useState<string>(sortingFields[0]);
  const [sortOrder, setSortOrder] = useState<string>(sortingOptions[0]);

  const updateDifficultyFilter = (difficulty: string) => {
    if (difficultyFilter === difficulty) {
      setDifficultyFilter("");
    } else {
      setDifficultyFilter(difficulty);
    }
  };

  const updateCategoryFilter = (category: string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter((cat) => cat !== category));
    } else {
      setCategoryFilter([...categoryFilter, category]);
    }
  };

  const clearAllFilter = () => {
    setSearchFilter("");
    setDifficultyFilter("");
    setCategoryFilter([]);
  };

  const value = useMemo(() => {
    return {
      searchFilter,
      difficultyFilter,
      categoryFilter,
      sortBy,
      sortOrder,
      setSearchFilter,
      updateDifficultyFilter,
      updateCategoryFilter,
      clearAllFilter,
      setSortBy,
      setSortOrder,
    };
  }, [
    searchFilter,
    difficultyFilter,
    categoryFilter,
    sortBy,
    sortOrder,
    setSearchFilter,
    updateDifficultyFilter,
    updateCategoryFilter,
    clearAllFilter,
    setSortBy,
    setSortOrder,
  ]);

  return (
    <FilterSortContext.Provider value={value}>
      {children}
    </FilterSortContext.Provider>
  );
}
