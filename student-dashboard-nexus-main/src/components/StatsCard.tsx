import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, change, icon, className }: StatsCardProps) => {
  const isPositive = change.startsWith('+');

  return (
    <Card className={cn("p-6 relative overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={cn(
          "font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {change}
        </span>
        <span className="text-muted-foreground ml-2">from last month</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/40" />
    </Card>
  );
};

export default StatsCard;