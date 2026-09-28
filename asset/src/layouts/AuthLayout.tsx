import { CheckCircle2, Wallet } from "lucide-react";
import { formatPercent, formatVND } from "@/helpers/format";
import { monthBalance } from "@/mocks/mockData";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const highlights = [
  "Ghi chép thu chi chỉ trong vài giây",
  "Tổng hợp theo ngày, tuần, tháng và năm",
  "Biết rõ tiền của bạn đang đi về đâu",
];

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <Wallet className="h-5 w-5" />
    </span>
    <span className="font-semibold">Money Manager</span>
  </div>
);

const AuthLayout = ({ title, description, children, footer }: AuthLayoutProps) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground text-primary">
            <Wallet className="h-5 w-5" />
          </span>
          <span className="font-semibold">Money Manager</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Làm chủ chi tiêu, mỗi ngày một chút.
          </h2>
          <ul className="mt-6 flex flex-col gap-3 text-sm text-primary-foreground/80">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
            <p className="text-xs text-primary-foreground/70">
              Số dư {monthBalance.label.toLowerCase()}
            </p>
            <p className="mt-1 text-3xl font-semibold">
              {formatVND(monthBalance.balance)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-primary-foreground/70">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-income" />
                  Tổng thu
                </p>
                <p className="mt-1 font-medium">{formatVND(monthBalance.income)}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-primary-foreground/70">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-expense" />
                  Tổng chi
                </p>
                <p className="mt-1 font-medium">
                  {formatVND(monthBalance.expense)}
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary-foreground/15">
              <div
                className="h-full rounded-full bg-expense"
                style={{ width: `${monthBalance.spentRatio}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-primary-foreground/70">
              Đã chi {formatPercent(monthBalance.spentRatio)} thu nhập tháng này
            </p>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © 2026 Money Manager
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
