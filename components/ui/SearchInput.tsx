import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchInputProps {
  onSearch: (keyword: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    onSearch(searchKeyword);
  };

  return (
    <div className="p-1.5 flex">
      <input
        type="text"
        placeholder="Search..."
        className="px-1 py-1 bg-transparent lg:w-[10cqw] md:w-[20cqw] sm:w-[25cqw] w-[25cqw] text-white focus:outline-none"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button
        title="Search"
        onClick={handleSearch}
        className="pl-1.5 z-20 border-white border-l"
      >
        <MagnifyingGlassIcon className="h-[25px] w-[25px] cursor-pointer" />
      </button>
    </div>
  );
};

export default SearchInput;
