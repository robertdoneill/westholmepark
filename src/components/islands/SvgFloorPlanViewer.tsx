import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Layers, Maximize2, Minus, Plus, RotateCcw, DoorOpen, Bath, ArrowRight, ArrowUp } from 'lucide-react';

type FloorPlan = {
  id: string;
  label: string;
  name: string;
  src: string;
  alt: string;
  aspect: string;
  summary: string;
  stats: string[];
};

type Room = {
  id: string;
  number: string;
  name: string;
  sqft: number;
  type?: string;
  bbox: { x: number; y: number; w: number; h: number };
};

const plans: FloorPlan[] = [
  {
    id: 'overview',
    label: 'Overview',
    name: 'All Floors',
    src: '/floor-plans/svg/westholme-all-floors.svg',
    alt: 'Westholme Park vector floor plans overview',
    aspect: '72 / 105',
    summary: 'Three converted vector plans stacked together for quick comparison.',
    stats: ['Ground floor', 'Second floor', 'Third floor', 'Vector SVG'],
  },
  {
    id: 'floor-1',
    label: 'Floor 1',
    name: 'Ground Floor',
    src: '/floor-plans/svg/westholme-floor-1.svg',
    alt: 'Westholme Park ground floor vector plan',
    aspect: '44 / 29',
    summary: 'Common spaces, courtyard-facing rooms, bathrooms, stairs, and the ground-floor bedroom wing.',
    stats: ['Living room', 'Kitchen', 'Dining', 'Bedrooms 100-115'],
  },
  {
    id: 'floor-2',
    label: 'Floor 2',
    name: 'Second Floor',
    src: '/floor-plans/svg/westholme-floor-2.svg',
    alt: 'Westholme Park second floor vector plan',
    aspect: '62 / 27',
    summary: 'Main residential floor with bedrooms arranged around hallways, shared baths, and storage.',
    stats: ['Bedroom rows', 'Hall baths', 'Storage', 'Central stairs'],
  },
  {
    id: 'floor-3',
    label: 'Floor 3',
    name: 'Third Floor',
    src: '/floor-plans/svg/westholme-floor-3.svg',
    alt: 'Westholme Park third floor vector plan',
    aspect: '48 / 30',
    summary: 'Upper-level rooms with bath access, stairs, fire escape, and roof-edge context.',
    stats: ['Upper rooms', 'Shared bath', 'Fire escape', 'Roof outline'],
  },
];

const floor3ViewBox = { x: 970, y: 408, w: 48, h: 30 };

const floor3Rooms: Room[] = [
  {
    id: 'room-340',
    number: '340',
    name: 'Room 340',
    sqft: 440.8,
    type: 'Double',
    bbox: { x: 985, y: 410, w: 10, h: 10 },
  },
  {
    id: 'room-350',
    number: '350',
    name: 'Room 350',
    sqft: 461.8,
    type: 'Double',
    bbox: { x: 995, y: 410, w: 10, h: 10 },
  },
  {
    id: 'room-330',
    number: '330',
    name: 'Room 330',
    sqft: 169.8,
    type: 'Private',
    bbox: { x: 985, y: 420, w: 10, h: 5 },
  },
  {
    id: 'room-320',
    number: '320',
    name: 'Room 320',
    sqft: 149.7,
    type: 'Private',
    bbox: { x: 985, y: 425, w: 8, h: 7 },
  },
  {
    id: 'room-310',
    number: '310',
    name: 'Room 310',
    sqft: 152.2,
    type: 'Private',
    bbox: { x: 993, y: 425, w: 8, h: 7 },
  },
  {
    id: 'room-300',
    number: '300',
    name: 'Room 300',
    sqft: 152.0,
    type: 'Private',
    bbox: { x: 1001, y: 425, w: 9, h: 7 },
  },
  {
    id: 'bath',
    number: '',
    name: 'Shared Bath',
    sqft: 0,
    bbox: { x: 995, y: 420, w: 8, h: 5 },
  },
  {
    id: 'stairs',
    number: '',
    name: 'Stairs',
    sqft: 0,
    bbox: { x: 995, y: 415, w: 8, h: 5 },
  },
  {
    id: 'fire-escape',
    number: '',
    name: 'Fire Escape',
    sqft: 0,
    bbox: { x: 1003, y: 420, w: 7, h: 12 },
  },
];

