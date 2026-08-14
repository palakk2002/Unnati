import React, { useMemo, useState } from 'react';

export interface LocationFilterState {
  filterType: 'all' | 'warehouse' | 'rack' | 'city' | 'room' | 'category';
  filterValue: string;
}

interface LocationFilterDropdownProps {
  items: any[];
  filterState: LocationFilterState;
  onChange: (newState: LocationFilterState) => void;
  className?: string;
  compact?: boolean;
}

export const LocationFilterDropdown: React.FC<LocationFilterDropdownProps> = ({
  items = [],
  filterState,
  onChange,
  className = '',
  compact = false,
}) => {
  const [isManualInput, setIsManualInput] = useState(false);

  // Extract unique options from current items
  const optionsMap = useMemo(() => {
    const warehouses = new Set<string>();
    const racks = new Set<string>();
    const cities = new Set<string>();
    const rooms = new Set<string>();
    const categories = new Set<string>();

    items.forEach((item) => {
      const loc = item.storageLocation || {};
      const wh = loc.warehouse || item.storageWarehouse;
      const rack = loc.rackNumber || item.rackNumber || item.storageRack;
      const city = loc.city || item.storageCity;
      const room = loc.room || item.storageRoom;
      const cat = typeof item.category === 'object' ? item.category?.name : (item.category || item.categoryName);

      if (wh && typeof wh === 'string' && wh.trim() !== '-' && wh.trim() !== '') {
        warehouses.add(wh.trim());
      }
      if (rack && typeof rack === 'string' && rack.trim() !== '-' && rack.trim() !== '') {
        racks.add(rack.trim());
      }
      if (city && typeof city === 'string' && city.trim() !== '-' && city.trim() !== '') {
        cities.add(city.trim());
      }
      if (room && typeof room === 'string' && room.trim() !== '-' && room.trim() !== '') {
        rooms.add(room.trim());
      }
      if (cat && typeof cat === 'string' && cat.trim() !== '-' && cat.trim() !== '') {
        categories.add(cat.trim());
      }
    });

    return {
      warehouse: Array.from(warehouses).sort(),
      rack: Array.from(racks).sort(),
      city: Array.from(cities).sort(),
      room: Array.from(rooms).sort(),
      category: Array.from(categories).sort(),
    };
  }, [items]);

  const currentOptions = useMemo(() => {
    if (filterState.filterType === 'all') return [];
    return optionsMap[filterState.filterType] || [];
  }, [filterState.filterType, optionsMap]);

  const handleTypeChange = (type: LocationFilterState['filterType']) => {
    onChange({
      filterType: type,
      filterValue: '', // Reset value when changing category/type
    });
  };

  const handleValueChange = (val: string) => {
    if (val === '__custom__') {
      setIsManualInput(true);
      onChange({ ...filterState, filterValue: '' });
      return;
    }
    onChange({
      ...filterState,
      filterValue: val,
    });
  };

  const handleReset = () => {
    setIsManualInput(false);
    onChange({
      filterType: 'all',
      filterValue: '',
    });
  };

  const isFiltering = filterState.filterType !== 'all' && Boolean(filterState.filterValue);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Icon & Label */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-lg shrink-0 border border-gray-200">
        <svg className="w-4 h-4 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="hidden sm:inline">Filter:</span>
      </div>

      {/* Dropdown 1: Filter Type */}
      <select
        value={filterState.filterType}
        onChange={(e) => handleTypeChange(e.target.value as LocationFilterState['filterType'])}
        className={`text-xs font-medium bg-white border border-gray-300 rounded-lg ${
          compact ? 'px-2 py-1' : 'px-3 py-1.5'
        } focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-700 shadow-sm transition-all`}
      >
        <option value="all">📍 All Storage Locations</option>
        <option value="category">🏷️ By Category</option>
        <option value="warehouse">🏬 By Warehouse Name</option>
        <option value="rack">📦 By Rack Number</option>
        <option value="city">🏙️ By City / Region</option>
        <option value="room">🚪 By Room</option>
      </select>

      {/* Dropdown 2 or Custom Text Input: Filter Value */}
      {filterState.filterType !== 'all' && (
        <div className="flex items-center gap-1 min-w-[170px] relative">
          {!isManualInput && currentOptions.length > 0 ? (
            <div className="flex items-center gap-1 w-full">
              <select
                value={filterState.filterValue}
                onChange={(e) => handleValueChange(e.target.value)}
                className={`w-full text-xs font-semibold bg-white border border-[var(--primary-color)] rounded-lg ${
                  compact ? 'px-2 py-1' : 'px-3 py-1.5'
                } focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-800 shadow-sm transition-all`}
              >
                <option value="">
                  Select {filterState.filterType === 'category' ? 'Category' : filterState.filterType === 'warehouse' ? 'Warehouse' : filterState.filterType === 'rack' ? 'Rack No.' : filterState.filterType === 'city' ? 'City' : 'Room'}...
                </option>
                {currentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="__custom__">✍️ Type Manual / Custom...</option>
              </select>
              <button
                type="button"
                onClick={() => setIsManualInput(true)}
                className="px-2 py-1 bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg shrink-0"
                title="Type Manual Value"
              >
                ✏️
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 w-full">
              <input
                type="text"
                value={filterState.filterValue}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder={`Type manual ${filterState.filterType}...`}
                className={`w-full text-xs font-medium bg-white border border-[var(--primary-color)] rounded-lg ${
                  compact ? 'px-2 py-1' : 'px-3 py-1.5'
                } focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-800 shadow-sm`}
                autoFocus
              />
              {currentOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualInput(false)}
                  className="px-2 py-1 bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg shrink-0"
                  title="Switch to List Dropdown"
                >
                  📋
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reset Filter Button */}
      {isFiltering && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
          title="Clear Filter"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Clear</span>
        </button>
      )}
    </div>
  );
};

export function filterItemsByLocation<T>(
  items: T[],
  filterState: LocationFilterState
): T[] {
  if (!filterState || filterState.filterType === 'all' || !filterState.filterValue.trim()) {
    return items;
  }

  const query = filterState.filterValue.trim().toLowerCase();

  return items.filter((item: any) => {
    const loc = item.storageLocation || {};
    const rack = loc.rackNumber || item.rackNumber || item.storageRack || '';
    const wh = loc.warehouse || item.storageWarehouse || '';
    const city = loc.city || item.storageCity || '';
    const room = loc.room || item.storageRoom || '';
    const cat = typeof item.category === 'object' ? item.category?.name || '' : (item.category || item.categoryName || '');

    if (filterState.filterType === 'category') {
      return cat.toString().toLowerCase().includes(query);
    }
    if (filterState.filterType === 'warehouse') {
      return wh.toString().toLowerCase().includes(query);
    }
    if (filterState.filterType === 'rack') {
      return rack.toString().toLowerCase().includes(query);
    }
    if (filterState.filterType === 'city') {
      return city.toString().toLowerCase().includes(query);
    }
    if (filterState.filterType === 'room') {
      return room.toString().toLowerCase().includes(query);
    }
    return true;
  });
}
