"use client";
import { useState } from "react";
import { useChat } from "ai/react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Textarea,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Toaster, toaster } from "@/components/ui/toaster";
import { FaCheckCircle } from "react-icons/fa";
import { useTheme } from "next-themes";

import Step1 from "@/app/components/Step1";
import Step2 from "@/app/components/Step2";
import OPeachHeader from "./components/OPeachHeader";

export default function Home() {
  const [aboutJob, setAboutJob] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [resume, setResume] = useState("");
  const { theme } = useTheme();

  const { setInput, handleSubmit, messages } = useChat();
  const responseMessages = messages.filter((m) => m.role === "assistant");
  const latestMessage = responseMessages[responseMessages.length - 1];
  console.log(messages);
  console.log(latestMessage);

  const onGenerate = async () => {
    if (!resume) {
      return toaster.error({
        title: "Info Needed.",
        description: "You need to upload or paste your resume above",
        duration: 5000,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } else if (!aboutJob) {
      return toaster.error({
        title: "Info Needed.",
        description: "You need to paste the job descrption above",
        duration: 5000,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } else if (!aboutCompany) {
      return toaster.error({
        title: "Info Needed.",
        description: "You need to paste the company descrption above",
        duration: 5000,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    }
    handleSubmit();
  };

  return (
    <div
      className={`${
        theme === "light"
          ? "bg-slate-200 text-slate-900"
          : "bg-slate-900 text-slate-200"
      }`}
    >
      {/* <OPeachHeader /> */}

      <form
        onSubmit={() => {
          onGenerate();
        }}
      >
        <Grid
          templateColumns={["1fr", "1fr", "repeat(2, 1fr)", "repeat(2, 1fr)"]}
          gap={10}
          h="full"
          px={[4, 4, 12, 48]}
          pb={32}
        >
          <GridItem w="100%">
            <Step1
              onEnterResume={(value) => {
                setResume(value);
                setInput(JSON.stringify([value, aboutJob, aboutCompany]));
              }}
            ></Step1>
            <Step2
              setAboutJob={(value) => {
                setAboutJob(value);
                setInput(JSON.stringify([resume, value, aboutCompany]));
              }}
              setAboutCompany={(value) => {
                setAboutCompany(value);
                setInput(JSON.stringify([resume, aboutJob, value]));
              }}
            ></Step2>
          </GridItem>
          <GridItem w="100%">
            <Box py="8" h="100%">
              <HStack justifyContent="space-between">
                <Heading color="text" my="6">
                  Cover Letter
                </Heading>
                <Button colorPalette="blue" onClick={onGenerate}>
                  <Icon className="mr-2">
                    <FaCheckCircle />
                  </Icon>
                  Generate
                </Button>
              </HStack>

              <Textarea
                height="90%"
                variant="subtle"
                value={latestMessage?.content}
                readOnly
              />
            </Box>
          </GridItem>
        </Grid>
      </form>
      <Toaster />
    </div>
  );
}
