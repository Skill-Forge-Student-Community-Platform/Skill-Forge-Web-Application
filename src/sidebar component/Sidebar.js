import React from 'react'
import Section1 from './sidebar section-one/Section-one';
import Section2 from './sidebar section-two/Section-two';
import Section3 from './sidebar section-three/Section-three';
import './Sidebar.css';
import { Link } from 'react-router-dom';


function Sidebar() {
  return (
    <div className='sidebar'>
        <Link to="/" style={{ textDecoration: 'none', color:'black' }}>
          <h1 className='logo'>SkillForge</h1>
        </Link>
        <Section1/>
        <Section2/>
        <Section3/>
    </div>
  )
}

export default Sidebar