import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Check, Globe, Loader2 } from 'lucide-react';
import { GeoLocation } from '../types';
import { searchCitiesFreeAPI, POPULAR_CITIES } from '../services/vedicAstrologyEngine';

interface CityAutocompleteProps {
  selectedLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  label?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  selectedLocation,
  onSelectLocation,
  label = 'Birth City & Country (Live Geocoding API)',
}) => {
  const [query, setQuery] = useState(
    `${selectedLocation.name}${selectedLocation.admin1 ? `, ${selectedLocation.admin1}` : ''}, ${selectedLocation.country}`
  );
  const [results, setResults] = useState<GeoLocation[]>(POPULAR_CITIES.slice(0, 5));
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(
      `${selectedLocation.name}${selectedLocation.admin1 ? `, ${selectedLocation.admin1}` : ''}, ${selectedLocation.country}`
    );
  }, [selectedLocation]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced API search
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      const list = await searchCitiesFreeAPI(query.split(',')[0]);
      setResults(list);
      setIsSearching(false);
    }, 260);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-[#C4B5A6] flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gold-400" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] font-mono text-emerald-400">
          {selectedLocation.latitude.toFixed(2)}°N, {selectedLocation.longitude.toFixed(2)}°E
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search any city or town worldwide..."
          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-cosmic-950 border border-white/15 text-sm text-white placeholder-[#C4B5A6]/50 focus:outline-none focus:border-gold-400"
        />
        <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
        {isSearching && (
          <Loader2 className="w-4 h-4 text-gold-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl bg-[#18122B] border border-gold-400/40 shadow-2xl max-h-60 overflow-y-auto divide-y divide-white/5">
          <div className="px-3 py-1.5 bg-black/30 flex items-center justify-between text-[10px] font-mono text-gold-300">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> Open-Meteo Global Ephemeris Geocoder
            </span>
            <span>Lat / Lon / TZ</span>
          </div>

          {results.length === 0 ? (
            <div className="p-3 text-xs text-[#C4B5A6] text-center">
              No matching city found. Try typing city name only.
            </div>
          ) : (
            results.map((loc) => {
              const isSelected =
                loc.name === selectedLocation.name &&
                Math.abs(loc.latitude - selectedLocation.latitude) < 0.05;

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-saffron-500/20 flex items-center justify-between gap-2 transition"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>{loc.name}</span>
                      {loc.admin1 && (
                        <span className="text-[#C4B5A6] font-normal">({loc.admin1})</span>
                      )}
                    </p>
                    <p className="text-[10px] text-gold-300 font-mono">
                      {loc.country} • {loc.timezone} (UTC{loc.utcOffsetHours >= 0 ? '+' : ''}
                      {loc.utcOffsetHours})
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-emerald-300 block">
                      {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 ml-auto mt-0.5" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
