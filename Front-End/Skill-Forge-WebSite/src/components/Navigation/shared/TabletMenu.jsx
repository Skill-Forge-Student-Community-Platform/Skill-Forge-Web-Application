// complete the file path: Front-End/Skill-Forge-WebSite/src/components/Navigation/shared/TabletMenu.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import "./TabletMenu.css";

const TabletMenu = ({ Menus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setActiveMenu(null);
  };

  const toggleSubmenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const subMenuAnimate = {
    enter: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 }
  };

  return (
    <div className="tablet-menu-container">
      <button
        className="tablet-menu-button"
        onClick={toggleDrawer}
        aria-label="Toggle menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <motion.div
        className="tablet-menu-dropdown"
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        style={{ overflow: isOpen ? "auto" : "hidden" }}
      >
        <div className="tablet-menu-content">
          <ul>
            {Menus.map((menu, idx) => (
              <li key={menu.name} className="tablet-menu-item">
                <div
                  className="tablet-menu-header"
                  onClick={() => toggleSubmenu(idx)}
                >
                  <span>{menu.name}</span>
                  {menu.subMenu?.length > 0 && (
                    <ChevronDown className={`transition-transform duration-300 ${activeMenu === idx ? 'rotate-180' : ''}`} />
                  )}
                </div>

                {menu.subMenu?.length > 0 && (
                  <motion.div
                    initial="exit"
                    animate={activeMenu === idx ? "enter" : "exit"}
                    variants={subMenuAnimate}
                    className="tablet-submenu-content"
                  >
                    <div>
                      {menu.subMenuHeading && menu.subMenuHeading.map((heading, hIdx) => (
                        <div key={heading} className="mb-3">
                          <h3 className="tablet-section-heading">{heading}</h3>
                          {/* Group items by heading - simplified for mobile */}
                          {menu.subMenu
                            .filter((_, i) => Math.floor(i / (menu.subMenu.length / menu.subMenuHeading.length)) === hIdx)
                            .map((item) => (
                              <Link
                                key={item.name}
                                to={item.path || "#"}
                                className="tablet-menu-link"
                                onClick={toggleDrawer} // Close drawer on navigation
                              >
                                <div className="tablet-menu-icon">
                                  {item.icon && <item.icon size={16} />}
                                </div>
                                <div className="tablet-menu-text-container">
                                  <div className="tablet-menu-title">{item.name}</div>
                                  <div className="tablet-menu-description">{item.desc}</div>
                                </div>
                              </Link>
                            ))}
                        </div>
                      ))}

                      {/* If no headings defined, show all items */}
                      {!menu.subMenuHeading && menu.subMenu.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path || "#"}
                          className="tablet-menu-link"
                          onClick={toggleDrawer} // Close drawer on navigation
                        >
                          <div className="tablet-menu-icon">
                            {item.icon && <item.icon size={16} />}
                          </div>
                          <div className="tablet-menu-text-container">
                            <div className="tablet-menu-title">{item.name}</div>
                            <div className="tablet-menu-description">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default TabletMenu;
