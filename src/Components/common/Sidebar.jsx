import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderTree, 
  ChevronDown, 
  ChevronRight, 
  ShoppingBag, 
  Users 
} from 'lucide-react';

const Sidebar = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { 
      name: 'Catalogues', 
      icon: <FolderTree size={20} />, 
      hasSubmenu: true,
      isOpen: isCatalogOpen,
      toggle: () => setIsCatalogOpen(!isCatalogOpen),
      subItems: [
        { name: 'Products' },
        { name: 'Categories' },
        { name: 'Attributes', active: true, hasArrow: true },
        { name: 'Collections' },
        { name: 'Brands' }
      ]
    },
    { name: 'Orders', icon: <ShoppingBag size={20} />, badge: 8 },
    { name: 'Customers', icon: <Users size={20} /> }
  ];

  return (
    <div className="w-64 h-screen bg-[#1a1c2c] text-gray-400 p-4 font-sans">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
        <span className="text-white font-semibold ml-1">Admin</span>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.name}>
            <button 
              onClick={item.toggle}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-800/50 ${
                item.isOpen ? 'bg-[#2a2d45] text-white' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-yellow-500 text-[#1a1c2c] text-xs font-bold px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
              {item.hasSubmenu && (
                item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )}
            </button>

            {/* Nested Submenu */}
            {item.hasSubmenu && item.isOpen && (
              <div className="mt-1 ml-4 border-l border-gray-700/50 space-y-1">
                {item.subItems.map((sub) => (
                  <button
                    key={sub.name}
                    className={`w-full flex items-center justify-between py-2.5 px-6 text-sm transition-colors hover:text-white ${
                      sub.active ? 'bg-[#2a2d45] text-white rounded-lg' : 'text-gray-500'
                    }`}
                  >
                    <span>{sub.name}</span>
                    {sub.hasArrow && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
