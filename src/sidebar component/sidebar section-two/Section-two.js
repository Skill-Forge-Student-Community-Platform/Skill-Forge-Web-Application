import React from 'react'
import './Section-two.css';
import { NavLink } from 'react-router-dom';

function Section2() {
  return (
    <div className='box2'>
                <ul>
                    <li>
                        <NavLink to="/pages/Quick_Settings">
                             Quick Settings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/pages/Profile_dashboard">
                            Profile
                        </NavLink>
                    </li>
                </ul>
    </div>
  )
}

export default Section2;