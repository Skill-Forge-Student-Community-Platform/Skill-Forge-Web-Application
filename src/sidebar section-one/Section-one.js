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
                        <MdEmojiEvents/> Events
                    </Link>
                </li>
                <li>
                    <Link to="/pages/friends">
                        <FaUserFriends/>  Friends
                    </Link>
                </li>
                <li>
                    <Link to="/pages/save">
                        <FaBookmark/> Save
                    </Link>
                </li>
            </ul>
        </div>
    );
}
export default Section1;