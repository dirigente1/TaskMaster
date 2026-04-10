import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Camera, X, MapPin, FileText, Car, Dog, Leaf, CheckCircle2 } from "lucide-react";
import { SANCTIONS_DATA } from "../utils/sanctions";
import { Agent } from "../types";

interface SanctionFormProps {
  agent: Agent;
  onSave: (data: any) => void;
}

export function SanctionForm({ agent, onSave }: SanctionFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<'stradali' | 'animali' | 'ambiente'>('stradali');
  const [selectedSanction, setSelectedSanction] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [plate, setPlate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSanction) {
      alert('Seleziona un\'infrazione');
      return;
    }
    if (!location) {
      alert('Inserisci il luogo dell\'infrazione');
      return;
    }

    const sanctionData = SANCTIONS_DATA.find(s => s.id === selectedSanction);
    const finalAmount = customAmount ? parseInt(customAmount) : sanctionData?.amount || 0;
    
    // Validazione importo se ci sono min/max
    if (sanctionData?.minAmount && finalAmount < sanctionData.minAmount) {
      alert(`L'importo minimo è € ${sanctionData.minAmount}`);
      return;
    }
    if (sanctionData?.maxAmount && finalAmount > sanctionData.maxAmount) {
      alert(`L'importo massimo è € ${sanctionData.maxAmount}`);
      return;
    }
    
    onSave({
      sanction: sanctionData?.label || '',
      law: sanctionData?.law || '',
      amount: finalAmount,
      plate: plate.toUpperCase(),
      location,
      notes,
      photo: photoUrl
    });

    // Reset Form
    setSelectedSanction('');
    setCustomAmount('');
    setPlate('');
    setLocation('');
    setNotes('');
    setPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const categories = [
    { id: 'stradali', label: 'Stradali', icon: Car, color: 'text-blue-600' },
    { id: 'animali', label: 'Animali', icon: Dog, color: 'text-amber-600' },
    { id: 'ambiente', label: 'Ambiente', icon: Leaf, color: 'text-emerald-600' },
  ];

  const selectedSanctionData = SANCTIONS_DATA.find(s => s.id === selectedSanction);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CATEGORY SELECTOR */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 block">Categoria Infrazione</Label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id as 'stradali' | 'animali' | 'ambiente');
                    setSelectedSanction('');
                    setCustomAmount('');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    selectedCategory === cat.id 
                      ? 'border-emerald-600 bg-emerald-50' 
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${selectedCategory === cat.id ? 'text-emerald-600' : cat.color}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedCategory === cat.id ? 'text-emerald-800' : 'text-slate-600'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* SANCTION LIST */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold uppercase text-slate-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" />
            Seleziona Infrazione
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <RadioGroup value={selectedSanction} onValueChange={(v) => { setSelectedSanction(v); setCustomAmount(''); }} className="space-y-3">
            {SANCTIONS_DATA
              .filter(s => s.cat === selectedCategory)
              .map((item) => {
                const isSelected = selectedSanction === item.id;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => { setSelectedSanction(item.id); setCustomAmount(''); }}
                    className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-600 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="pt-1">
                        <RadioGroupItem 
                          value={item.id} 
                          id={item.id} 
                          className={`w-5 h-5 border-slate-300 text-emerald-600 ${isSelected ? 'border-emerald-600' : ''}`}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={item.id} className={`block leading-tight cursor-pointer ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>
                          <span className="text-sm font-bold">{item.label}</span>
                        </Label>
                        <p className={`mt-1 text-xs leading-snug ${isSelected ? 'text-emerald-700/80' : 'text-slate-600'}`}>
                          {item.law}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4 pl-4 border-l border-slate-100 min-w-[80px]">
                      {item.minAmount && item.maxAmount ? (
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>
                            da € {item.minAmount}
                          </span>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>
                            a € {item.maxAmount}
                          </span>
                        </div>
                      ) : (
                        <span className={`block font-bold tracking-tight ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>
                          € {item.amount}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      </div>
                    )}
                  </div>
                );
              })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* IMPORTO PERSONALIZZATO - Solo se la sanzione ha min/max */}
      {selectedSanctionData?.minAmount && selectedSanctionData?.maxAmount && (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-4">
            <Label className="text-xs font-bold uppercase text-amber-700 tracking-wider mb-2 block">
              Importo Sanzione (€ {selectedSanctionData.minAmount} - € {selectedSanctionData.maxAmount})
            </Label>
            <div className="flex items-center gap-3">
              <span className="text-amber-600 font-bold">€</span>
              <Input 
                type="number"
                min={selectedSanctionData.minAmount}
                max={selectedSanctionData.maxAmount}
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                placeholder={String(selectedSanctionData.amount)}
                className="font-mono font-bold text-lg bg-white border-amber-300 focus:border-amber-500"
              />
              <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
                Default: € {selectedSanctionData.amount}
              </span>
            </div>
            <p className="text-[10px] text-amber-600 mt-2">
              Inserisci l'importo entro il range indicato. Se lasci vuoto, viene applicato l'importo predefinito.
            </p>
          </CardContent>
        </Card>
      )}

      {/* DETAILS & PHOTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Targa Veicolo (Opzionale)</Label>
                <Input 
                  value={plate} 
                  onChange={e => setPlate(e.target.value)} 
                  placeholder="AA 000 BB" 
                  className="uppercase font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Luogo Infrazione *
                </Label>
                <Input 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  placeholder="Es: Via del Bosco, Km 12" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Note Operative</Label>
                <Textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  placeholder="Descrizione dettagliata dell'evento..." 
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PHOTO */}
        <Card className="border-slate-200 shadow-sm h-fit">
          <CardContent className="p-4">
            <Label className="text-xs font-bold uppercase text-slate-500 mb-3 block flex items-center justify-between">
              <span>Documentazione Fotografica</span>
              <span className="text-[9px] text-slate-400 font-normal">Max 1 Foto</span>
            </Label>
            
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              ref={fileInputRef}
              className="hidden"
            />

            {photoUrl ? (
              <div className="relative group">
                <div className="aspect-square w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-mono">
                  IMG_LOADED
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-emerald-100 transition-colors">
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-600 group-hover:text-emerald-700">Scatta Foto</p>
                <p className="text-[10px] text-slate-400 mt-1">Tocca per aprire la camera</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SUBMIT BUTTON */}
      <Button type="submit" className="w-full h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-widest text-lg shadow-lg flex items-center justify-center gap-3">
        <FileText className="w-5 h-5" />
        Genera e Salva Verbale
      </Button>
    </form>
  );
}
