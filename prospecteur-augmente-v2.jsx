import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Wifi, WifiOff, RefreshCw, Check, Clock, AlertTriangle, XCircle, ChevronLeft, ChevronRight, X, FileText, Image, Layers, User, Settings, Plus, Trash2, Upload, Star, GripVertical, Sparkles, Globe, Home, List, Map, Filter, RotateCcw, Navigation, Eye, Edit3, Save, Send, Menu, Search, ChevronDown, Phone, Mail, Building2, Package, ShoppingBag, Warehouse, Trees, Camera, MoreVertical, Zap, Cloud, CloudOff, CheckCircle2, Info, Bell } from 'lucide-react';

// ==================== DESIGN TOKENS ====================
const colors = {
  // Primary - Deep Corporate Blue
  primary: '#1E3A5F',
  primaryLight: '#2B4F7E',
  primaryDark: '#152A45',
  
  // Accent - Vibrant Green for positive states
  success: '#22C55E',
  successLight: '#DCFCE7',
  successDark: '#16A34A',
  
  // AI Feature - Soft Indigo
  ai: '#6366F1',
  aiLight: '#EEF2FF',
  aiMedium: '#C7D2FE',
  
  // Neutral
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status colors
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
};

// ==================== MOCK DATA ====================
const BRUSSELS_COMMUNES = ['Anderlecht', 'Auderghem', 'Berchem-Sainte-Agathe', 'Bruxelles', 'Etterbeek', 'Evere', 'Forest', 'Ganshoren', 'Ixelles', 'Jette', 'Koekelberg', 'Molenbeek-Saint-Jean', 'Saint-Gilles', 'Saint-Josse-ten-Noode', 'Schaerbeek', 'Uccle', 'Watermael-Boitsfort', 'Woluwe-Saint-Lambert', 'Woluwe-Saint-Pierre'];

const PROPERTY_TYPES = [
  { id: 'bureau', labelFr: 'Bureau', abbr: 'BUR', icon: Building2 },
  { id: 'entrepot', labelFr: 'Entrepôt', abbr: 'ENT', icon: Warehouse },
  { id: 'commerce', labelFr: 'Commerce', abbr: 'COM', icon: ShoppingBag },
  { id: 'terrain', labelFr: 'Terrain', abbr: 'TER', icon: Trees },
  { id: 'atelier', labelFr: 'Atelier', abbr: 'ATE', icon: Package }
];

const STATUS_CONFIG = {
  'complet-bien_ok': { icon: '😊', color: colors.success, bg: colors.successLight, label: 'Complet' },
  'complet-a_reviser_1m': { icon: '😐', color: colors.warning, bg: colors.warningLight, label: 'À réviser' },
  'complet-a_reviser_2m': { icon: '😠', color: '#F97316', bg: '#FED7AA', label: 'À réviser (2m)' },
  'incomplet-a_contacter': { icon: '📞', color: colors.info, bg: colors.infoLight, label: 'À contacter' },
  'incomplet-en_suspens': { icon: '💔', color: colors.gray500, bg: colors.gray100, label: 'En suspens' },
  'desactive-loue_vendu': { icon: '👎', color: colors.error, bg: colors.errorLight, label: 'Loué/Vendu' },
  'desactive-contact_not_ok': { icon: '✋', color: colors.error, bg: colors.errorLight, label: 'Contact refusé' }
};

