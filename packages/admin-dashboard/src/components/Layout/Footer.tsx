import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>© 2024 Workero. All rights reserved.</span>
          <span>•</span>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Terms of Service
          </a>
        </div>
        
        {/* <div className="flex items-center space-x-4">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
