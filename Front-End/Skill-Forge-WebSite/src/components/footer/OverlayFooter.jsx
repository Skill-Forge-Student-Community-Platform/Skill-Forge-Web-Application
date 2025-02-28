import React, { useState } from 'react';
import './overlayfooter.css';

const OverlayFooter = () => {
  const [showFullFooter, setShowFullFooter] = useState(false);
  
  const toggleFooter = () => {
    setShowFullFooter(!showFullFooter);
  };
  
  return (
    <div className={`overlay-footer ${showFullFooter ? 'expanded' : 'collapsed'}`}>
      <div className="footer-toggle" onClick={toggleFooter}>
        <span>{showFullFooter ? 'Hide Footer' : 'Show Footer'}</span>
        <svg 
          className={`toggle-icon ${showFullFooter ? 'up' : 'down'}`} 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 12L2 6L3.4 4.6L8 9.2L12.6 4.6L14 6L8 12Z" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-section company-info">
          <div className="footer-logo">SkillForge</div>
          <p>Your platform for mastering new skills and advancing your career.</p>
          <div className="social-links">
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8.46 15.54L7 14.08L10.08 11L7 7.92L8.46 6.46L13 11L8.46 15.54ZM16.54 15.54L12 11L16.54 6.46L18 7.92L14.92 11L18 14.08L16.54 15.54Z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Tutorials</a></li>
            <li><a href="#">Workshops</a></li>
            <li><a href="#">Career Paths</a></li>
            <li><a href="#">Community</a></li>
          </ul>
        </div>
        
        <div className="footer-section links">
          <h3>Information</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Team</a></li>
            <li><a href="#">Partners</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><strong>Email:</strong> info@skillforge.com</p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>Address:</strong> 123 Learning Way,<br />Education District, SF 94105</p>
          <div className="newsletter">
            <h4>Subscribe to our newsletter</h4>
            <form>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 SkillForge. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  );
};

export default OverlayFooter;