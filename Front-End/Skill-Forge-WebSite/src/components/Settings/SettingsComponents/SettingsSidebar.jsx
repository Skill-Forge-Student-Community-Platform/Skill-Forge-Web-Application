import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { IoMdLock } from 'react-icons/io'
import { AiFillEye } from 'react-icons/ai'
import { BiMessageDetail } from 'react-icons/bi'
import { MdSecurity, MdCampaign } from 'react-icons/md'

export default function SettingsSidebar() {
  const location = useLocation()
  
  const menuItems = [
    { 
      icon: <FaUser size={20} />, 
      label: "Account preferences", 
      path: "/settings/account" 
    },
    { 
      icon: <IoMdLock size={20} />, 
      label: "Sign in & security", 
      path: "/settings/security" 
    },
    { 
      icon: <AiFillEye size={20} />, 
      label: "Visibility", 
      path: "/settings/visibility" 
    },
    { 
      icon: <BiMessageDetail size={20} />, 
      label: "Communications", 
      path: "/settings/communications" 
    },
    { 
      icon: <MdSecurity size={20} />, 
      label: "Data privacy", 
      path: "/settings/privacy" 
    },
    { 
      icon: <MdCampaign size={20} />, 
      label: "Advertising data", 
      path: "/settings/advertising" 
    }
  ]

  return (
    <div className="settings-SettingsSidebar">
      <div className="SettingsSidebar-header">
        <h2>Settings</h2>
      </div>
      <nav className="SettingsSidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`SettingsSidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="SettingsSidebar-icon">{item.icon}</span>
            <span className="SettingsSidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}