const MOCK_PROPERTIES = [
  {
    id: 'bien-001',
    statusKey: 'incomplet-a_contacter',
    address: { full: 'Rue de la Loi 42, 1000 Bruxelles', street: 'Rue de la Loi', number: '42', postalCode: '1000', commune: 'Bruxelles', lat: 50.8466, lng: 4.3528 },
    type: 'bureau', transaction: 'location', surface: 250, price: 3500,
    descriptions: { fr: '', nl: '', isGenerated: false },
    characteristics: { etat: 'Bon état', equipements: ['Bureaux intégrés', 'Sanitaires'], atouts: ['Proche Ring'] },
    photos: [],
    contact: { name: 'Immobilière Centrale', phone: '+32 2 123 45 67', type: 'agence' },
    assignedTo: { initials: 'JD', name: 'Jean Dupont' },
    lastModifiedAt: new Date('2025-01-03')
  },
  {
    id: 'bien-002',
    statusKey: 'complet-bien_ok',
    address: { full: 'Avenue Louise 120, 1050 Ixelles', street: 'Avenue Louise', number: '120', postalCode: '1050', commune: 'Ixelles', lat: 50.8322, lng: 4.3619 },
    type: 'commerce', transaction: 'location', surface: 180, price: 4200,
    descriptions: { fr: 'Magnifique espace commercial sur l\'Avenue Louise avec grande vitrine et excellente visibilité.', nl: 'Prachtige commerciÃ«le ruimte op de Louisalaan met grote etalage en uitstekende zichtbaarheid.', isGenerated: true },
    characteristics: { etat: 'Neuf', equipements: ['Parking', 'Sanitaires', 'Chauffage'], atouts: ['Accès PMR'] },
    photos: [{ id: 'p1', ordre: 1, isPrincipal: true }, { id: 'p2', ordre: 2, isPrincipal: false }],
    contact: { name: 'Marie Martin', phone: '+32 475 123 456', type: 'particulier' },
    assignedTo: { initials: 'JD', name: 'Jean Dupont' },
    lastModifiedAt: new Date('2025-01-05')
  },
  {
    id: 'bien-003',
    statusKey: 'complet-a_reviser_1m',
    address: { full: 'Rue du Marché 15, 1000 Bruxelles', street: 'Rue du Marché', number: '15', postalCode: '1000', commune: 'Bruxelles', lat: 50.8485, lng: 4.3513 },
    type: 'entrepot', transaction: 'vente', surface: 500, price: 450000,
    descriptions: { fr: 'Entrepôt spacieux idéal pour logistique...', nl: 'Ruim magazijn ideaal voor logistiek...', isGenerated: true },
    characteristics: { etat: 'Bon état', equipements: ['Quai de chargement', 'Chauffage'], atouts: ['Proche Ring', 'Hauteur libre >6m'] },
    photos: [{ id: 'p3', ordre: 1, isPrincipal: true }],
    contact: { name: 'Pierre Dubois', phone: '+32 2 987 65 43', type: 'agence' },
    assignedTo: { initials: 'AB', name: 'Anne Bernard' },
    lastModifiedAt: new Date('2024-12-15')
  },
  {
    id: 'bien-004',
    statusKey: 'incomplet-en_suspens',
    address: { full: 'Boulevard Général Jacques 50, 1050 Ixelles', street: 'Boulevard Général Jacques', number: '50', postalCode: '1050', commune: 'Ixelles', lat: 50.8234, lng: 4.3892 },
    type: 'atelier', transaction: 'location', surface: 320, price: 2800,
    descriptions: { fr: '', nl: '', isGenerated: false },
    characteristics: { etat: 'À rénover', equipements: [], atouts: ['Sol renforcé'] },
    photos: [],
    contact: null,
    assignedTo: { initials: 'JD', name: 'Jean Dupont' },
    lastModifiedAt: new Date('2025-01-02')
  },
  {
    id: 'bien-005',
    statusKey: 'desactive-loue_vendu',
    address: { full: 'Chaussée de Charleroi 88, 1060 Saint-Gilles', street: 'Chaussée de Charleroi', number: '88', postalCode: '1060', commune: 'Saint-Gilles', lat: 50.8289, lng: 4.3467 },
    type: 'commerce', transaction: 'location', surface: 95, price: 1800,
    descriptions: { fr: 'Petit commerce de quartier bien situé.', nl: 'Goed gelegen kleine buurtwinkel.', isGenerated: false },
    characteristics: { etat: 'Bon état', equipements: ['Sanitaires'], atouts: [] },
    photos: [{ id: 'p4', ordre: 1, isPrincipal: true }],
    contact: { name: 'Sophie Laurent', phone: '+32 476 789 012', type: 'particulier' },
    assignedTo: { initials: 'AB', name: 'Anne Bernard' },
    lastModifiedAt: new Date('2024-11-20')
  }
];

