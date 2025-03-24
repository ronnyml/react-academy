import React from "react";
import { Loader2 } from "lucide-react";
import { useTranslator } from "@/hooks/useTranslator";

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslator();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 z-50">
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      <span className="ml-2 text-gray-700 font-medium">{t("loading")}</span>
    </div>
  );
}

export default LoadingSpinner;