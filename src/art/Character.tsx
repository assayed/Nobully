import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

export type Mood = 'happy' | 'sad' | 'angry' | 'crying' | 'neutral' | 'surprised' | 'mean' | 'shy';
export type HairStyle = 'short' | 'long' | 'curly' | 'hijab' | 'bald' | 'spiky';
export type Age = 'kid' | 'small' | 'adult' | 'old';

export type CharacterLook = {
  skin: string;
  hair: string; // hair colour, or scarf colour for hijab
  hairStyle: HairStyle;
  shirt: string;
  pants: string;
  dress?: boolean;
  glasses?: boolean;
  mustache?: boolean;
  age?: Age;
  // hero accessories (from the shop)
  cape?: string;
  hat?: 'cap' | 'crown' | 'grad';
  mask?: boolean;
  star?: boolean;
  hood?: boolean; // the online "stranger"
};

export const SKINS = ['#F7D7BC', '#EBB98F', '#C98E62', '#8E5B3C'];

type Props = { look: CharacterLook; mood?: Mood; arms?: 'down' | 'up' | 'wave'; size?: number };

/** A cartoon person drawn in a 100 x 150 box. */
export default function Character({ look, mood = 'neutral', arms = 'down', size = 100 }: Props) {
  const { skin, hair, hairStyle, shirt, pants } = look;
  const old = look.age === 'old';
  const adult = look.age === 'adult' || old;
  const hood = look.hood;
  const armUp = arms === 'up';
  const wave = arms === 'wave';
  const eyeY = 46;

  return (
    <Svg width={size} height={size * 1.5} viewBox="0 0 100 150">
      {/* cape behind the body */}
      {look.cape && <Path d="M30 72 L18 140 Q50 148 82 140 L70 72 Z" fill={look.cape} />}

      {/* legs */}
      {!look.dress && (
        <G>
          <Rect x={36} y={108} width={12} height={32} rx={5} fill={pants} />
          <Rect x={52} y={108} width={12} height={32} rx={5} fill={pants} />
        </G>
      )}
      {look.dress && (
        <G>
          <Rect x={38} y={120} width={9} height={20} rx={4} fill={skin} />
          <Rect x={53} y={120} width={9} height={20} rx={4} fill={skin} />
        </G>
      )}
      <Ellipse cx={41} cy={142} rx={9} ry={5} fill="#3F3F46" />
      <Ellipse cx={59} cy={142} rx={9} ry={5} fill="#3F3F46" />

      {/* arms */}
      {armUp ? (
        <G>
          <Rect x={14} y={40} width={11} height={36} rx={5} fill={shirt} transform="rotate(-20 20 75)" />
          <Rect x={75} y={40} width={11} height={36} rx={5} fill={shirt} transform="rotate(20 80 75)" />
          <Circle cx={13} cy={40} r={7} fill={skin} />
          <Circle cx={87} cy={40} r={7} fill={skin} />
        </G>
      ) : wave ? (
        <G>
          <Rect x={20} y={74} width={11} height={34} rx={5} fill={shirt} />
          <Circle cx={25} cy={110} r={6.5} fill={skin} />
          <Rect x={75} y={42} width={11} height={36} rx={5} fill={shirt} transform="rotate(25 80 76)" />
          <Circle cx={90} cy={44} r={7} fill={skin} />
        </G>
      ) : (
        <G>
          <Rect x={20} y={74} width={11} height={34} rx={5} fill={shirt} />
          <Rect x={69} y={74} width={11} height={34} rx={5} fill={shirt} />
          <Circle cx={25} cy={110} r={6.5} fill={skin} />
          <Circle cx={75} cy={110} r={6.5} fill={skin} />
        </G>
      )}

      {/* body */}
      {look.dress || hairStyle === 'hijab' ? (
        <Path d="M30 72 Q50 66 70 72 L78 124 Q50 130 22 124 Z" fill={shirt} />
      ) : (
        <Rect x={28} y={70} width={44} height={44} rx={12} fill={shirt} />
      )}
      {look.star && (
        <Path d="M50 82 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" fill="#FDE047" stroke="#CA8A04" strokeWidth={1} />
      )}

      {/* neck + head */}
      <Rect x={44} y={62} width={12} height={10} fill={skin} />
      {hairStyle === 'hijab' && !hood && <Path d="M22 50 Q22 18 50 16 Q78 18 78 50 L80 78 Q50 86 20 78 Z" fill={hair} />}
      {hood && <Path d="M20 54 Q20 12 50 12 Q80 12 80 54 L82 80 Q50 88 18 80 Z" fill="#334155" />}
      {hairStyle === 'long' && <Path d="M24 44 Q24 18 50 18 Q76 18 76 44 L78 80 Q66 76 66 60 L34 60 Q34 76 22 80 Z" fill={hair} />}
      <Circle cx={50} cy={45} r={adult ? 22 : 24} fill={hood ? '#1E293B' : skin} />

      {/* hair on top */}
      {hairStyle === 'short' && <Path d="M26 42 Q26 18 50 18 Q74 18 74 42 Q66 30 50 30 Q34 30 26 42 Z" fill={hair} />}
      {hairStyle === 'spiky' && <Path d="M26 42 L28 24 L36 30 L40 18 L48 28 L54 16 L60 28 L68 20 L70 32 L75 30 L74 42 Q60 30 26 42 Z" fill={hair} />}
      {hairStyle === 'long' && <Path d="M26 44 Q26 18 50 18 Q74 18 74 44 Q64 28 46 30 Q34 32 26 44 Z" fill={hair} />}
      {hairStyle === 'curly' && (
        <G fill={hair}>
          <Circle cx={30} cy={34} r={9} /><Circle cx={40} cy={24} r={10} /><Circle cx={52} cy={21} r={10} />
          <Circle cx={64} cy={25} r={10} /><Circle cx={72} cy={36} r={8} /><Circle cx={27} cy={48} r={7} /><Circle cx={74} cy={48} r={7} />
        </G>
      )}
      {hairStyle === 'bald' && (
        <G fill={hair}>
          <Ellipse cx={29} cy={42} rx={5} ry={8} /><Ellipse cx={71} cy={42} rx={5} ry={8} />
        </G>
      )}
      {hairStyle === 'hijab' && !hood && <Path d="M27 40 Q30 20 50 20 Q70 20 73 40 Q62 28 50 28 Q38 28 27 40 Z" fill={hair} opacity={0.85} />}

      {/* face (a hero mask sits under the eyes so they still show) */}
      {look.mask && <Path d="M28 40 Q50 36 72 40 L72 51 Q50 47 28 51 Z" fill="#DC2626" opacity={0.9} />}
      {hood ? (
        <G>
          <Circle cx={42} cy={45} r={3} fill="#F87171" />
          <Circle cx={58} cy={45} r={3} fill="#F87171" />
          <Path d="M42 56 Q50 52 58 56" stroke="#F87171" strokeWidth={2} fill="none" />
        </G>
      ) : (
        <Face mood={mood} eyeY={eyeY} old={old} />
      )}
      {look.mustache && <Path d="M40 54 Q45 50 50 54 Q55 50 60 54 Q55 57 50 55 Q45 57 40 54 Z" fill={old ? '#D4D4D8' : '#3F2A1D'} />}
      {look.glasses && (
        <G stroke="#1F2937" strokeWidth={2} fill="none">
          <Circle cx={41} cy={eyeY} r={7} /><Circle cx={59} cy={eyeY} r={7} /><Path d={`M48 ${eyeY} L52 ${eyeY}`} />
        </G>
      )}

      {/* hats */}
      {look.hat === 'cap' && (
        <G>
          <Path d="M26 34 Q28 14 50 14 Q72 14 74 34 Z" fill="#2563EB" />
          <Path d="M50 32 L86 34 Q84 40 70 38 Z" fill="#1D4ED8" />
        </G>
      )}
      {look.hat === 'crown' && <Path d="M30 26 L32 8 L41 18 L50 4 L59 18 L68 8 L70 26 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth={1.5} />}
      {look.hat === 'grad' && (
        <G>
          <Rect x={34} y={16} width={32} height={10} fill="#111827" />
          <Path d="M22 16 L50 6 L78 16 L50 24 Z" fill="#1F2937" />
          <Path d="M74 16 L76 30" stroke="#FACC15" strokeWidth={2} />
        </G>
      )}
    </Svg>
  );
}

function Face({ mood, eyeY, old }: { mood: Mood; eyeY: number; old: boolean }) {
  const ink = '#1F2937';
  const eyes =
    mood === 'crying' ? (
      <G stroke={ink} strokeWidth={2.2} fill="none">
        <Path d={`M37 ${eyeY} Q41 ${eyeY + 3} 45 ${eyeY}`} />
        <Path d={`M55 ${eyeY} Q59 ${eyeY + 3} 63 ${eyeY}`} />
      </G>
    ) : mood === 'happy' ? (
      <G stroke={ink} strokeWidth={2.4} fill="none">
        <Path d={`M37 ${eyeY + 1} Q41 ${eyeY - 4} 45 ${eyeY + 1}`} />
        <Path d={`M55 ${eyeY + 1} Q59 ${eyeY - 4} 63 ${eyeY + 1}`} />
      </G>
    ) : (
      <G fill={ink}>
        <Circle cx={41} cy={eyeY} r={mood === 'surprised' ? 4 : 3} />
        <Circle cx={59} cy={eyeY} r={mood === 'surprised' ? 4 : 3} />
        <Circle cx={42} cy={eyeY - 1} r={1} fill="#fff" />
        <Circle cx={60} cy={eyeY - 1} r={1} fill="#fff" />
      </G>
    );

  const brows =
    mood === 'angry' || mood === 'mean' ? (
      <G stroke={ink} strokeWidth={2.5}>
        <Path d={`M35 ${eyeY - 9} L46 ${eyeY - 5}`} />
        <Path d={`M65 ${eyeY - 9} L54 ${eyeY - 5}`} />
      </G>
    ) : mood === 'sad' || mood === 'crying' || mood === 'shy' ? (
      <G stroke={ink} strokeWidth={2}>
        <Path d={`M36 ${eyeY - 6} L45 ${eyeY - 9}`} />
        <Path d={`M64 ${eyeY - 6} L55 ${eyeY - 9}`} />
      </G>
    ) : null;

  const m = eyeY + 12;
  const mouth = {
    happy: <Path d={`M40 ${m - 2} Q50 ${m + 9} 60 ${m - 2} Z`} fill="#B91C1C" />,
    sad: <Path d={`M42 ${m + 4} Q50 ${m - 3} 58 ${m + 4}`} stroke={ink} strokeWidth={2.4} fill="none" />,
    crying: <Path d={`M41 ${m + 5} Q50 ${m - 4} 59 ${m + 5} Z`} fill="#7F1D1D" />,
    angry: <Path d={`M42 ${m + 2} L58 ${m + 2}`} stroke={ink} strokeWidth={2.6} />,
    neutral: <Path d={`M44 ${m + 1} Q50 ${m + 3} 56 ${m + 1}`} stroke={ink} strokeWidth={2.2} fill="none" />,
    surprised: <Ellipse cx={50} cy={m + 2} rx={4} ry={5} fill="#7F1D1D" />,
    mean: <Path d={`M42 ${m + 2} Q52 ${m + 5} 60 ${m - 2}`} stroke={ink} strokeWidth={2.4} fill="none" />,
    shy: <Path d={`M45 ${m + 2} Q50 ${m} 55 ${m + 2}`} stroke={ink} strokeWidth={2} fill="none" />,
  }[mood];

  return (
    <G>
      {brows}
      {eyes}
      {(mood === 'happy' || mood === 'shy') && (
        <G fill="#FB7185" opacity={0.45}>
          <Circle cx={34} cy={eyeY + 8} r={4} />
          <Circle cx={66} cy={eyeY + 8} r={4} />
        </G>
      )}
      {mouth}
      {mood === 'crying' && (
        <G fill="#38BDF8">
          <Path d={`M38 ${eyeY + 3} Q35 ${eyeY + 11} 38 ${eyeY + 13} Q41 ${eyeY + 11} 38 ${eyeY + 3} Z`} />
          <Path d={`M62 ${eyeY + 3} Q59 ${eyeY + 11} 62 ${eyeY + 13} Q65 ${eyeY + 11} 62 ${eyeY + 3} Z`} />
        </G>
      )}
      {old && (
        <G stroke="#A1A1AA" strokeWidth={1}>
          <Path d={`M33 ${eyeY - 2} L36 ${eyeY}`} />
          <Path d={`M67 ${eyeY - 2} L64 ${eyeY}`} />
        </G>
      )}
    </G>
  );
}
