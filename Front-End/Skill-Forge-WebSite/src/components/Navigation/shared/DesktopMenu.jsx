import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const DesktopMenu = ({ menu }) => {
  const [isHover, setIsHover] = useState(false);

  const toggleHoverMenu = () => {
    setIsHover(!isHover);
  };

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: { duration: 0.5 },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: { duration: 0.5 },
      transitionEnd: { display: "none" },
    },
  };

  const hasSubMenu = menu?.subMenu?.length;

  return (
    <motion.li
      className="nav-item relative"
      onHoverStart={toggleHoverMenu}
      onHoverEnd={toggleHoverMenu}
    >
      <span className="flex items-center gap-1">
        {menu.name}
        {hasSubMenu && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isHover ? 'rotate-180' : ''}`}
          />
        )}
      </span>

      {hasSubMenu && (
        <motion.div
          className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50"
          style={{ transformOrigin: "top center", minWidth: "240px" }}
          initial="exit"
          animate={isHover ? "enter" : "exit"}
          variants={subMenuAnimate}
        >
          <div
            className={`grid gap-4 ${
              menu.gridCols === 3 ? "grid-cols-3" :
              menu.gridCols === 2 ? "grid-cols-2" : "grid-cols-1"
            }`}
            style={{
              width: menu.gridCols === 3 ? "600px" :
                    menu.gridCols === 2 ? "450px" : "220px"
            }}
          >
            {/* Group submenu items by heading */}
            {menu.subMenuHeading?.map((heading, headingIndex) => (
              <div className="submenu-group" key={`heading-${headingIndex}`}>
                <p className="text-sm mb-2 text-gray-500">{heading}</p>
                {menu.subMenu
                  .filter((_, itemIndex) => {
                    // This is a simple way to group items - can be made more sophisticated
                    const itemsPerGroup = Math.ceil(menu.subMenu.length / (menu.subMenuHeading.length || 1));
                    const startIdx = headingIndex * itemsPerGroup;
                    const endIdx = startIdx + itemsPerGroup;
                    return itemIndex >= startIdx && itemIndex < endIdx;
                  })
                  .map((submenu, i) => (
                    <NavLink
                      to={submenu.path || "#"}
                      key={i}
                      className={({ isActive }) =>
                        `flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md mb-2 ${
                          isActive ? "bg-blue-50 dark:bg-blue-900" : ""
                        }`
                      }
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                        {submenu.icon && <submenu.icon size={18} />}
                      </div>
                      <div>
                        <h6 className="font-medium">{submenu.name}</h6>

                        <p className="text-xs text-gray-500 dark:text-gray-400">{submenu.desc}</p>
                      </div>
                    </NavLink>
                  ))
                }
              </div>
            ))}

            {/* If no headings defined, show all items in a simple list */}
            {!menu.subMenuHeading && menu.subMenu.map((submenu, i) => (
              <NavLink
                to={submenu.path || "#"}
                key={i}
                className={({ isActive }) =>
                  `flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md mb-2 ${
                    isActive ? "bg-blue-50 dark:bg-blue-900" : ""
                  }`
                }
              >
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                  {submenu.icon && <submenu.icon size={18} />}
                </div>
                <div>
                  <h6 className="font-medium">{submenu.name}</h6>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{submenu.desc}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </motion.li>
  );
};

export default DesktopMenu;
