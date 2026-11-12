import { ReactNode } from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export type BgId =
  | 'yard' | 'classroom' | 'pitch' | 'living' | 'kitchen' | 'street'
  | 'metro' | 'pool' | 'club' | 'mall' | 'bedroom';

const Sky = ({ top = '#7DD3FC', bottom = '#E0F2FE' }) => (
  <G>
    <Defs>
      <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={top} />
        <Stop offset="1" stopColor={bottom} />
      </LinearGradient>
    </Defs>
    <Rect width={400} height={260} fill="url(#sky)" />
  </G>
);
const Sun = ({ x = 350, y = 40 }) => (
  <G>
    <Circle cx={x} cy={y} r={26} fill="#FDE047" opacity={0.35} />
    <Circle cx={x} cy={y} r={18} fill="#FACC15" />
  </G>
);
const Cloud = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G fill="#fff" opacity={0.95} transform={`translate(${x} ${y}) scale(${s})`}>
    <Ellipse cx={0} cy={0} rx={22} ry={12} /><Ellipse cx={18} cy={-6} rx={16} ry={12} /><Ellipse cx={34} cy={2} rx={16} ry={10} />
  </G>
);
const Tree = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G transform={`translate(${x} ${y}) scale(${s})`}>
    <Rect x={-6} y={-10} width={12} height={40} fill="#92400E" />
    <Circle cx={0} cy={-26} r={26} fill="#22C55E" /><Circle cx={-16} cy={-12} r={16} fill="#16A34A" /><Circle cx={16} cy={-12} r={16} fill="#16A34A" />
  </G>
);
const Palm = ({ x, y }: { x: number; y: number }) => (
  <G transform={`translate(${x} ${y})`}>
    <Path d="M-4 40 Q0 0 4 -40 L8 -40 Q4 0 6 40 Z" fill="#A16207" />
    <Path d="M6 -40 Q-20 -60 -40 -40 Q-20 -48 6 -40 Z M6 -40 Q30 -62 50 -42 Q28 -48 6 -40 Z M6 -40 Q-8 -70 -30 -66 Q-10 -60 6 -40 Z M6 -40 Q20 -72 40 -66 Q20 -60 6 -40 Z" fill="#15803D" />
  </G>
);

