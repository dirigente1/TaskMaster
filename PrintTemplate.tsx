import { SanctionRecord } from "../types";

interface PrintTemplateProps {
  record: SanctionRecord | null;
}

export function PrintTemplate({ record }: PrintTemplateProps) {
  if (!record) return null;

  return (
    <div className="print-only hidden">
      <style>{`
        .print-only { display: block; }
        body { font-family: 'Times New Roman', serif; }
        .header-box { border-bottom: 3px double #000; margin-bottom: 20px; padding-bottom: 10px; }
        .section-title { font-weight: bold; text-transform: uppercase; margin-top: 20px; border-bottom: 1px solid #000; margin-bottom: 10px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .label { font-weight: bold; }
      `}</style>
      
      <div className="p-8 max-w-2xl mx-auto">
        <div className="header-box text-center">
          <h1 className="text-2xl font-bold uppercase">Nucleo Ispettori Forestali</h1>
          <p className="text-sm">Verbale di Accertamento e Contestazione</p>
        </div>

        <div className="row">
          <span className="label">N. Verbale:</span> <span>#{record.id.slice(-6)}</span>
        </div>
        <div className="row">
          <span className="label">Data e Ora:</span> <span>{record.date}</span>
        </div>

        <div className="section-title">Dati Agente Accertatore</div>
        <div className="row">
          <span className="label">Nome:</span> <span>{record.agentName}</span>
        </div>
        <div className="row">
          <span className="label">Matricola:</span> <span>{record.matricola}</span>
        </div>

        <div className="section-title">Dati Violazione</div>
        <div className="row">
          <span className="label">Infrazione:</span> <span>{record.sanction}</span>
        </div>
        <div className="row">
          <span className="label">Normativa Violata:</span> <span>{record.law}</span>
        </div>
        <div className="row">
          <span className="label">Luogo:</span> <span>{record.location}</span>
        </div>
        <div className="row">
          <span className="label">Targa Veicolo:</span> <span>{record.plate || 'N/A'}</span>
        </div>
        <div className="row">
          <span className="label">Importo Sanzione:</span> <span>€ {record.amount}</span>
        </div>

        <div className="section-title">Note Operative</div>
        <p className="text-justify italic bg-slate-100 p-4 border border-slate-300">
          {record.notes || 'Nessuna nota aggiuntiva'}
        </p>

        {record.photo && (
          <div className="mt-6 text-center">
            <p className="label mb-2">Documentazione Fotografica:</p>
            <img src={record.photo} alt="Evidenza" className="max-w-full h-auto border border-black" style={{ maxHeight: '400px' }} />
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-10">
          <div className="text-center">
            <div className="border-b border-black mb-2 h-16"></div>
            <p className="text-sm">Firma Agente</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black mb-2 h-16"></div>
            <p className="text-sm">Firma Trasgressore</p>
          </div>
        </div>
        
        <div className="mt-10 text-center text-xs text-slate-500">
          Documento generato digitalmente dal Sistema Nucleo Forestale
        </div>
      </div>
    </div>
  );
}
