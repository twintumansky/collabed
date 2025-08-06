import { HugeiconsIcon } from '@hugeicons/react';
import { Cursor02Icon, SquareIcon } from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";

export const Toolbar = () => {
    return (
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-md p-2 flex gap-x-2">
        <Button variant="default" size="icon">
          <HugeiconsIcon
            icon={Cursor02Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}          
          />
        </Button>
        <Button variant="default" size="icon">
        <HugeiconsIcon
            icon={SquareIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}          
          />
        </Button>
        {/* Add more tool buttons here later */}
      </div>
    );
  };