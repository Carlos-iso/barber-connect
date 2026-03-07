import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SummaryItem } from '@/components/SummaryItem';
import { useSelection } from '@/contexts/SelectionContext';
import { useCustomStyles } from '@/contexts/CustomStylesContext';
import { Check, RefreshCw } from 'lucide-react';

const BarberView = () => {
  const navigate = useNavigate();
  const { selection, resetSelection } = useSelection();
  const {
    cuttingMethods,
    machineHeights,
    scissorHeights,
    sideStyles,
    finishStyles,
    fadeTypes,
    beardHeights,
    beardContours
  } = useCustomStyles();

  const handleNewService = () => {
    resetSelection();
    navigate('/');
  };

  const getLabel = (items: readonly { id: string; label: string }[], id: string | null) => {
    if (!id) return null;
    return items.find(item => item.id === id)?.label ?? null;
  };

  const hasHaircut = selection.serviceType === 'hair' || selection.serviceType === 'both';
  const hasBeard = selection.serviceType === 'beard' || selection.serviceType === 'both';
  const haircutMethodLabel = getLabel(cuttingMethods, selection.haircutDetails.method);
  const machineHeightLabel = getLabel(machineHeights, selection.haircutDetails.machineHeight);
  const scissorHeightLabel = getLabel(scissorHeights, selection.haircutDetails.scissorHeight);
  const fadeTypeLabel = getLabel(fadeTypes, selection.haircutDetails.fadeType);
  const sideStyleLabel = getLabel(sideStyles, selection.haircutDetails.sideStyle);
  const finishLabel = getLabel(finishStyles, selection.haircutDetails.finish);
  const beardHeightLabel = getLabel(beardHeights, selection.beardDetails.height);
  const beardContourLabel = getLabel(beardContours, selection.beardDetails.contour);

  return (
    <div className="min-h-screen bg-primary flex flex-col safe-top safe-bottom">
      {/* Header */}
      <header className="py-8 px-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-primary-foreground rounded-full flex items-center justify-center">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground mb-2">
          Pedido Confirmado
        </h1>
        <p className="text-lg text-primary-foreground/80">
          Mostre esta tela ao barbeiro
        </p>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 bg-background rounded-t-3xl px-6 py-8">
        <div className="container max-w-2xl mx-auto space-y-6">
          {/* Cabelo */}
          {hasHaircut && selection.haircutStyle && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  ✂
                </span>
                Cabelo
              </h3>
              <div className="space-y-3">
                <SummaryItem
                  icon={selection.haircutStyle.icon}
                  label="Estilo"
                  value={selection.haircutStyle.name}
                />
                {haircutMethodLabel && (
                  <SummaryItem
                    icon="Scissors"
                    label="Método"
                    value={haircutMethodLabel}
                  />
                )}
                {selection.haircutDetails.method === 'machine' && machineHeightLabel && (
                  <SummaryItem
                    icon="Ruler"
                    label="Altura"
                    value={machineHeightLabel}
                  />
                )}
                {scissorHeightLabel && (
                  <SummaryItem
                    icon="Ruler"
                    label="Topo"
                    value={scissorHeightLabel}
                  />
                )}
                {selection.haircutStyle.id === 'fade' && fadeTypeLabel && (
                  <SummaryItem
                    icon="TrendingDown"
                    label="Tipo de Degradê"
                    value={fadeTypeLabel}
                  />
                )}
                {sideStyleLabel && (
                  <SummaryItem
                    icon="TrendingDown"
                    label="Laterais"
                    value={sideStyleLabel}
                  />
                )}
                {finishLabel && (
                  <SummaryItem
                    icon="Target"
                    label="Acabamento"
                    value={finishLabel}
                  />
                )}
              </div>
            </div>
          )}

          {/* Barba */}
          {hasBeard && selection.beardStyle && (
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 mt-8">
                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  🧔
                </span>
                Barba
              </h3>
              <div className="space-y-3">
                <SummaryItem
                  icon={selection.beardStyle.icon}
                  label="Estilo"
                  value={selection.beardStyle.name}
                />
                {beardHeightLabel && (
                  <SummaryItem
                    icon="Minus"
                    label="Altura"
                    value={beardHeightLabel}
                  />
                )}
                {beardContourLabel && (
                  <SummaryItem
                    icon="Target"
                    label="Contorno"
                    value={beardContourLabel}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Botão Novo Atendimento */}
      <div className="p-6 bg-background border-t border-border safe-bottom">
        <div className="container max-w-2xl mx-auto">
          <Button
            onClick={handleNewService}
            variant="outline"
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Novo Atendimento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarberView;
