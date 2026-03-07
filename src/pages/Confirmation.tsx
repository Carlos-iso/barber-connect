import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { SummaryItem } from '@/components/SummaryItem';
import { Button } from '@/components/ui/button';
import { useSelection } from '@/contexts/SelectionContext';
import { useCustomStyles } from '@/contexts/CustomStylesContext';
import { ordersData, ServiceItem } from '@/data/ordersData';
import { useToast } from '@/hooks/use-toast';
import { DynamicIcon } from '@/components/DynamicIcon';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Check } from 'lucide-react';

const Confirmation = () => {
  const navigate = useNavigate();
  const { selection } = useSelection();
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
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const buildServices = (): ServiceItem[] => {
    const services: ServiceItem[] = [];

    if (hasHaircut && selection.haircutStyle) {
      services.push({ name: `Cabelo - ${selection.haircutStyle.name}`, price: 0 });
    }

    if (hasBeard && selection.beardStyle) {
      services.push({ name: `Barba - ${selection.beardStyle.name}`, price: 0 });
    }

    return services;
  };

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const services = buildServices();
      await ordersData.createOrder({
        customerName: "Cliente",
        services,
        totalPrice: services.reduce((sum, item) => sum + item.price, 0),
      });
      navigate('/barber-view');
    } catch (error: any) {
      toast({
        title: "Erro ao finalizar atendimento",
        description: error.response?.data?.message || error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    if (selection.serviceType === 'both') {
      return { current: 5, total: 5 };
    }
    return { current: 3, total: 3 };
  };

  const getBackPath = () => {
    if (selection.serviceType === 'both' || selection.serviceType === 'beard') {
      return '/beard/details';
    }
    return '/haircut/details';
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
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Confirmar Pedido"
        backTo={getBackPath()}
        progress={getProgress()}
      />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Este é o corte desejado?
          </h2>
          <p className="text-muted-foreground">
            Revise as opções antes de confirmar
          </p>

          {/* Preview das imagens */}
          <div className="flex justify-center gap-4 mt-6">
            {hasHaircut && selection.haircutStyle && (
              <div className="text-center">
                <div className="w-36 h-36 rounded-2xl border-2 border-primary overflow-hidden bg-muted mx-auto">
                  {(selection.haircutStyle.imageData || selection.haircutStyle.defaultImage) ? (
                    <ImageWithFallback
                      imageUrl={selection.haircutStyle.imageData || selection.haircutStyle.defaultImage}
                      imageKey={!selection.haircutStyle.imageData ? selection.haircutStyle.defaultImageKey : undefined}
                      iconName={selection.haircutStyle.icon}
                      alt={selection.haircutStyle.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <DynamicIcon name={selection.haircutStyle.icon} className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium mt-2">{selection.haircutStyle.name}</p>
              </div>
            )}

            {hasBeard && selection.beardStyle && (
              <div className="text-center">
                <div className="w-36 h-36 rounded-2xl border-2 border-primary overflow-hidden bg-muted mx-auto">
                  {(selection.beardStyle.imageData || selection.beardStyle.defaultImage) ? (
                    <ImageWithFallback
                      imageUrl={selection.beardStyle.imageData || selection.beardStyle.defaultImage}
                      imageKey={!selection.beardStyle.imageData ? selection.beardStyle.defaultImageKey : undefined}
                      iconName={selection.beardStyle.icon}
                      alt={selection.beardStyle.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <DynamicIcon name={selection.beardStyle.icon} className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium mt-2">{selection.beardStyle.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Mensagem quando não há seleções */}
          {!hasHaircut && !hasBeard && (
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                Nenhuma seleção encontrada.
                <br />
                Por favor, volte e escolha seu corte.
              </p>
            </div>
          )}

          {/* Cabelo */}
          {hasHaircut && selection.haircutStyle && (
            <>
              <div className="animate-fade-in">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
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

                  {selection.haircutStyle?.id === 'fade' && fadeTypeLabel && (
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
            </>
          )}

          {/* Barba */}
          {hasBeard && selection.beardStyle && (
            <>
              <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 mt-6">
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
            </>
          )}
        </div>
      </main>

      {/* Botão Confirmar */}
      <div className="sticky bottom-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
        <div className="container max-w-2xl mx-auto">
          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full h-14 text-lg font-semibold bg-success hover:bg-success/90"
            size="lg"
          >
            <Check className="mr-2 h-5 w-5" />
            {submitting ? "Finalizando..." : "Confirmar e mostrar ao barbeiro"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
