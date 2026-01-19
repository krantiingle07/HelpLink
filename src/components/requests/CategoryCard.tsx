import { CategoryInfo } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: CategoryInfo;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export function CategoryCard({ category, onClick, selected, compact }: CategoryCardProps) {
  const Icon = category.icon;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-medium",
          selected
            ? "border-primary bg-primary/10 text-primary shadow-sm"
            : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <Icon className={cn("h-4 w-4", selected ? "text-primary" : category.color)} />
        <span className="text-sm">{category.label}</span>
      </button>
    );
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group overflow-hidden",
        selected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 relative">
        {/* Background gradient on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          category.bgColor
        )} style={{ opacity: 0.05 }} />
        
        <div className="relative z-10">
          <div className={cn(
            "inline-flex p-3.5 rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110",
            category.bgColor
          )}>
            <Icon className={cn("h-6 w-6", category.color)} />
          </div>
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
            {category.label}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {category.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
