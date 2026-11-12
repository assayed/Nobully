import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Lang, num, StrKey, tr } from './i18n';
import { Profile } from './game/rules';

const KEY = 'herokid:v1';

type Saved = {
  lang: Lang;
  pin: string | null;
  profiles: Profile[];
  activeId: string | null;
  readAloud: boolean;
  sounds: boolean;
  music: boolean;
};

const initial: Saved = { lang: 'ar', pin: null, profiles: [], activeId: null, readAloud: true, sounds: true, music: true };

type Ctx = Saved & {
  ready: boolean;
  t: (k: StrKey) => string;
  n: (x: number) => string;
  rtl: boolean;
  active: Profile | null;
  set: (patch: Partial<Saved>) => void;
  upsertProfile: (p: Profile) => void;
  removeProfile: (id: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Saved>(initial);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setState({ ...initial, ...JSON.parse(raw) }); })
      .catch(() => {})
      .finally(() => { loaded.current = true; setReady(true); });
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const set = useCallback((patch: Partial<Saved>) => setState((s) => ({ ...s, ...patch })), []);
  const upsertProfile = useCallback((p: Profile) => setState((s) => {
    const exists = s.profiles.some((x) => x.id === p.id);
    return { ...s, profiles: exists ? s.profiles.map((x) => (x.id === p.id ? p : x)) : [...s.profiles, p] };
  }), []);
  const removeProfile = useCallback((id: string) => setState((s) => ({
    ...s,
    profiles: s.profiles.filter((x) => x.id !== id),
    activeId: s.activeId === id ? null : s.activeId,
  })), []);

  const value = useMemo<Ctx>(() => ({
    ...state,
    ready,
    t: (k) => tr(state.lang, k),
    n: (x) => num(state.lang, x),
    rtl: state.lang === 'ar',
    active: state.profiles.find((p) => p.id === state.activeId) ?? null,
    set,
    upsertProfile,
    removeProfile,
  }), [state, ready, set, upsertProfile, removeProfile]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
