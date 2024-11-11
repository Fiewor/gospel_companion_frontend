import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FIELD_VALIDATION,
  MIN_LENGTH,
  signup,
  signupGoogle,
} from "./constants";

export const handleSignUpWithGoogle = async (event: React.SyntheticEvent) => {
  event.preventDefault();
  await signupGoogle();
};

const SignUpForm = () => {
  const nav = useNavigate();

  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(MIN_LENGTH, {
        message: FIELD_VALIDATION.MSG.MIN_LEN,
      })
      .refine(
        FIELD_VALIDATION.TEST.SPECIAL_CHAR,
        FIELD_VALIDATION.MSG.SPECIAL_CHAR
      )
      .refine(FIELD_VALIDATION.TEST.NUMBER, FIELD_VALIDATION.MSG.NUMBER),
    confirmPassword: z
      .string()
      .min(MIN_LENGTH, {
        message: FIELD_VALIDATION.MSG.MIN_LEN,
      })
      .refine(
        FIELD_VALIDATION.TEST.SPECIAL_CHAR,
        FIELD_VALIDATION.MSG.SPECIAL_CHAR
      )
      .refine(FIELD_VALIDATION.TEST.NUMBER, FIELD_VALIDATION.MSG.NUMBER),
  });
  // .superRefine(({ confirmPassword, password }, ctx) => {
  //   if (confirmPassword !== password) {
  //     addFieldIssue("password", ctx);
  //     addFieldIssue("confirmPassword", ctx);
  //   }
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    let user = {};
    user = await signup(email, password);

    if (user && Object.keys(user)) {
      console.log("user: ", user);
      nav("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 h-screen px-4 py-8 md:w-1/4 mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
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
                <Input placeholder="abcd1234" type="password" {...field} />
              </FormControl>
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
                <Input placeholder="abcd1234" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <Button type="submit" className="">
            Sign Up
          </Button>
          <Button variant="secondary" onClick={handleSignUpWithGoogle} disabled>
            Sign Up With Google
          </Button>
          <Button variant="link" type="submit" onClick={() => nav("../login")}>
            or login instead
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
