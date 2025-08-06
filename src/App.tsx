import React from "react";
import { Canvas } from "@/components/ui/Canvas.tsx";
import { Toolbar } from "@/components/ui/Toolbar.tsx";

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen">
      <Toolbar />
      <Canvas />
    </div>
  );
};

export default App;
