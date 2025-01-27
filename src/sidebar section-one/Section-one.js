import './Section-one-style.css';
import { FaBookmark, FaUserFriends } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { Link } from 'react-router-dom';

function Section1(){
    return(
        <div className="box1">
            <ul>
                <li>
                    <Link to="/pages/events">
                        <MdEmojiEvents className="achievement-icon"/> Events
                    </Link>
                </li>
                <li>
                    <Link to="/pages/friends">
                        <FaUserFriends className="friends-icon"/>  Friends
                    </Link>
                </li>
                <li>
                    <Link to="/pages/save">
                        <FaBookmark className="save-icon" /> Save
                    </Link>
                </li>
            </ul>
        </div>
    );
}
export default Section1;