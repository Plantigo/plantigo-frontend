import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password is too short." }),
    confirmPassword: z.string().min(6, { message: "Password is too short." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center flex justify-center gap-2">
          <span>Register in</span>
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
                  <FormDescription>
                    Password must be at least 6 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Confirm your password"
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
