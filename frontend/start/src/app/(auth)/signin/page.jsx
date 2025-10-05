"use client";
import Button from "@/ui/Button";
import RHFTextField from "@/ui/RHFTextField";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import SpinnerMini from "@/ui/SpinnerMini";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const schema = yup
  .object({
    email: yup.string().email("ایمیل نامعتبر است").required("ایمیل الزامی است"),
    password: yup.string().required("رمز عبور الزامی است"),
  })
  .required();

function Signin() {
  const { signin } = useAuth();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    await signin(values);
  };

  useEffect(() => {
    if (error === "unauthorized") {
      toast.error("برای دسترسی باید حساب کاربری داشته باشی");
    }
    if (error === "sessionExpired") {
      toast.error("داوش خیلی وقته اینجا بودی، دوباره وارد شو");
    }
    if (error === "serverError") {
      toast.error("مشکلی پیش ، دلارو نگاه کن تا درستش کنیم");
    }
  }, [error]);

  return (
    <div className="max-w-md mx-auto mt-12 px-6 py-8 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-secondary-600 text-center mb-8">
        ورود
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <RHFTextField
          label="ایمیل"
          name="email"
          register={register}
          dir="ltr"
          isRequired
          errors={errors}
        />
        <RHFTextField
          label="رمز عبور"
          name="password"
          register={register}
          type="password"
          dir="ltr"
          isRequired
          errors={errors}
        />
        <div>
          {isSubmitting ? (
            <SpinnerMini />
          ) : (
            <Button type="submit" variant="primary" className="w-full">
              تایید
            </Button>
          )}
        </div>
      </form>
      <p className="mt-6 text-sm flex justify-center gap-1">
        حساب نداری؟{" "}
        <Link
          href="/signup"
          className="text-secondary-500 font-semibold hover:text-blue-600"
        >
          ثبت نام
        </Link>
      </p>
    </div>
  );
}

export default Signin;
