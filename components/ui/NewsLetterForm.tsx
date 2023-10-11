"use client";

import axios from "axios";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Button } from "@material-tailwind/react";

const formSchema = z.object({
  email: z.string().min(1),
});

type NewsLetterForm = z.infer<typeof formSchema>;

export default function NewsLetterForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<NewsLetterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Replace with your API URL

  const onSubmit = async (data: NewsLetterForm) => {
    try {
      setLoading(true);

      await axios.post(`/api/subscribe`, data, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Subscribed to Newsletter!");

      // Reset the form values after successful submission
      form.reset();
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex lg:px-16 md:px-8 sm:px-0 px-0 lg:gap-4 md:gap-2 sm:gap-1 gap-1  items-end mb-12"
        >
          <div className=" w-[100%]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="border-0 outline-none w-full bg-transparent border-b-2 border-black px-2 text-gray-800 mr-[2cqw] placeholder:text-gray-700 lg:text-xl text-md focus-visible:border-b-4 transition-all rounded-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:outline-offset-0 ring-offset-transparent ring-offset-0 focus-visible:ring-offset-0"
                      disabled={loading}
                      placeholder="Email Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              disabled={loading}
              className="lg:text-lg md:text-md sm:text-xs text-xs font-header lg:px-8 lg:py-4 sm:px-2 px-2"
              type="submit"
            >
              SUBSCRIBE
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
