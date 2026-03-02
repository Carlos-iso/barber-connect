import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { OptionSection } from '@/components/OptionSection';
import { OptionButton } from '@/components/OptionButton';
import { ServiceCard } from '@/components/ServiceCard';

import { Button } from '@/components/ui/button';
import { useSelection } from '@/contexts/SelectionContext';
import { useCustomStyles } from '@/contexts/CustomStylesContext';
import { styleConfigs, CuttingMethod, SideStyle, FinishStyle, FadeType, ScissorHeight } from '@/types/barber';
import { ArrowRight } from 'lucide-react';

const HaircutDetails = () => {
  const navigate = useNavigate();
  const { selection, setHaircutDetails } = useSelection();
  const { haircutDetails, haircutStyle } = selection;
  const {
    machineHeights,
    scissorHeights,
    sideStyles,
    fadeTypes,
    finishStyles,
    cuttingMethods
  } = useCustomStyles();

  // Configuration based on selected style

  const styleId = haircutStyle?.id || 'default';
  const config = styleConfigs[styleId] || styleConfigs.default;
  const isFadeStyle = styleId === 'fade';

  // Filter options based on style config
  const availableMethods = cuttingMethods.filter(m =>
    config.methods.includes(m.id as CuttingMethod)
  );
  const availableSideStyles = sideStyles.filter(s =>
    config.sideStyles.includes(s.id as SideStyle)
  );
  const availableFinishStyles = finishStyles.filter(f =>
    config.finishStyles.includes(f.id as FinishStyle)
  );

  // Auto-select when only one option exists
  useEffect(() => {
    if (availableMethods.length === 1 && haircutDetails.method !== availableMethods[0].id) {
      setHaircutDetails({ method: availableMethods[0].id as CuttingMethod });
    }
    if (availableSideStyles.length === 1 && haircutDetails.sideStyle !== availableSideStyles[0].id) {
      setHaircutDetails({ sideStyle: availableSideStyles[0].id as SideStyle });
    }
    if (availableFinishStyles.length === 1 && haircutDetails.finish !== availableFinishStyles[0].id) {
      setHaircutDetails({ finish: availableFinishStyles[0].id as FinishStyle });
    }
  }, [styleId, availableMethods, availableSideStyles, availableFinishStyles, haircutDetails, setHaircutDetails]);

  const handleNext = () => {
    if (selection.serviceType === "both") {
      navigate("/beard");
    } else {
      navigate("/confirmation");
    }
  };

  const getProgress = () => {
    if (selection.serviceType === "both") {
      return { current: 2, total: 5 };
    }
    return { current: 2, total: 3 };
  };

  // Calculate number of active selections
  const selectionCount = [
    haircutDetails.method,
    haircutDetails.machineHeight,
    haircutDetails.scissorHeight,
    haircutDetails.fadeType,
    haircutDetails.sideStyle,
    haircutDetails.finish
  ].filter(Boolean).length;

  const isComplete = selectionCount >= 2;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Detalhes do Corte"
        backTo="/haircut"
        progress={getProgress()}
      />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Fade Type - Only for Fade style */}
        {isFadeStyle && (
          <OptionSection title="Tipo de Degradê">
            {fadeTypes.map(fade => {
              return (
                <ServiceCard
                  key={fade.id}
                  icon={fade.icon}
                  label={fade.label}
                  description={fade.description}
                  defaultImage={fade.defaultImage}
                  defaultImageKey={fade.defaultImageKey}
                  imageData={fade.imageData}
                  selected={haircutDetails.fadeType === fade.id}
                  onClick={() => setHaircutDetails({ fadeType: fade.id as FadeType })}
                  compact
                />
              );
            })}
          </OptionSection>
        )}

        {/* Cutting Method - Show if more than 1 option */}
        {availableMethods.length > 1 && (
          <OptionSection title="Método de Corte">
            {availableMethods.map(method => (
              <OptionButton
                key={method.id}
                icon={method.icon}
                label={method.label}
                defaultImage={method.backgroundImage}
                defaultImageKey={method.backgroundImageKey}
                imageData={method.imageData}
                selected={haircutDetails.method === method.id}
                onClick={() => setHaircutDetails({
                  method: haircutDetails.method === method.id ? null : method.id as CuttingMethod
                })}
              />
            ))}
          </OptionSection>
        )}

        {/* Machine Height (Only if method is machine AND NOT fade style) */}
        {haircutDetails.method === "machine" && !isFadeStyle && (
          <OptionSection title="Altura da Pente">
            {machineHeights.map((height) => (
              <OptionButton
                key={height.id}
                icon={height.icon}
                label={height.label}
                defaultImage={height.defaultImage}
                defaultImageKey={height.defaultImageKey}
                imageData={height.imageData}
                selected={haircutDetails.machineHeight === height.id}
                onClick={() => setHaircutDetails({
                  machineHeight: haircutDetails.machineHeight === height.id ? null : height.id
                })}
              />
            ))}
          </OptionSection>
        )}


        {/* Scissor Height (Topo) - Show if method is scissors OR style is fade/social (assuming topo is relevant) */}
        {/* Requirement: "Colocar aba TOPO para parte de cima do cabelo... para tesoura" */}
        {/* We show it if method is scissors, OR if it's implicitly part of the style like Social/Fade? */}
        {/* If user selected Machine, usually Scissor top is optional or not present depending on style. */}
        {/* Let's show it if method is NOT strictly machine-only (i.e. 'scissors' is selected OR style implies mixed). */}
        {/* Actually simpler: Show if method is 'scissors' OR (style is 'fade' and method is 'machine' -> commonly means fade sides, scissors top?) */}
        {/* Let's just follow the user instruction: "Colocar aba TOPO ... para tesoura". */}
        {(haircutDetails.method === "scissors" || styleId === 'fade' || styleId === 'social') && (
          <OptionSection title="Topo (Tesoura)">
            {scissorHeights.map((height) => (
              <OptionButton
                key={height.id}
                icon={height.icon}
                label={height.label}
                defaultImage={height.defaultImage}
                defaultImageKey={height.defaultImageKey}
                imageData={height.imageData}
                selected={haircutDetails.scissorHeight === height.id}
                onClick={() => setHaircutDetails({
                  scissorHeight: haircutDetails.scissorHeight === height.id ? null : height.id as ScissorHeight
                })}
              />
            ))}
          </OptionSection>
        )}

        {/* Sides - Show if more than 1 option */}
        {availableSideStyles.length > 0 && ( /* Changed from > 1 to > 0 to ensure it shows if filtered list has items (e.g. Fade styles) */
          <OptionSection title="Laterais">
            {availableSideStyles.map(style => (
              <OptionButton
                key={style.id}
                icon={style.icon}
                label={style.label}
                defaultImage={style.defaultImage}
                defaultImageKey={style.defaultImageKey}
                imageData={style.imageData}
                selected={haircutDetails.sideStyle === style.id}
                onClick={() => setHaircutDetails({
                  sideStyle: haircutDetails.sideStyle === style.id ? null : style.id as SideStyle
                })}
              />
            ))}
          </OptionSection>
        )}

        {/* Finish - Show if more than 1 option */}
        {availableFinishStyles.length > 1 && (
          <OptionSection title="Acabamento">
            {availableFinishStyles.map(finish => (
              <OptionButton
                key={finish.id}
                icon={finish.icon}
                label={finish.label}
                defaultImage={finish.defaultImage}
                defaultImageKey={finish.defaultImageKey}
                imageData={finish.imageData}
                selected={haircutDetails.finish === finish.id}
                onClick={() => setHaircutDetails({
                  finish: haircutDetails.finish === finish.id ? null : finish.id as FinishStyle
                })}
              />
            ))}
          </OptionSection>
        )}

        {/* Auto-selected Summary */}
        {(availableMethods.length === 1 || availableSideStyles.length === 1 || availableFinishStyles.length === 1) && (
          <div className="p-4 bg-secondary/50 rounded-2xl space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Opções do estilo {haircutStyle?.name}:</p>
            {availableMethods.length === 1 && (
              <p className="text-foreground">• Método: {availableMethods[0].label}</p>
            )}
            {availableSideStyles.length === 1 && (
              <p className="text-foreground">• Laterais: {availableSideStyles[0].label}</p>
            )}
            {availableFinishStyles.length === 1 && (
              <p className="text-foreground">• Acabamento: {availableFinishStyles[0].label}</p>
            )}
          </div>
        )}
      </main>

      {/* Footer Button */}
      <div className="sticky bottom-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
        <div className="container max-w-2xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!isComplete}
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

export default HaircutDetails;
