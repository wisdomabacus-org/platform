// src/pages/NotFoundPage.tsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import { PortalLayout } from "@/components/layouts/PortalLayout";

const MAIN_PLATFORM_URL =
  import.meta.env.VITE_MAIN_SITE_URL || "https://wisdomabacus.com";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoToMainSite = () => {
    window.location.href = MAIN_PLATFORM_URL;
  };

  return (
    <PortalLayout className="flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center">
          <div className="rounded-full bg-muted p-3">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="pt-4 text-center text-2xl">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <p className="text-4xl font-bold text-muted-foreground">404</p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-xs text-muted-foreground">
            Attempted path: <code className="rounded bg-muted px-1 py-0.5">{location.pathname}</code>
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleGoToMainSite}>
            Go to Main Platform
          </Button>
        </CardFooter>
      </Card>
    </PortalLayout>
  );
};

export default NotFoundPage;
