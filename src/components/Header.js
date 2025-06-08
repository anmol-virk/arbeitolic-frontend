import React from "react";
import LogoutButton from "./Logout";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <a className="navbar-brand" href="/">My App</a>
      <div className="">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Header;
