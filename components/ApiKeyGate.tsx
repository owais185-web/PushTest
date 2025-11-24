import React, { useEffect, useState } from 'react';
import { checkApiKeySelection, openApiKeySelection } from '../services/geminiService';
import { Button } from './Button';

interface ApiKeyGateProps {
  onKeySelected: () => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  const [checking, setChecking] = useState(true);

  const verifyKey = async () => {
    setChecking(true);
    try {
      const hasKey = await checkApiKeySelection();
      if (hasKey) {
        onKeySelected();
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setChecking(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      await openApiKeySelection();
      // Assume success after dialog closes (or user interaction completes)
      // Check again
      await verifyKey();
    } catch (error) {
      console.error("Failed to select key:", error);
    }
  };

  useEffect(() => {
    verifyKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse text-indigo-400">Verifying access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl text-center">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">LogoMotion Studio</h1>
        <p className="text-slate-400 mb-8">
          To generate professional logos and animations, please connect your Google Cloud Project with a valid billing account.
        </p>
        
        <div className="space-y-4">
          <Button onClick={handleSelectKey} className="w-full justify-center py-3 text-lg">
            Connect API Key
          </Button>
          
          <div className="text-xs text-slate-500">
            Need help? <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">View Billing Documentation</a>
          </div>
        </div>
      </div>
    </div>
  );
};