const MOCK_AI_RESPONSE = {
  fr: "Magnifique entrepôt de 500m² en excellent état, idéalement situé à proximité du Ring de Bruxelles. Cet espace professionnel offre une hauteur libre exceptionnelle de plus de 6 mètres, parfait pour les activités logistiques et de stockage. Ã‰quipé d'un quai de chargement pratique et d'un système de chauffage performant, ce bien répond aux exigences des entreprises modernes.",
  nl: "Prachtig magazijn van 500m² in uitstekende staat, ideaal gelegen nabij de Brusselse Ring. Deze professionele ruimte biedt een uitzonderlijke vrije hoogte van meer dan 6 meter, perfect voor logistieke en opslagactiviteiten. Uitgerust met een praktisch laadperron en een efficiÃ«nt verwarmingssysteem, voldoet dit pand aan de eisen van moderne bedrijven."
};

// ==================== TOAST NOTIFICATION SYSTEM ====================
const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up ${
          toast.type === 'success' ? 'bg-white border-l-4 border-green-500' :
          toast.type === 'error' ? 'bg-white border-l-4 border-red-500' :
          toast.type === 'ai' ? 'bg-indigo-50 border-l-4 border-indigo-500' :
          'bg-white border-l-4 border-blue-500'
        }`}
        style={{ minWidth: '320px' }}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          toast.type === 'success' ? 'bg-green-100' :
          toast.type === 'error' ? 'bg-red-100' :
          toast.type === 'ai' ? 'bg-indigo-100' :
          'bg-blue-100'
        }`}>
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-green-600" />}
          {toast.type === 'error' && <XCircle size={18} className="text-red-600" />}
          {toast.type === 'ai' && <Sparkles size={18} className="text-indigo-600" />}
          {toast.type === 'info' && <Info size={18} className="text-blue-600" />}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm">{toast.title}</p>
          {toast.message && <p className="text-gray-500 text-xs mt-0.5">{toast.message}</p>}
        </div>
        <button onClick={() => onDismiss(toast.id)} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// ==================== HEADER COMPONENTS ====================
const ConnectionStatus = ({ isOnline }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
    isOnline ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
  }`}>
    {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
    {isOnline ? 'ONLINE' : 'OFFLINE'}
  </div>
);

const SyncStatus = ({ status, pendingCount, onClick }) => {
  const configs = {
    synced: { icon: Cloud, text: 'Synced', color: 'text-green-600', bg: 'bg-green-50' },
    syncing: { icon: RefreshCw, text: 'Syncing...', color: 'text-blue-600', bg: 'bg-blue-50', animate: true },
    pending: { icon: Clock, text: `${pendingCount} pending`, color: 'text-amber-600', bg: 'bg-amber-50' },
    error: { icon: CloudOff, text: 'Sync error', color: 'text-red-600', bg: 'bg-red-50' }
  };
  const config = configs[status];
  const Icon = config.icon;

  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${config.bg} ${config.color} hover:opacity-80 transition-opacity`}>
      <Icon size={14} className={config.animate ? 'animate-spin' : ''} />
      {config.text}
    </button>
  );
};

