import { useState, useCallback } from 'react';
import { Category } from '@/app/(protected)/categories/_types';

interface UseCategoryModalProps {
  initialCategories?: Category[];
}

export function useCategoryModal({ initialCategories = [] }: UseCategoryModalProps = {}) {
  const [createdCategories, setCreatedCategories] = useState<Category[]>(initialCategories);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const openCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(false);
  }, []);

  return {
    createdCategories,
    setCreatedCategories,
    isCategoryModalOpen,
    openCategoryModal,
    closeCategoryModal,
  };
}
