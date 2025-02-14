import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/base/SearchBar.css"

function MainPageSearchBar({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery || "")
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    setQuery(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (query) {
      navigate(`/search?query=${query}`) // 검색어를 쿼리 파라미터로 전달
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

export default MainPageSearchBar
