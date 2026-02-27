import { z } from "zod";

export const documentaryScriptSchema = z.object({
  viralTitles: z
    .array(z.string())
    .length(7)
    .describe("Exactly 7 viral YouTube title options for the documentary"),
  thumbnailTexts: z
    .array(z.string())
    .length(5)
    .describe(
      "Exactly 5 high-CTR thumbnail text options, max 4 words each"
    ),
  description: z
    .string()
    .describe("YouTube description in 2–3 sentences"),
  estimatedRuntimeMinutes: z
    .number()
    .min(25)
    .max(40)
    .describe("Estimated runtime in minutes (25–35 target)"),
  fullScript: z
    .string()
    .describe(
      "Full 30–35 minute documentary script, cinematic narration, pure narrative prose"
    ),
});

export type DocumentaryScript = z.infer<typeof documentaryScriptSchema>;
