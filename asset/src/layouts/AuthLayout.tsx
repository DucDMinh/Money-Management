import { CheckCircle2, Wallet } from "lucide-react";

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
