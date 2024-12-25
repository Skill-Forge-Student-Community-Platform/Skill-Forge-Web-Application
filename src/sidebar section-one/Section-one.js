import './Section-one-style.css';
import { FaBookmark, FaUserFriends } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
function Section1(){
    return(
        <div>
            <ul>
                <li><MdEmojiEvents/> Events</li>
                <li><FaUserFriends/>  Friends</li>
                <li><FaBookmark/> Save</li>
            </ul>
        </div>
    );
}
export default Section1;