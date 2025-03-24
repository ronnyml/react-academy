import { useTranslation } from 'react-i18next';

export const useTranslator = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    changeLanguage: i18n.changeLanguage,
    language: i18n.language
  };
};
