interface UserSearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
}

export default function UserSearchInput({ query, setQuery, isLoading }: UserSearchInputProps) {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ユーザー名で検索"
        className="w-full px-4 py-3 pr-10 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div
            className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"
            data-testid="spinner"
          ></div>
        </div>
      )}
    </div>
  );
}
