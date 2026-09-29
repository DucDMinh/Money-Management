import { useState } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Form, Formik, FormikHelpers } from "formik";
import { MoreHorizontal } from "lucide-react";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import { useCategory } from "@/api/category";
import { useCreateTransaction, useUpdateTransaction } from "@/api/transaction";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { categoryIcons, defaultCategories } from "@/consts/categories";
import { todayISO } from "@/helpers/date";
import { showSuccess } from "@/helpers/toast";
import {
  Transaction,
  TransactionPayload,
  TransactionType,
} from "@/interfaces/transaction";

interface TransactionFormValues {
  type: TransactionType;
  amount?: number;
  category: string;
  date: string;
  note: string;
}

interface TransactionFormDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  transaction?: Transaction | null;
}

const MAX_NOTE_LENGTH = 500;

const validationSchema = Yup.object({
  amount: Yup.number()
    .typeError("Vui lòng nhập số tiền")
    .required("Vui lòng nhập số tiền")
    .moreThan(0, "Số tiền phải lớn hơn 0")
    .max(1e12, "Số tiền tối đa là 1.000 tỷ"),
  category: Yup.string()
    .trim()
    .required("Vui lòng chọn hoặc nhập danh mục")
    .max(50, "Danh mục tối đa 50 ký tự"),
  date: Yup.string().required("Vui lòng chọn ngày"),
  note: Yup.string().max(
    MAX_NOTE_LENGTH,
    `Ghi chú tối đa ${MAX_NOTE_LENGTH} ký tự`
  ),
});

const getInitialValues = (
  transaction?: Transaction | null
): TransactionFormValues => {
  if (transaction) {
    return {
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      note: transaction.note,
    };
  }

  return {
    type: "expense",
    amount: undefined,
    category: defaultCategories.expense[0],
    date: todayISO(),
    note: "",
  };
};

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="invalid-text">{message}</p>;
};

const TransactionForm = ({
  transaction,
  onDone,
}: {
  transaction?: Transaction | null;
  onDone: () => void;
}) => {
  const { data: categoryOptions = defaultCategories } = useCategory();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const handleSubmit = async (
    values: TransactionFormValues,
    { setErrors }: FormikHelpers<TransactionFormValues>
  ) => {
    const payload: TransactionPayload = {
      type: values.type,
      amount: values.amount ?? 0,
      category: values.category.trim(),
      date: values.date,
      note: values.note.trim(),
    };

    try {
      if (transaction) {
        await updateTransaction.mutateAsync({ id: transaction.id, ...payload });
        showSuccess("Đã cập nhật giao dịch");
      } else {
        await createTransaction.mutateAsync(payload);
        showSuccess("Đã thêm giao dịch");
      }
      onDone();
    } catch (error: any) {
      const details = error?.response?.data?.details;
      if (details) setErrors(details);
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(transaction)}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
      }) => {
        const categories = categoryOptions[values.type];
        const isCustomCategory =
          values.category !== "" && !categories.includes(values.category);

        const handleTypeChange = (type: TransactionType) => {
          setFieldValue("type", type);
          if (!categoryOptions[type].includes(values.category)) {
            setFieldValue("category", categoryOptions[type][0] ?? "");
          }
        };

        return (
          <Form className="grid gap-5">
            <Tabs
              value={values.type}
              onValueChange={(value) => handleTypeChange(value as TransactionType)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense">Khoản chi</TabsTrigger>
                <TabsTrigger value="income">Khoản thu</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-2">
              <Label htmlFor="transaction-amount" className="required">
                Số tiền
              </Label>
              <div className="relative">
                <NumericFormat
                  id="transaction-amount"
                  customInput={Input}
                  inputMode="numeric"
                  placeholder="0"
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  value={values.amount ?? ""}
                  onValueChange={({ floatValue }) =>
                    setFieldValue("amount", floatValue)
                  }
                  onBlur={() => setFieldTouched("amount", true)}
                  className="h-12 pr-10 text-xl font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₫
                </span>
              </div>
              <FieldError message={touched.amount ? errors.amount : undefined} />
            </div>

            <div className="grid gap-2">
              <Label className="required">Danh mục</Label>
              <RadioGroupPrimitive.Root
                value={isCustomCategory ? "" : values.category}
                onValueChange={(value) => setFieldValue("category", value)}
                className="grid grid-cols-3 gap-2 sm:grid-cols-5"
                aria-label="Danh mục"
              >
                {categories.map((category) => {
                  const Icon = categoryIcons[category] ?? MoreHorizontal;
                  return (
                    <RadioGroupPrimitive.Item
                      key={category}
                      value={category}
                      className="flex flex-col items-center gap-1.5 rounded-lg border px-1 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:border-foreground data-[state=checked]:bg-accent data-[state=checked]:text-foreground"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      <span className="w-full truncate text-center">
                        {category}
                      </span>
                    </RadioGroupPrimitive.Item>
                  );
                })}
              </RadioGroupPrimitive.Root>
              <Input
                placeholder="Hoặc nhập danh mục khác..."
                value={isCustomCategory ? values.category : ""}
                onChange={(event) => setFieldValue("category", event.target.value)}
                onBlur={() => setFieldTouched("category", true)}
                maxLength={50}
              />
              <FieldError
                message={touched.category ? errors.category : undefined}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-date" className="required">
                Ngày
              </Label>
              <Input
                id="transaction-date"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FieldError message={touched.date ? errors.date : undefined} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="transaction-note">Ghi chú</Label>
                <span className="text-xs text-muted-foreground">
                  {values.note.length}/{MAX_NOTE_LENGTH}
                </span>
              </div>
              <Textarea
                id="transaction-note"
                name="note"
                placeholder="Ví dụ: Ăn trưa cùng đồng nghiệp"
                className="min-h-[72px] resize-none"
                maxLength={MAX_NOTE_LENGTH}
                value={values.note}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FieldError message={touched.note ? errors.note : undefined} />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" isLoading={isSubmitting}>
                {transaction ? "Lưu thay đổi" : "Thêm giao dịch"}
              </Button>
            </DialogFooter>
          </Form>
        );
      }}
    </Formik>
  );
};

const TransactionFormDialog = ({
  trigger,
  open,
  onOpenChange,
  transaction,
}: TransactionFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;

  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Sửa giao dịch" : "Thêm giao dịch"}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Cập nhật thông tin khoản thu chi"
              : "Ghi lại một khoản thu hoặc chi của bạn"}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
