import React from "react";
import { Button } from "@/components/ui/button"

const App: React.FC = () => {
  return (
    <div className="bg-blue-500 text-white p-4">
      <div>Coming soon...</div>
      <h3>Vite + React</h3>
      <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
    </div>
  );
};

export default App;
