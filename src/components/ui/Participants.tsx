import { useOthersMapped, useSelf } from "@/liveblocks.config";
import { shallow } from "@liveblocks/client";

interface UserAvatarProps {
  name: string;
  color: string;
}

const UserAvatar = ({ name, color }: UserAvatarProps) => {
  return (
    <div
      className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center font-semibold"
      style={{ backgroundColor: color }}
      title={name}
    >
      {name[0]}
    </div>
  );
};

export const Participants = () => {
  const others = useOthersMapped((other) => other.info, shallow);
  const self = useSelf();

  return (
    <div className="absolute top-2 right-2 bg-white rounded-md shadow-md p-2 flex">
      <div className="flex pl-2">
        {others.map(([connectionId, info]) => {
          // THE FIX: Destructure name and color from info.
          const { name, color } = info || {};
          if (name && typeof(color)==='string') {
            return <UserAvatar key={connectionId} name={name} color={color} />;
          }

          // If info, name, or color is missing, render nothing for that user.
          return null;
        })}
        {self && self.info && typeof(self.info.color)==='string' &&(
          <UserAvatar
            name={`${self.info.name} (You)`}
            color={self.info.color}
          />
        )}
      </div>
    </div>
  );
};