const scenes: Record<BgId, () => ReactNode> = {
  yard: () => (
    <G>
      <Sky /><Sun /><Cloud x={60} y={40} /><Cloud x={200} y={28} s={0.8} />
      {/* school building */}
      <Rect x={110} y={70} width={190} height={110} fill="#FDBA74" />
      <Path d="M100 72 L205 30 L310 72 Z" fill="#EA580C" />
      <Rect x={190} y={130} width={30} height={50} fill="#7C2D12" />
      {[125, 160, 235, 270].map((x) => <Rect key={x} x={x} y={92} width={22} height={22} fill="#BAE6FD" stroke="#fff" strokeWidth={3} />)}
      {[125, 270].map((x) => <Rect key={'b' + x} x={x} y={132} width={22} height={22} fill="#BAE6FD" stroke="#fff" strokeWidth={3} />)}
      <Path d="M205 30 L205 8" stroke="#475569" strokeWidth={2} />
      <Rect x={205} y={8} width={22} height={7} fill="#CE1126" /><Rect x={205} y={15} width={22} height={7} fill="#fff" /><Rect x={205} y={22} width={22} height={7} fill="#111" />
      <Rect y={180} width={400} height={80} fill="#86EFAC" />
      <Rect y={176} width={400} height={6} fill="#4ADE80" />
      <Tree x={45} y={170} /><Tree x={360} y={172} s={0.9} />
    </G>
  ),
  classroom: () => (
    <G>
      <Rect width={400} height={260} fill="#FEF3C7" />
      <Rect y={190} width={400} height={70} fill="#D6A16B" />
      <Rect x={70} y={30} width={260} height={100} rx={6} fill="#14532D" stroke="#92400E" strokeWidth={8} />
      <Path d="M100 60 L150 60 M100 80 L200 80 M220 60 Q240 40 260 60 T300 60" stroke="#F0FDF4" strokeWidth={3} fill="none" opacity={0.8} />
      <Rect x={20} y={40} width={34} height={44} fill="#BAE6FD" stroke="#fff" strokeWidth={4} />
      <Rect x={350} y={40} width={34} height={44} fill="#BAE6FD" stroke="#fff" strokeWidth={4} />
      <Circle cx={200} cy={16} r={10} fill="#fff" stroke="#334155" strokeWidth={2} />
      <Rect x={20} y={176} width={110} height={14} rx={3} fill="#A16207" /><Rect x={270} y={176} width={110} height={14} rx={3} fill="#A16207" />
    </G>
  ),
  pitch: () => (
    <G>
      <Sky /><Sun x={60} />
      <Rect y={120} width={400} height={140} fill="#4ADE80" />
      {[0, 80, 160, 240, 320].map((x) => <Rect key={x} x={x} y={120} width={40} height={140} fill="#22C55E" />)}
      <Path d="M0 190 L400 190" stroke="#fff" strokeWidth={3} />
      <Circle cx={200} cy={190} r={30} stroke="#fff" strokeWidth={3} fill="none" />
      <Rect x={330} y={100} width={60} height={40} stroke="#fff" strokeWidth={4} fill="none" />
    </G>
  ),
  living: () => (
    <G>
      <Rect width={400} height={260} fill="#FDE68A" />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => <Rect key={x} x={x} y={0} width={18} height={190} fill="#FCD34D" opacity={0.4} />)}
      <Rect y={190} width={400} height={70} fill="#B45309" />
      <Ellipse cx={200} cy={225} rx={150} ry={22} fill="#DC2626" opacity={0.7} />
      <Rect x={150} y={36} width={100} height={70} fill="#7DD3FC" stroke="#fff" strokeWidth={6} />
      <Path d="M200 36 L200 106 M150 71 L250 71" stroke="#fff" strokeWidth={4} />
      <Rect x={280} y={120} width={110} height={60} rx={14} fill="#0EA5E9" /><Rect x={280} y={146} width={110} height={40} rx={10} fill="#0284C7" />
      <Rect x={30} y={60} width={6} height={130} fill="#57534E" /><Path d="M14 70 L52 70 L42 44 L24 44 Z" fill="#FEF9C3" />
    </G>
  ),
  kitchen: () => (
    <G>
      <Rect width={400} height={260} fill="#E0F2FE" />
      {Array.from({ length: 10 }).map((_, i) => <Rect key={i} x={i * 40} y={90} width={38} height={38} fill="#fff" opacity={0.7} />)}
      <Rect y={190} width={400} height={70} fill="#CBD5E1" />
      <Rect x={0} y={140} width={400} height={50} fill="#A16207" /><Rect x={0} y={134} width={400} height={8} fill="#78350F" />
      <Rect x={20} y={20} width={120} height={60} fill="#F59E0B" /><Rect x={260} y={20} width={120} height={60} fill="#F59E0B" />
      <Circle cx={200} cy={60} r={22} fill="#FDE047" />
    </G>
  ),
  street: () => (
    <G>
      <Sky top="#93C5FD" /><Sun x={50} y={36} /><Cloud x={260} y={30} />
      {/* Cairo-style apartment blocks */}
      {[[10, 60, 70, '#FCA5A5'], [85, 40, 60, '#FDE68A'], [150, 70, 80, '#C4B5FD'], [235, 50, 70, '#A7F3D0'], [310, 30, 85, '#FDBA74']].map(([x, y, w, c]) => (
        <G key={String(x)}>
          <Rect x={x as number} y={y as number} width={w as number} height={190 - (y as number)} fill={c as string} />
          {Array.from({ length: 4 }).map((_, r) => (
            <G key={r}>
              <Rect x={(x as number) + 10} y={(y as number) + 14 + r * 30} width={14} height={16} fill="#E0F2FE" />
              <Rect x={(x as number) + (w as number) - 24} y={(y as number) + 14 + r * 30} width={14} height={16} fill="#E0F2FE" />
            </G>
          ))}
        </G>
      ))}
      <Rect y={190} width={400} height={20} fill="#D4D4D8" />
      <Rect y={210} width={400} height={50} fill="#52525B" />
      {[20, 120, 220, 320].map((x) => <Rect key={x} x={x} y={232} width={50} height={5} fill="#FDE047" />)}
      <Palm x={380} y={150} />
    </G>
  ),
  metro: () => (
    <G>
      <Rect width={400} height={260} fill="#E2E8F0" />
      <Rect y={200} width={400} height={60} fill="#94A3B8" />
      {[20, 150, 280].map((x) => (
        <G key={x}>
          <Rect x={x} y={40} width={100} height={60} rx={10} fill="#1E293B" />
          <Rect x={x + 6} y={46} width={88} height={48} rx={8} fill="#38BDF8" opacity={0.6} />
        </G>
      ))}
      <Rect x={0} y={10} width={400} height={10} fill="#DC2626" />
      <Rect x={0} y={150} width={400} height={12} fill="#2563EB" />
      {[0, 70, 140, 210, 280, 350].map((x) => <Rect key={x} x={x + 4} y={162} width={60} height={30} rx={6} fill="#3B82F6" />)}
      <Rect x={196} y={20} width={8} height={180} fill="#A1A1AA" />
    </G>
  ),
  pool: () => (
    <G>
      <Sky /><Sun /><Palm x={30} y={140} />
      <Rect y={130} width={400} height={130} fill="#F5F5F4" />
      <Rect x={20} y={150} width={360} height={100} rx={10} fill="#22D3EE" />
      <Path d="M30 180 Q60 172 90 180 T150 180 T210 180 T270 180 T330 180 T370 180" stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />
      <Path d="M30 215 Q60 207 90 215 T150 215 T210 215 T270 215 T330 215 T370 215" stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />
      <Rect x={340} y={110} width={4} height={50} fill="#94A3B8" /><Rect x={360} y={110} width={4} height={50} fill="#94A3B8" />
    </G>
  ),
  club: () => (
    <G>
      <Sky /><Sun x={60} /><Cloud x={240} y={36} />
      <Rect y={170} width={400} height={90} fill="#86EFAC" />
      {/* ice-cream kiosk */}
      <Rect x={260} y={80} width={120} height={100} fill="#FBCFE8" />
      <Path d="M250 84 L390 84 L380 60 L260 60 Z" fill="#EC4899" />
      {[260, 290, 320, 350].map((x) => <Path key={x} d={`M${x} 84 Q${x + 15} 98 ${x + 30} 84`} fill="#F472B6" />)}
      <Rect x={280} y={110} width={80} height={30} fill="#fff" />
      <Circle cx={300} cy={120} r={7} fill="#FDE68A" /><Circle cx={320} cy={120} r={7} fill="#86EFAC" /><Circle cx={340} cy={120} r={7} fill="#F9A8D4" />
      <Tree x={40} y={160} s={0.9} />
    </G>
  ),
  mall: () => (
    <G>
      <Rect width={400} height={260} fill="#F1F5F9" />
      {[10, 140, 270].map((x, i) => (
        <G key={x}>
          <Rect x={x} y={30} width={120} height={130} fill={['#FECACA', '#BFDBFE', '#FDE68A'][i]} />
          <Rect x={x + 10} y={60} width={100} height={90} fill="#E0F2FE" opacity={0.8} />
          <Rect x={x} y={30} width={120} height={22} fill={['#EF4444', '#3B82F6', '#F59E0B'][i]} />
        </G>
      ))}
      {Array.from({ length: 10 }).map((_, i) => <Rect key={i} x={i * 40} y={170} width={40} height={90} fill={i % 2 ? '#E2E8F0' : '#F8FAFC'} />)}
    </G>
  ),
  bedroom: () => (
    <G>
      <Rect width={400} height={260} fill="#DDD6FE" />
      {Array.from({ length: 12 }).map((_, i) => <Circle key={i} cx={20 + i * 34} cy={20 + (i % 3) * 30} r={3} fill="#FDE047" opacity={0.8} />)}
      <Rect y={195} width={400} height={65} fill="#A78BFA" />
      <Rect x={20} y={140} width={110} height={56} rx={8} fill="#F472B6" /><Rect x={20} y={124} width={36} height={24} rx={6} fill="#fff" />
    </G>
  ),
};

/** Full-width illustrated background, 400 x 260. */
export default function Background({ id }: { id: BgId }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
      {scenes[id]()}
    </Svg>
  );
}
