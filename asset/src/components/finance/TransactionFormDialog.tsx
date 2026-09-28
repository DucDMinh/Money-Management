import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  categoryIcons,
  expenseCategories,
  incomeCategories,
  mockToday,
} from "@/mocks/mockData";

interface TransactionFormDialogProps {
  trigger: React.ReactNode;
  title?: string;
}

const CategoryPicker = ({
  categories,
  defaultValue,
}: {
  categories: string[];
  defaultValue: string;
}) => {
  return (
    <RadioGroupPrimitive.Root
      defaultValue={defaultValue}
      className="grid grid-cols-3 gap-2 sm:grid-cols-5"
      aria-label="Danh mục"
    >
      {categories.map((category) => {
        const Icon = categoryIcons[category];
        return (
          <RadioGroupPrimitive.Item
            key={category}
            value={category}
            className="flex flex-col items-center gap-1.5 rounded-lg border px-1 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:border-foreground data-[state=checked]:bg-accent data-[state=checked]:text-foreground"
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="w-full truncate text-center">{category}</span>
          </RadioGroupPrimitive.Item>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
};

const TransactionFormDialog = ({
  trigger,
  title = "Thêm giao dịch",
}: TransactionFormDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Ghi lại một khoản thu hoặc chi của bạn
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="expense" className="flex flex-col gap-5">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Khoản chi</TabsTrigger>
            <TabsTrigger value="income">Khoản thu</TabsTrigger>
          </TabsList>

          <div className="grid gap-2">
            <Label htmlFor="transaction-amount">Số tiền</Label>
            <div className="relative">
              <Input
                id="transaction-amount"
                inputMode="numeric"
                placeholder="0"
                defaultValue="150.000"
                className="h-12 pr-10 text-xl font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₫
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Danh mục</Label>
            <TabsContent value="expense" className="mt-0">
              <CategoryPicker
                categories={expenseCategories}
                defaultValue="Ăn uống"
              />
            </TabsContent>
            <TabsContent value="income" className="mt-0">
              <CategoryPicker categories={incomeCategories} defaultValue="Lương" />
            </TabsContent>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-date">Ngày</Label>
              <Input
                id="transaction-date"
                type="date"
                defaultValue={mockToday.date}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transaction-note">Ghi chú</Label>
              <Textarea
                id="transaction-note"
                placeholder="Ví dụ: Ăn trưa cùng đồng nghiệp"
                className="min-h-[72px] resize-none"
              />
            </div>
          </div>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button>Lưu giao dịch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
