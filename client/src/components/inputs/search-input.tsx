import { clsx } from 'clsx';
import type { ChangeEvent } from 'react';

interface SearchInputProps {
  value: string;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
}

const SearchInput = ({
  value,
  placeholder = 'Search',
  className,
  onChange,
}: SearchInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner',
        className,
      )}
    >
      <span className="text-gray-400">🔍</span>
      <input
        type="search"
        data-testid="search-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
      />
    </div>
  );
};

export default SearchInput;
