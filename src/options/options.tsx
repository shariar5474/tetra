import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsView } from '../dashboard/pages/SettingsView';
import { calculateStorageUsage } from '../database/asset-store';
import { getDB } from '../database/indexeddb';

export const OptionsApp: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState({ totalBytes: 0, count: 0, formatted: '0 KB' });

  useEffect(() => {
    calculateStorageUsage().then(setStorageInfo);
  }, []);

  const handleClearStorage = async () => {
    const db = await getDB();
    await db.clear('asset_blobs');
    const updated = await calculateStorageUsage();
    setStorageInfo(updated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SettingsView
        storageInfo={storageInfo}
        onClearStorage={handleClearStorage}
        onExportAllBackup={() => {
          chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById('options-root')!);
root.render(<OptionsApp />);