// ==================== MAP COMPONENTS ====================
const MapView = ({ properties, selectedId, onSelectProperty, route }) => {
  const getPosition = (prop) => {
    const baseX = 15 + (prop.address.lng - 4.34) * 900;
    const baseY = 15 + (50.85 - prop.address.lat) * 900;
    return { x: Math.max(8, Math.min(92, baseX)), y: Math.max(8, Math.min(92, baseY)) };
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Map Background - Simplified street pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#F3F4F6"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        
        {/* Simulated streets */}
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#D1D5DB" strokeWidth="8"/>
        <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#D1D5DB" strokeWidth="6"/>
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#D1D5DB" strokeWidth="6"/>
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#D1D5DB" strokeWidth="8"/>
        <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#D1D5DB" strokeWidth="4"/>
      </svg>

      {/* Brussels region label */}
      <div className="absolute top-4 left-4 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <span className="text-sm font-semibold text-gray-700">Région de Bruxelles-Capitale</span>
      </div>

      {/* Route polyline */}
      {route && route.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {route.map((prop, i) => {
            if (i === route.length - 1) return null;
            const pos1 = getPosition(prop);
            const pos2 = getPosition(route[i + 1]);
            return (
              <g key={`route-${i}`}>
                <line
                  x1={`${pos1.x}%`} y1={`${pos1.y}%`}
                  x2={`${pos2.x}%`} y2={`${pos2.y}%`}
                  stroke={colors.primary}
                  strokeWidth="4"
                  strokeDasharray="12,6"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>
      )}

      {/* Property Markers */}
      {properties.map((prop) => {
        const status = STATUS_CONFIG[prop.statusKey];
        const propertyType = PROPERTY_TYPES.find(t => t.id === prop.type);
        const TypeIcon = propertyType?.icon || Building2;
        const pos = getPosition(prop);
        const isSelected = prop.id === selectedId;
        const routeIndex = route?.findIndex(r => r.id === prop.id);

        return (
          <div
            key={prop.id}
            onClick={() => onSelectProperty(prop.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 ${isSelected ? 'z-30 scale-110' : 'z-10 hover:z-20 hover:scale-105'}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {/* Pin shape */}
            <div className="relative">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border-3 transition-all ${isSelected ? 'ring-4 ring-blue-200' : ''}`}
                style={{ 
                  backgroundColor: status.bg, 
                  borderColor: status.color,
                  borderWidth: '3px'
                }}
              >
                {status.icon}
              </div>
              {/* Property type badge */}
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-200"
                title={propertyType?.labelFr}
              >
                <TypeIcon size={12} className="text-gray-600" />
              </div>
              {/* Pin tail */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  top: '36px',
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `10px solid ${status.color}`
                }}
              />
              {/* Route number badge */}
              {routeIndex !== undefined && routeIndex >= 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: colors.primary }}>
                  {routeIndex + 1}
                </div>
              )}
            </div>

            {/* Info popup on selection */}
            {isSelected && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-xl shadow-xl p-4 min-w-[240px] border border-gray-100">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45" />
                <div className="flex items-center gap-2 mb-1">
                  <TypeIcon size={14} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">{propertyType?.labelFr || 'N/A'}</span>
                </div>
                <p className="font-semibold text-gray-800">{prop.address.street} {prop.address.number}</p>
                <p className="text-sm text-gray-500">{prop.address.commune}</p>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{prop.surface}m²</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm font-semibold" style={{ color: colors.primary }}>{prop.price?.toLocaleString()}€</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Map controls */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
          <Plus size={20} className="text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
          <span className="text-gray-600 text-xl font-light">−</span>
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
          <Navigation size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// ==================== SLIDE-OUT PANEL ====================
const SlideOutPanel = ({ isOpen, onClose, property, onSave, connectivity, addToast }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiStatus, setAiStatus] = useState('idle');
  const [descriptions, setDescriptions] = useState(property?.descriptions || { fr: '', nl: '', isGenerated: false });
  const [photos, setPhotos] = useState(property?.photos || []);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (property) {
      setDescriptions(property.descriptions);
      setPhotos(property.photos);
      setIsDirty(false);
      setAiStatus(property.descriptions.isGenerated ? 'complete' : 'idle');
    }
  }, [property?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    setIsDirty(false);
    addToast({
      type: connectivity.isOnline ? 'success' : 'info',
      title: connectivity.isOnline ? 'Modifications enregistrées' : 'Sauvegardé localement',
      message: connectivity.isOnline ? 'Synchronisation réussie' : 'Sera synchronisé une fois en ligne'
    });
  };

  const handleAIGenerate = async () => {
    setAiStatus('generating');
    addToast({ type: 'ai', title: 'Génération IA en cours', message: 'Création de la description...' });
    await new Promise(r => setTimeout(r, 2500));
    setDescriptions({ ...MOCK_AI_RESPONSE, isGenerated: true });
    setAiStatus('complete');
    setIsDirty(true);
    addToast({ type: 'ai', title: 'Description générée !', message: 'FR & NL créées avec succès' });
  };

  const handlePhotoUpload = async () => {
    addToast({ type: 'info', title: 'Photo détectée', message: autoRotate ? 'Auto-rotation appliquée â†»' : 'Traitement en cours...' });
    await new Promise(r => setTimeout(r, 1500));
    setPhotos([...photos, { id: `p-${Date.now()}`, ordre: photos.length + 1, isPrincipal: photos.length === 0 }]);
    setIsDirty(true);
    addToast({ type: 'success', title: 'Photo ajoutée', message: 'Glissez pour réorganiser' });
  };

  if (!property) return null;

  const status = STATUS_CONFIG[property.statusKey];
  const typeConfig = PROPERTY_TYPES.find(t => t.id === property.type);
  const completeness = descriptions.fr ? 85 : 45;

  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-out z-40 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '480px' }}>
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronRight size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="px-2 py-1 bg-amber-400 text-amber-900 text-xs font-semibold rounded-full">
                Non enregistré
              </span>
            )}
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <MoreVertical size={18} className="text-white" />
            </button>
          </div>
        </div>
        
        <h2 className="text-lg font-bold text-white">{property.address.street} {property.address.number}</h2>
        <p className="text-white/70 text-sm">{property.address.postalCode} {property.address.commune}</p>
        
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: status.bg, color: status.color }}>
            {status.icon} {status.label}
          </span>
          <span className="text-white/80 text-sm flex items-center gap-1">
            {typeConfig && <typeConfig.icon size={14} />}
            {typeConfig?.labelFr}
          </span>
          <span className="text-white/80 text-sm">{property.surface}m²</span>
        </div>

        {/* Completeness bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Complétude</span>
            <span>{completeness}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${completeness}%`, 
                backgroundColor: completeness === 100 ? colors.success : completeness >= 70 ? colors.warning : colors.error 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4">
        {[
          { id: 'info', label: 'Informations', icon: FileText },
          { id: 'photos', label: 'Photos', icon: Camera },
          { id: 'contact', label: 'Contact', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Détails du bien</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Type</label>
                  <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {PROPERTY_TYPES.map(t => (
                      <option key={t.id} value={t.id} selected={t.id === property.type}>{t.labelFr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Transaction</label>
                  <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="location">Location</option>
                    <option value="vente">Vente</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Surface (m²)</label>
                  <input 
                    type="number" 
                    defaultValue={property.surface} 
                    onChange={() => setIsDirty(true)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Prix (â‚¬)</label>
                  <input 
                    type="number" 
                    defaultValue={property.price}
                    onChange={() => setIsDirty(true)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Caractéristiques</h3>
              <div className="flex flex-wrap gap-2">
                {['Parking', 'Quai', 'Bureaux', 'WC', 'Chauffage', 'Accès PMR'].map(item => (
                  <label key={item} className="cursor-pointer">
                    <input type="checkbox" className="peer hidden" onChange={() => setIsDirty(true)} />
                    <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 peer-checked:bg-blue-100 peer-checked:text-blue-700 transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Description Section - Distinctive indigo styling */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.aiLight }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: colors.aiMedium }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={18} style={{ color: colors.ai }} />
                  <span className="font-semibold text-sm" style={{ color: colors.ai }}>Description IA</span>
                </div>
                {aiStatus === 'complete' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/60" style={{ color: colors.ai }}>
                    âœ“ Générée
                  </span>
                )}
              </div>
              
              <div className="p-4 space-y-4">
                {aiStatus === 'idle' && (
                  <button
                    onClick={handleAIGenerate}
                    className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.ai }}
                  >
                    <Sparkles size={18} />
                    Générer avec l'IA
                  </button>
                )}

                {aiStatus === 'generating' && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-sm text-indigo-600 font-medium">Génération en cours...</span>
                  </div>
                )}

                {(aiStatus === 'complete' || descriptions.fr) && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-indigo-700 mb-1 block">Français</label>
                      <textarea
                        value={descriptions.fr}
                        onChange={(e) => { setDescriptions({...descriptions, fr: e.target.value}); setIsDirty(true); }}
                        rows={4}
                        className="w-full px-3 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-indigo-700 mb-1 block">Nederlands</label>
                      <textarea
                        value={descriptions.nl}
                        onChange={(e) => { setDescriptions({...descriptions, nl: e.target.value}); setIsDirty(true); }}
                        rows={4}
                        className="w-full px-3 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            {/* Auto-rotate toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <RotateCcw size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Auto-rotate</span>
              </div>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`relative w-11 h-6 rounded-full transition-colors ${autoRotate ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoRotate ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Drop zone */}
            <div
              onClick={handlePhotoUpload}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Cliquez pour ajouter</span> ou glissez-déposez
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 10MB</p>
            </div>

            {/* Photo grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative group aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-3xl text-gray-400">
                      <Camera size={32} />
                    </div>
                    <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                      {i + 1}
                    </div>
                    {photo.isPrincipal && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white rounded-lg">
                        <GripVertical size={16} className="text-gray-600" />
                      </button>
                      <button className="p-2 bg-white rounded-lg">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            {property.contact ? (
              <>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{property.contact.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{property.contact.type}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      {property.contact.phone}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Nom</label>
                    <input 
                      type="text" 
                      defaultValue={property.contact.name}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Téléphone</label>
                    <input 
                      type="tel" 
                      defaultValue={property.contact.phone}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 mb-4">Aucun contact associé</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  + Ajouter un contact
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isDirty 
                ? 'text-white hover:opacity-90' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            style={{ backgroundColor: isDirty ? colors.primary : undefined }}
          >
            {isSaving ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} />
                Enregistrer
              </>
            )}
          </button>
          <button 
            disabled={completeness < 100}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              completeness >= 100
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
            Publier
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== FILTER BAR ====================
const FilterBar = ({ filters, onChange, propertyCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-gray-500" />
          <span className="font-medium text-gray-800">Filtres</span>
          {(filters.types.length > 0 || filters.statuses.length > 0) && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {filters.types.length + filters.statuses.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{propertyCount} biens</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronDown size={18} className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 py-4 border-t border-gray-100 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">Type de bien</label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map(type => {
                const Icon = type.icon;
                const isActive = filters.types.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      const newTypes = isActive 
                        ? filters.types.filter(t => t !== type.id)
                        : [...filters.types, type.id];
                      onChange({ ...filters, types: newTypes });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ backgroundColor: isActive ? colors.primary : undefined }}
                  >
                    <Icon size={14} />
                    {type.labelFr}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).slice(0, 5).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    const newStatuses = filters.statuses.includes(key)
                      ? filters.statuses.filter(s => s !== key)
                      : [...filters.statuses, key];
                    onChange({ ...filters, statuses: newStatuses });
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    filters.statuses.includes(key) ? 'ring-2 ring-offset-1' : ''
                  }`}
                  style={{ 
                    backgroundColor: config.bg, 
                    color: config.color,
                    ringColor: filters.statuses.includes(key) ? config.color : undefined
                  }}
                >
                  {config.icon} {config.label}
                </button>
              ))}
            </div>
          </div>

          {(filters.types.length > 0 || filters.statuses.length > 0) && (
            <button 
              onClick={() => onChange({ types: [], statuses: [], communes: [] })}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RotateCcw size={14} />
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== ROUTE PANEL ====================
const RoutePanel = ({ route, onClear, onGenerate, isGenerating, canGenerate }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
    {!route ? (
      <button
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
          canGenerate && !isGenerating
            ? 'text-white hover:opacity-90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        style={{ backgroundColor: canGenerate && !isGenerating ? colors.primary : undefined }}
      >
        {isGenerating ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            Calcul en cours...
          </>
        ) : (
          <>
            <Navigation size={18} />
            Générer Itinéraire
          </>
        )}
      </button>
    ) : (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Itinéraire</h3>
          <button onClick={onClear} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-gray-50 rounded-xl">
            <p className="text-xl font-bold" style={{ color: colors.primary }}>{route.length}</p>
            <p className="text-xs text-gray-500">étapes</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl">
            <p className="text-xl font-bold" style={{ color: colors.primary }}>{(route.length * 1.2).toFixed(1)}</p>
            <p className="text-xs text-gray-500">km</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl">
            <p className="text-xl font-bold" style={{ color: colors.primary }}>{route.length * 8}</p>
            <p className="text-xs text-gray-500">min</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {route.map((prop, i) => (
            <div key={prop.id} className="flex items-center gap-2 text-sm py-1">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: colors.primary }}>
                {i + 1}
              </span>
              <span className="text-gray-700 truncate">{prop.address.street} {prop.address.number}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ==================== IMPORT MODAL ====================
const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const validateProperty = (prop, index) => {
    const errors = [];
    if (!prop.id) errors.push(`Property ${index + 1}: missing 'id'`);
    if (!prop.statusKey) errors.push(`Property ${index + 1}: missing 'statusKey'`);
    if (!prop.address || !prop.address.full) errors.push(`Property ${index + 1}: missing 'address.full'`);
    if (!prop.type) errors.push(`Property ${index + 1}: missing 'type'`);
    return errors;
  };

  const parseJavaScriptData = (text) => {
    let cleanText = text;
    
    // Try to find the MOCK_PROPERTIES array
    const mockPropsIndex = cleanText.indexOf('MOCK_PROPERTIES');
    if (mockPropsIndex !== -1) {
      const startBracket = cleanText.indexOf('[', mockPropsIndex);
      if (startBracket !== -1) {
        let depth = 0;
        let endBracket = -1;
        for (let i = startBracket; i < cleanText.length; i++) {
          if (cleanText[i] === '[') depth++;
          if (cleanText[i] === ']') depth--;
          if (depth === 0) {
            endBracket = i;
            break;
          }
        }
        if (endBracket !== -1) {
          cleanText = cleanText.substring(startBracket, endBracket + 1);
        }
      }
    }
    
    // Convert new Date(...) to string
    cleanText = cleanText.replace(/new Date\(['"]([\d\-]+)['"]\)/g, '"$1"');
    cleanText = cleanText.replace(/new Date\(\)/g, '"2024-01-01"');
    
    // Remove trailing commas
    cleanText = cleanText.replace(/,(\s*[\]}])/g, '$1');
    
    // Try to parse - if it fails, try with quote conversion
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      // Convert single quotes to double quotes
      cleanText = cleanText.replace(/'/g, '"');
      return JSON.parse(cleanText);
    }
  };

  const handleImport = () => {
    setError(null);
    
    if (!importText.trim()) {
      setError('Veuillez coller des données');
      return;
    }

    try {
      // Try JavaScript format first, then fall back to pure JSON
      let parsed;
      try {
        parsed = parseJavaScriptData(importText);
      } catch (jsError) {
        // Try pure JSON as fallback
        try {
          parsed = JSON.parse(importText);
        } catch (jsonError) {
          throw new Error(`Impossible de parser les données.\nEssayez de coller uniquement le tableau MOCK_PROPERTIES.\n\nDétails: ${jsError.message}`);
        }
      }
      
      // Check if it's an array
      if (!Array.isArray(parsed)) {
        setError('Les données doivent être un tableau de propriétés');
        return;
      }

      if (parsed.length === 0) {
        setError('Le tableau ne peut pas être vide');
        return;
      }

      // Validate each property
      const allErrors = [];
      parsed.forEach((prop, index) => {
        const propErrors = validateProperty(prop, index);
        allErrors.push(...propErrors);
      });

      if (allErrors.length > 0) {
        setError(`Erreurs de validation:\n${allErrors.slice(0, 5).join('\n')}${allErrors.length > 5 ? `\n... et ${allErrors.length - 5} autres` : ''}`);
        return;
      }

      // Convert date strings to Date objects if needed
      const processedData = parsed.map(prop => ({
        ...prop,
        lastModifiedAt: prop.lastModifiedAt ? new Date(prop.lastModifiedAt) : new Date(),
        lastValidatedAt: prop.lastValidatedAt ? new Date(prop.lastValidatedAt) : null
      }));

      onImport(processedData);
      setImportText('');
      setError(null);
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleClose = () => {
    setImportText('');
    setError(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.aiLight }}>
                <Upload size={20} style={{ color: colors.ai }} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Importer des données</h2>
                <p className="text-sm text-gray-500">Collez le contenu de mock-properties-data.js ou un tableau JSON</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Collez le contenu du fichier mock-properties-data.js ou un tableau JSON.

Formats acceptés:
• Fichier JS complet avec export const MOCK_PROPERTIES = [...]
• Tableau JSON simple: [{ "id": "BU-001", ... }]

Les dates (new Date('...')) seront automatiquement converties.`}
              className="flex-1 w-full p-4 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              style={{ minHeight: '300px' }}
            />
            
            {/* Error message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <pre className="text-sm text-red-700 whitespace-pre-wrap font-sans">{error}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Les données importées remplaceront les données existantes
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2"
                style={{ backgroundColor: colors.ai }}
              >
                <Upload size={16} />
                Importer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ==================== MAIN APPLICATION ====================
const ProspecteurAugmenteV2 = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [filters, setFilters] = useState({ types: [], statuses: [], communes: [] });
  const [route, setRoute] = useState(null);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Connectivity state
  const [connectivity, setConnectivity] = useState({ isOnline: true });
  const [syncStatus, setSyncStatus] = useState({ status: 'synced', pendingCount: 0 });

  // Properties state (replaces MOCK_PROPERTIES constant)
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  
  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredProperties = properties.filter(prop => {
    if (filters.types.length > 0 && !filters.types.includes(prop.type)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(prop.statusKey)) return false;
    return true;
  });

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  
  const handleImportData = (importedProperties) => {
    setProperties(importedProperties);
    setSelectedPropertyId(null);
    setIsPanelOpen(false);
    setRoute(null);
    addToast({ 
      type: 'success', 
      title: 'Données importées', 
      message: `${importedProperties.length} biens chargés avec succès` 
    });
  };

  const addToast = (toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleSelectProperty = (id) => {
    setSelectedPropertyId(id);
    setIsPanelOpen(true);
  };

  const handleGenerateRoute = async () => {
    setIsGeneratingRoute(true);
    addToast({ type: 'info', title: 'Calcul de l\'itinéraire', message: 'Optimisation en cours...' });
    await new Promise(r => setTimeout(r, 1500));
    setRoute(filteredProperties.slice(0, 4));
    setIsGeneratingRoute(false);
    addToast({ type: 'success', title: 'Itinéraire généré', message: `${Math.min(4, filteredProperties.length)} étapes optimisées` });
  };

  const toggleOffline = () => {
    const newOnline = !connectivity.isOnline;
    setConnectivity({ isOnline: newOnline });
    setSyncStatus(newOnline ? { status: 'synced', pendingCount: 0 } : { status: 'pending', pendingCount: 2 });
    addToast({
      type: newOnline ? 'success' : 'info',
      title: newOnline ? 'Connexion rétablie' : 'Mode hors ligne',
      message: newOnline ? 'Synchronisation terminée' : 'Les modifications seront synchronisées plus tard'
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Custom styles for animations */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between shadow-sm" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Prospecteur Augmenté</h1>
              <p className="text-white/60 text-xs">CityDev • Inventimmo</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Import button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-2"
            title="Importer des données"
          >
            <Settings size={14} />
            Importer
          </button>

          {/* Demo toggle */}
          <button
            onClick={toggleOffline}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-colors"
          >
            {connectivity.isOnline ? '🔴 Simuler hors ligne' : '🔶 Revenir en ligne'}
          </button>

          <ConnectionStatus isOnline={connectivity.isOnline} />
          <SyncStatus status={syncStatus.status} pendingCount={syncStatus.pendingCount} onClick={() => {}} />
          
          <div className="flex bg-white/10 rounded-lg overflow-hidden">
            <button className="px-3 py-1.5 text-white text-xs font-bold bg-white/20">FR</button>
            <button className="px-3 py-1.5 text-white/60 text-xs font-bold hover:bg-white/10">NL</button>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
            JD
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters & Route */}
        <div className="w-80 p-4 space-y-4 overflow-y-auto bg-gray-50 border-r border-gray-200">
          <FilterBar 
            filters={filters} 
            onChange={setFilters} 
            propertyCount={filteredProperties.length}
          />
          
          <RoutePanel
            route={route}
            onClear={() => setRoute(null)}
            onGenerate={handleGenerateRoute}
            isGenerating={isGeneratingRoute}
            canGenerate={filteredProperties.length > 0}
          />

          {/* Property List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">Biens filtrés</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {filteredProperties.map(prop => {
                const status = STATUS_CONFIG[prop.statusKey];
                const propertyType = PROPERTY_TYPES.find(t => t.id === prop.type);
                const TypeIcon = propertyType?.icon || Building2;
                const isSelected = prop.id === selectedPropertyId;
                return (
                  <div
                    key={prop.id}
                    onClick={() => handleSelectProperty(prop.id)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: status.bg }}>
                        {status.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800 text-sm truncate">{prop.address.street} {prop.address.number}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <TypeIcon size={12} className="text-gray-400" />
                          <span className="font-medium text-gray-600">{propertyType?.abbr || 'N/A'}</span>
                          <span>•</span>
                          <span>{prop.address.commune}</span>
                          <span>•</span>
                          <span>{prop.surface}m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapView
            properties={filteredProperties}
            selectedId={selectedPropertyId}
            onSelectProperty={handleSelectProperty}
            route={route}
          />
        </div>
      </div>

      {/* Slide-out Panel */}
      <SlideOutPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        property={selectedProperty}
        connectivity={connectivity}
        addToast={addToast}
      />

      {/* Panel Backdrop */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Import Modal */}
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportData}
      />
    </div>
  );
};

export default ProspecteurAugmenteV2;
