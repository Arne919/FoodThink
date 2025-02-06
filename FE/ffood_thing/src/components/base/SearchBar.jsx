import React, { useState } from "react"
import "../../styles/base/SearchBar.css"
import Form from "react-bootstrap/Form"

function SearchBar({ onSearch, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || "")

  const handleInputChange = (event) => {
    setQuery(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query) // 부모 컴포넌트로 검색어 전달
    }
  }

  return (
    <div>
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input type="text" className="search-input" placeholder="Search..." value={query} onChange={handleInputChange} onKeyPress={handleKeyPress} />
          <i className="bi bi-search search-icon" onClick={handleSearch}></i>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
