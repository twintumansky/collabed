import type { Color } from "@/types";

interface ColorPickerProps {
    onChange: (color: Color) => void;
}

const ColorButton =({ color, onClick}: {color: Color, onClick: (color: Color) => void}) => {
    return (
        <button 
        className="w-6 h-6 rounded-full border border-neutral-300"
        style={{ background: `rgb(${color.r}, ${color.g}, ${color.b})` }}
        onClick={() => onClick(color)}
        />
    )
}

export const ColorPicker = ({onChange}: ColorPickerProps) => {
    const colors: Color[] = [
        {r:255, g:246, b:181},
        {r:247, g:211, b:176},
        {r:173, g:240, b:249},
        {r:199, g:220, b:255}, 
        {r:221, g:217, b:255},
        {r:176, g:176, b:176},
        {r:26, g:26, b:26},
        {r:255, g:0, b:0},
    ];
    return (
        <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
            {colors.map((color) => (
                <ColorButton 
                    key={`${color.r}-${color.g}-${color.b}`}
                    color={color}
                    onClick={onChange}
                />
            ))}
        </div>
    )
}