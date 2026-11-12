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
  // freeze the list when the screen opens, so finishing a situation doesn't reshuffle the run
  const ids = useMemo(() => {
    if (!world || !active) return [];
    const all = scenariosOf(world.id);
    const todo = all.filter((s) => !active.answers[s.id]?.done);
    return (todo.length ? todo : all).map((s) => s.id);
  }, [world?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!active) return <Redirect href="/profiles" />;
  if (!world) return <Redirect href="/home" />;
  return <Play ids={ids} mode="world" title={`${world.emoji} ${world.title[lang]}`} color={world.color} />;
}
