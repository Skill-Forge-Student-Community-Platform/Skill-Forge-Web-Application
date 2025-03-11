import React, { useState } from "react";
import { Dropdown, Image } from "react-bootstrap";


const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown show={open} onToggle={() => setOpen(!open)}>
      <Dropdown.Toggle 
        variant="light" 
        id="dropdown-basic" 
        style={{ background: "none", border: "none", padding: 0 }}
      >
        <Image
          src="https://via.placeholder.com/40"
          roundedCircle
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.ItemText>
          <strong> Lakshan Fernando </strong> <br />
          Student at University of Westminster
        </Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.Item href="#">View Profile</Dropdown.Item>
        <Dropdown.Item href="#">Settings & Privacy</Dropdown.Item>
        <Dropdown.Item href="#">Help</Dropdown.Item>
        <Dropdown.Item href="#">Language</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#">Posts & Activity</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#">Sign Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
