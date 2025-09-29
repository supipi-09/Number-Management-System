import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-3xl font-bold mb-1">{value.toLocaleString()}</h3>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-xs mt-2 opacity-80">{trend}</p>
        </div>
        <div className="opacity-80">
          <Icon size={40} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
