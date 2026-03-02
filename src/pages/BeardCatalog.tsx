import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { ServiceCard } from '@/components/ServiceCard';
import { useSelection } from '@/contexts/SelectionContext';
import { useCustomStyles } from '@/contexts/CustomStylesContext';
import { BeardStyle } from '@/types/barber';

const BeardCatalog = () => {
  const navigate = useNavigate();
  const { selection, setBeardStyle } = useSelection();
  const { beardStyles } = useCustomStyles();

  const handleSelect = (style: BeardStyle) => {
    setBeardStyle(style);
    navigate('/beard/details');
  };

  const getProgress = () => {
    if (selection.serviceType === 'both') {
      return { current: 3, total: 5 };
    }
    return { current: 1, total: 3 };
  };

  const getBackPath = () => {
    if (selection.serviceType === 'both') {
      return '/haircut/details';
    }
    return '/';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Escolha a Barba"
        backTo={getBackPath()}
        progress={getProgress()}
      />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6">
        <p className="text-accessible text-muted-foreground text-center mb-6">
          Toque no estilo desejado
        </p>

        <div className="grid grid-cols-2 gap-4">
          {beardStyles.map((style, index) => (
            <div
              key={style.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ServiceCard
                icon={style.icon}
                label={style.name}
                description={style.description}
                defaultImage={style.defaultImage}
                defaultImageKey={style.defaultImageKey}
                imageData={style.imageData}
                selected={selection.beardStyle?.id === style.id}
                onClick={() => handleSelect(style)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BeardCatalog;
