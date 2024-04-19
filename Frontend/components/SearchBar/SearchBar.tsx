"use client";
import React, { useEffect, useState } from "react";
import SearchBarManufacturer from "./SearchBarManufacturer";

function SearchBar() {
  return (
    <form className="search-bar w-96">
      <div className="search-bar-items">
        <SearchBarManufacturer />
      </div>
    </form>
  );
}

export default SearchBar;
