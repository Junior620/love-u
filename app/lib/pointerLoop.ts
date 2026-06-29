export type PointerState = {
  x: number;
  y: number;
  active: boolean;
  finePointer: boolean;
};

type PointerCallback = (state: PointerState) => void;
type FrameCallback = (state: PointerState) => void;

const state: PointerState = {
  x: 0,
  y: 0,
  active: false,
  finePointer: false,
};

const pointerSubs = new Set<PointerCallback>();
const frameSubs = new Set<FrameCallback>();

let raf = 0;
let listenersAttached = false;
let gyroMx = 0;
let gyroMy = 0;
let gyroListenerAttached = false;

function updateParallaxVars() {
  const root = document.documentElement;
  let mx: number;
  let my: number;

  if (state.finePointer && state.active) {
    mx = (state.x / window.innerWidth) * 2 - 1;
    my = (state.y / window.innerHeight) * 2 - 1;
  } else {
    mx = gyroMx;
    my = gyroMy;
  }

  root.style.setProperty("--mx", mx.toFixed(3));
  root.style.setProperty("--my", my.toFixed(3));
}

function tick() {
  updateParallaxVars();
  for (const cb of frameSubs) cb(state);
  raf = window.requestAnimationFrame(tick);
}

function startLoop() {
  if (raf) return;
  raf = window.requestAnimationFrame(tick);
}

function stopLoop() {
  if (raf) {
    window.cancelAnimationFrame(raf);
    raf = 0;
  }
}

function attachGyroListener() {
  if (gyroListenerAttached) return;
  gyroListenerAttached = true;

  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    gyroMx = Math.max(-1, Math.min(1, e.gamma / 45));
    gyroMy = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
  };

  window.addEventListener("deviceorientation", onOrient, { passive: true });
}

async function requestGyroPermission() {
  const req = (
    DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<PermissionState>;
    }
  ).requestPermission;

  if (typeof req === "function") {
    try {
      const result = await req();
      if (result === "granted") attachGyroListener();
    } catch {
      /* permission refusée */
    }
  } else {
    attachGyroListener();
  }
}

function ensureListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  state.x = window.innerWidth / 2;
  state.y = window.innerHeight / 2;
  state.finePointer = window.matchMedia("(pointer: fine)").matches;

  const onPointer = (e: PointerEvent) => {
    state.x = e.clientX;
    state.y = e.clientY;

    if (!state.active) {
      state.active = true;
      if (state.finePointer) {
        document.body.classList.add("cursor-fx-active");
      }
    }

    for (const cb of pointerSubs) cb(state);
  };

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });

  if (!state.finePointer) {
    window.addEventListener("pointerdown", () => requestGyroPermission(), {
      passive: true,
      once: true,
    });
    attachGyroListener();
  }
}

function maybeStop() {
  if (pointerSubs.size === 0 && frameSubs.size === 0) {
    stopLoop();
  }
}

export function getPointer(): PointerState {
  return { ...state };
}

export function subscribePointer(cb: PointerCallback): () => void {
  ensureListeners();
  pointerSubs.add(cb);
  return () => {
    pointerSubs.delete(cb);
  };
}

export function subscribeFrame(cb: FrameCallback): () => void {
  ensureListeners();
  frameSubs.add(cb);
  startLoop();
  return () => {
    frameSubs.delete(cb);
    maybeStop();
  };
}
