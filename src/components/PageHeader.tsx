import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProgressBar } from './ProgressBar';
import { useAuth } from '@/contexts/AuthContext';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  progress?: { current: number; total: number };
}

export function PageHeader({ title, showBack = true, backTo, progress }: PageHeaderProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const canAccessDashboard = (user?.role ?? []).includes('barber') || (user?.role ?? []).includes('admin');

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleNew = () => {
    if (canAccessDashboard) {
      navigate('/dashboard');
      return;
    }
    navigate('/login', { state: { from: '/dashboard' } });
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border safe-top">
      <div className="container max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="min-w-touch min-h-touch rounded-full hover:bg-secondary"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          <h1 className="title-accessible text-foreground flex-1">
            {title}
          </h1>

          <div className="flex items-center gap-2">
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
        </div>

        {progress && (
          <div className="mt-4">
            <ProgressBar current={progress.current} total={progress.total} />
          </div>
        )}
      </div>
    </header>
  );
}
