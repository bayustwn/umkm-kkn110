import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix untuk icon Leaflet di React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
    mapStyle?: 'cartodb' | 'osm' | 'satellite';
}

export default function MapPicker({ onLocationSelect, initialLat = -7.2591052, initialLng = 112.6764528, mapStyle = 'cartodb' }: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [coordinates, setCoordinates] = useState({ lat: initialLat, lng: initialLng });
    const [currentMapStyle, setCurrentMapStyle] = useState(mapStyle);

    // Update currentMapStyle jika mapStyle prop berubah
    useEffect(() => {
        setCurrentMapStyle(mapStyle);
    }, [mapStyle]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Inisialisasi map
        const map = L.map(mapRef.current).setView([initialLat, initialLng], 17);
        mapInstanceRef.current = map;

        // Pilih tile layer berdasarkan currentMapStyle
        let tileLayer: L.TileLayer;
        
        switch (currentMapStyle) {
            case 'satellite':
                tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '© Esri',
                    maxZoom: 19
                });
                break;
            case 'osm':
                tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                });
                break;
            case 'cartodb':
            default:
                tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '© OpenStreetMap contributors, © CartoDB',
                    subdomains: 'abcd',
                    maxZoom: 19
                });
                break;
        }
        
        tileLayer.addTo(map);

        // Tambahkan marker awal
        const marker = L.marker([initialLat, initialLng]).addTo(map);
        markerRef.current = marker;

        // Event listener untuk klik pada map
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            setCoordinates({ lat, lng });
            
            // Update marker position tanpa mengubah zoom
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            }
            
            // Callback ke parent component
            onLocationSelect(lat, lng);
        });

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [initialLat, initialLng, onLocationSelect, currentMapStyle]);

    // Effect untuk mengupdate map style (hanya saat user mengubah style)
    useEffect(() => {
        if (mapInstanceRef.current && currentMapStyle !== mapStyle) {
            // Remove existing tile layers
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof L.TileLayer) {
                    mapInstanceRef.current!.removeLayer(layer);
                }
            });

            // Add new tile layer berdasarkan currentMapStyle
            let tileLayer: L.TileLayer;
            switch (currentMapStyle) {
                case 'satellite':
                    tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                        attribution: '© Esri',
                        maxZoom: 19
                    });
                    break;
                case 'osm':
                    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19
                    });
                    break;
                case 'cartodb':
                default:
                    tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                        attribution: '© OpenStreetMap contributors, © CartoDB',
                        subdomains: 'abcd',
                        maxZoom: 19
                    });
                    break;
            }
            tileLayer.addTo(mapInstanceRef.current);
        }
    }, [currentMapStyle, mapStyle]);

    return (
        <div className="w-full">
            <div className="mb-4">
                <label className="block text-xl font-semibold text-black mb-2">
                    Pilih Lokasi di Peta
                </label>
                <div className="text-sm text-gray-600 mb-2">
                    Klik pada peta untuk memilih lokasi UMKM
                </div>
                
                {/* Map Style Selector */}
                <div className="flex gap-2 mt-3">
                    <button
                        type="button"
                        onClick={() => setCurrentMapStyle('cartodb')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            currentMapStyle === 'cartodb' 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Street
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentMapStyle('satellite')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            currentMapStyle === 'satellite' 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Satellite
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentMapStyle('osm')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            currentMapStyle === 'osm' 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        OSM
                    </button>
                </div>
            </div>
            
            <div 
                ref={mapRef} 
                className="w-full h-64 md:h-80 border border-gray-300 rounded-lg"
                style={{ zIndex: 1 }}
            />
            
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                    <strong>Koordinat yang dipilih:</strong>
                </div>
                <div className="text-sm font-mono">
                    Latitude: {coordinates.lat.toFixed(6)}
                </div>
                <div className="text-sm font-mono">
                    Longitude: {coordinates.lng.toFixed(6)}
                </div>
            </div>
        </div>
    );
} 