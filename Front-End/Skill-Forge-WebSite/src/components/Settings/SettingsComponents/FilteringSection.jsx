import React from 'react'

const FilteringSection = () => {
  return (
    <div className="filtering-section">
      <div className="filtering-header">
        <h2>All</h2>
        <button className="sort-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="content-list">
        {/* Product/Content Items */}
        <div className="content-item">
          <div className="item-image">
            {/* Image placeholder */}
          </div>
          <div className="item-details">
            <h3>Title</h3>
            <p>Product • Price • Author</p>
          </div>
          <div className="item-actions">
            <button className="add-collection-btn">Add to Collection</button>
            <button className="more-options-btn">•••</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilteringSection

// Add some basic styles to match the design
const styles = `
.filtering-section {
  padding: 16px;
}

.filtering-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sort-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.content-item {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background: white;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.item-details {
  flex: 1;
  margin: 0 16px;
}

.item-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-collection-btn {
  background: #f0f0f0;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.more-options-btn {
  background: none;
  border: none;
  cursor: pointer;
}
` 