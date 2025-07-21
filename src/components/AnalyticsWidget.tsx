import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AnalyticsWidgetProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    period: string;
  };
  icon?: React.ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export function AnalyticsWidget({ 
  title, 
  value, 
  change, 
  icon, 
  color = "blue" 
}: AnalyticsWidgetProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
      green: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
      purple: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20",
      orange: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20",
      red: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendIcon = (type: string) => {
    switch (type) {
      case "increase":
        return <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />;
      case "decrease":
        return <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTrendColor = (type: string) => {
    switch (type) {
      case "increase":
        return "text-green-600 dark:text-green-400";
      case "decrease":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getColorClasses(color)}`}>
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          
          {change && (
            <div className={`flex items-center space-x-1 text-xs ${getTrendColor(change.type)}`}>
              {getTrendIcon(change.type)}
              <span className="font-medium">
                {change.value > 0 && change.type !== "decrease" ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-muted-foreground">
                {change.period}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}