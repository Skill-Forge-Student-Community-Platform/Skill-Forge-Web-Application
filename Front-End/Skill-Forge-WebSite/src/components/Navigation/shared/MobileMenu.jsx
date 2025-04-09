import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import "./MobileMenu.css";

const MobileMenu = ({ Menus }) => {
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
    <div className="mobile-menu-container">
      <button
        className="mobile-menu-button"
        onClick={toggleDrawer}
        aria-label="Toggle menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <motion.div
        className="mobile-menu-dropdown"
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        style={{ overflow: isOpen ? "auto" : "hidden" }}
      >
        <div className="mobile-menu-content">
          <ul>
            {Menus.map((menu, idx) => (
              <li key={menu.name} className="mobile-menu-item">
                <div
                  className="mobile-menu-header"
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
                    className="mobile-submenu-content"
                  >
                    <div>
                      {menu.subMenuHeading && menu.subMenuHeading.map((heading, hIdx) => (
                        <div key={heading} className="mb-3">
                          <h3 className="mobile-section-heading">{heading}</h3>
                          {/* Group items by heading - simplified for mobile */}
                          {menu.subMenu
                            .filter((_, i) => Math.floor(i / (menu.subMenu.length / menu.subMenuHeading.length)) === hIdx)
                            .map((item) => (
                              <Link
                                key={item.name}
                                to={item.path || "#"}
                                className="mobile-menu-link"
                                onClick={toggleDrawer} // Close drawer on navigation
                              >
                                <div className="mobile-menu-icon">
                                  {item.icon && <item.icon size={16} />}
                                </div>
                                <div className="mobile-menu-text-container">
                                  <div className="mobile-menu-title">{item.name}</div>
                                  <div className="mobile-menu-description">{item.desc}</div>
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
                          className="mobile-menu-link"
                          onClick={toggleDrawer} // Close drawer on navigation
                        >
                          <div className="mobile-menu-icon">
                            {item.icon && <item.icon size={16} />}
                          </div>
                          <div className="mobile-menu-text-container">
                            <div className="mobile-menu-title">{item.name}</div>
                            <div className="mobile-menu-description">{item.desc}</div>
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

export default MobileMenu;
