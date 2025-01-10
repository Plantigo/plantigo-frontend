import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LoaderCircle, Eye, EyeOff } from "lucide-react";
import { ActionFunctionArgs } from "@remix-run/node";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { login } from "../_auth/actions";
import { commitSession, createUserSession } from "@/lib/sessions";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password is too short." }),
});

export const loader = () => {
  return {
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "",
  };
};

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
    const { access, refresh } = await response.json();
    const session = await createUserSession({
      accessToken: access,
      refreshToken: refresh,
      authType: "custom",
    });
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
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
  const [showPassword, setShowPassword] = useState(false);
  const { googleClientId, googleRedirectUri } = useLoaderData<typeof loader>();

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

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20email%20profile`;

  const handleGoogleLogin = async () => {
    const platform = Capacitor.getPlatform();
    if (platform == "android" || platform == "ios") {
      await Browser.open({ url: googleLoginUrl });
    } else {
      window.location.href = googleLoginUrl;
    }
  };

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
    <Card className="w-full max-w-md bg-white bg-opacity-80">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex flex-col justify-center items-center">
          <span>Sign in</span>
          <span className="text-4xl flex items-center justify-center bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent pb-1">
            Plantigo <Leaf className="w-8 h-8 text-green-500" />
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
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-5 top-11"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground hover:text-primary" />
              ) : (
                <Eye className="text-muted-foreground hover:text-primary" />
              )}
            </button>
            <span className="text-destructive">
              {errors.password && <p>{errors.password.message}</p>}
            </span>
          </label>
          <Button
            size="lg"
            type="submit"
            className="mt-2 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            Login
          </Button>
        </Form>
        <div className="border-b w-full my-5"></div>
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
          >
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
