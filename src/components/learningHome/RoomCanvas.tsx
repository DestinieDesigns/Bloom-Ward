import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  Trash2,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Info,
  Check,
  X,
  Volume2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import {
  HomeItem,
  HomeRoom,
  PlacedHomeItem,
  AppSection,
  CharacterState,
  FurnitureActionType,
  ThemeId
} from '../../types';
import { INITIAL_HOME_ITEMS } from '../../data/learningHomeData';
import { MiniatureFurnitureRenderer } from './MiniatureFurnitureRenderer';
import { HomeCharacter } from './HomeCharacter';
import { DecorateControlPanel } from './DecorateControlPanel';
import { PlayInteractionPanel, SelectedInteractiveObject } from './PlayInteractionPanel';
import { sound } from '../../utils/audio';
import { getThemeConfig } from '../../data/themes';

interface RoomCanvasProps {
  room: HomeRoom;
  onUpdatePlacedItems: (items: PlacedHomeItem[]) => void;
  onRemoveItem: (instanceId: string) => void;
  onStoreItem?: (instanceId: string) => void;
  onSelectSection: (section: AppSection) => void;
  isDecoratingMode: boolean;
  character?: CharacterState;
  onUpdateCharacter?: (c: CharacterState) => void;
  themeId?: ThemeId;
  onUndo?: () => void;
  canUndo?: boolean;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  room,
  onUpdatePlacedItems,
  onRemoveItem,
  onStoreItem,
  onSelectSection,
  isDecoratingMode,
  character,
  onUpdateCharacter,
  themeId,
  onUndo,
  canUndo
}) => {
  const activeTheme = getThemeConfig(themeId || (room.theme as ThemeId));
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [activePetDialogue, setActivePetDialogue] = useState<{ name: string; text: string } | null>(null);
  const [activeWordCard, setActiveWordCard] = useState<{ word: string; definition: string } | null>(null);
  const [interactiveStation, setInteractiveStation] = useState<{
    title: string;
    description: string;
    targetSection: AppSection;
  } | null>(null);
  const [selectedInteractiveObject, setSelectedInteractiveObject] = useState<SelectedInteractiveObject | null>(null);
  const [characterBubble, setCharacterBubble] = useState<string | null>(null);
  const [isMovingActive, setIsMovingActive] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const originalTransformRef = useRef<{
    instanceId: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    zIndex: number;
  } | null>(null);

  // Clear or capture initial transform when selected item changes
  useEffect(() => {
    if (!selectedInstanceId) {
      originalTransformRef.current = null;
      setIsMovingActive(false);
      return;
    }
    const current = room.placedItems.find((p) => p.instanceId === selectedInstanceId);
    if (current && (!originalTransformRef.current || originalTransformRef.current.instanceId !== selectedInstanceId)) {
      originalTransformRef.current = {
        instanceId: current.instanceId,
        x: current.x,
        y: current.y,
        scale: current.scale,
        rotation: current.rotation,
        zIndex: current.zIndex || 10
      };
    }
  }, [selectedInstanceId, room.placedItems]);

  // Mode transition cleanup
  useEffect(() => {
    if (!isDecoratingMode) {
      setSelectedInstanceId(null);
      setIsMovingActive(false);
      originalTransformRef.current = null;
    } else {
      setSelectedInteractiveObject(null);
    }
  }, [isDecoratingMode]);

  // Map of item definitions for fast lookup
  const itemMap = useRef<Map<string, HomeItem>>(new Map());
  useEffect(() => {
    const map = new Map<string, HomeItem>();
    INITIAL_HOME_ITEMS.forEach((i) => map.set(i.id, i));
    itemMap.current = map;
  }, []);

  const selectedPlacedItem = room.placedItems.find((p) => p.instanceId === selectedInstanceId);
  const selectedItemDef = selectedPlacedItem ? itemMap.current.get(selectedPlacedItem.itemId) : null;

  // Active interactive item lookup for Play Mode
  const activeSelectedInteractivePlaced = selectedInteractiveObject
    ? room.placedItems.find((p) => p.instanceId === selectedInteractiveObject.instanceId) || selectedInteractiveObject.placed
    : null;
  const activeSelectedInteractiveDef = activeSelectedInteractivePlaced
    ? itemMap.current.get(activeSelectedInteractivePlaced.itemId) || selectedInteractiveObject?.item
    : null;

  // Global pointer up to end drag
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  // Handle pointer down on an item
  const handleItemPointerDown = (
    e: React.PointerEvent,
    placed: PlacedHomeItem,
    itemDef?: HomeItem
  ) => {
    e.stopPropagation();

    // If in Play mode, handle interactions instead of drag
    if (!isDecoratingMode) {
      handleItemInteraction(placed, itemDef);
      return;
    }

    sound.playPop();
    setSelectedInstanceId(placed.instanceId);
    setSelectedInteractiveObject(null);
    isDraggingRef.current = true;

    if (!originalTransformRef.current || originalTransformRef.current.instanceId !== placed.instanceId) {
      originalTransformRef.current = {
        instanceId: placed.instanceId,
        x: placed.x,
        y: placed.y,
        scale: placed.scale,
        rotation: placed.rotation,
        zIndex: placed.zIndex || 10
      };
    }

    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const itemPixelX = (placed.x / 100) * canvasRect.width;
    const itemPixelY = (placed.y / 100) * canvasRect.height;

    dragStartOffsetRef.current = {
      x: e.clientX - canvasRect.left - itemPixelX,
      y: e.clientY - canvasRect.top - itemPixelY
    };
  };

  // Handle pointer move across canvas
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !selectedInstanceId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const currentMouseX = e.clientX - canvasRect.left - dragStartOffsetRef.current.x;
    const currentMouseY = e.clientY - canvasRect.top - dragStartOffsetRef.current.y;

    // Convert to percentage (clamped between 5% and 95%)
    const newX = Math.max(5, Math.min(95, Math.round((currentMouseX / canvasRect.width) * 100)));
    const newY = Math.max(10, Math.min(92, Math.round((currentMouseY / canvasRect.height) * 100)));

    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        return { ...p, x: newX, y: newY };
      }
      return p;
    });

    onUpdatePlacedItems(updated);
  };

  // Walk character towards a location on click, or place item in move mode
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isDecoratingMode) {
      if (isMovingActive && selectedInstanceId && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const clickX = Math.max(5, Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
        const clickY = Math.max(10, Math.min(92, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
        const updated = room.placedItems.map((p) =>
          p.instanceId === selectedInstanceId ? { ...p, x: clickX, y: clickY } : p
        );
        onUpdatePlacedItems(updated);
        sound.playPop();
        return;
      }
      // In Decorate Mode, clicking empty canvas does NOT deselect the object.
      // The object remains selected until the user presses Done, Cancel, Store,
      // taps another object, or exits decorate mode.
      return;
    }

    if (!canvasRef.current || !character || !onUpdateCharacter) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.max(45, Math.min(88, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    // Distance-based interaction buffer / hysteresis:
    // If the player clicks far away across the room (>35%), close the panel.
    // If the click is a minor adjustment near the object, keep the panel open.
    if (selectedInteractiveObject) {
      const targetPlaced =
        room.placedItems.find((p) => p.instanceId === selectedInteractiveObject.instanceId) ||
        selectedInteractiveObject.placed;
      const dx = clickX - targetPlaced.x;
      const dy = clickY - targetPlaced.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 35) {
        setSelectedInteractiveObject(null);
      }
    }

    const facing = clickX < character.x ? 'left' : 'right';

    // Start walking animation
    sound.playPop();
    onUpdateCharacter({
      ...character,
      x: clickX,
      y: clickY,
      facing,
      animation: 'walking'
    });

    // Settle to idle after brief walk
    setTimeout(() => {
      onUpdateCharacter({
        ...character,
        x: clickX,
        y: clickY,
        facing,
        animation: 'idle'
      });
    }, 600);
  };

  // Determine contextual actions for any object in the room
  const getItemActions = (itemDef: HomeItem): { action: FurnitureActionType; label: string; icon: string }[] => {
    const id = itemDef.id.toLowerCase();
    const name = itemDef.name.toLowerCase();

    // 🐾 Animals: Cat (Luna)
    if (id.includes('cat') || id.includes('luna') || name.includes('cat')) {
      return [
        { action: 'pet', label: 'Pet', icon: '🐾' },
        { action: 'play', label: 'Play', icon: '🎾' },
        { action: 'sleep', label: 'Sleep', icon: '😴' },
        { action: 'stretch', label: 'Stretch', icon: '✨' },
        { action: 'groom', label: 'Groom', icon: '🧼' }
      ];
    }

    // 🐾 Animals: Dog (Sparky)
    if (id.includes('pup') || id.includes('dog') || id.includes('sparky') || name.includes('pup') || name.includes('dog')) {
      return [
        { action: 'pet', label: 'Pet', icon: '🐾' },
        { action: 'play', label: 'Play', icon: '🎾' },
        { action: 'sit', label: 'Sit', icon: '🪑' },
        { action: 'sleep', label: 'Sleep', icon: '😴' }
      ];
    }

    // 🐾 Animals: Rabbit (Pippin)
    if (id.includes('bunny') || id.includes('rabbit') || id.includes('pippin') || name.includes('bunny') || name.includes('rabbit')) {
      return [
        { action: 'pet', label: 'Pet', icon: '🐾' },
        { action: 'feed', label: 'Feed', icon: '🥕' },
        { action: 'hop', label: 'Hop', icon: '🐇' }
      ];
    }

    // 🐾 Animals: Bird / Owl (Barnaby)
    if (id.includes('owl') || id.includes('bird') || id.includes('barnaby') || name.includes('owl') || name.includes('bird')) {
      return [
        { action: 'talk', label: 'Talk', icon: '💬' },
        { action: 'feed', label: 'Feed', icon: '🌾' },
        { action: 'fly', label: 'Fly to perch', icon: '🪶' }
      ];
    }

    // 🐾 Animals: Fox (Pip)
    if (id.includes('fox') || name.includes('fox')) {
      return [
        { action: 'pet', label: 'Pet', icon: '🐾' },
        { action: 'play', label: 'Play', icon: '🎾' },
        { action: 'sleep', label: 'Sleep', icon: '😴' }
      ];
    }

    // 🌿 Botanical Plants
    if (
      id.includes('plant') || id.includes('monstera') || id.includes('succulent') ||
      id.includes('fern') || id.includes('flower') || id.includes('pothos') ||
      id.includes('snake') || id.includes('lily') || name.includes('plant') ||
      name.includes('monstera') || name.includes('succulent') || name.includes('fern')
    ) {
      return [
        { action: 'waterPlant', label: 'Water', icon: '💧' },
        { action: 'observePlant', label: 'Observe', icon: '🌱' }
      ];
    }

    // 🛏️ Beds
    if (id.includes('bed') || name.includes('bed')) {
      return [
        { action: 'sit', label: 'Sit', icon: '🪑' },
        { action: 'sleep', label: 'Sleep', icon: '😴' },
        { action: 'messBed', label: 'Mess Up Bed', icon: '🤪' },
        { action: 'makeBed', label: 'Make Bed', icon: '✨' }
      ];
    }

    // 🛋️ Chairs & Sofas
    if (id.includes('chair') || id.includes('sofa') || id.includes('cushion') || id.includes('armchair') || name.includes('chair') || name.includes('sofa')) {
      return [
        { action: 'sit', label: 'Sit', icon: '🪑' },
        { action: 'sit', label: 'Relax', icon: '☕' }
      ];
    }

    // 📚 Bookshelves & Desks
    if (id.includes('book') || id.includes('shelf') || id.includes('desk') || name.includes('book') || name.includes('shelf') || name.includes('desk')) {
      return [
        { action: 'browseBooks', label: 'Browse Books', icon: '📚' },
        { action: 'read', label: 'Read', icon: '📖' }
      ];
    }

    // 💡 Lighting
    if (id.includes('lamp') || id.includes('candle') || id.includes('lantern') || id.includes('light') || name.includes('lamp') || name.includes('light')) {
      return [
        { action: 'turnOn', label: 'Turn On', icon: '💡' },
        { action: 'turnOff', label: 'Turn Off', icon: '🌙' }
      ];
    }

    // 🪟 Windows
    if (id.includes('window') || name.includes('window')) {
      return [
        { action: 'openWindow', label: 'Open Window', icon: '🌤️' },
        { action: 'closeWindow', label: 'Close Window', icon: '🪟' }
      ];
    }

    // 🚪 Doors
    if (id.includes('door') || name.includes('door')) {
      return [
        { action: 'openDoor', label: 'Open Door', icon: '🚪' },
        { action: 'closeDoor', label: 'Close Door', icon: '🔒' }
      ];
    }

    if (itemDef.actions && itemDef.actions.length > 0) {
      return itemDef.actions.map(act => ({ action: act, label: act, icon: '✨' }));
    }

    return [{ action: 'sit', label: 'Sit', icon: '🪑' }];
  };

  // Periodic subtle idle movements and pose adjustments for animals
  useEffect(() => {
    if (isDecoratingMode) return;

    const interval = setInterval(() => {
      const animalItems = room.placedItems
        .map((p, index) => ({ p, index, def: itemMap.current.get(p.itemId) }))
        .filter(({ def }) => {
          if (!def) return false;
          const id = def.id.toLowerCase();
          const name = def.name.toLowerCase();
          return (
            def.category === 'companion' ||
            id.startsWith('pet-') ||
            id.includes('cat') ||
            id.includes('dog') ||
            id.includes('pup') ||
            id.includes('bunny') ||
            id.includes('owl') ||
            id.includes('fox') ||
            name.includes('cat') ||
            name.includes('dog') ||
            name.includes('bunny') ||
            name.includes('owl') ||
            name.includes('fox')
          );
        });

      if (animalItems.length === 0) return;

      const randomChoice = animalItems[Math.floor(Math.random() * animalItems.length)];
      const idleAnimations = ['idle', 'stretch', 'play', 'idle', 'hop'];
      const nextAnimation = idleAnimations[Math.floor(Math.random() * idleAnimations.length)];

      const deltaX = (Math.random() - 0.5) * 4;
      const newX = Math.max(15, Math.min(85, Math.round(randomChoice.p.x + deltaX)));

      const updated = room.placedItems.map((item, idx) => {
        if (idx === randomChoice.index) {
          return { ...item, x: newX, state: nextAnimation };
        }
        return item;
      });

      onUpdatePlacedItems(updated);

      setTimeout(() => {
        const reset = room.placedItems.map((item, idx) => {
          if (idx === randomChoice.index && item.state === nextAnimation) {
            return { ...item, state: 'idle' };
          }
          return item;
        });
        onUpdatePlacedItems(reset);
      }, 3500);
    }, 15000);

    return () => clearInterval(interval);
  }, [isDecoratingMode, room.placedItems, onUpdatePlacedItems]);

  // Handle clicks on items in Play Mode
  const handleItemInteraction = (placed: PlacedHomeItem, itemDef?: HomeItem) => {
    if (!itemDef) return;

    sound.playPop();

    // Move character toward item
    if (character && onUpdateCharacter) {
      const facing = placed.x < character.x ? 'left' : 'right';
      const targetCharX = Math.max(10, Math.min(90, placed.x + (facing === 'left' ? 12 : -12)));
      const targetCharY = Math.max(50, Math.min(85, placed.y));

      onUpdateCharacter({
        ...character,
        x: targetCharX,
        y: targetCharY,
        facing: placed.x < targetCharX ? 'left' : 'right',
        animation: 'walking'
      });

      setTimeout(() => {
        onUpdateCharacter({
          ...character,
          x: targetCharX,
          y: targetCharY,
          facing: placed.x < targetCharX ? 'left' : 'right',
          animation: 'idle'
        });
      }, 400);
    }

    // Special item logic: Knowledge flower
    if (itemDef.interactiveType === 'knowledge_flower' && itemDef.interactiveData?.word) {
      setSelectedInteractiveObject(null);
      setActiveWordCard({
        word: itemDef.interactiveData.word,
        definition: itemDef.interactiveData.definition || 'A marvelous word you mastered!'
      });
      return;
    }

    // Special item logic: Station
    if (itemDef.interactiveData?.targetSection) {
      setSelectedInteractiveObject(null);
      setInteractiveStation({
        title: itemDef.interactiveData.title || itemDef.name,
        description: itemDef.interactiveData.description || 'Open this interactive learning station.',
        targetSection: itemDef.interactiveData.targetSection
      });
      return;
    }

    // Set persistent interactive target (Play Mode)
    setSelectedInteractiveObject({
      instanceId: placed.instanceId,
      placed,
      item: itemDef
    });
  };

  // Perform furniture/animal/plant specific action
  const handlePerformAction = (action: FurnitureActionType, instanceId: string) => {
    sound.playPop();
    const placed = room.placedItems.find((p) => p.instanceId === instanceId);
    if (!placed) return;
    const itemDef = itemMap.current.get(placed.itemId);
    const itemName = itemDef?.name || 'Cozy Item';

    // 1. PET
    if (action === 'pet') {
      sound.playSuccessChime();
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'pet' } : p
      );
      onUpdatePlacedItems(updated);

      const petDialogue = itemDef?.interactiveData?.petDialogue;
      const petName = itemDef?.interactiveData?.petName || itemName;
      setCharacterBubble(petDialogue ? `${petName}: "${petDialogue}"` : `${petName} purrs happily! 🐾`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 3500);
    }
    // 2. PLAY
    else if (action === 'play') {
      sound.playSuccessChime();
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'play' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(`Playing games together with ${itemName}! 🎾`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 3000);
    }
    // 3. SLEEP
    else if (action === 'sleep') {
      sound.playSuccessChime();
      const isAnimal = itemDef?.category === 'companion' || itemDef?.id.includes('pet');
      if (isAnimal) {
        const updated = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'sleep' } : p
        );
        onUpdatePlacedItems(updated);
        setCharacterBubble(`${itemName} curled up for a peaceful nap! 💤`);

        setTimeout(() => {
          const reset = room.placedItems.map((p) =>
            p.instanceId === instanceId ? { ...p, state: 'idle' } : p
          );
          onUpdatePlacedItems(reset);
          setCharacterBubble(null);
        }, 4000);
      } else {
        if (character && onUpdateCharacter) {
          onUpdateCharacter({ ...character, animation: 'sleeping' });
          setCharacterBubble('Nap time in the cozy bed! 💤');
          setTimeout(() => setCharacterBubble(null), 3500);
        }
      }
    }
    // 4. STRETCH
    else if (action === 'stretch') {
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'stretch' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(`${itemName} does a big, cozy stretch! 🐾`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 3000);
    }
    // 5. GROOM
    else if (action === 'groom') {
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'groom' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(`${itemName} washes fluffy paws and fur! ✨`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 3000);
    }
    // 6. FEED
    else if (action === 'feed') {
      sound.playSuccessChime();
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'feed' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(`Crunch crunch! Healthy treat for ${itemName}! 🥕`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 3000);
    }
    // 7. HOP
    else if (action === 'hop') {
      sound.playPop();
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'hop' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(`Boing boing! Happy hop! 🐇`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 2500);
    }
    // 8. TALK
    else if (action === 'talk') {
      sound.playSuccessChime();
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'talk' } : p
      );
      onUpdatePlacedItems(updated);
      const dialogue = itemDef?.interactiveData?.petDialogue || 'Hoo-hoo! Did you know words are seeds of wisdom?';
      setCharacterBubble(`${itemName}: "${dialogue}" 🦉`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 4000);
    }
    // 9. FLY TO PERCH
    else if (action === 'fly') {
      sound.playPop();
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'fly' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(`${itemName} flutters up gracefully to perch! 🪶`);

      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 3000);
    }
    // 10. WATER PLANT
    else if (action === 'waterPlant') {
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'watered' } : p
      );
      onUpdatePlacedItems(updated);

      if (character && onUpdateCharacter) {
        onUpdateCharacter({ ...character, animation: 'watering' });
        setCharacterBubble(`Watered ${itemName} with love! 💧`);
        setTimeout(() => {
          onUpdateCharacter({ ...character, animation: 'idle' });
          setCharacterBubble(null);
        }, 3000);
      }
    }
    // 11. OBSERVE PLANT
    else if (action === 'observePlant') {
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'observed' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(`Observing ${itemName}: Vibrant and thriving! 🌱`);
      setTimeout(() => {
        const reset = room.placedItems.map((p) =>
          p.instanceId === instanceId ? { ...p, state: 'idle' } : p
        );
        onUpdatePlacedItems(reset);
        setCharacterBubble(null);
      }, 3000);
    }
    // 12. SIT
    else if (action === 'sit') {
      if (character && onUpdateCharacter) {
        onUpdateCharacter({ ...character, animation: 'sitting' });
        setCharacterBubble(`So comfortable and cozy on ${itemName}! 🪑`);
        setTimeout(() => setCharacterBubble(null), 2500);
      }
    }
    // 13. READ / BROWSE BOOKS
    else if (action === 'read' || action === 'browseBooks') {
      if (character && onUpdateCharacter) {
        onUpdateCharacter({ ...character, animation: 'reading' });
        setCharacterBubble('Reading a lovely chapter! 📖');
        setTimeout(() => setCharacterBubble(null), 3000);
      }
    }
    // 14. BED TIDY / MESSY
    else if (action === 'messBed') {
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'messy' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble('Playful messy daybed mode! 🤪');
      setTimeout(() => setCharacterBubble(null), 2500);
    } else if (action === 'makeBed') {
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: 'neat' } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble('All tidy and neatly made! ✨');
      setTimeout(() => setCharacterBubble(null), 2500);
    }
    // 15. LIGHTS
    else if (action === 'turnOn' || action === 'turnOff') {
      const nextState = placed.state === 'turned_off' ? 'turned_on' : 'turned_off';
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: nextState } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(nextState === 'turned_on' ? 'Warm light shining bright! 💡' : 'Night light dimmed 🌙');
      setTimeout(() => setCharacterBubble(null), 2500);
    }
    // 16. WINDOWS & DOORS
    else if (action === 'openDoor' || action === 'closeDoor' || action === 'openWindow' || action === 'closeWindow') {
      const nextState = placed.state === 'open' ? 'closed' : 'open';
      const updated = room.placedItems.map((p) =>
        p.instanceId === instanceId ? { ...p, state: nextState } : p
      );
      onUpdatePlacedItems(updated);
      setCharacterBubble(nextState === 'open' ? 'Fresh gentle air! 🌤️' : 'Snug and cozy! 🏡');
      setTimeout(() => setCharacterBubble(null), 2500);
    }
  };

  // Rotate item by 90 degrees
  const handleRotate = () => {
    if (!selectedInstanceId) return;
    sound.playPop();
    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        const nextRotation = (p.rotation + 90) % 360;
        return { ...p, rotation: nextRotation };
      }
      return p;
    });
    onUpdatePlacedItems(updated);
  };

  // Scale item up or down
  const handleScaleChange = (delta: number) => {
    if (!selectedInstanceId) return;
    sound.playPop();
    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        const nextScale = Math.max(0.6, Math.min(2.0, parseFloat((p.scale + delta).toFixed(2))));
        return { ...p, scale: nextScale };
      }
      return p;
    });
    onUpdatePlacedItems(updated);
  };

  // Bring item forward in z-index
  const handleBringForward = () => {
    if (!selectedInstanceId) return;
    sound.playPop();
    const maxZ = Math.max(10, ...room.placedItems.map((p) => p.zIndex || 10));
    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        return { ...p, zIndex: maxZ + 1 };
      }
      return p;
    });
    onUpdatePlacedItems(updated);
  };

  // Nudge item with fine directional steps
  const handleNudgeMove = (deltaX: number, deltaY: number) => {
    if (!selectedInstanceId) return;
    sound.playPop();
    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        const nextX = Math.max(5, Math.min(95, p.x + deltaX));
        const nextY = Math.max(10, Math.min(92, p.y + deltaY));
        return { ...p, x: nextX, y: nextY };
      }
      return p;
    });
    onUpdatePlacedItems(updated);
  };

  // Revert changes to before this edit session started
  const handleCancelEdit = () => {
    if (originalTransformRef.current && selectedInstanceId) {
      const orig = originalTransformRef.current;
      const reverted = room.placedItems.map((p) =>
        p.instanceId === orig.instanceId
          ? {
              ...p,
              x: orig.x,
              y: orig.y,
              scale: orig.scale,
              rotation: orig.rotation,
              zIndex: orig.zIndex
            }
          : p
      );
      onUpdatePlacedItems(reverted);
    }
    sound.playPop();
    setSelectedInstanceId(null);
    setIsMovingActive(false);
    originalTransformRef.current = null;
  };

  // Check if any lamp is turned on to add warm lighting glow
  const hasActiveLamp = room.placedItems.some((p) => {
    const def = itemMap.current.get(p.itemId);
    return (
      (def?.shopCategory === 'lighting' || def?.id.includes('lamp')) &&
      p.state !== 'turned_off'
    );
  });

  return (
    <div className="relative w-full select-none">
      {/* 🏡 3D Perspective Room Stage */}
      <div
        ref={canvasRef}
        id="learning-home-canvas"
        onPointerMove={handleCanvasPointerMove}
        onClick={handleCanvasClick}
        className={`relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 transition-all ${room.wallpaperClass}`}
        style={{
          perspective: '1000px',
          touchAction: 'none'
        }}
      >
        {/* Architectural Ceiling Molding */}
        <div className="absolute top-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-b from-white/40 to-transparent pointer-events-none border-b border-white/20 z-1" />

        {/* Ambient Room Lighting Glow when lamps are active or theme-based atmospheric lighting */}
        {hasActiveLamp && (
          <div className="absolute inset-0 bg-amber-300/15 pointer-events-none mix-blend-soft-light z-2 animate-pulse duration-3000" />
        )}
        {activeTheme.home?.lighting === 'sunset' && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-400/10 via-amber-300/10 to-rose-400/10 pointer-events-none mix-blend-soft-light z-2" />
        )}
        {activeTheme.home?.lighting === 'neon' && (
          <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600/10 via-purple-500/10 to-indigo-600/10 pointer-events-none mix-blend-screen z-2" />
        )}
        {activeTheme.home?.lighting === 'cool_futuristic' && (
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-blue-500/10 to-transparent pointer-events-none mix-blend-screen z-2" />
        )}
        {activeTheme.home?.lighting === 'candlelight' && (
          <div className="absolute inset-0 bg-amber-600/15 pointer-events-none mix-blend-soft-light z-2" />
        )}

        {/* Room Window with Theme-Specific Scenery (Stars, Ocean, Forest, Mountains, Garden, etc.) */}
        <div className="absolute top-8 right-10 sm:right-16 w-24 sm:w-36 h-28 sm:h-40 rounded-t-full border-4 border-white/85 shadow-inner backdrop-blur-xs flex items-center justify-center pointer-events-none z-1 overflow-hidden">
          {activeTheme.home?.windowView === 'stars' ? (
            <div className="w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 flex flex-col items-center justify-center relative">
              <span className="text-xl sm:text-2xl animate-pulse">🪐</span>
              <div className="absolute top-2 left-3 text-[10px] text-amber-200">✨</div>
              <div className="absolute bottom-4 right-3 text-[10px] text-cyan-200">⭐</div>
              <div className="absolute top-6 right-4 text-[9px] text-white">✨</div>
            </div>
          ) : activeTheme.home?.windowView === 'ocean' ? (
            <div className="w-full h-full bg-gradient-to-b from-sky-400 via-cyan-300 to-teal-300 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl">⛵</span>
              <div className="absolute bottom-1 inset-x-0 text-center text-xs opacity-70">🌊🌊</div>
              <div className="absolute top-2 right-2 text-xs">☀️</div>
            </div>
          ) : activeTheme.home?.windowView === 'forest' ? (
            <div className="w-full h-full bg-gradient-to-b from-emerald-300 via-green-400 to-lime-200 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl">🌲</span>
              <div className="absolute top-2 right-3 text-xs">🦅</div>
              <div className="absolute bottom-1 left-2 text-xs">🍃</div>
            </div>
          ) : activeTheme.home?.windowView === 'mountains' ? (
            <div className="w-full h-full bg-gradient-to-b from-sky-400 via-slate-200 to-indigo-100 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl">🏔️</span>
              <div className="absolute top-3 left-3 text-xs">🦅</div>
            </div>
          ) : activeTheme.home?.windowView === 'arcade' ? (
            <div className="w-full h-full bg-gradient-to-b from-fuchsia-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center relative">
              <span className="text-xl sm:text-2xl animate-bounce">👾</span>
              <div className="absolute bottom-1 inset-x-0 text-center text-[10px] text-pink-400 font-mono">===</div>
            </div>
          ) : activeTheme.home?.windowView === 'stadium' ? (
            <div className="w-full h-full bg-gradient-to-b from-sky-400 via-emerald-300 to-green-600 flex flex-col items-center justify-center relative">
              <span className="text-xl sm:text-2xl">🏟️</span>
              <div className="absolute bottom-2 right-3 text-xs">⚽</div>
            </div>
          ) : activeTheme.home?.windowView === 'lab' ? (
            <div className="w-full h-full bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-800 flex flex-col items-center justify-center relative">
              <span className="text-xl sm:text-2xl animate-spin text-cyan-300">⚛️</span>
              <div className="absolute top-2 right-2 text-xs">🔬</div>
            </div>
          ) : activeTheme.home?.windowView === 'studio' ? (
            <div className="w-full h-full bg-gradient-to-b from-rose-200 via-amber-200 to-orange-300 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl">🎨</span>
              <div className="absolute top-2 right-2 text-xs">🌤️</div>
            </div>
          ) : activeTheme.home?.windowView === 'peaceful_terrace' ? (
            <div className="w-full h-full bg-gradient-to-b from-amber-100 via-orange-100 to-stone-200 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl">🕊️</span>
              <div className="absolute bottom-1 text-xs">🌿</div>
              <div className="absolute top-2 right-2 text-xs">☀️</div>
            </div>
          ) : activeTheme.home?.windowView === 'city' ? (
            <div className="w-full h-full bg-gradient-to-b from-sky-300 via-amber-100 to-stone-200 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl">🏙️</span>
              <div className="absolute top-2 right-2 text-xs">🌤️</div>
            </div>
          ) : activeTheme.home?.windowView === 'garden' ? (
            <div className="w-full h-full bg-gradient-to-b from-rose-100 via-pink-100 to-amber-100 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl">🌸</span>
              <div className="absolute top-2 right-2 text-xs">🦋</div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-sky-200/50 via-cyan-100/30 to-amber-100/20 flex items-center justify-center relative">
              <span className="text-2xl sm:text-4xl opacity-70 select-none">☀️</span>
            </div>
          )}
          {/* Window Frame Panes */}
          <div className="w-full h-0.5 bg-white/70 absolute top-1/2" />
          <div className="h-full w-0.5 bg-white/70 absolute left-1/2" />
        </div>

        {/* Left & Right Corner Shadow Depths */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-2" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-2" />

        {/* Realistic Perspective Flooring Area (Bottom 42%) */}
        <div
          className={`absolute bottom-0 inset-x-0 h-[42%] pointer-events-none z-2 ${room.flooringClass}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'perspective(400px) rotateX(18deg)',
            transformOrigin: 'bottom'
          }}
        >
          {/* Subtle wood plank lines texture */}
          <div className="w-full h-full opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Baseboard Wall Divider */}
        <div className="absolute bottom-[42%] inset-x-0 h-2 bg-gradient-to-b from-black/10 to-white/40 pointer-events-none z-2" />

        {/* Placed Items Render Loop */}
        {room.placedItems.map((placed) => {
          const itemDef = itemMap.current.get(placed.itemId);
          if (!itemDef) return null;

          const isSelected = placed.instanceId === selectedInstanceId && isDecoratingMode;
          const isInteractiveSelected = !isDecoratingMode && selectedInteractiveObject?.instanceId === placed.instanceId;
          const isSticker = itemDef.category === 'sticker';

          return (
            <div
              key={placed.instanceId}
              id={`home-item-${placed.instanceId}`}
              onPointerDown={(e) => handleItemPointerDown(e, placed, itemDef)}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`absolute cursor-pointer ${
                isDraggingRef.current && isSelected ? 'transition-none' : 'transition-transform'
              } ${
                isSelected
                  ? 'ring-4 ring-amber-500 ring-offset-2 ring-offset-white/80 rounded-2xl shadow-2xl scale-[1.02]'
                  : isInteractiveSelected
                  ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white/80 rounded-2xl shadow-xl scale-[1.03]'
                  : isDecoratingMode
                  ? 'hover:scale-105 hover:ring-2 hover:ring-amber-300 rounded-xl'
                  : 'hover:scale-103'
              } flex flex-col items-center justify-center touch-none`}
              style={{
                left: `${placed.x}%`,
                top: `${placed.y}%`,
                transform: `translate(-50%, -50%) rotate(${placed.rotation}deg) scale(${placed.scale})`,
                transformOrigin: 'center center',
                zIndex: isSelected || isInteractiveSelected ? 99 : placed.zIndex || 10
              }}
            >
              {/* Item Visual Rendering using MiniatureFurnitureRenderer */}
              <div className="relative group">
                {isSticker ? (
                  <span className="block text-4xl sm:text-6xl drop-shadow-md select-none">
                    {itemDef.icon}
                  </span>
                ) : (
                  <div className="select-none pointer-events-none">
                    <MiniatureFurnitureRenderer
                      item={itemDef}
                      state={placed.state}
                      isLit={placed.state !== 'turned_off'}
                      size="md"
                    />
                  </div>
                )}

                {/* Play mode subtle hover tag */}
                {!isDecoratingMode && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-stone-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                    {itemDef.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 👤 Live Customizable Miniature Character */}
        {character && (
          <div
            id="home-mini-character"
            className="absolute transition-all duration-500 ease-out z-30"
            style={{
              left: `${character.x}%`,
              top: `${character.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <HomeCharacter
              state={character}
              bubbleMessage={characterBubble}
              onClick={() => {
                sound.playPop();
                setCharacterBubble('Hi there! Let’s keep learning! 🌟');
                setTimeout(() => setCharacterBubble(null), 2500);
              }}
            />
          </div>
        )}

        {/* 🛠️ Contextual Collision-Free Decorate Control Panel (Mobile Sheet + Desktop Clamped Floating Toolbar) */}
        {selectedPlacedItem && selectedItemDef && isDecoratingMode && (
          <DecorateControlPanel
            placedItem={selectedPlacedItem}
            itemDef={selectedItemDef}
            canvasElement={canvasRef.current}
            onScaleChange={handleScaleChange}
            onRotate={handleRotate}
            onNudgeMove={handleNudgeMove}
            onBringForward={handleBringForward}
            onStoreItem={() => {
              sound.playPop();
              if (onStoreItem) {
                onStoreItem(selectedPlacedItem.instanceId);
              } else {
                onRemoveItem(selectedPlacedItem.instanceId);
              }
              setSelectedInstanceId(null);
              setIsMovingActive(false);
              originalTransformRef.current = null;
            }}
            onUndo={onUndo || (() => {})}
            canUndo={!!canUndo}
            onCancel={handleCancelEdit}
            onDone={() => {
              setSelectedInstanceId(null);
              setIsMovingActive(false);
              originalTransformRef.current = null;
            }}
            isMovingActive={isMovingActive}
            onToggleMoveActive={() => setIsMovingActive(!isMovingActive)}
          />
        )}

        {/* Empty Room Hint */}
        {room.placedItems.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-stone-400">
            <span className="text-5xl mb-2 animate-pulse">🏡</span>
            <p className="font-extrabold text-sm sm:text-base text-stone-700">
              Your room is ready for decorating!
            </p>
            <p className="text-xs text-stone-500">
              Tap "🛍️ Shop" or "🎒 Inventory" below to place cozy miniature furniture.
            </p>
          </div>
        )}
      </div>

      {/* 🎮 Persistent Player-to-Item Interaction Panel (Play Mode) */}
      {selectedInteractiveObject &&
        activeSelectedInteractivePlaced &&
        activeSelectedInteractiveDef &&
        !isDecoratingMode && (
          <PlayInteractionPanel
            selectedObject={{
              instanceId: selectedInteractiveObject.instanceId,
              placed: activeSelectedInteractivePlaced,
              item: activeSelectedInteractiveDef
            }}
            actions={getItemActions(activeSelectedInteractiveDef)}
            onPerformAction={(action) =>
              handlePerformAction(action, selectedInteractiveObject.instanceId)
            }
            onClose={() => setSelectedInteractiveObject(null)}
          />
        )}

      {/* --- POPUP DIALOGS FOR INTERACTIVE STATIONS --- */}

      {/* 🐾 Pet Dialogue Speech Bubble */}
      {activePetDialogue && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-amber-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <span className="text-5xl block animate-bounce">🐾</span>
            <h4 className="text-xl font-extrabold text-stone-900">
              {activePetDialogue.name} says:
            </h4>
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-950 font-semibold text-sm leading-relaxed border border-amber-100">
              "{activePetDialogue.text}"
            </div>
            <button
              onClick={() => {
                sound.playPop();
                setActivePetDialogue(null);
              }}
              className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm cursor-pointer shadow-md transition-all active:scale-95"
            >
              Thanks, {activePetDialogue.name}! 🌸
            </button>
          </div>
        </div>
      )}

      {/* 🌸 Knowledge Flower Word Inspector Modal */}
      {activeWordCard && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-emerald-200 shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-4xl">🌺</span>
              <button
                onClick={() => setActiveWordCard(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Mastered Knowledge Flower
              </span>
              <h4 className="text-2xl font-extrabold text-stone-900">
                {activeWordCard.word}
              </h4>
            </div>
            <p className="text-sm text-stone-600 font-medium leading-relaxed bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
              "{activeWordCard.definition}"
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => sound.speak(activeWordCard.word)}
                className="flex-1 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Word</span>
              </button>
              <button
                onClick={() => setActiveWordCard(null)}
                className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Keep Blooming 🌸
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📚 Interactive Station (Reading Corner / Desk / Spelling Lab) */}
      {interactiveStation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-indigo-200 shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-4xl">✨</span>
              <button
                onClick={() => setInteractiveStation(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-stone-900">
                {interactiveStation.title}
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                {interactiveStation.description}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setInteractiveStation(null)}
                className="flex-1 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs cursor-pointer"
              >
                Stay in Home
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  const target = interactiveStation.targetSection;
                  setInteractiveStation(null);
                  onSelectSection(target);
                }}
                className="flex-1 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Jump In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
