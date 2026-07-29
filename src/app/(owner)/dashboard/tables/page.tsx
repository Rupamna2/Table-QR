"use client";

import { useState } from "react";

export default function TablesManagerPlaceholder() {
  const [tableId, setTableId] = useState("");
  const [qrData, setQrData] = useState<{ tableUrl: string; qrCodeDataUri: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/tables/${tableId}/qr`, {
        method: "POST"
      });
      const payload = await res.json();

      if (payload.error) {
        setError(payload.error);
      } else {
        setQrData(payload.data);
      }
    } catch (err: any) {
      setError("Failed to generate QR Code");
    }
  };

  return (
    <div className="p-8 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Table Manager (Unit 05 Stub)</h1>

      <div className="space-y-4 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-default)]">
        <div>
           <label className="block text-sm text-[var(--text-muted)] mb-1">Enter Table ID (UUID from DB)</label>
           <input
             value={tableId}
             onChange={(e) => setTableId(e.target.value)}
             className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md text-[var(--text-primary)]"
           />
        </div>

        <button
          onClick={handleGenerate}
          className="bg-[var(--accent-primary)] text-white px-4 py-2 rounded-md"
        >
          Generate Signed QR Code
        </button>

        {error && (
           <p className="text-[var(--state-error)] text-sm">{error}</p>
        )}

        {qrData && (
          <div className="mt-6 p-4 border border-[var(--border-default)] rounded-xl flex flex-col items-center">
            <img src={qrData.qrCodeDataUri} alt="Table QR Code" className="w-48 h-48 mb-4 rounded-xl" />
            <a href={qrData.tableUrl} target="_blank" className="text-[var(--accent-primary)] text-sm break-all">
              {qrData.tableUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
