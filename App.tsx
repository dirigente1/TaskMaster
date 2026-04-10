import { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { ShieldCheck, Settings, Archive, AlertTriangle, Printer, Trash2, CheckCircle2, FileText, Fingerprint, Lock, Share2, Smartphone, Copy, QrCode, X, Check, Users, Camera, MapPin, Car, Dog, Leaf } from "lucide-react";

// Types
interface Agent { name: string; matricola: string; rank: string; }
interface Sanction { id: string; label: string; law: string; amount: number; minAmount?: number; maxAmount?: number; cat: 'stradali' | 'animali' | 'ambiente'; }
interface SanctionRecord { id: string; date: string; timestamp: number; sanction: string; law: string; amount: string | number; plate: string; notes: string; photo: string | null; agentName: string; matricola: string; location?: string; }

// Storage
const storage = {
  agent: {
    load: (): Agent => { try { const d = localStorage.getItem('nf_agent'); return d ? JSON.parse(d) : { name: '', matricola: '', rank: '' }; } catch { return { name: '', matricola: '', rank: '' }; } },
    save: (a: Agent) => localStorage.setItem('nf_agent', JSON.stringify(a))
  },
  archive: {
    load: (): SanctionRecord[] => { try { const d = localStorage.getItem('nf_archive'); return d ? JSON.parse(d) : []; } catch { return []; } },
    save: (r: SanctionRecord) => localStorage.setItem('nf_archive', JSON.stringify([r, ...storage.archive.load()])),
    delete: (id: string) => localStorage.setItem('nf_archive', JSON.stringify(storage.archive.load().filter(i => i.id !== id)))
  }
};

// Sanctions Data
const SANCTIONS: Sanction[] = [
  { id: 's1', label: 'Sosta non autorizzata su stalli disabili', law: 'Codice Strada', amount: 87, cat: 'stradali' },
  { id: 's2', label: 'Sosta su spiazzola scuolabus', law: 'Codice Strada', amount: 87, cat: 'stradali' },
  { id: 's3', label: 'Violazione sosta merci', law: 'Codice Strada', amount: 41, cat: 'stradali' },
  { id: 's4', label: 'Sosta sul marciapiede', law: 'Codice Strada', amount: 41, cat: 'stradali' },
  { id: 's5', label: 'Sosta in doppia fila', law: 'Codice Strada', amount: 87, cat: 'stradali' },
  { id: 's6', label: 'Sosta su strisce pedonali', law: 'Codice Strada', amount: 87, cat: 'stradali' },
  { id: 's7', label: 'Mancata revisione', law: 'Codice Strada', amount: 173, cat: 'stradali' },
  { id: 's8', label: 'Assicurazione scaduta', law: 'Codice Strada', amount: 868, cat: 'stradali' },
  { id: 'a1', label: 'Animale lasciato in auto', law: 'Abbandono in veicolo', amount: 500, cat: 'animali' },
  { id: 'a2', label: 'Abbandono di animale', law: 'Abbandono definitivo', amount: 1000, cat: 'animali' },
  { id: 'a3', label: 'Accesso cani area protetta', law: 'Ingresso non autorizzato', amount: 50, cat: 'animali' },
  { id: 'a4', label: 'Mancato microchip', law: 'Anagrafe canina', amount: 30, cat: 'animali' },
  { id: 'a5', label: 'Cane senza guinzaglio', law: 'Art. 672 C.P.', amount: 25, cat: 'animali' },
  { id: 'a6', label: 'Mancata museruola', law: 'Art. 672 C.P.', amount: 25, cat: 'animali' },
  { id: 'a7', label: 'Mancata raccolta escrementi', law: 'Reg. Comunale', amount: 25, cat: 'animali' },
  { id: 'e1', label: 'Abbandono rifiuti generici', law: 'Art. 192 D.Lgs 152/06', amount: 80, cat: 'ambiente' },
  { id: 'e2', label: 'Abbandono rifiuti pericolosi', law: 'Art. 192 D.Lgs 152/06', amount: 500, cat: 'ambiente' },
  { id: 'e3', label: 'Raccolta flora protetta', law: 'Art. 2 L. 394/91', amount: 200, cat: 'ambiente' },
  { id: 'e4', label: 'Accesso veicolare non autorizzato', law: 'Art. 30 L. 394/91', amount: 150, cat: 'ambiente' },
  { id: 'e5', label: 'Mancato taglio erba aree private', law: 'Ordinanza - Rischio incendi', minAmount: 50, maxAmount: 500, amount: 100, cat: 'ambiente' },
  { id: 'e6', label: 'Mancata rimozione sfalcio', law: 'Ordinanza - Rifiuti', minAmount: 50, maxAmount: 400, amount: 100, cat: 'ambiente' },
  { id: 'e7', label: 'Vegetazione pericolosa viabilita', law: 'Ordinanza - Viabilita', minAmount: 100, maxAmount: 500, amount: 150, cat: 'ambiente' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'archive' | 'profile'>('form');
  const [agent, setAgent] = useState<Agent>({ name: '', matricola: '', rank: '' });
  const [archive, setArchive] = useState<SanctionRecord[]>([]);
  const [recordToPrint, setRecordToPrint] = useState<SanctionRecord | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedAgent = storage.agent.load();
    setAgent(savedAgent);
    setArchive(storage.archive.load());
    if (!savedAgent.name || !savedAgent.matricola) setActiveTab('profile');
  }, []);

  const handleSaveSanction = (data: any) => {
    const newRecord: SanctionRecord = { id: Date.now().toString(), date: new Date().toLocaleString('it-IT'), timestamp: Date.now(), agentName: agent.name, matricola: agent.matricola, ...data };
    storage.archive.save(newRecord);
    setArchive([newRecord, ...archive]);
    setRecordToPrint(newRecord);
    setTimeout(() => { window.print(); setRecordToPrint(null); }, 500);
  };

  const handlePrintItem = (record: SanctionRecord) => { setRecordToPrint(record); setTimeout(() => { window.print(); setRecordToPrint(null); }, 100); };
  const handleDeleteItem = (id: string) => { if (confirm('Eliminare?')) { storage.archive.delete(id); setArchive(archive.filter(i => i.id !== id)); } };
  const saveProfile = () => { if (!agent.name || !agent.matricola) { alert("Inserisci Nome e Matricola!"); return; } storage.agent.save(agent); alert('Profilo salvato!'); setActiveTab('form'); };
  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleNativeShare = async () => { if (navigator.share) { try { await navigator.share({ title: 'Nucleo Forestale', text: 'App Sanzioni', url: window.location.href }); } catch {} } else handleCopyLink(); };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-24">
      <style>{`@media print { .no-print { display: none !important; } .print-only { display: block !important; } body { background: white; } } .fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <header className="bg-emerald-950 text-white p-4 sticky top-0 z-50 shadow-md no-print border-b border-emerald-900">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded border border-white/20"><ShieldCheck className="w-6 h-6 text-emerald-400" /></div>
            <div><h1 className="font-bold text-lg tracking-wide uppercase">Nucleo Forestale</h1><p className="text-[10px] text-emerald-300 font-medium tracking-widest uppercase">Sistema Digitale Sanzioni</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)} className="text-emerald-400 hover:bg-white/10 hover:text-white rounded-full"><Share2 className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('profile')} className="text-emerald-400 hover:bg-white/10 hover:text-white rounded-full"><Settings className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      {(!agent.name || !agent.matricola) && activeTab !== 'profile' && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 max-w-3xl mx-auto no-print">
          <div className="flex items-center gap-2 text-amber-800"><AlertTriangle className="w-4 h-4" /><p className="text-xs font-bold uppercase tracking-wide">Configurare il profilo operatore</p></div>
        </div>
      )}

      <nav className="bg-white border-b border-slate-200 sticky top-[64px] z-40 no-print">
        <div className="max-w-3xl mx-auto flex">
          {(['form', 'archive', 'profile'] as const).map(tab => (
            <Button key={tab} variant="ghost" onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {tab === 'form' ? 'Nuovo Verbale' : tab === 'archive' ? 'Archivio' : 'Operatore'}
            </Button>
          ))}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-4 no-print">
        {activeTab === 'form' && <FormTab agent={agent} setActiveTab={setActiveTab} onSave={handleSaveSanction} />}
        {activeTab === 'archive' && <ArchiveTab archive={archive} onPrint={handlePrintItem} onDelete={handleDeleteItem} />}
        {activeTab === 'profile' && <ProfileTab agent={agent} setAgent={setAgent} onSave={saveProfile} />}
      </main>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print" onClick={() => setShowShareModal(false)}>
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <CardHeader className="bg-emerald-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Users className="w-6 h-6" /><CardTitle className="text-lg font-bold">Condividi App</CardTitle></div>
                <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)} className="text-white/80 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col items-center py-4">
                <div className="w-40 h-40 bg-slate-900 rounded-xl p-3 shadow-lg"><div className="w-full h-full bg-white rounded-lg flex items-center justify-center"><QrCode className="w-16 h-16 text-slate-800" /></div></div>
                <p className="text-[10px] text-slate-500 mt-3 font-mono uppercase tracking-wider">Scansiona per installare</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
                <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2 block">Link</Label>
                <div className="flex items-center gap-2">
                  <Input value={window.location.href} readOnly className="font-mono text-sm bg-white border-slate-200 text-emerald-600 font-bold truncate" />
                  <Button onClick={handleCopyLink} className={`shrink-0 ${copied ? 'bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900'} text-white`}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleNativeShare} className="h-14 flex flex-col items-center justify-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"><Share2 className="w-5 h-5" /><span className="text-[10px] font-bold uppercase">Condividi</span></Button>
                <Button onClick={handleCopyLink} variant="outline" className="h-14 flex flex-col items-center justify-center gap-1 border-2 border-slate-200 hover:border-emerald-500 rounded-xl">{copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-slate-600" />}<span className="text-[10px] font-bold uppercase text-slate-600">{copied ? 'Copiato!' : 'Copia Link'}</span></Button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4"><div className="flex items-start gap-3"><Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" /><div><p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Istruzioni</p><p className="text-xs text-amber-700">Apri il link sul dispositivo → Configura il profilo → L'app è pronta.</p></div></div></div>
            </CardContent>
          </Card>
        </div>
      )}

      {recordToPrint && <PrintTemplate record={recordToPrint} />}
    </div>
  );
}

function FormTab({ agent, setActiveTab, onSave }: { agent: Agent; setActiveTab: (t: any) => void; onSave: (d: any) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<'stradali' | 'animali' | 'ambiente'>('stradali');
  const [selectedSanction, setSelectedSanction] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [plate, setPlate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSanction) { alert('Seleziona un\'infrazione'); return; }
    if (!location) { alert('Inserisci il luogo'); return; }
    const sanctionData = SANCTIONS.find(s => s.id === selectedSanction);
    const finalAmount = customAmount ? parseInt(customAmount) : sanctionData?.amount || 0;
    if (sanctionData?.minAmount && finalAmount < sanctionData.minAmount) { alert(`Importo minimo: € ${sanctionData.minAmount}`); return; }
    if (sanctionData?.maxAmount && finalAmount > sanctionData.maxAmount) { alert(`Importo massimo: € ${sanctionData.maxAmount}`); return; }
    onSave({ sanction: sanctionData?.label || '', law: sanctionData?.law || '', amount: finalAmount, plate: plate.toUpperCase(), location, notes, photo: photoUrl });
    setSelectedSanction(''); setCustomAmount(''); setPlate(''); setLocation(''); setNotes(''); setPhotoUrl(null);
  };

  const categories = [{ id: 'stradali', label: 'Stradali', icon: Car }, { id: 'animali', label: 'Animali', icon: Dog }, { id: 'ambiente', label: 'Ambiente', icon: Leaf }];
  const selectedSanctionData = SANCTIONS.find(s => s.id === selectedSanction);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 fade-in">
      <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest mb-1">Agente Accertatore</p>
              {agent.name ? <h3 className="text-lg font-bold text-white">{agent.name}</h3> : <h3 className="text-sm font-bold text-amber-400 uppercase">NON CONFIGURATO</h3>}
              {agent.matricola && <p className="font-mono text-emerald-400 text-sm">{agent.matricola}</p>}
            </div>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('profile')} className="bg-slate-700 text-white hover:bg-slate-600 text-[10px] font-bold uppercase"><Settings className="w-3 h-3 mr-1" /> Modifica</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 block">Categoria</Label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.id} type="button" onClick={() => { setSelectedCategory(cat.id as any); setSelectedSanction(''); setCustomAmount(''); }} className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${selectedCategory === cat.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <Icon className={`w-6 h-6 mb-1 ${selectedCategory === cat.id ? 'text-emerald-600' : 'text-slate-600'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedCategory === cat.id ? 'text-emerald-800' : 'text-slate-600'}`}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4"><CardTitle className="text-base font-bold uppercase text-slate-700 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-500" /> Seleziona Infrazione</CardTitle></CardHeader>
        <CardContent className="p-4">
          <RadioGroup value={selectedSanction} onValueChange={(v) => { setSelectedSanction(v); setCustomAmount(''); }} className="space-y-3">
            {SANCTIONS.filter(s => s.cat === selectedCategory).map((item) => {
              const isSelected = selectedSanction === item.id;
              return (
                <div key={item.id} onClick={() => { setSelectedSanction(item.id); setCustomAmount(''); }} className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-emerald-50 border-emerald-600 shadow-sm' : 'bg-white border-slate-200 hover:border-emerald-300'}`}>
                  <div className="flex items-start gap-4 flex-1">
                    <RadioGroupItem value={item.id} id={item.id} className={`w-5 h-5 ${isSelected ? 'border-emerald-600' : ''}`} />
                    <div className="flex-1">
                      <Label htmlFor={item.id} className={`block leading-tight cursor-pointer ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}><span className="text-sm font-bold">{item.label}</span></Label>
                      <p className={`mt-1 text-xs leading-snug ${isSelected ? 'text-emerald-700/80' : 'text-slate-600'}`}>{item.law}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 pl-4 border-l border-slate-100 min-w-[80px]">
                    {item.minAmount && item.maxAmount ? (<div className="flex flex-col"><span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>da € {item.minAmount}</span><span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>a € {item.maxAmount}</span></div>) : (<span className={`block font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>€ {item.amount}</span>)}
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {selectedSanctionData?.minAmount && selectedSanctionData?.maxAmount && (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-4">
            <Label className="text-xs font-bold uppercase text-amber-700 tracking-wider mb-2 block">Importo (€ {selectedSanctionData.minAmount} - € {selectedSanctionData.maxAmount})</Label>
            <div className="flex items-center gap-3"><span className="text-amber-600 font-bold">€</span><Input type="number" min={selectedSanctionData.minAmount} max={selectedSanctionData.maxAmount} value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder={String(selectedSanctionData.amount)} className="font-mono font-bold text-lg bg-white border-amber-300" /><span className="text-xs text-amber-600 font-medium whitespace-nowrap">Default: € {selectedSanctionData.amount}</span></div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-500">Targa (Opzionale)</Label><Input value={plate} onChange={e => setPlate(e.target.value)} placeholder="AA 000 BB" className="uppercase font-mono" /></div>
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Luogo *</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Via del Bosco, Km 12" required /></div>
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-slate-500">Note</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Descrizione..." rows={3} /></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm h-fit">
          <CardContent className="p-4">
            <Label className="text-xs font-bold uppercase text-slate-500 mb-3 block">Foto</Label>
            <input type="file" accept="image/*" capture="environment" onChange={(e) => { const file = e.target.files?.[0]; if (file) setPhotoUrl(URL.createObjectURL(file)); }} ref={fileInputRef} className="hidden" />
            {photoUrl ? (
              <div className="relative group"><div className="aspect-square w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200"><img src={photoUrl} alt="Preview" className="w-full h-full object-cover" /></div><Button type="button" variant="destructive" size="icon" onClick={() => { setPhotoUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></Button></div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="aspect-square w-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"><div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-emerald-100 transition-colors"><Camera className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" /></div><p className="text-sm font-bold text-slate-600 group-hover:text-emerald-700">Scatta Foto</p></div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button type="submit" className="w-full h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-widest text-lg shadow-lg flex items-center justify-center gap-3"><FileText className="w-5 h-5" /> Genera Verbale</Button>
    </form>
  );
}

function ArchiveTab({ archive, onPrint, onDelete }: { archive: SanctionRecord[]; onPrint: (r: SanctionRecord) => void; onDelete: (id: string) => void }) {
  return (
    <div className="space-y-3 fade-in">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">Archivio</h2><span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-1 rounded font-bold uppercase">{archive.length} Documenti</span></div>
      {archive.length === 0 ? (<Card className="p-12 text-center bg-white border-slate-200"><Archive className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500 font-bold uppercase text-sm">Nessun verbale</p></Card>) : (
        archive.map(item => (
          <Card key={item.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4"><div className="flex items-center gap-2 mb-1"><FileText className="w-4 h-4 text-emerald-700" /><h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{item.sanction}</h3></div><div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1"><span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">{item.plate || 'N/A'}</span><span>{item.date.split(',')[0]}</span></div></div>
                <div className="bg-emerald-50 text-emerald-800 text-lg font-bold px-3 py-1 rounded border border-emerald-100">€ {item.amount}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100 mb-3 flex justify-between items-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Agente</p><p className="text-xs font-bold text-slate-700">{item.agentName} ({item.matricola})</p></div>
              <div className="flex gap-2"><Button onClick={() => onPrint(item)} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase py-2.5"><Printer className="w-3 h-3 mr-2" /> Stampa</Button><Button onClick={() => onDelete(item.id)} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 px-3"><Trash2 className="w-4 h-4" /></Button></div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function ProfileTab({ agent, setAgent, onSave }: { agent: Agent; setAgent: (a: Agent) => void; onSave: () => void }) {
  return (
    <div className="fade-in max-w-xl mx-auto mt-6">
      <Card className="bg-slate-900 border-slate-800 shadow-2xl text-white">
        <CardHeader className="bg-slate-800/50 border-b border-slate-700 pb-6">
          <div className="flex items-center gap-3 mb-2"><div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20"><Fingerprint className="w-5 h-5 text-emerald-400" /></div><div><CardTitle className="text-lg font-bold uppercase tracking-wider text-white">Configurazione Operatore</CardTitle><p className="text-slate-400 text-xs font-mono mt-1">ID: TERMINALE-01</p></div></div>
          <div className="flex items-center gap-2 mt-4"><Lock className="w-3 h-3 text-emerald-500" /><span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Accesso Riservato</span></div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2"><Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Matricola (ID Unico)</Label><Input value={agent.matricola} onChange={e => setAgent({...agent, matricola: e.target.value})} placeholder="00000" className="font-mono bg-slate-800 border-slate-700 text-emerald-400 focus:border-emerald-500 placeholder:text-slate-600 tracking-widest uppercase" /></div>
          <div className="space-y-2"><Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Nome e Cognome</Label><Input value={agent.name} onChange={e => setAgent({...agent, name: e.target.value})} placeholder="ROSSI MARIO" className="bg-slate-800 border-slate-700 text-white focus:border-emerald-500 placeholder:text-slate-600 uppercase font-bold" /></div>
          <div className="space-y-2"><Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Reparto / Grado</Label><Input value={agent.rank} onChange={e => setAgent({...agent, rank: e.target.value})} placeholder="STAZIONE MONTE VERDE" className="bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 placeholder:text-slate-600 uppercase text-sm" /></div>
          <div className="pt-4 border-t border-slate-800"><Button onClick={onSave} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3 shadow-lg flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Conferma e Salva</Button><p className="text-center text-[10px] text-slate-500 mt-3 font-mono">I dati vengono salvati localmente sul dispositivo.</p></div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrintTemplate({ record }: { record: SanctionRecord }) {
  return (
    <div className="print-only hidden">
      <style>{`.print-only { display: block; } body { font-family: 'Times New Roman', serif; } .header-box { border-bottom: 3px double #000; margin-bottom: 20px; padding-bottom: 10px; } .section-title { font-weight: bold; text-transform: uppercase; margin-top: 20px; border-bottom: 1px solid #000; margin-bottom: 10px; } .row { display: flex; justify-content: space-between; margin-bottom: 8px; } .label { font-weight: bold; }`}</style>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="header-box text-center"><h1 className="text-2xl font-bold uppercase">Nucleo Ispettori Forestali</h1><p className="text-sm">Verbale di Accertamento e Contestazione</p></div>
        <div className="row"><span className="label">N. Verbale:</span> <span>#{record.id.slice(-6)}</span></div>
        <div className="row"><span className="label">Data e Ora:</span> <span>{record.date}</span></div>
        <div className="section-title">Dati Agente Accertatore</div>
        <div className="row"><span className="label">Nome:</span> <span>{record.agentName}</span></div>
        <div className="row"><span className="label">Matricola:</span> <span>{record.matricola}</span></div>
        <div className="section-title">Dati Violazione</div>
        <div className="row"><span className="label">Infrazione:</span> <span>{record.sanction}</span></div>
        <div className="row"><span className="label">Normativa:</span> <span>{record.law}</span></div>
        <div className="row"><span className="label">Luogo:</span> <span>{record.location}</span></div>
        <div className="row"><span className="label">Targa:</span> <span>{record.plate || 'N/A'}</span></div>
        <div className="row"><span className="label">Importo:</span> <span>€ {record.amount}</span></div>
        <div className="section-title">Note</div>
        <p className="text-justify italic bg-slate-100 p-4 border border-slate-300">{record.notes || 'Nessuna nota'}</p>
        {record.photo && <div className="mt-6 text-center"><p className="label mb-2">Foto:</p><img src={record.photo} alt="Evidenza" className="max-w-full h-auto border border-black" style={{ maxHeight: '400px' }} /></div>}
        <div className="mt-10 grid grid-cols-2 gap-10"><div className="text-center"><div className="border-b border-black mb-2 h-16"></div><p className="text-sm">Firma Agente</p></div><div className="text-center"><div className="border-b border-black mb-2 h-16"></div><p className="text-sm">Firma Trasgressore</p></div></div>
        <div className="mt-10 text-center text-xs text-slate-500">Documento generato digitalmente dal Sistema Nucleo Forestale</div>
      </div>
    </div>
  );
}
