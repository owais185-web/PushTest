import React, { useState } from 'react';
import { ApiKeyGate } from './components/ApiKeyGate';
import { LogoWorkspace } from './components/LogoWorkspace';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);

  return (
    <>
      {!hasKey ? (
        <ApiKeyGate onKeySelected={() => setHasKey(true)} />
      ) : (
        <LogoWorkspace />
      )}
    </>
  );
};

export default App;