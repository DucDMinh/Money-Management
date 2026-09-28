import FormikField from "@/components/customFieldsFormik/FormikField";
import InputField from "@/components/customFieldsFormik/InputField";
import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const ChangePassword = () => {
  return (
    <PageWrapper>
      <div className="component:ChangePassword">
        <PageHeader
          title="Đổi mật khẩu"
          description="Cập nhật mật khẩu để bảo vệ tài khoản của bạn"
        />
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="text-base">Mật khẩu mới</CardTitle>
            <CardDescription>
              Mật khẩu cần có ít nhất 6 ký tự
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                currentPassword: "",
                nextPassword: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object().shape({
                currentPassword: Yup.string().required(
                  "Vui lòng nhập mật khẩu hiện tại"
                ),
                nextPassword: Yup.string().required(
                  "Vui lòng nhập mật khẩu mới"
                ),
                confirmPassword: Yup.string().required(
                  "Vui lòng nhập lại mật khẩu mới"
                ),
              })}
              onSubmit={() => {}}
            >
              {() => {
                return (
                  <Form className="flex flex-col gap-5">
                    <FormikField
                      component={InputField}
                      name="currentPassword"
                      type="password"
                      label="Mật khẩu hiện tại"
                      required
                      placeholder="Nhập mật khẩu hiện tại"
                    />

                    <FormikField
                      component={InputField}
                      name="nextPassword"
                      type="password"
                      label="Mật khẩu mới"
                      required
                      placeholder="Nhập mật khẩu mới"
                    />

                    <FormikField
                      component={InputField}
                      name="confirmPassword"
                      type="password"
                      label="Nhập lại mật khẩu mới"
                      required
                      placeholder="Nhập lại mật khẩu mới"
                    />

                    <Button type="submit" className="mt-1 self-start">
                      Cập nhật mật khẩu
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default ChangePassword;
