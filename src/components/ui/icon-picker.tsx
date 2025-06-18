import React, { useState } from "react";
import * as MdIcons from "react-icons/md"; // You can include others too

const ICONS = Object.entries(MdIcons);

export default function IconPicker({ onSelect }: { onSelect: (iconName: string) => void }) {
  const [search, setSearch] = useState("");

  const filteredIcons = ICONS.filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-sm bg-white border border-gray-300 rounded-md shadow-md p-4 space-y-3 z-50">
      <input
        type="text"
        placeholder="Search icons..."
        className="w-full border px-2 py-1 rounded text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-6 gap-3 max-h-60 overflow-y-auto">
        {filteredIcons.map(([name, Icon]) => (
          <button
            key={name}
            className="hover:bg-gray-100 p-2 rounded flex items-center justify-center"
            title={name}
            onClick={() => onSelect(name)}
          >
            <Icon className="text-xl" />
          </button>
        ))}
      </div>
    </div>
  );
}
