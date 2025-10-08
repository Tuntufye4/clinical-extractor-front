import React from "react";

export default function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "noteForm", label: "Note Form" },
    { id: "notes", label: "Clinical Notes" },
    { id: "entities", label: "Extracted Entities" },
    { id: "charts", label: "Charts" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Entity Extractor</h2>
      </div>

      <nav className="flex-1 px-2 py-6 space-y-12">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
