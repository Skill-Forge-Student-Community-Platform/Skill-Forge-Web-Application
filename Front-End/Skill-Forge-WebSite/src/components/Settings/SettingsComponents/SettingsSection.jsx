import React from 'react'
import { Link } from 'react-router-dom'

export default function SettingsSection({ title, items }) {
  return (
    <section className="settings-section">
      <h2 className="section-title">{title}</h2>
      <div className="section-items">
        {items.map((item, index) => (
          <Link 
            key={index}
            to={item.path} 
            className="settings-item"
          >
            <div className="item-content">
              <div className="item-title">{item.title}</div>
              {item.description && (
                <div className="item-description">{item.description}</div>
              )}
            </div>
            {item.value && (
              <div className="item-value">{item.value}</div>
            )}
            <div className="item-arrow">→</div>
          </Link>
        ))}
      </div>
    </section>
  )
}