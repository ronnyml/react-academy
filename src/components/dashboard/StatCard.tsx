import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  stats?: ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {stats && <div className="mt-2">{stats}</div>}
      </CardContent>
    </Card>
  );
};