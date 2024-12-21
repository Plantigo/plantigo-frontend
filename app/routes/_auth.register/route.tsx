import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, Link, redirect } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { ActionFunctionArgs } from "@remix-run/node";
import { registerUser } from "../_auth/actions";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password is too short." }),
    confirmPassword: z.string().min(8, { message: "Password is too short." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<Record<string, string>>(
    request,
    zodResolver(formSchema)
  );
  if (errors) {
    return { errors, defaultValues };
  }

  const response = await registerUser(data);

  if (response.ok) {
    return redirect("/account-created");
  } else {
    if (response.status === 400) {
      return {
        errors: {
          root: {
            message: "Account already exists. Please login.",
          },
        },
        defaultValues,
      };
    } else {
      return {
        errors: {
          root: {
            message: "An unexpected error occurred. Please try again later.",
          },
        },
        defaultValues,
      };
    }
  }
};

export default function RegisterPage() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const toggleShowPassword = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useRemixForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (errors.root?.message) {
      toast({
        title: "Error",
        description: errors.root.message,
        variant: "destructive",
      });
    }
  }, [errors.root?.message]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center flex justify-center gap-2 items-center">
          <span>Register in</span>
          <span className="text-primary flex items-center">
            Plantigo <Leaf className="w-7 h-7" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-4"
        >
          <label htmlFor="email" className="flex flex-col gap-1">
            <span className="font-semibold">Email</span>
            <Input
              placeholder="Enter your email here"
              type="email"
              {...register("email")}
            />
            <span className="text-destructive">
              {errors.email && <p>{errors.email.message}</p>}
            </span>
          </label>
          <label htmlFor="password" className="flex flex-col gap-1 relative">
            <span className="font-semibold">Password</span>
            <Input
              placeholder="Enter your password here"
              type={showPassword.password ? "text" : "password"}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-5 top-11"
              onClick={() => toggleShowPassword("password")}
            >
              {showPassword.password ? (
                <EyeOff className="text-muted-foreground hover:text-primary" />
              ) : (
                <Eye className="text-muted-foreground hover:text-primary" />
              )}
            </button>
            <span className="text-destructive">
              {errors.password && <p>{errors.password.message}</p>}
            </span>
          </label>
          <label
            htmlFor="confirmPassword"
            className="flex flex-col gap-1 relative"
          >
            <span className="font-semibold">Confirm Password</span>
            <Input
              placeholder="Confirm your password"
              type={showPassword.confirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute right-5 top-11"
              onClick={() => toggleShowPassword("confirmPassword")}
            >
              {showPassword.confirmPassword ? (
                <EyeOff className="text-muted-foreground hover:text-primary" />
              ) : (
                <Eye className="text-muted-foreground hover:text-primary" />
              )}
            </button>
            <span className="text-destructive">
              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
            </span>
          </label>
          <Button
            size="lg"
            type="submit"
            className="mt-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            Register
          </Button>
        </Form>
        <div className="pt-6">
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold">
              Login here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
