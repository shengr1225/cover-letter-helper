import fs from "fs";
import OpenAI from "openai";
import { FineTuningJobEvent } from "openai/resources/fine-tuning/index";
import "dotenv/config";

// Gets the API Key from the environment variable `OPENAI_API_KEY`
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  console.log(`Uploading file`);

  const file = await client.files.create({
    file: fs.createReadStream("./scripts/data.jsonl"),
    purpose: "fine-tune",
  });
  console.log(`Uploaded file with ID: ${file.id}`);

  console.log("-----");

  console.log(`Waiting for file to be processed`);

  console.log("-----");

  console.log(`Starting fine-tuning`);
  let fineTune = await client.fineTuning.jobs.create({
    model: "gpt-4o-mini-2024-07-18",
    training_file: file.id,
  });
  console.log(`Fine-tuning ID: ${fineTune.id}`);

  console.log("-----");

  console.log(`Track fine-tuning progress:`);

  const events: Record<string, FineTuningJobEvent> = {};

  while (fineTune.status == "running") {
    fineTune = await client.fineTuning.jobs.retrieve(fineTune.id);
    console.log(`${fineTune.status}`);

    const { data } = await client.fineTuning.jobs.listEvents(fineTune.id, {
      limit: 100,
    });
    for (const event of data.reverse()) {
      if (event.id in events) continue;
      events[event.id] = event;
      const timestamp = new Date(event.created_at * 1000);
      console.log(`- ${timestamp.toLocaleTimeString()}: ${event.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
