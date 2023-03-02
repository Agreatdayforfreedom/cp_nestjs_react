import { OperationVariables } from '@apollo/client';
import { FormEvent, useState } from 'react';

interface Props {
  refetch: (variables: Partial<OperationVariables>) => void;
}

export const SearchBar = ({ refetch }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch({ searchValue });
  };

  return (
    <div className="mb-2 flex justify-center">
      <form className="xs:flex xs:items-center" onSubmit={handleSubmit}>
        <label htmlFor="search" className="font-bold mx-1">
          Find a user
        </label>
        <div>
          <input
            type="text"
            id="search"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="bg-transparent input-border-within rounded-lg border border-[var(--purple)] p-1"
            placeholder="Search..."
          />
          <button
            type="submit"
            className="text-sm bg-[var(--light-blue)] active:bg-blue-500 font-semibold mx-2 p-2 px-3 hover:bg-blue-600 rounded-full"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};
