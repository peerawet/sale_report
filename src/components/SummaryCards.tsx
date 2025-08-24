import React from "react";

interface SummaryCardsProps {
  title: string;
  cards: Array<{
    title: string;
    value: string;
    subtitle?: string;
    color: string;
    isGradient?: boolean;
  }>;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ title, cards }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300 ${
              card.isGradient ? "" : "transform hover:-translate-y-1 bg-white"
            } ${card.isGradient ? card.color : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-semibold uppercase tracking-wider ${
                  card.isGradient ? "text-white opacity-90" : "text-slate-500"
                }`}
              >
                {card.title}
              </h3>
              <div
                className={`w-3 h-3 rounded-full ${
                  card.isGradient ? "bg-white" : card.color
                }`}
              ></div>
            </div>
            <p
              className={`text-3xl font-bold ${
                card.isGradient ? "text-white" : "text-slate-800"
              }`}
            >
              {card.value}
            </p>
            {card.subtitle && (
              <p
                className={`text-sm font-medium mt-2 ${
                  card.isGradient
                    ? "text-white opacity-90"
                    : card.color.replace("bg-", "text-").replace("-500", "-600")
                }`}
              >
                {card.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
