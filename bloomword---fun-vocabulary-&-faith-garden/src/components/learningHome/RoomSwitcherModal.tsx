import React from 'react';
import {
  X,
  Lock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Home
} from 'lucide-react';
import { HomeRoom, HomeRoomId } from '../../types';
import { sound } from '../../utils/audio';

interface RoomSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Record<HomeRoomId, HomeRoom>;
  activeRoomId: HomeRoomId;
  onSelectRoom: (roomId: HomeRoomId) => void;
}

export const RoomSwitcherModal: React.FC<RoomSwitcherModalProps> = ({
  isOpen,
  onClose,
  rooms,
  activeRoomId,
  onSelectRoom
}) => {
  if (!isOpen) return null;

  const roomList = Object.values(rooms) as HomeRoom[];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl max-h-[85vh] rounded-3xl shadow-2xl border-4 border-pink-200 flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚪</span>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka']">
                Explore Rooms & Spaces
              </h3>
              <p className="text-xs text-slate-500">
                Unlock new cozy rooms as you read, spell, and master new words!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {roomList.map((room) => {
            const isActive = room.id === activeRoomId;
            const isUnlocked = room.unlocked;

            const progress = room.currentProgress || 0;
            const max = room.maxProgress || 1;
            const percent = Math.min(100, Math.round((progress / max) * 100));

            return (
              <div
                key={room.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-pink-50/70 border-pink-400 shadow-md ring-2 ring-pink-200'
                    : isUnlocked
                    ? 'bg-white border-slate-200 hover:border-pink-300 hover:shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white border border-slate-100 shadow-xs">
                    {room.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {room.name}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-500 text-white">
                          Current Room
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {room.subtitle}
                    </p>

                    {!isUnlocked && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-amber-900 font-bold">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>{room.unlockRequirement}</span>
                          </span>
                          <span>
                            {progress} / {max}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:self-center">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playPop();
                        onSelectRoom(room.id);
                        onClose();
                      }}
                      disabled={isActive}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-pink-100 text-pink-700 cursor-default'
                          : 'bg-pink-500 hover:bg-pink-600 text-white shadow-xs active:scale-95'
                      }`}
                    >
                      <span>{isActive ? 'In this Room' : 'Enter Room'}</span>
                      {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <div className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-slate-100">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
