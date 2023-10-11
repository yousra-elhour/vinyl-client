"use client";

import React, { useState } from "react";
import { Genre, Search } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import qs from "query-string";
import * as z from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "@material-tailwind/react";

interface FilterProps {
  genres: Genre[];
  initialData: Search;

  name: string;
}

const formSchema = z.object({
  genreId: z.string().min(1),
  sort: z.string().optional(),
});

type FilterFormValues = z.infer<typeof formSchema>;

function Filter({ genres, name, initialData }: FilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onClick = (valueKey: string, id?: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    // Check if the valueKey is "genreId" or "sort" and reset accordingly
    if (valueKey === "genreId" || valueKey === "sort") {
      form.setValue(valueKey, initialData ? initialData[valueKey] : "");
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      genreId: "",
      sort: "",
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    try {
      setLoading(true);
      // Perform your form submission here
    } catch (err) {
      // Handle errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between 2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6 lg:pt-14 md:pt-10 sm:pt-6 pt-6 lg:gap-5 md:gap-5 sm:gap-0 gap-0 "
      >
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="genreId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      // Find the selected genre based on its ID
                      // Update the genreId field
                      field.onChange(value);
                      const selectedGenre = genres.find(
                        (genre) => genre.id === value
                      );

                      onClick("genreId", selectedGenre?.id);
                      form.setValue("genreId", selectedGenre?.id || "");
                    }}
                    value={field.value || initialData?.genreId || ""} // Set the value to the default value if it exists
                    defaultValue={initialData?.genreId || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value
                            ? // If field.value is not empty, show the selected genre name
                              genres.find((genre) => genre.id === field.value)
                                ?.name || "Select Genre"
                            : // If field.value is empty, show "Select genre"
                              "Select Genre"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{name.toUpperCase()}</SelectLabel>

                        {genres.map((genre) => (
                          <SelectItem key={genre.id} value={genre.id}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      onClick("sort", value);
                      form.setValue("sort", value);
                      field.onChange(value);
                    }}
                    value={field.value || initialData?.sort || ""}
                    defaultValue={initialData?.sort || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value === "lowToHigh"
                            ? "Price Low To High"
                            : field.value === "highToLow"
                            ? "Price High To Low"
                            : "Sort By"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>SORT BY</SelectLabel>
                        <SelectItem key="highToLow" value="highToLow">
                          Price High to Low
                        </SelectItem>
                        <SelectItem key="lowToHigh" value="lowToHigh">
                          Price Low to High
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          onClick={() => {
            form.reset({
              genreId: "",
              sort: "",
            });
            router.push(window.location.pathname);
            // Debugging statements
            console.log("Form Values After Reset:", form.getValues());
            console.log(
              "Current Query Params:",
              qs.parse(searchParams.toString())
            );
          }}
        >
          Reset
        </Button>
      </form>
    </FormProvider>
  );
}

export default Filter;
