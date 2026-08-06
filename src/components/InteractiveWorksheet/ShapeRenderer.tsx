import { Cloud, Star, Circle, Square, Triangle, Heart, Apple, Fish, Bird, Leaf, Flower2 } from 'lucide-react';

interface Props {
  shape?: string;
  color: string;
  className?: string;
}

export function ShapeRenderer({ shape, color, className = "" }: Props) {
  const normalizedShape = shape?.toLowerCase().trim() || 'square';
  
  const commonProps = {
    className,
    style: { fill: color, color: color, strokeWidth: 1.5 },
  };

  switch (normalizedShape) {
    case 'star':
      return <Star {...commonProps} />;
    case 'cloud':
      return <Cloud {...commonProps} />;
    case 'circle':
      return <Circle {...commonProps} />;
    case 'triangle':
      return <Triangle {...commonProps} />;
    case 'heart':
      return <Heart {...commonProps} />;
    case 'apple':
      return <Apple {...commonProps} />;
    case 'fish':
      return <Fish {...commonProps} />;
    case 'bird':
      return <Bird {...commonProps} />;
    case 'leaf':
      return <Leaf {...commonProps} />;
    case 'flower':
      return <Flower2 {...commonProps} />;
    case 'square':
    default:
      return <Square {...commonProps} style={{...commonProps.style, borderRadius: '8px'}} />;
  }
}
