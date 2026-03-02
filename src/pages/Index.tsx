import { useNavigate } from 'react-router-dom';
import { Scissors, User, Users } from 'lucide-react';
import { useSelection } from '@/contexts/SelectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { authData } from '@/data/authData';
import { Button } from '@/components/ui/button';
import { ServiceType } from '@/types/barber';

const Index = () => {
  const navigate = useNavigate();
  const { setServiceType } = useSelection();
  const { user, signOut } = useAuth();
  const hasToken = Boolean(authData.getToken());
  const canAccessDashboard = user?.role === 'barber' || user?.role === 'admin';

  const handleNew = () => {
    if (canAccessDashboard) {
      navigate('/dashboard');
      return;
    }
    navigate('/login', { state: { from: '/dashboard' } });
  };

  const handleServiceSelect = (type: ServiceType) => {
    setServiceType(type);

    if (type === 'hair' || type === 'both') {
      navigate('/haircut');
    } else {
      navigate('/beard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top safe-bottom">
      {/* Header */}
      <header className="relative pt-12 pb-8 px-6 text-center">
        {hasToken && canAccessDashboard && (
          <div className="absolute top-4 left-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground"
            >
              Dashboard
            </Button>
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-2">
            {canAccessDashboard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNew}
                className="text-muted-foreground"
              >
                Novo
              </Button>
            )}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-destructive"
              >
                Sair
              </Button>
            )}
          </div>
        <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
          <Scissors className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="title-accessible text-foreground mb-2">
          Barbearia Acessível
        </h1>
        <p className="text-accessible text-muted-foreground">
          Como deseja seu atendimento?
        </p>
      </header>

      {/* Service Options */}
      <main className="flex-1 container max-w-lg mx-auto px-6 pb-8">
        <div className="flex flex-col gap-4">
          {/* Cabelo */}
          <button
            onClick={() => handleServiceSelect('hair')}
            className="service-card animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
              <Scissors className="h-10 w-10 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Cabelo</span>
            <span className="text-sm text-muted-foreground">Corte de cabelo</span>
          </button>

          {/* Barba */}
          <button
            onClick={() => handleServiceSelect('beard')}
            className="service-card animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
              <User className="h-10 w-10 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Barba</span>
            <span className="text-sm text-muted-foreground">Fazer a barba</span>
          </button>

          {/* Cabelo + Barba */}
          <button
            onClick={() => handleServiceSelect('both')}
            className="service-card animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Cabelo + Barba</span>
            <span className="text-sm text-muted-foreground">Serviço completo</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>Toque para escolher</p>
      </footer>
    </div>
  );
};

export default Index;
