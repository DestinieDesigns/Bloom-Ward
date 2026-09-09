import React, { useState } from 'react';
import { CharacterCustomization, CharacterState } from '../../types';
import { HomeCharacter } from './HomeCharacter';
import { X, Check, Sparkles, User } from 'lucide-react';

interface CharacterCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: CharacterCustomization;
  onSave: (customization: CharacterCustomization) => void;
}

const SKIN_TONES = [
  { id: '#FDDFCA', label: 'Fair' },
  { id: '#F5CBA7', label: 'Honey' },
  { id: '#D89762', label: 'Tan' },
  { id: '#A3683A', label: 'Bronze' },
  { id: '#5E3B20', label: 'Espresso' }
];

const HAIR_STYLES: { id: CharacterCustomization['hairStyle']; label: string }[] = [
  { id: 'cozy_bun', label: 'Cozy Bun' },
  { id: 'short_waves', label: 'Short Waves' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'braids', label: 'Twin Braids' },
  { id: 'curls', label: 'Soft Curls' }
];

const HAIR_COLORS = [
  { id: '#2E241E', label: 'Midnight Black' },
  { id: '#4A3525', label: 'Brunette' },
  { id: '#8F3B20', label: 'Auburn' },
  { id: '#D4A359', label: 'Golden Blonde' },
  { id: '#94A3B8', label: 'Silver Mist' }
];

const OUTFIT_COLORS = [
  { id: '#EFB6BD', label: 'Rosewater Knit' },
  { id: '#8FA58B', label: 'Sage Botanical' },
  { id: '#B88963', label: 'Warm Timber' },
  { id: '#688BBA', label: 'Ocean Twilight' },
  { id: '#DDAA55', label: 'Harvest Amber' }
];

const ACCESSORIES: { id: CharacterCustomization['accessory']; label: string; icon: string }[] = [
  { id: 'reading_glasses', label: 'Reading Glasses', icon: '👓' },
  { id: 'flower_clip', label: 'Blossom Clip', icon: '🌸' },
  { id: 'star_badge', label: 'Scholar Star', icon: '⭐' },
  { id: 'none', label: 'None', icon: '✨' }
];

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  isOpen,
  onClose,
  customization,
  onSave
}) => {
  const [current, setCurrent] = useState<CharacterCustomization>(customization);

  if (!isOpen) return null;

  // Preview character state
  const previewState: CharacterState = {
    x: 50,
    y: 50,
    facing: 'right',
    animation: 'idle',
    customization: current
  };

  const handleSave = () => {
    onSave(current);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <div>
              <h3 className="font-bold text-base text-amber-950">Customize Mini Learner</h3>
              <p className="text-xs text-amber-700">Choose hair, outfit colors, and accessories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Live Preview Stage */}
          <div className="w-full h-36 bg-gradient-to-b from-stone-50 via-amber-50/40 to-amber-100/50 rounded-2xl border border-amber-200/60 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-amber-200/30 border-t border-amber-300/30" />
            <HomeCharacter state={previewState} bubbleMessage="Looking cozy!" />
          </div>

          {/* Skin Tone */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">Skin Tone</label>
            <div className="flex items-center gap-3">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setCurrent({ ...current, skinTone: tone.id })}
                  className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                    current.skinTone === tone.id ? 'scale-115 border-amber-600 ring-2 ring-amber-400/40' : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: tone.id }}
                  title={tone.label}
                />
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">Hairstyle</label>
            <div className="grid grid-cols-3 gap-2">
              {HAIR_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setCurrent({ ...current, hairStyle: style.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    current.hairStyle === style.id
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">Hair Color</label>
            <div className="flex items-center gap-3">
              {HAIR_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setCurrent({ ...current, hairColor: color.id })}
                  className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                    current.hairColor === color.id ? 'scale-115 border-amber-600 ring-2 ring-amber-400/40' : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.id }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Outfit Knit Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">Sweater Outfit</label>
            <div className="flex items-center gap-3">
              {OUTFIT_COLORS.map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => setCurrent({ ...current, outfitColor: outfit.id })}
                  className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                    current.outfitColor === outfit.id ? 'scale-115 border-amber-600 ring-2 ring-amber-400/40' : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: outfit.id }}
                  title={outfit.label}
                />
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">Accessory</label>
            <div className="grid grid-cols-2 gap-2">
              {ACCESSORIES.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setCurrent({ ...current, accessory: acc.id })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    current.accessory === acc.id
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <span className="text-base">{acc.icon}</span>
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Style</span>
          </button>
        </div>
      </div>
    </div>
  );
};
