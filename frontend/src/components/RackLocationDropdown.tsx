import React, { useState, useRef, useEffect } from 'react';

export interface StorageLocationInfo {
  city?: string;
  warehouse?: string;
  room?: string;
  rackNumber?: string;
}

interface RackLocationDropdownProps {
  item: {
    rackNumber?: string;
    storageRack?: string;
    storageCity?: string;
    storageWarehouse?: string;
    storageRoom?: string;
    storageLocation?: StorageLocationInfo;
  };
  onUpdateRack: (newRack: string) => void;
  availableRacks?: string[];
  displayAttribute?: 'rack' | 'city' | 'warehouse' | 'room';
}

const DEFAULT_RACKS = [
  'Rack-101',
  'Rack-102',
  'Rack-103',
  'Rack-201',
  'Rack-202',
  'Rack-205',
  'Rack-301',
  'Rack-A',
  'Rack-B',
];

export const RackLocationDropdown: React.FC<RackLocationDropdownProps> = ({
  item,
  onUpdateRack,
  availableRacks = DEFAULT_RACKS,
  displayAttribute = 'rack',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loc = item.storageLocation || {};
  const currentRack = loc.rackNumber || item.rackNumber || item.storageRack || '';

  const city = loc.city || item.storageCity || '';
  const warehouse = loc.warehouse || item.storageWarehouse || '';
  const room = loc.room || item.storageRoom || '';

  const getDisplayText = () => {
    switch (displayAttribute) {
      case 'city':
        return city.trim() ? city : '-';
      case 'warehouse':
        return warehouse.trim() ? warehouse : '-';
      case 'room':
        return room.trim() ? room : '-';
      case 'rack':
      default:
        return currentRack.trim() ? currentRack : '-';
    }
  };

  const displayText = getDisplayText();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let val = e.target.value;
    if (val === '__custom__') {
      const customVal = window.prompt("Enter manual Rack Number (e.g. Rack-99):", currentRack);
      if (customVal !== null && customVal.trim()) {
        val = customVal.trim();
      } else {
        return;
      }
    }
    onUpdateRack(val);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Compact Rounded Gray Badge Button matching Image 2 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-7 px-2.5 rounded-lg border inline-flex items-center justify-center gap-1 transition-all text-xs font-semibold select-none min-w-[36px] ${
          isOpen
            ? 'bg-gray-200 border-gray-300 ring-2 ring-gray-300/40 text-gray-900'
            : 'bg-[#eeeff1] hover:bg-gray-200 border-gray-200/80 text-gray-700'
        }`}
        title="View Storage Location & Select Rack"
      >
        <span>{displayText}</span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-gray-600' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Popover Card matching Image 2 */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-1.5 left-1/2 -translate-x-1/2 min-w-[210px] bg-white rounded-xl shadow-xl border border-slate-200/90 p-3 text-slate-700 animate-in fade-in zoom-in-95 duration-100">
          <div className="text-xs font-semibold text-slate-800 pb-1 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Storage Location</span>
          </div>

          <div className="space-y-1.5 text-[11px] leading-tight">
            <div className="flex items-start justify-between text-slate-600 gap-2">
              <span className="font-medium text-slate-500 shrink-0">City:</span>
              <span className="font-semibold text-slate-800 text-right break-words">{city}</span>
            </div>
            <div className="flex items-start justify-between text-slate-600 gap-2">
              <span className="font-medium text-slate-500 shrink-0">Warehouse:</span>
              <span className="font-semibold text-slate-800 text-right break-words">{warehouse}</span>
            </div>
            <div className="flex items-start justify-between text-slate-600 gap-2">
              <span className="font-medium text-slate-500 shrink-0">Room:</span>
              <span className="font-semibold text-slate-800 text-right break-words">{room}</span>
            </div>

            <div className="flex items-center justify-between pt-1 gap-2">
              <span className="font-medium text-slate-500 shrink-0 whitespace-nowrap">Rack Number:</span>
              <select
                value={currentRack}
                onChange={handleSelectChange}
                className="h-7 px-1.5 bg-slate-100 border border-slate-300 hover:border-emerald-500 focus:border-emerald-500 rounded-md text-[11px] font-bold text-slate-800 outline-none cursor-pointer transition-all max-w-[100px]"
              >
                <option value="">-</option>
                {availableRacks.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                {currentRack &&
                  !['', ...availableRacks].includes(currentRack) && (
                    <option value={currentRack}>{currentRack}</option>
                  )}
                <option value="__custom__">✍️ Custom...</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