function useMeasuredOverlay(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isActive: boolean
) {
  const [overlay, setOverlay] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const img = container.querySelector('img');
    if (!img) return;
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setOverlay({
      left: imgRect.left - containerRect.left,
      top: imgRect.top - containerRect.top,
      width: imgRect.width,
      height: imgRect.height,
    });
  }, [containerRef]);

  useEffect(() => {
    if (!isActive) return;
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) {
      ro.observe(containerRef.current);
      const img = containerRef.current.querySelector('img');
      if (img) {
        ro.observe(img);
        if ((img as HTMLImageElement).complete) measure();
        else img.addEventListener('load', measure);
      }
    }
    window.addEventListener('resize', measure);
    const timer = setTimeout(measure, 500);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
  }, [isActive, measure, containerRef]);

  return overlay;
}

function bboxToPercent(bbox: Room['bbox']) {
  return {
    left: ((bbox.x - floor3ViewBox.x) / floor3ViewBox.w) * 100,
    top: ((bbox.y - floor3ViewBox.y) / floor3ViewBox.h) * 100,
    width: (bbox.w / floor3ViewBox.w) * 100,
    height: (bbox.h / floor3ViewBox.h) * 100,
  };
}

export function SvgFloorPlanViewer() {
  const [planId, setPlanId] = useState('floor-3');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ pointerId: number; x: number; y: number } | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const plan = useMemo(() => plans.find((item) => item.id === planId) ?? plans[1], [planId]);
  const isFloor3 = plan.id === 'floor-3';
  const rooms = isFloor3 ? floor3Rooms : [];

  const activeRoomId = hoveredRoomId ?? selectedRoomId;
  const activeRoom = useMemo(
    () => rooms.find((r) => r.id === activeRoomId) ?? null,
    [rooms, activeRoomId]
  );

  const overlay = useMeasuredOverlay(containerRef, isFloor3);

  const choosePlan = (id: string) => {
    setPlanId(id);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedRoomId(null);
    setHoveredRoomId(null);
  };

  const updateZoom = (value: number) => {
    const next = Math.min(3, Math.max(1, Number(value.toFixed(2))));
    setZoom(next);
    if (next === 1) setPan({ x: 0, y: 0 });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedRoomId(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const idx = plans.findIndex((p) => p.id === planId);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = plans[(idx + 1) % plans.length];
        choosePlan(next.id);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = plans[(idx - 1 + plans.length) % plans.length];
        choosePlan(next.id);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        updateZoom(zoom + 0.25);
      } else if (e.key === '-') {
        e.preventDefault();
        updateZoom(zoom - 0.25);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        resetView();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [planId, zoom]);

  const residentialRooms = rooms.filter((r) => r.number && r.sqft > 0);

  return (
    <section className="mt-10 border border-border bg-card reveal">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 border-b border-border lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-4 border-b border-border bg-background/70 p-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted p-1 sm:inline-grid sm:grid-cols-4">
              {plans.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => choosePlan(item.id)}
                  className={`min-h-10 rounded-sm px-4 text-sm font-semibold transition-colors ${
                    plan.id === item.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateZoom(zoom - 0.25)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="min-w-14 text-center text-sm font-semibold tabular-nums text-muted-foreground">
                {Math.round(zoom * 100)}%
              </div>
              <button
                type="button"
                onClick={() => updateZoom(zoom + 0.25)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetView}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="Reset view"
                title="Reset view"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <a
                href={plan.src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="Open vector plan"
                title="Open vector plan"
              >
                <Maximize2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative overflow-hidden bg-white touch-none"
            onPointerDown={(event) => {
              if (zoom <= 1) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              setDrag({ pointerId: event.pointerId, x: event.clientX, y: event.clientY });
            }}
            onPointerMove={(event) => {
              if (!drag || drag.pointerId !== event.pointerId) return;
              setPan((current) => ({
                x: current.x + event.clientX - drag.x,
                y: current.y + event.clientY - drag.y,
              }));
              setDrag({ pointerId: event.pointerId, x: event.clientX, y: event.clientY });
            }}
            onPointerUp={(event) => {
              if (drag?.pointerId === event.pointerId) setDrag(null);
            }}
            onPointerCancel={() => setDrag(null)}
            onWheel={(event) => {
              if (!event.ctrlKey && !event.metaKey) return;
              event.preventDefault();
              updateZoom(zoom + (event.deltaY > 0 ? -0.15 : 0.15));
            }}
            onDoubleClick={() => updateZoom(zoom >= 2 ? 1 : zoom + 0.5)}
          >
            <div
              key={plan.id}
              className="mx-auto flex w-full max-w-[90rem] origin-center items-center justify-center p-3 transition-transform duration-300 ease-out sm:p-5"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            >
              <div
                className="relative"
                style={{ aspectRatio: plan.aspect, maxHeight: '85vh', maxWidth: '100%', width: '100%' }}
              >
                <img
                  src={plan.src}
                  alt={plan.alt}
                  className="absolute inset-0 h-full w-full select-none object-contain"
                  draggable={false}
                />
                {isFloor3 && overlay.width > 0 && (
                  <div
                    className="absolute z-10"
                    style={{
                      left: overlay.left,
                      top: overlay.top,
                      width: overlay.width,
                      height: overlay.height,
                    }}
                  >
                    {rooms.map((room) => {
                      const pct = bboxToPercent(room.bbox);
                      return (
                        <div
                          key={room.id}
                          className="absolute cursor-pointer transition-colors duration-200"
                          style={{
                            left: `${pct.left}%`,
                            top: `${pct.top}%`,
                            width: `${pct.width}%`,
                            height: `${pct.height}%`,
                            backgroundColor:
                              selectedRoomId === room.id
                                ? 'hsl(var(--primary) / 0.25)'
                                : hoveredRoomId === room.id
                                  ? 'hsl(var(--primary) / 0.15)'
                                  : 'transparent',
                            border:
                              selectedRoomId === room.id || hoveredRoomId === room.id
                                ? '1px solid hsl(var(--primary))'
                                : '1px solid transparent',
                          }}
                          onMouseEnter={() => setHoveredRoomId(room.id)}
                          onMouseLeave={() => setHoveredRoomId(null)}
                          onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                          onClick={() =>
                            setSelectedRoomId((prev) => (prev === room.id ? null : room.id))
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {activeRoom && hoveredRoomId && !selectedRoomId && (
              <div
                className="pointer-events-none absolute z-20 rounded-md border border-border bg-card px-3 py-2 shadow-lg"
                style={{
                  left: Math.min(
                    tooltipPos.x - (containerRef.current?.getBoundingClientRect().left ?? 0) + 16,
                    (containerRef.current?.clientWidth ?? 0) - 180
                  ),
                  top: Math.min(
                    tooltipPos.y - (containerRef.current?.getBoundingClientRect().top ?? 0) + 16,
                    (containerRef.current?.clientHeight ?? 0) - 60
                  ),
                }}
              >
                <p className="text-sm font-semibold text-foreground">{activeRoom.name}</p>
                {activeRoom.sqft > 0 && (
                  <p className="text-xs text-muted-foreground">{activeRoom.sqft} sq ft</p>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="bg-card p-5">
          {activeRoom ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {activeRoom.number ? `Room ${activeRoom.number}` : activeRoom.name}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-card-foreground">{activeRoom.name}</h2>
                </div>
                <DoorOpen className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {activeRoom.sqft > 0 && (
                  <div className="border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground">
                    {activeRoom.sqft} sq ft
                  </div>
                )}
                {activeRoom.type && (
                  <div className="border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground">
                    {activeRoom.type}
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {activeRoom.number
                  ? `Room ${activeRoom.number} is a ${activeRoom.type?.toLowerCase() ?? 'residential'} room on the third floor. Click "Ask About Availability" to check if this room is open for the upcoming lease cycle.`
                  : activeRoom.name === 'Shared Bath'
                    ? 'The shared bathroom on the third floor includes toilets, sinks, and showers accessible to all Floor 3 residents.'
                    : activeRoom.name === 'Stairs'
                      ? 'Central stairwell connecting Floor 3 to the rest of the house.'
                      : 'Fire escape access for the third floor, located on the east side of the building.'}
              </p>

              {activeRoom.number && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {['Furnished', 'WiFi', 'Utilities included', 'Shared bath access'].map((f) => (
                      <span key={f} className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedRoomId(null)}
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <ArrowRight className="h-3 w-3 rotate-180" /> Back to floor overview
              </button>

              <a
                href="/contact"
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ask About Availability
              </a>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{plan.label}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-card-foreground">{plan.name}</h2>
                </div>
                <Layers className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.summary}</p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {plan.stats.map((stat) => (
                  <div key={stat} className="border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground">
                    {stat}
                  </div>
                ))}
              </div>

              {isFloor3 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Room Directory</p>
                  <div className="mt-3 space-y-1.5">
                    {residentialRooms.map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          selectedRoomId === room.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className="font-semibold">{room.name}</span>
                        <span className="text-xs text-muted-foreground">{room.sqft} sq ft</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {[
                      { id: 'bath', name: 'Shared Bath', icon: Bath },
                      { id: 'stairs', name: 'Stairs', icon: ArrowUp },
                      { id: 'fire-escape', name: 'Fire Escape', icon: DoorOpen },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedRoomId(item.id)}
                        className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          selectedRoomId === item.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <a
                href="/contact"
                className="mt-6 inline-flex min-h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ask About Availability
              </a>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
