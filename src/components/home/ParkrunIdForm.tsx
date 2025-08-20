import { Box, Button, Flex, LoadingOverlay, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getParkrunResults } from "@/lib/api";

export const ParkrunIdForm = () => {
  const router = useRouter();

  const form = useForm({
    mode: "controlled",
    validateInputOnBlur: true,
    initialValues: {
      parkrunId: "",
    },

    validate: {
      parkrunId: (value) => {
        if (value === "") return "Please enter a parkrun ID";
        if (isNaN(Number(value))) return "Parkrun ID must be a number";
      },
    },
  });

  useEffect(() => {
    const parkrunId = localStorage.getItem("5krun.parkrunId");
    if (parkrunId) {
      form.setFieldValue("parkrunId", parkrunId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutation = useMutation({
    mutationFn: getParkrunResults,
    onSuccess: (_, parkrunId) => {
      localStorage.setItem("5krun.parkrunId", parkrunId);
      router.push(`/results/${parkrunId}`);
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        form.setFieldError("parkrunId", "Parkrun ID not found");
      } else {
        form.setFieldError(
          "parkrunId",
          "Something went wrong on our end. Please try again.",
        );
        throw error;
      }
    },
  });

  const handleSubmit = async ({ parkrunId }: typeof form.values) => {
    mutation.mutate(parkrunId);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={mutation.isPending}
        overlayProps={{ blur: 2, color: "var(--primary-bg-color)" }}
        loaderProps={{ pt: "sm", size: "sm" }}
        transitionProps={{ transition: "fade", duration: 1000 }}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex gap="md">
          <TextInput
            label="Parkrun ID"
            leftSection="A"
            style={{
              flex: 1,
            }}
            key={form.key("parkrunId")}
            {...form.getInputProps("parkrunId")}
          />
          <Button mt="25" type="submit">
            View Results
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
