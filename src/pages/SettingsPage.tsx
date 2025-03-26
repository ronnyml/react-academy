import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Globe, Clock, Palette, Link, Mail, Edit, Save, RefreshCw, Image as ImageIcon, X, Hash } from "lucide-react";
import BaseLayout from "@/layouts/BaseLayout";
import { settingsService } from "@/services/SettingsService";
import { Settings } from "@/types/dataTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import { useTranslator } from "@/hooks/useTranslator";

const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" }
];

const LATIN_AMERICAN_TIMEZONES = [
  { value: "America/Lima", label: "Peru (Lima)" },
  { value: "America/Bogota", label: "Colombia (Bogotá)" },
  { value: "America/Mexico_City", label: "Mexico (Mexico City)" },
  { value: "America/Buenos_Aires", label: "Argentina (Buenos Aires)" },
  { value: "America/Santiago", label: "Chile (Santiago)" },
  { value: "America/Sao_Paulo", label: "Brazil (São Paulo)" },
  { value: "America/Caracas", label: "Venezuela (Caracas)" },
  { value: "America/Montevideo", label: "Uruguay (Montevideo)" },
  { value: "America/Asuncion", label: "Paraguay (Asunción)" },
  { value: "America/Guatemala", label: "Guatemala (Guatemala City)" }
];

const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<Partial<Settings>>({});
  const { t, changeLanguage } = useTranslator();

  const {
    data: Settings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["Settings"],
    queryFn: () => settingsService.getSettings()
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: Partial<Settings>) =>
      settingsService.updateSettings(updatedData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["Settings", 1] });
      await refetch();

      setIsEditing(false);
      setEditedSettings({});
      toast.success(t("updated"), {
        description: t("updatedDescription"),
      });
    },
    onError: () => {
      toast.error(t("updateFailed"), {
        description: t("updateFailedDescription"),
      });
    }
  });

  if (isLoading)return <LoadingSpinner />;
  if (error) return <ErrorScreen title={t("settings.title")} />;

  const handleInputChange = (key: keyof Settings, value: string) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    const updatedData = {
      ...Settings,
      ...editedSettings
    };
    changeLanguage(updatedData.defaultLanguage);
    updateMutation.mutate(updatedData);
  };

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
            {t("settings.title")}
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2" />{t("edit")}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedSettings({});
                  }}
                >
                  <X className="mr-2" />{t("cancel")}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <RefreshCw className="mr-2 animate-spin" />
                  ) : (
                    <Save className="mr-2" />
                  )}
                  {t("save")}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <Label className="flex items-center w-32 mr-4">
                  <Building2 className="mr-2" />{t("settings.company")}:
                </Label>
                {isEditing ? (
                  <div className="flex-grow">
                    <Input
                      className="w-full"
                      value={editedSettings.name ?? Settings?.name ?? ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                ) : (
                  <p>{Settings?.name}</p>
                )}
              </div>

              <div className="flex items-center">
                <Label className="flex items-center w-32 mr-4">
                  <Mail className="mr-2" />{t("settings.email")}:
                </Label>
                {isEditing ? (
                  <div className="flex-grow">
                    <Input
                      className="w-full"
                      value={editedSettings.email ?? Settings?.email ?? ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                ) : (
                  <a
                    href={`mailto:${Settings?.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {Settings?.email}
                  </a>
                )}
              </div>

              <div className="flex items-center">
                <Label className="flex items-center w-32 mr-4">
                  <Link className="mr-2" />{t("settings.website")}:
                </Label>
                {isEditing ? (
                  <div className="flex-grow">
                    <Input
                      className="w-full"
                      value={editedSettings.website ?? Settings?.website ?? ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                ) : (
                  <a
                    href={Settings?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {Settings?.website}
                  </a>
                )}
              </div>

              <div className="flex items-center">
                <Label className="flex items-center w-32 mr-4">
                  <ImageIcon className="mr-2" />Logo URL:
                </Label>
                {isEditing ? (
                  <div className="flex-grow">
                    <Input
                      className="w-full"
                      value={editedSettings.logoUrl ?? Settings?.logoUrl ?? ""}
                      onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                    />
                  </div>
                ) : (
                  <a
                    href={Settings?.logoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={Settings?.logoUrl}
                      alt={`${Settings?.name} logo`}
                      className="h-12 w-auto object-contain"
                    />
                  </a>
                )}
              </div>

              <div className="flex items-center">
                <Label className="flex items-center w-32 mr-4">
                  <Globe className="mr-2" />{t("settings.language")}:
                </Label>
                {isEditing ? (
                  <div className="flex-grow">
                    <Select
                      value={editedSettings.defaultLanguage ?? Settings?.defaultLanguage}
                      onValueChange={(value) => {
                        handleInputChange("defaultLanguage", value)
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("settings.selectLanguage")} />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p>{LANGUAGES.find(l => l.value === Settings?.defaultLanguage)?.label}</p>
                )}
              </div>

              <div className="flex items-center">
                <Label className="flex items-center w-32 mr-4">
                  <Clock className="mr-2" />{t("settings.timezone")}:
                </Label>
                {isEditing ? (
                  <div className="flex-grow">
                    <Select
                      value={editedSettings.timezone ?? Settings?.timezone}
                      onValueChange={(value) => handleInputChange("timezone", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("settings.selectTimezone")} />
                      </SelectTrigger>
                      <SelectContent>
                        {LATIN_AMERICAN_TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p>{LATIN_AMERICAN_TIMEZONES.find(tz => tz.value === Settings?.timezone)?.label}</p>
                )}
              </div>

              <div className="flex items-center">
                <Label className="flex items-center w-32 mr-4">
                  <Palette className="mr-2" />{t("settings.themeColor")}:
                </Label>
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-grow">
                    <Input
                      type="color"
                      value={editedSettings.themeColor ?? Settings?.themeColor ?? "#000000"}
                      onChange={(e) => handleInputChange("themeColor", e.target.value)}
                      className="w-16 h-10 p-0 border-none"
                    />
                    <div className="flex items-center flex-grow">
                      <Hash className="mr-2" />
                      <div className="flex-grow">
                        <Input
                          className="w-full"
                          value={editedSettings.themeColor ?? Settings?.themeColor ?? "#000000"}
                          onChange={(e) => handleInputChange("themeColor", e.target.value)}
                          placeholder={t("settings.enterHexColor")}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: Settings?.themeColor }}
                    />
                    <span>{Settings?.themeColor}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default SettingsPage;