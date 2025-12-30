import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ label, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onSelect(option);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Label */}
      <label className="block text-xl font-semibold mb-2">
        {label}
      </label>

      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center
                   bg-white border-4 border-blue-600
                   rounded-xl px-6 py-4
                   text-xl font-medium
                   focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        {selected}
        <ChevronDown size={28} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute mt-2 w-full bg-white
                     border-4 border-blue-600
                     rounded-xl shadow-xl z-50"
        >
          {/* Scrollable container */}
          <div className="max-h-64 overflow-y-auto overscroll-contain">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-6 py-4 text-xl
                           hover:bg-blue-100
                           border-b last:border-none"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
