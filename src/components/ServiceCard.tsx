import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from './DynamicIcon';
import { Pencil } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface ServiceCardProps {
  icon: string;
  label: string;
  description?: string;
  defaultImage?: string;
  defaultImageKey?: string;
  imageData?: string;
  selected?: boolean;
  onClick: () => void;
  onEdit?: () => void;
  size?: 'default' | 'large';
  editable?: boolean;
  compact?: boolean;
}

export function ServiceCard({
  icon,
  label,
  description,
  defaultImage,
  defaultImageKey,
  imageData,
  selected = false,
  onClick,
  onEdit,
  size = 'default',
  editable = false,
  compact = false,
}: ServiceCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={cn(
          'w-full overflow-hidden',
          compact ? 'selection-button' : 'service-card',
          selected && 'selected',
          isAnimating && 'pulse-selection',
          size === 'large' && 'min-h-[200px] p-10'
        )}
        aria-pressed={selected}
      >
        {/* Hierarquia: imageData (custom) → defaultImage → icon */}
        {(imageData || defaultImage || defaultImageKey) ? (
          <div className={cn(
            'rounded-xl overflow-hidden mx-auto border-2 border-border',
            compact ? 'h-20 w-20' : size === 'large' ? 'h-28 w-28' : 'h-24 w-24'
          )}>
            <ImageWithFallback
              imageUrl={imageData || defaultImage}
              imageKey={!imageData ? defaultImageKey : undefined}
              iconName={icon}
              alt={label}
              imageClassName="w-full h-full object-cover"
            />
          </div>
        ) : (
          <DynamicIcon
            name={icon}
            className={cn(
              'transition-colors duration-200',
              compact ? 'h-8 w-8' : size === 'large' ? 'h-16 w-16' : 'h-12 w-12',
              selected ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        )}
        <span className={cn(
          'font-semibold text-center',
          compact ? 'text-base' : size === 'large' ? 'text-xl' : 'text-lg',
          selected ? 'text-primary' : 'text-foreground'
        )}>
          {label}
        </span>
        {description && !compact && (
          <span className="text-sm text-muted-foreground text-center">
            {description}
          </span>
        )}
      </button>

      {editable && (
        <button
          onClick={handleEditClick}
          className="absolute top-2 right-2 p-2 bg-background/90 backdrop-blur-sm rounded-full border border-border shadow-sm hover:bg-accent transition-colors"
          aria-label={`Editar ${label}`}
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
