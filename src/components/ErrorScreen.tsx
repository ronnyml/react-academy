import BaseLayout from "@/layouts/BaseLayout";
import { useTranslator } from "@/hooks/useTranslator";

const ErrorScreen: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslator();
  return (
    <BaseLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-red-500">
          {t("errorLoading")}
          </p>
        </div>
      </div>
    </BaseLayout>
  )
};

export default ErrorScreen;