import { Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import Play from '../../src/components/Play';
import { scenariosOf, worldById } from '../../src/content/scenarios';
import { useApp } from '../../src/store';

/** Plays a world: unfinished situations first; once all are done, the whole world replays as practice. */
export default function WorldScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { active, lang } = useApp();
  const world = worldById(id);
  // Play decides which situations to run; it receives the whole world so progress shows every situation.
  const ids = useMemo(() => (world ? scenariosOf(world.id).map((s) => s.id) : []), [world?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!active) return <Redirect href="/profiles" />;
  if (!world) return <Redirect href="/home" />;
  return <Play ids={ids} mode="world" title={`${world.emoji} ${world.title[lang]}`} color={world.color} />;
}
