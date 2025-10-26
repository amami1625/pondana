import { useState, useCallback } from 'react';
import { Author } from '@/schemas/author';

interface UseAuthorModalProps {
  initialAuthors?: Author[];
}

export function useAuthorModal({ initialAuthors = [] }: UseAuthorModalProps = {}) {
  const [createdAuthors, setCreatedAuthors] = useState<Author[]>(initialAuthors);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  const openAuthorModal = useCallback(() => {
    setIsAuthorModalOpen(true);
  }, []);

  const closeAuthorModal = useCallback(() => {
    setIsAuthorModalOpen(false);
  }, []);

  return {
    createdAuthors,
    setCreatedAuthors,
    isAuthorModalOpen,
    openAuthorModal,
    closeAuthorModal,
  };
}
