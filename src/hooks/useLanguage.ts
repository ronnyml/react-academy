import { useEffect } from "react";
import { useTranslator } from "@/hooks/useTranslator";
import { settingsService } from "@/services/SettingsService";

export const useLanguage = () => {
  const { changeLanguage } = useTranslator();

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = localStorage.getItem("appLanguage");
        if (savedLanguage) {
          changeLanguage(savedLanguage);
          return;
        }

        const settings = await settingsService.getSettings();
        if (settings.defaultLanguage) {
          changeLanguage(settings.defaultLanguage);
          localStorage.setItem("appLanguage", settings.defaultLanguage);
        }
      } catch (error) {
        console.error("Error initializing language:", error);
        changeLanguage("es");
      }
    };

    initializeLanguage();
  }, [changeLanguage]);
};