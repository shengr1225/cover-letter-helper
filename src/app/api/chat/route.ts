import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const m = messages[messages.length - 1];
  const contents = JSON.parse(m.content);

  const _messages: CoreMessage[] = [
    {
      role: "assistant",
      content:
        "You are a helpful ChatGPT that generate cover letter based on resume, company description and job description. During the process, please follow principles below: 1. The personality is professional with normal words 2. Specific how my experience aligns with the job description 3. Explain one thing that attract me of the company",
    },
    {
      role: "user",
      content: "here is the job describtion: " + contents[1],
    },
    {
      role: "user",
      content: "here is the company describtion: " + contents[2],
    },
    { role: "user", content: "here is my resume: " + contents[0] },
  ];
  const response = await streamText({
    model: openai("gpt-4o"),
    messages: _messages,
  });
  return response.toDataStreamResponse();
}
