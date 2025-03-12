import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 z-50">
    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
    <span className="ml-2 text-gray-700 font-medium">Loading...</span>
  </div>
);

export default LoadingSpinner;