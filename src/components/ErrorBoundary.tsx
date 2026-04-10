import { useState, useEffect, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleReset = () => {
    setHasError(false);
    setError(null);
    window.location.reload();
  };

  if (hasError) {
    let errorMessage = "Kisu ekta vul hoise bhai! 😨";
    
    try {
      if (error?.message) {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.includes("permissions")) {
          errorMessage = "Bhai, permission nai! Login koro ba rules check koro. 🛑";
        }
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full p-8 bg-card border-2 border-destructive/20 rounded-3xl shadow-xl text-center space-y-6">
          <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-destructive">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold font-bangla">Opps! Danger!</h1>
          <p className="text-muted-foreground font-bangla">{errorMessage}</p>
          <Button onClick={handleReset} className="w-full gap-2 font-bangla">
            <RefreshCw className="h-4 w-4" /> Abar Try Koro
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
