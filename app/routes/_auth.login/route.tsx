import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, Link, redirect } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LoaderCircle } from "lucide-react";
import { ActionFunctionArgs } from "@remix-run/node";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { login } from "../_auth/actions";
import { tokenCookie } from "../_auth/cookies.server";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password is too short." }),
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

  const response = await login(data);

  if (response.ok) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await tokenCookie.parse(cookieHeader)) || {};

    const { access, refresh } = await response.json();

    cookie.access = access;
    cookie.refresh = refresh;

    return redirect("/", {
      headers: {
        "Set-Cookie": await tokenCookie.serialize(cookie),
      },
    });
  } else {
    if (response.status === 401) {
      return {
        errors: {
          root: {
            message: "Account not found. Please check your email and password.",
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

export default function LoginPage() {
  const { toast } = useToast();

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
          <span>Login to</span>
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
          <label htmlFor="password" className="flex flex-col gap-1">
            <span className="font-semibold">Password</span>
            <Input
              placeholder="Enter your passoword here"
              type="password"
              {...register("password")}
            />
            <span className="text-destructive">
              {errors.password && <p>{errors.password.message}</p>}
            </span>
          </label>
          <Button
            size="lg"
            type="submit"
            className="mt-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            Login
          </Button>
        </Form>
        <div className="border-b w-full my-5"></div>
        <div className="flex flex-col gap-3">
          <Button variant="outline" size="lg" className="w-full">
            <img className="w-6 h-6" src="google.svg" alt="google" />
            Login with Google
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            <img className="w-6 h-6" src="apple.svg" alt="google" />
            Login with Apple
          </Button>
        </div>
        <div className="pt-6">
          <p className="text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary font-bold">
              Register here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
