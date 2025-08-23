//Defining the shape of data that our app will adhere to.

//represents the different interaction modes of the canvas
export type CanvasInteractionMode =
  | "IDLE"
  | "DRAWING"
  | "SELECTING"
  | "TRANSLATING";

//represents an RGB color
export type Color = {
  r: number;
  g: number;
  b: number;
};

//represents an camera component, which is responsible for rendering the specific viewpoint, which represents the user's view of the canvas.
export type Camera = {
  x: number;
  y: number;
};

//different layer types we have that we can add to the canvas
export type LayerType = "Rectangle" | "Selecting";

export type RectangleLayer = {
  id: string;
  type: "Rectangle";
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

//a union of all possible layer types in the canvas
export type Layer = RectangleLayer;

//represents a specific point on the canvas
export type Point = {
  x: number;
  y: number;
};

//represents the state of the entire canvas
export type CanvasState = {
  selectedLayerId: string | null;
  layers: Record<string, Layer>;
  camera: Camera;
  mode: CanvasInteractionMode;
};
