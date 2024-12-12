import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { Link } from "@remix-run/react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password is too short." }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your password here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button size="lg" type="submit" className="mt-2">
              Submit
            </Button>
          </form>
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
