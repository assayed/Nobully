import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { feminize } from './content/feminine';
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
  /** Text of a content field ({ar,en}) for the current language and the active hero's gender. */
  L: (l: { ar: string; en: string }) => string;
  female: boolean;
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

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  }, [state.lang]);

  const activeProfile = state.profiles.find((p) => p.id === state.activeId) ?? null;
  const female = !!activeProfile && activeProfile.look.gender !== 'boy';

  const value = useMemo<Ctx>(() => ({
    ...state,
    ready,
    female,
    t: (k) => tr(state.lang, k, female),
    L: (l) => (state.lang === 'ar' ? (female ? feminize(l.ar) : l.ar) : l.en),
    n: (x) => num(state.lang, x),
    rtl: state.lang === 'ar',
    active: activeProfile,
    set,
    upsertProfile,
    removeProfile,
  }), [state, ready, female, activeProfile, set, upsertProfile, removeProfile]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
