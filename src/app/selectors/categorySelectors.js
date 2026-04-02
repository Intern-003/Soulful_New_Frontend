import { createSelector } from "@reduxjs/toolkit";

// Base selector
const selectCategoriesState = (state) => state.categories;

// Memoized parent categories
export const selectParentCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) =>
    categoriesState.all.filter((cat) => cat.parent_id === null)
);

// Memoized children by parent (with proper memoization)
export const selectChildrenByParent = createSelector(
  [
    (state) => state.categories.children,
    (state, parentId) => parentId,
  ],
  (childrenCache, parentId) => {
    if (!parentId) return [];
    return childrenCache[parentId] || [];
  }
);