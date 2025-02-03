import './Section-one-style.css';
import { FaBookmark, FaUserFriends } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { NavLink } from 'react-router-dom';

function Section1(){
    return(
            <div className="box1">
                <ul>
                    <li>
                        <NavLink to="/pages/events">
                            <MdEmojiEvents className="achievement-icon"/> Events
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/pages/friends">
                            <FaUserFriends className="friends-icon"/>  Friends
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/pages/save">
                            <FaBookmark className="save-icon" /> Save
                        </NavLink>
                    </li>
                </ul>
            </div>
    );
}
export default Section1;