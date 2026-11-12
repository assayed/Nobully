import { ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

export type PropId =
  | 'sandwich' | 'ball' | 'bag' | 'pencils' | 'book' | 'vase' | 'cat' | 'dog' | 'wallet' | 'juice'
  | 'phone' | 'tablet' | 'icecream' | 'shopping' | 'stone' | 'paper' | 'gift' | 'dice' | 'chat'
  | 'teddy' | 'bin' | 'coin' | 'rabbit' | 'parrot' | 'camel' | 'heart' | 'lock';

const art: Record<PropId, () => ReactNode> = {
  sandwich: () => (
    <G>
      <Path d="M8 34 L30 14 L52 34 Z" fill="#FCD34D" stroke="#B45309" strokeWidth={2} />
      <Path d="M10 34 L50 34 L48 38 L12 38 Z" fill="#22C55E" /><Path d="M12 38 L48 38 L46 42 L14 42 Z" fill="#EF4444" />
      <Path d="M8 42 L52 42 L48 48 L12 48 Z" fill="#FCD34D" stroke="#B45309" strokeWidth={2} />
    </G>
  ),
  ball: () => (
    <G>
      <Circle cx={30} cy={30} r={22} fill="#fff" stroke="#111" strokeWidth={2} />
      <Path d="M30 20 L39 27 L36 38 L24 38 L21 27 Z" fill="#111" />
      <Path d="M30 8 L30 20 M39 27 L50 22 M36 38 L42 48 M24 38 L18 48 M21 27 L10 22" stroke="#111" strokeWidth={2} />
    </G>
  ),
  bag: () => (
    <G>
      <Path d="M20 16 Q30 4 40 16" stroke="#7C2D12" strokeWidth={4} fill="none" />
      <Rect x={10} y={16} width={40} height={38} rx={8} fill="#F97316" /><Rect x={16} y={34} width={28} height={14} rx={4} fill="#FDBA74" />
    </G>
  ),
  pencils: () => (
    <G>
      <Rect x={6} y={30} width={48} height={20} rx={6} fill="#A855F7" transform="rotate(-8 30 40)" />
      <Path d="M14 18 L40 40" stroke="#FACC15" strokeWidth={6} /><Path d="M40 40 L44 44" stroke="#111" strokeWidth={4} />
      <Path d="M26 12 L22 46" stroke="#38BDF8" strokeWidth={6} />
      <Path d="M30 30 L36 34 L32 38" stroke="#fff" strokeWidth={2} fill="none" />
    </G>
  ),
  book: () => (
    <G>
      <Path d="M6 14 Q18 8 30 14 L30 50 Q18 44 6 50 Z" fill="#60A5FA" /><Path d="M54 14 Q42 8 30 14 L30 50 Q42 44 54 50 Z" fill="#93C5FD" />
      <Path d="M12 22 L24 20 M12 30 L24 28 M36 20 L48 22 M36 28 L48 30" stroke="#1E3A8A" strokeWidth={2} />
    </G>
  ),
  vase: () => (
    <G>
      <Path d="M10 50 L18 34 L26 46 Z" fill="#0EA5E9" /><Path d="M28 50 L34 30 L42 44 Z" fill="#38BDF8" /><Path d="M40 52 L50 38 L54 52 Z" fill="#0284C7" />
      <Path d="M22 24 L30 18 L34 26" stroke="#0EA5E9" strokeWidth={4} fill="none" />
      <Circle cx={14} cy={20} r={2} fill="#0EA5E9" /><Circle cx={48} cy={24} r={2} fill="#0EA5E9" />
    </G>
  ),
  cat: () => (
    <G>
      <Ellipse cx={32} cy={42} rx={16} ry={12} fill="#F59E0B" />
      <Path d="M46 44 Q58 36 54 24" stroke="#F59E0B" strokeWidth={5} fill="none" />
      <Circle cx={20} cy={28} r={12} fill="#F59E0B" />
      <Path d="M10 22 L12 10 L18 18 Z M30 22 L28 10 L22 18 Z" fill="#F59E0B" />
      <Circle cx={16} cy={27} r={1.8} fill="#111" /><Circle cx={24} cy={27} r={1.8} fill="#111" />
      <Path d="M18 32 L20 33 L22 32" stroke="#111" strokeWidth={1.2} fill="none" />
      <Path d="M28 38 L30 46 M36 38 L38 46" stroke="#B45309" strokeWidth={2} />
    </G>
  ),
  dog: () => (
    <G>
      <Ellipse cx={34} cy={42} rx={16} ry={11} fill="#A16207" />
      <Circle cx={20} cy={28} r={12} fill="#CA8A04" />
      <Ellipse cx={10} cy={28} rx={5} ry={10} fill="#713F12" /><Ellipse cx={30} cy={28} rx={5} ry={10} fill="#713F12" />
      <Circle cx={16} cy={26} r={1.8} fill="#111" /><Circle cx={24} cy={26} r={1.8} fill="#111" /><Ellipse cx={20} cy={32} rx={3} ry={2} fill="#111" />
      <Path d="M50 40 Q56 34 54 28" stroke="#A16207" strokeWidth={4} fill="none" />
    </G>
  ),
  rabbit: () => (
    <G>
      <Ellipse cx={22} cy={14} rx={4} ry={12} fill="#F5F5F4" stroke="#D6D3D1" /><Ellipse cx={36} cy={14} rx={4} ry={12} fill="#F5F5F4" stroke="#D6D3D1" />
      <Ellipse cx={30} cy={44} rx={16} ry={12} fill="#F5F5F4" stroke="#D6D3D1" />
      <Circle cx={29} cy={30} r={11} fill="#F5F5F4" stroke="#D6D3D1" />
      <Circle cx={25} cy={29} r={1.8} fill="#111" /><Circle cx={33} cy={29} r={1.8} fill="#111" /><Circle cx={29} cy={33} r={1.6} fill="#F472B6" />
    </G>
  ),
  parrot: () => (
    <G>
      <Ellipse cx={30} cy={36} rx={13} ry={18} fill="#22C55E" />
      <Circle cx={30} cy={18} r={10} fill="#EF4444" />
      <Path d="M36 18 Q46 20 38 26 Z" fill="#FACC15" />
      <Circle cx={31} cy={16} r={2} fill="#111" />
      <Path d="M24 48 L20 58 M36 48 L40 58" stroke="#2563EB" strokeWidth={4} />
    </G>
  ),
  camel: () => (
    <G>
      <Path d="M8 40 Q14 22 24 36 Q32 18 42 36 L44 40 Z" fill="#D97706" />
      <Rect x={10} y={38} width={36} height={8} rx={4} fill="#D97706" />
      <Path d="M44 40 L50 20 L56 20 L54 26 L50 26 L48 42 Z" fill="#D97706" />
      <Path d="M14 46 L14 58 M22 46 L22 58 M34 46 L34 58 M42 46 L42 58" stroke="#B45309" strokeWidth={3} />
      <Circle cx={53} cy={22} r={1.4} fill="#111" />
    </G>
  ),
  wallet: () => (
    <G>
      <Rect x={8} y={18} width={44} height={30} rx={6} fill="#7C3AED" /><Rect x={30} y={26} width={22} height={14} rx={4} fill="#A78BFA" />
      <Circle cx={38} cy={33} r={3} fill="#FACC15" /><Rect x={12} y={12} width={30} height={10} fill="#4ADE80" />
    </G>
  ),
  juice: () => (
    <G>
      <Rect x={18} y={14} width={24} height={40} rx={3} fill="#FB923C" /><Rect x={18} y={24} width={24} height={16} fill="#fff" />
      <Circle cx={30} cy={32} r={6} fill="#F97316" /><Path d="M34 14 L38 2" stroke="#EC4899" strokeWidth={3} />
    </G>
  ),
  phone: () => (
    <G>
      <Rect x={14} y={4} width={32} height={52} rx={6} fill="#111827" /><Rect x={17} y={9} width={26} height={42} rx={3} fill="#E0F2FE" />
      <Rect x={20} y={14} width={16} height={7} rx={3} fill="#A78BFA" /><Rect x={24} y={25} width={16} height={7} rx={3} fill="#4ADE80" />
      <Rect x={20} y={36} width={14} height={7} rx={3} fill="#A78BFA" />
    </G>
  ),
  tablet: () => (
    <G>
      <Rect x={4} y={10} width={52} height={40} rx={6} fill="#111827" /><Rect x={8} y={14} width={44} height={32} rx={3} fill="#38BDF8" />
      <Circle cx={22} cy={30} r={6} fill="#FACC15" /><Rect x={32} y={26} width={14} height={10} rx={2} fill="#F472B6" />
    </G>
  ),
  icecream: () => (
    <G>
      <Path d="M20 30 L30 58 L40 30 Z" fill="#F59E0B" /><Path d="M22 34 L38 34 M24 40 L36 40" stroke="#B45309" strokeWidth={1.5} />
      <Circle cx={24} cy={26} r={9} fill="#F9A8D4" /><Circle cx={36} cy={26} r={9} fill="#86EFAC" /><Circle cx={30} cy={16} r={9} fill="#FDE68A" />
      <Circle cx={30} cy={7} r={3} fill="#DC2626" />
    </G>
  ),
  shopping: () => (
    <G>
      <Rect x={4} y={22} width={26} height={32} rx={3} fill="#F59E0B" /><Path d="M10 22 Q17 10 24 22" stroke="#92400E" strokeWidth={3} fill="none" />
      <Rect x={28} y={18} width={28} height={36} rx={3} fill="#10B981" /><Path d="M34 18 Q42 6 50 18" stroke="#065F46" strokeWidth={3} fill="none" />
      <Circle cx={14} cy={20} r={5} fill="#EF4444" /><Path d="M44 14 L44 6" stroke="#16A34A" strokeWidth={4} />
    </G>
  ),
  stone: () => <G><Ellipse cx={30} cy={36} rx={16} ry={12} fill="#78716C" /><Ellipse cx={26} cy={32} rx={5} ry={3} fill="#A8A29E" /></G>,
  paper: () => (
    <G>
      <Rect x={12} y={6} width={36} height={48} rx={3} fill="#fff" stroke="#CBD5E1" strokeWidth={2} />
      <Path d="M18 18 L40 18 M18 26 L40 26 M18 34 L32 34" stroke="#94A3B8" strokeWidth={2} />
      <SvgText x={34} y={50} fontSize={14} fontWeight="bold" fill="#DC2626">A+</SvgText>
    </G>
  ),
  gift: () => (
    <G>
      <Rect x={10} y={24} width={40} height={30} rx={3} fill="#EF4444" /><Rect x={6} y={16} width={48} height={10} rx={3} fill="#F87171" />
      <Rect x={26} y={16} width={8} height={38} fill="#FACC15" />
      <Path d="M30 16 Q18 2 16 14 Q22 18 30 16 Q42 2 44 14 Q38 18 30 16" fill="#FACC15" />
      <SvgText x={44} y={12} fontSize={14} fontWeight="bold" fill="#DC2626">!</SvgText>
    </G>
  ),
  dice: () => (
    <G>
      <Rect x={10} y={14} width={34} height={34} rx={6} fill="#fff" stroke="#111" strokeWidth={2} />
      <Circle cx={19} cy={23} r={3} fill="#111" /><Circle cx={27} cy={31} r={3} fill="#111" /><Circle cx={35} cy={39} r={3} fill="#111" />
    </G>
  ),
  chat: () => (
    <G>
      <Path d="M6 10 L54 10 L54 40 L24 40 L14 50 L16 40 L6 40 Z" fill="#FCA5A5" stroke="#DC2626" strokeWidth={2} />
      <SvgText x={14} y={32} fontSize={18} fontWeight="bold" fill="#991B1B">#@!</SvgText>
    </G>
  ),
  teddy: () => (
    <G>
      <Circle cx={18} cy={14} r={6} fill="#B45309" /><Circle cx={42} cy={14} r={6} fill="#B45309" />
      <Circle cx={30} cy={22} r={13} fill="#D97706" /><Ellipse cx={30} cy={44} rx={14} ry={13} fill="#D97706" />
      <Circle cx={25} cy={20} r={1.8} fill="#111" /><Circle cx={35} cy={20} r={1.8} fill="#111" />
      <Path d="M44 38 L54 34 M50 44 L58 46" stroke="#92400E" strokeWidth={3} />
    </G>
  ),
  bin: () => (
    <G>
      <Path d="M14 18 L46 18 L42 56 L18 56 Z" fill="#16A34A" /><Rect x={10} y={12} width={40} height={8} rx={2} fill="#15803D" />
      <Path d="M24 26 L24 50 M30 26 L30 50 M36 26 L36 50" stroke="#14532D" strokeWidth={2} />
    </G>
  ),
  coin: () => (
    <G>
      <Circle cx={30} cy={30} r={24} fill="#FACC15" stroke="#CA8A04" strokeWidth={4} />
      <Circle cx={30} cy={30} r={16} fill="#FDE047" />
      <Path d="M30 18 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 z" fill="#EAB308" />
    </G>
  ),
  heart: () => <Path d="M30 52 Q4 34 8 18 Q12 6 24 8 Q30 10 30 18 Q30 10 36 8 Q48 6 52 18 Q56 34 30 52 Z" fill="#F43F5E" />,
  lock: () => (
    <G>
      <Path d="M18 28 L18 18 Q18 6 30 6 Q42 6 42 18 L42 28" stroke="#64748B" strokeWidth={6} fill="none" />
      <Rect x={10} y={26} width={40} height={30} rx={6} fill="#F59E0B" /><Circle cx={30} cy={40} r={4} fill="#78350F" />
    </G>
  ),
};

export default function Prop({ id, size = 48 }: { id: PropId; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      {art[id]()}
    </Svg>
  );
}
