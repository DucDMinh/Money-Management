import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BaseUrl from "@/consts/baseUrl";
import AuthLayout from "@/layouts/AuthLayout";

const Register = () => {
  return (
    <AuthLayout
      title="Tạo tài khoản"
      description="Bắt đầu quản lý chi tiêu của bạn ngay hôm nay."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link
            to={BaseUrl.Login}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Đăng nhập
          </Link>
        </>
      }
    >
      <form className="component:Register flex flex-col gap-5">
        <div className="grid gap-2">
          <Label htmlFor="register-name">Tên hiển thị</Label>
          <Input id="register-name" placeholder="Ví dụ: Nguyễn Minh Anh" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-username" className="required">
            Tên đăng nhập
          </Label>
          <Input id="register-username" placeholder="Nhập tên đăng nhập" />
          <p className="text-[13px] text-muted-foreground">
            3–32 ký tự, gồm chữ không dấu, số, dấu gạch dưới hoặc dấu chấm
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-password" className="required">
            Mật khẩu
          </Label>
          <Input
            id="register-password"
            type="password"
            placeholder="Ít nhất 6 ký tự"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-confirm" className="required">
            Nhập lại mật khẩu
          </Label>
          <Input
            id="register-confirm"
            type="password"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <Button className="mt-1 h-10 w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Tạo tài khoản
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
