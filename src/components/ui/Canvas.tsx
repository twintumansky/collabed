import { useCanvasStore } from "@/store/useCanvasStore";

export const Canvas = () => {
  const layers = useCanvasStore((state) => state.canvasState.layers);

  return (
    <main className="h-full w-full bg-neutral-100 touch-none">
      {/* For now, we will just prove we can read the layers.
        In the future, we will map over these and render each layer.
      */}
      {/* Example of how to display data from the store: */}
      <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-md">
        Layers on canvas: {Object.keys(layers).length}
      </div>
    </main>
  );
};