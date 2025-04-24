import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>EventMaster</h5>
            <p>Your one-stop platform for discovering and booking amazing events.</p>
          </div>
          <div className="col-md-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/login" className="text-light">Login</a></li>
              <li><a href="/register" className="text-light">Register</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <address>
              <p>Email: info@eventmaster.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </address>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} EventMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 