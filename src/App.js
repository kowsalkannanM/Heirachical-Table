import { useState } from 'react'
import { HierarchicalTable } from './components/hierachicalTable'
import { hierachicalData } from './data/data'

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="records-page">
      <main className="records-content">
        <div className="records-toolbar">
          <div className="search-box">
            <span className="search-icon"></span>
            <input
              type="search"
              placeholder="Search by label..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <HierarchicalTable
          initialRows={hierachicalData.rows}
          searchTerm={searchTerm}
        />
      </main>
    </div>
  )
}