import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ links }) => (
  <aside className="w-60 bg-gray-100 p-4 h-screen">
    <ul>
      {links.map((link) => (
        <li key={link.path} className="mb-2">
          <Link to={link.path} className="text-gray-700 hover:text-blue-600">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
