import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div>
      <button
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={toggleDrawer}
        aria-label="Toggle menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <motion.div
        className="fixed left-0 right-0 top-[70px] bg-white dark:bg-gray-800 shadow-lg z-50"
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        style={{ overflow: isOpen ? "auto" : "hidden" }}
      >
        <div className="max-h-[calc(100vh-70px)] overflow-y-auto p-4">
          <ul>
            {Menus.map((menu, idx) => (
              <li key={menu.name} className="border-b border-gray-100 dark:border-gray-700 py-2">
                <div
                  className="flex justify-between items-center p-2 cursor-pointer"
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
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pt-2">
                      {menu.subMenuHeading && menu.subMenuHeading.map((heading, hIdx) => (
                        <div key={heading} className="mb-3">
                          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">{heading}</h3>
                          {/* Group items by heading - simplified for mobile */}
                          {menu.subMenu
                            .filter((_, i) => Math.floor(i / (menu.subMenu.length / menu.subMenuHeading.length)) === hIdx)
                            .map((item) => (
                              <Link
                                key={item.name}
                                to={item.path || "#"}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md my-1"
                                onClick={toggleDrawer} // Close drawer on navigation
                              >
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                                  {item.icon && <item.icon size={16} />}
                                </div>
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-gray-500">{item.desc}</div>
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
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md my-1"
                          onClick={toggleDrawer} // Close drawer on navigation
                        >
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                            {item.icon && <item.icon size={16} />}
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.desc}</div>
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
