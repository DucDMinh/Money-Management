import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionErrorProps {
  onRetry: () => void;
  className?: string;
}

const SectionError = ({ onRetry, className }: SectionErrorProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 py-10 text-center",
      className
    )}
  >
    <p className="text-sm text-muted-foreground">Không tải được dữ liệu</p>
    <Button variant="outline" size="sm" onClick={onRetry}>
      <RotateCw className="mr-2 h-4 w-4" />
      Thử lại
    </Button>
  </div>
);

export default SectionError;
