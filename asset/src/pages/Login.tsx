import FormikField from "@/components/customFieldsFormik/FormikField";
import InputField from "@/components/customFieldsFormik/InputField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import BaseUrl from "@/consts/baseUrl";
import AuthLayout from "@/layouts/AuthLayout";
import { useAuth } from "@/providers/AuthenticationProvider";
import { Form, Formik } from "formik";
import { LogIn } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import * as Yup from "yup";

const Login = () => {
  const { toast } = useToast();
  const { login, isLogged } = useAuth();

  if (isLogged) {
    return <Navigate to={BaseUrl.Homepage} />;
  }

  return (
    <AuthLayout
      title="Đăng nhập"
      description="Chào mừng bạn quay lại! Nhập thông tin để tiếp tục."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link
            to={BaseUrl.Register}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <Formik
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
          password: Yup.string().required("Vui lòng nhập mật khẩu"),
        })}
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);
            const { username, password } = values;
            await login({ username, password });

          } catch (error) {
            toast({
              variant: "destructive",
              description: error as string,
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form className="component:Login flex flex-col gap-5">
              <FormikField
                component={InputField}
                name="username"
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập"
                required
              />

              <div className="flex flex-col gap-2">
                <FormikField
                  component={InputField}
                  name="password"
                  type="password"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <Link
                  to={BaseUrl.ForgotPassword}
                  className="self-end text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" isLoading={isSubmitting} className="h-10 w-full">
                {!isSubmitting && <LogIn className="mr-2 h-4 w-4" />}
                Đăng nhập
              </Button>
            </Form>
          );
        }}
      </Formik>
    </AuthLayout>
  );
};

export default Login;
