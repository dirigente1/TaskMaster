import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { ShieldCheck, Settings, Archive, User, AlertTriangle, Printer, Trash2, CheckCircle2, FileText, Fingerprint, BadgeCheck, Lock, Share2, Smartphone, Copy, QrCode, X, Check, Users } from "lucide-react";
import { SanctionForm } from "./components/SanctionForm";
import { PrintTemplate } from "./components/PrintTemplate";
import { storageUtils } from "./utils/storage";
import { Agent, SanctionRecord } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'archive' | 'profile'>('form');
  const [agent, setAgent] = useState<Agent>({ name: '', matricola: '', rank: '' });
  const [archive, setArchive] = useState<SanctionRecord[]>([]);
  const [recordToPrint, setRecordToPrint] = useState<SanctionRecord | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load Data
  useEffect(() => {
    const savedAgent = storageUtils.agent.load();
    setAgent(savedAgent);
    setArchive(storageUtils.archive.load());
    
    if (!savedAgent.name || !savedAgent.matricola) {
      setActiveTab('profile');
    }
  }, []);

  const handleSaveSanction = (data: any) => {
    const newRecord: SanctionRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('it-IT'),
      timestamp: Date.now(),
      agentName: agent.name,
      matricola: agent.matricola,
      ...data
    };
    
    storageUtils.archive.save(newRecord);
    setArchive([newRecord, ...archive]);
    
    setRecordToPrint(newRecord);
    setTimeout(() => {
      window.print();
      setRecordToPrint(null);
    }, 500);
  };

  const handlePrintItem = (record: SanctionRecord) => {
    setRecordToPrint(record);
    setTimeout(() => {
      window.print();
      setRecordToPrint(null);
    }, 100);
  };

  const handleDeleteItem = (id: string) => {
    if(confirm('Eliminare questa sanzione?')) {
      storageUtils.archive.delete(id);
      setArchive(archive.filter(i => i.id !== id));
    }
  };

  const saveProfile = () => {
    if (!agent.name || !agent.matricola) {
      alert("Inserisci Nome e Matricola!");
      return;
    }
    storageUtils.agent.save(agent);
    alert('Profilo salvato con successo!');
    setActiveTab('form');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nucleo Forestale - App Sanzioni',
          text: 'Ecco l\'app per la gestione delle sanzioni del Nucleo Forestale. Installala sul tuo dispositivo!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Condivisione annullata');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-24">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; -webkit-print-color-adjust: exact; }
        }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .id-card-bg {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border: 1px solid #334155;
        }
        .qr-pattern {
          background-image: 
            linear-gradient(45deg, #334155 25%, transparent 25%),
            linear-gradient(-45deg, #334155 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #334155 75%),
            linear-gradient(-45deg, transparent 75%, #334155 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
        }
      `}</style>

      {/* HEADER ISTITUZIONALE */}
      <header className="bg-emerald-950 text-white p-4 sticky top-0 z-50 shadow-md no-print border-b border-emerald-900">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded border border-white/20 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide uppercase">Nucleo Forestale</h1>
              <p className="text-[10px] text-emerald-300 font-medium tracking-widest uppercase">Sistema Digitale Sanzioni</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* PULSANTE CONDIVIDI RAPIDO */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowShareModal(true)} 
              className="text-emerald-400 hover:bg-white/10 hover:text-white rounded-full relative"
              title="Condividi App"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('profile')} className="text-emerald-400 hover:bg-white/10 hover:text-white rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* WARNING BANNER */}
      {(!agent.name || !agent.matricola) && activeTab !== 'profile' && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 max-w-3xl mx-auto no-print">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wide">Attenzione: Profilo Agente mancante. Configurare prima di procedere.</p>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-[64px] z-40 no-print">
        <div className="max-w-3xl mx-auto flex">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'form' ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            Nuovo Verbale
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('archive')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'archive' ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            Archivio
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'profile' ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            Operatore
          </Button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-4 no-print">
        {activeTab === 'form' && (
          <div className="fade-in">
            {/* CREDENZIALI OPERATORE - ID CARD STYLE */}
            <Card className="mb-6 id-card-bg shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Left: Photo Area */}
                  <div className="bg-slate-800/50 p-4 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-700 w-full sm:w-32">
                    <div className="w-20 h-20 bg-slate-700 rounded-full border-2 border-emerald-500/30 flex items-center justify-center relative overflow-hidden mb-3">
                      <User className="w-10 h-10 text-slate-400" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                      <BadgeCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Identificato</span>
                    </div>
                  </div>

                  {/* Right: Data Area */}
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest mb-1">Agente Accertatore</p>
                        {agent.name ? (
                          <h3 className="text-lg font-bold text-white tracking-tight">{agent.name}</h3>
                        ) : (
                          <h3 className="text-sm font-bold text-amber-400 uppercase">NON CONFIGURATO</h3>
                        )}
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => setActiveTab('profile')} className="bg-slate-700 text-white hover:bg-slate-600 border-slate-600 text-[10px] font-bold uppercase tracking-wider h-7 px-3">
                        <Settings className="w-3 h-3 mr-1" /> Modifica
                      </Button>
                    </div>
                    
                    {agent.matricola && (
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1">
                          <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Matricola</p>
                          <p className="font-mono text-emerald-400 text-sm tracking-widest">{agent.matricola}</p>
                        </div>
                        {agent.rank && (
                          <div className="flex-1">
                            <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Reparto</p>
                            <p className="text-slate-300 text-xs font-medium">{agent.rank}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <SanctionForm agent={agent} onSave={handleSaveSanction} />
          </div>
        )}
        
        {activeTab === 'archive' && (
          <div className="space-y-3 fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">Archivio Digitale</h2>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">{archive.length} Documenti</span>
            </div>
            {archive.length === 0 ? (
              <Card className="p-12 text-center bg-white border-slate-200">
                <Archive className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold uppercase text-sm tracking-wider">Nessun verbale presente</p>
              </Card>
            ) : (
              archive.map(item => (
                <Card key={item.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{item.sanction}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">{item.plate || 'N/A'}</span>
                          <span>{item.date.split(',')[0]}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="bg-emerald-50 text-emerald-800 text-lg font-bold px-3 py-1 rounded border border-emerald-100">
                          € {item.amount}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 mb-3 flex justify-between items-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agente</p>
                      <p className="text-xs font-bold text-slate-700">{item.agentName} ({item.matricola})</p>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handlePrintItem(item)} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider py-2.5">
                        <Printer className="w-3 h-3 mr-2" /> Stampa
                      </Button>
                      <Button onClick={() => handleDeleteItem(item.id)} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-3">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="fade-in max-w-xl mx-auto mt-6">
            {/* TERMINAL STYLE PROFILE CARD */}
            <Card className="bg-slate-900 border-slate-800 shadow-2xl text-white">
              <CardHeader className="bg-slate-800/50 border-b border-slate-700 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                    <Fingerprint className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold uppercase tracking-wider text-white">Configurazione Operatore</CardTitle>
                    <p className="text-slate-400 text-xs font-mono mt-1">ID: TERMINALE-SECURE-01</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Accesso Riservato Personale Autorizzato</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Matricola Field */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Matricola (ID Unico)
                  </Label>
                  <div className="relative">
                    <Input 
                      value={agent.matricola} 
                      onChange={e => setAgent({...agent, matricola: e.target.value})} 
                      placeholder="00000" 
                      className="font-mono bg-slate-800 border-slate-700 text-emerald-400 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-slate-600 tracking-widest uppercase" 
                    />
                    <div className="absolute right-3 top-2.5 text-slate-600 text-xs font-mono">ID</div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Nome e Cognome
                  </Label>
                  <Input 
                    value={agent.name} 
                    onChange={e => setAgent({...agent, name: e.target.value})} 
                    placeholder="ROSSI MARIO" 
                    className="bg-slate-800 border-slate-700 text-white focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-slate-600 uppercase font-bold tracking-wide" 
                  />
                </div>

                {/* Rank Field */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Reparto / Grado
                  </Label>
                  <Input 
                    value={agent.rank} 
                    onChange={e => setAgent({...agent, rank: e.target.value})} 
                    placeholder="STAZIONE MONTE VERDE" 
                    className="bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-slate-600 uppercase text-sm" 
                  />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <Button onClick={saveProfile} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all">
                    <CheckCircle2 className="w-4 h-4" /> Conferma e Salva Profilo
                  </Button>
                  <p className="text-center text-[10px] text-slate-500 mt-3 font-mono">
                    I dati verranno archiviati localmente sul dispositivo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 no-print" onClick={() => setShowShareModal(false)}>
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <CardHeader className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Condividi con Colleghi</CardTitle>
                    <p className="text-emerald-200 text-xs mt-1">Invia l'app istantaneamente</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)} className="text-white/80 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              {/* QR CODE PLACEHOLDER */}
              <div className="flex flex-col items-center py-4">
                <div className="w-40 h-40 bg-slate-900 rounded-xl p-3 shadow-lg">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Simulated QR Pattern */}
                    <div className="absolute inset-2 qr-pattern opacity-20"></div>
                    <QrCode className="w-16 h-16 text-slate-800 relative z-10" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-mono uppercase tracking-wider">Scansiona per installare</p>
              </div>

              {/* LINK DISPLAY */}
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
                <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2 block">Link Diretto</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={window.location.href} 
                    readOnly 
                    className="font-mono text-sm bg-white border-slate-200 text-emerald-600 font-bold truncate"
                  />
                  <Button 
                    onClick={handleCopyLink}
                    className={`shrink-0 ${copied ? 'bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900'} text-white`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* SHARE OPTIONS */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleNativeShare}
                  className="h-16 flex flex-col items-center justify-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Condividi</span>
                </Button>
                
                <Button 
                  onClick={handleCopyLink}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-1 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-slate-600" />}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{copied ? 'Copiato!' : 'Copia Link'}</span>
                </Button>
              </div>

              {/* INSTRUCTIONS */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Istruzioni per i colleghi</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Apri il link sul dispositivo mobile → Configura il profilo → L'app è pronta all'uso. I dati restano salvati localmente.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PRINT TEMPLATE */}
      <PrintTemplate record={recordToPrint} />
    </div>
  );
}
