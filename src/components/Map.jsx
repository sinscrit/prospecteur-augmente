import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Building2, Warehouse, ShoppingBag, Trees, Package } from 'lucide-react';

const PROPERTY_TYPES = [
  { id: 'bureau', labelFr: 'Bureau', abbr: 'BUR', icon: Building2 },
  { id: 'entrepot', labelFr: 'Entrepôt', abbr: 'ENT', icon: Warehouse },
  { id: 'commerce', labelFr: 'Commerce', abbr: 'COM', icon: ShoppingBag },
  { id: 'terrain', labelFr: 'Terrain', abbr: 'TER', icon: Trees },
  { id: 'atelier', labelFr: 'Atelier', abbr: 'ATE', icon: Package }
];

const STATUS_CONFIG = {
  'complet-bien_ok': { icon: '😊', color: '#22C55E', bg: '#DCFCE7', label: 'Complet' },
  'complet-a_reviser_1m': { icon: '😐', color: '#F59E0B', bg: '#FEF3C7', label: 'À réviser' },
  'complet-a_reviser_2m': { icon: '😠', color: '#F97316', bg: '#FED7AA', label: 'À réviser (2m)' },
  'incomplet-a_contacter': { icon: '📞', color: '#3B82F6', bg: '#DBEAFE', label: 'À contacter' },
  'incomplet-en_suspens': { icon: '💔', color: '#6B7280', bg: '#F3F4F6', label: 'En suspens' },
  'desactive-loue_vendu': { icon: '👎', color: '#EF4444', bg: '#FEE2E2', label: 'Loué/Vendu' },
  'desactive-contact_not_ok': { icon: '✋', color: '#EF4444', bg: '#FEE2E2', label: 'Contact refusé' }
};

const MapComponent = ({ properties, selectedId, onSelectProperty, onCloseInfoWindow, route }) => {
  const [hoveredId, setHoveredId] = useState(null);

  // Center on Brussels
  const defaultCenter = { lat: 50.8466, lng: 4.3528 };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-full relative bg-gray-100">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          className="w-full h-full"
          options={{
             disableDefaultUI: false,
             zoomControl: true,
             streetViewControl: false,
             mapTypeControl: false,
             fullscreenControl: false,
             clickableIcons: false,
          }}
        >
          {properties.map((prop) => {
             const status = STATUS_CONFIG[prop.statusKey];
             const isSelected = prop.id === selectedId;
             const routeIndex = route?.findIndex(r => r.id === prop.id);
             
             // Safety check for coordinates
             if (!prop.address || !prop.address.lat || !prop.address.lng) return null;

             return (
               <AdvancedMarker
                 key={prop.id}
                 position={{ lat: prop.address.lat, lng: prop.address.lng }}
                 onClick={() => onSelectProperty(prop.id)}
                 onMouseEnter={() => setHoveredId(prop.id)}
                 onMouseLeave={() => setHoveredId(null)}
                 zIndex={isSelected ? 100 : 1}
               >
                  <div className={`
                    rounded-full shadow-lg flex items-center justify-center border-2 transition-all duration-300
                    ${isSelected ? 'w-10 h-10 border-black z-50' : 'w-8 h-8 border-white hover:scale-110'}
                  `}
                  style={{ backgroundColor: status.color }}
                  >
                    {(() => {
                      const TypeIcon = PROPERTY_TYPES.find(t => t.id === prop.type)?.icon || Building2;
                      return <TypeIcon size={isSelected ? 20 : 16} className="text-white" />;
                    })()}
                    
                    {routeIndex !== undefined && routeIndex >= 0 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-900 border border-white z-50">
                            {routeIndex + 1}
                        </div>
                    )}
                  </div>
               </AdvancedMarker>
             );
          })}
          
          {selectedId && (() => {
            const prop = properties.find(p => p.id === selectedId);
            if (!prop) return null;
            const propertyType = PROPERTY_TYPES.find(t => t.id === prop.type);

            return (
              <InfoWindow
                position={{ lat: prop.address.lat, lng: prop.address.lng }}
                onCloseClick={() => onCloseInfoWindow ? onCloseInfoWindow() : onSelectProperty(null)}
                headerContent={<div className="font-bold text-sm">{prop.address.street} {prop.address.number}</div>}
              >
                <div className="p-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs font-medium text-gray-500">{propertyType?.labelFr || 'N/A'}</span>
                         <span className="text-xs text-gray-400">•</span>
                         <span className="text-xs font-medium text-gray-500">{prop.address.commune}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-sm font-semibold">{prop.surface}m²</span>
                        <span className="text-sm font-bold text-blue-900">{prop.price?.toLocaleString()}€</span>
                    </div>
                </div>
              </InfoWindow>
            );
          })()}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
