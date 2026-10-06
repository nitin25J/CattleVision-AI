import React from "react";
import { CheckCircle2, AlertTriangle, Layers, TrendingUp } from "lucide-react";

export default function KpiMetricCards({ stats }) {
  const cards = [
    {
      id: "identified",
      value: stats?.total_identified ?? 10,
      label: "Identified",
      badge: "+3 this week",
      badgeType: "ochre",
      icon: <CheckCircle2 className="w-5 h-5 text-[#2E5B41]" />,
      iconBg: "bg-[#E7EEE0]"
    },
    {
      id: "confidence",
      value: `${stats?.avg_confidence ? Math.round(stats.avg_confidence) : 44}%`,
      label: "Avg. confidence",
      badge: "⚠ +2.4% vs last week",
      badgeType: "amberWarning",
      icon: <AlertTriangle className="w-5 h-5 text-[#D97706]" />,
      iconBg: "bg-[#FEF3C7]"
    },
    {
      id: "breeds",
      value: stats?.breeds_covered ?? 4,
      label: "Breeds covered",
      badge: "+1 new breed",
      badgeType: "sage",
      icon: <Layers className="w-5 h-5 text-[#173B2B]" />,
      iconBg: "bg-[#EAEFE6]"
    }
  ];

  const getBadgeClasses = (type) => {
    switch (type) {
      case "ochre":
        return "bg-[#F5E6CC] text-[#7A4E1B] border border-[#ECD1A4]/60";
      case "amberWarning":
        return "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]";
      case "sage":
      default:
        return "bg-[#E7EEE0] text-[#2E5B41] border border-[#D1DECA]/80";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="glass glass-hover p-5 flex flex-col justify-between"
        >
          {/* Top row: Icon and Badge */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              {card.icon}
            </div>
            <span
              className={`text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getBadgeClasses(
                card.badgeType
              )}`}
            >
              {card.badge}
            </span>
          </div>

          {/* Metric Value & Label */}
          <div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#16291E] tracking-tight mb-1">
              {card.value}
            </div>
            <div className="text-xs sm:text-[13px] font-sans font-medium text-[#79746A]">
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
