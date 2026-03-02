import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { OptionSection } from '@/components/OptionSection';
import { OptionButton } from '@/components/OptionButton';
import { Button } from '@/components/ui/button';
import { useSelection } from '@/contexts/SelectionContext';
import { useCustomStyles } from '@/contexts/CustomStylesContext';
import { ArrowRight } from 'lucide-react';

const BeardDetails = () => {
  const navigate = useNavigate();
  const { selection, setBeardDetails } = useSelection();
  const { beardDetails } = selection;
  const {
    beardHeights,
    beardContours
  } = useCustomStyles();

  const handleNext = () => {
    navigate('/confirmation');
  };

  const getProgress = () => {
    if (selection.serviceType === 'both') {
      return { current: 4, total: 5 };
    }
    return { current: 2, total: 3 };
  };

  const isComplete = beardDetails.height && beardDetails.contour;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Detalhes da Barba"
        backTo="/beard"
        progress={getProgress()}
      />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Altura da Barba */}
        <OptionSection title="Altura da Barba">
          {beardHeights.map(height => (
            <OptionButton
              key={height.id}
              icon={height.icon}
              label={height.label}
              defaultImage={height.defaultImage}
              defaultImageKey={height.defaultImageKey}
              imageData={height.imageData}
              selected={beardDetails.height === height.id}
              onClick={() => setBeardDetails({
                height: beardDetails.height === height.id ? null : height.id
              })}
            />
          ))}
        </OptionSection>

        {/* Contorno */}
        <OptionSection title="Contorno">
          {beardContours.map(contour => (
            <OptionButton
              key={contour.id}
              icon={contour.icon}
              label={contour.label}
              defaultImage={contour.defaultImage}
              defaultImageKey={contour.defaultImageKey}
              imageData={contour.imageData}
              selected={beardDetails.contour === contour.id}
              onClick={() => setBeardDetails({
                contour: beardDetails.contour === contour.id ? null : contour.id
              })}
            />
          ))}
        </OptionSection>
      </main>

      {/* Botão Continuar */}
      <div className="sticky bottom-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
        <div className="container max-w-2xl mx-auto">
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};


export default BeardDetails;
