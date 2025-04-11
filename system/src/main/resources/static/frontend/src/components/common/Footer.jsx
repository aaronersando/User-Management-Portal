import React from "react";

function Footer() {
  return (
    
      <div>
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>Privacy Policy | Terms of Service</p>
        </footer>
      </div>
  );
}

export default Footer;