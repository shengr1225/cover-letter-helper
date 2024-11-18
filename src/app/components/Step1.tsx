"use client";
import React, { MutableRefObject, useRef, useState } from "react";

import { FaLink } from "react-icons/fa6";
import {
  Box,
  Heading,
  Text,
  Tabs,
  Input,
  Textarea,
  Icon,
} from "@chakra-ui/react";

import { useTheme } from "next-themes";
import { usePDFJS } from "../hooks/usePDFJS";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { DOMParser } from "@xmldom/xmldom";
import PizZip from "pizzip";

import { madeupTextForPDF } from "@/app/util/util";

type propType = {
  onEnterResume: React.Dispatch<React.SetStateAction<string>>;
};

const Step1 = (props: propType) => {
  const fileInputRef: MutableRefObject<HTMLInputElement> = useRef();
  const [tabIndex, setTabIndex] = useState("upload");
  const [editingResume, setEditingResume] = useState("");
  const { theme } = useTheme();
  const [pdf, setPDF] = useState<ArrayBuffer>();

  usePDFJS(async (pdfLoader) => {
    if (!pdf) return;
    const pdfDocTask = pdfLoader.getDocument(pdf);
    const pdfDoc = await pdfDocTask.promise;
    const data = await madeupTextForPDF(pdfDoc);
    props.onEnterResume(data);
    setTabIndex("text");
    setEditingResume(data);
  });

  const str2xml = (str: string) => {
    if (str.charCodeAt(0) === 65279) {
      // BOM sequence
      str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
  };

  // Get paragraphs as javascript array
  const getParagraphs = (content: ArrayBuffer) => {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];

    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs.join("\n");
  };

  const onFileUpload = async (event) => {
    console.log(typeof event);
    const reader = new FileReader();
    const file = event.target.files[0];
    if (file.type === "text/plain") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }

    reader.onload = async (e) => {
      const target = e.target;
      const content = target?.result;
      let result = "";
      fileInputRef.current.value = "";

      console.log(file.type);
      console.log(content);

      if (file.type === "text/plain") {
        props.onEnterResume(content as string);
        setTabIndex("text");
        setEditingResume(content as string);
      } else if (file.type === "application/pdf") {
        setPDF(content as ArrayBuffer);
      } else {
        result = getParagraphs(content as ArrayBuffer);
        props.onEnterResume(result);
        setTabIndex("text");
        setEditingResume(result);
      }
    };
    reader.onerror = (err) => {
      console.error(err);
    };
  };

  return (
    <Box pt="8">
      <Heading fontSize="xl" mt="8" mb="2" fontWeight="bold">
        Step 1: Enter Resume
      </Heading>

      <Tabs.Root
        variant="plain"
        value={tabIndex}
        onValueChange={(e) => setTabIndex(e.value)}
      >
        <RadioGroup
          px="4"
          py="2"
          border="solid 1px"
          borderRadius="sm"
          borderColor={`${theme === "light" ? "black" : "white"}`}
          defaultValue="file"
          colorPalette="gray"
        >
          <Tabs.List gap={2}>
            <Tabs.Trigger value="upload">
              <Radio value="file">Upload File</Radio>
            </Tabs.Trigger>
            <Tabs.Trigger value="text">
              <Radio value="text">Text</Radio>
            </Tabs.Trigger>
          </Tabs.List>
        </RadioGroup>
        <Tabs.Content value="upload" px="0">
          <Text color="text" mb={2}>
            Upload your resume*
          </Text>
          <label
            htmlFor="upload_file"
            style={{
              border: "1px solid gray",
              padding: "4px 0 4px 12px",
              display: "flex",
              borderRadius: "6px",
              backgroundColor:
                theme == "light" ? "white" : "rgba(255, 255, 255, 0.12)",
              cursor: "pointer",
              alignItems: "baseline",
            }}
          >
            <Icon className="mr-2">
              <FaLink />
            </Icon>
            Click here to select a file
          </label>
          <Input
            ref={fileInputRef}
            id="upload_file"
            bg="white"
            type="file"
            opacity={0}
            zIndex={-1}
            position="absolute"
            onChange={onFileUpload}
          />
          <Text color="text" textStyle="xs" mt="1">
            Support file type: .pdf .doc .docx .txt
          </Text>
        </Tabs.Content>
        <Tabs.Content value="text" px="0">
          <Text mb={2}>Your resume*</Text>
          <Textarea
            variant="subtle"
            size="xl"
            placeholder="Enter your resume here..."
            onChange={(e) => {
              setEditingResume(e.target.value);
              props.onEnterResume(e.target.value);
            }}
            value={editingResume}
          ></Textarea>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default Step1;
