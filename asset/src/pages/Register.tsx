import { Form, Formik, FormikHelpers } from "formik";
import { UserPlus } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import * as Yup from "yup";
import FormikField from "@/components/customFieldsFormik/FormikField";
import InputField from "@/components/customFieldsFormik/InputField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import BaseUrl from "@/consts/baseUrl";
import AuthLayout from "@/layouts/AuthLayout";
import { useAuth } from "@/providers/AuthenticationProvider";

interface RegisterValues {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterValues = {
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  name: Yup.string().trim().max(50, "Tên hiển thị tối đa 50 ký tự"),
  username: Yup.string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập cần ít nhất 3 ký tự")
    .max(32, "Tên đăng nhập tối đa 32 ký tự")
    .matches(/^[a-zA-Z0-9_.]+$/, "Chỉ dùng chữ không dấu, số, dấu _ hoặc dấu ."),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu cần ít nhất 6 ký tự")
    .test(
      "max-bytes",
      "Mật khẩu quá dài",
      (value) => !value || new TextEncoder().encode(value).length <= 72
    ),
  confirmPassword: Yup.string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu nhập lại không khớp"),
});

const Register = () => {
  const { toast } = useToast();
  const { register, isLogged } = useAuth();

  if (isLogged) {
    return <Navigate to={BaseUrl.Homepage} replace />;
  }

  const handleSubmit = async (
    values: RegisterValues,
    { setErrors }: FormikHelpers<RegisterValues>
  ) => {
    try {
      await register({
        username: values.username.trim(),
        password: values.password,
        name: values.name.trim() || undefined,
      });
      toast({ description: "Tạo tài khoản thành công. Chào mừng bạn!" });
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 409) {
        setErrors({ username: data?.error ?? "Tên đăng nhập đã tồn tại" });
        return;
      }
      if (data?.details) {
        setErrors(data.details);
        return;
      }
      toast({
        variant: "destructive",
        description: data?.error ?? "Không thể đăng ký, vui lòng thử lại sau",
      });
    }
  };

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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="component:Register flex flex-col gap-5">
            <FormikField
              component={InputField}
              name="name"
              label="Tên hiển thị"
              placeholder="Ví dụ: Nguyễn Văn A"
              autoComplete="name"
            />

            <FormikField
              component={InputField}
              name="username"
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              helperText="3–32 ký tự: chữ không dấu, số, dấu _ hoặc dấu ."
              autoComplete="username"
              required
            />

            <FormikField
              component={InputField}
              name="password"
              type="password"
              label="Mật khẩu"
              placeholder="Ít nhất 6 ký tự"
              autoComplete="new-password"
              required
            />

            <FormikField
              component={InputField}
              name="confirmPassword"
              type="password"
              label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="mt-1 h-10 w-full"
            >
              {!isSubmitting && <UserPlus className="mr-2 h-4 w-4" />}
              Tạo tài khoản
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Register;
