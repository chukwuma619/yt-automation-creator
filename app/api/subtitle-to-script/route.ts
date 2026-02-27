import { streamText, Output } from "ai";
import { documentaryScriptSchema } from "@/lib/documentary-schema";

export const maxDuration = 120;

export async function POST(req: Request) {
  const body = (await req.json()) as { subtitle?: string; prompt?: string };
  const subtitle = body.subtitle ?? body.prompt;

  if (!subtitle || typeof subtitle !== "string") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid subtitle text" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const prompt = `
# ROLE

You are an elite faceless YouTube documentary scriptwriter.

Your job is to transform raw YouTube subtitles into a high-retention,
25–35 minute cinematic documentary script.

This is NOT a summary.
This is a psychological storytelling reconstruction.

You must:
- Rewrite completely (no copying phrasing)
- Change names, locations, and identifying details
- Reconstruct structure for tension and pacing
- Add psychological depth and instability
- Expand key scenes for cinematic immersion
- Engineer retention spikes every 3–5 minutes
- Generate a strong viral title at the end

The final script must feel like a premium faceless crime documentary.


---

# SOURCE MATERIAL

Below are raw subtitles from a YouTube video:

${subtitle.trim()}


---

# STRUCTURE REQUIREMENTS

## LENGTH
Target: 4,500–6,000 words  
Estimated runtime: 25–35 minutes  

Expand scenes when necessary to meet this range.


---

# 🔥 10/10 VIRAL INTRO HOOK PROTOCOL

The first 60–120 seconds MUST follow ALL five rules:

### 1️⃣ Start Inside Immediate Danger
Open at the most volatile, high-stakes moment in the entire story.
No backstory. No explanation.

Drop the viewer into chaos.

---

### 2️⃣ Withhold Full Context
Do NOT immediately reveal:
- The protagonist’s real identity
- Their mission
- Whether they are law enforcement or criminal

Allow ambiguity for at least 45–90 seconds.

---

### 3️⃣ Imply a Twist (Without Explaining It)
Within the first minute, include a line that subtly suggests:
- A betrayal is possible
- A loyalty test is coming
- Something is not what it seems
- The protagonist may already be changing

Do NOT resolve this implication.

---

### 4️⃣ Hint at Internal Transformation
Foreshadow:
- Identity fracture
- Moral compromise
- Emotional numbness
- Psychological erosion

The audience must sense that survival isn’t the only cost.

---

### 5️⃣ Leave One Open Psychological Question
End the hook section with an unresolved tension line such as:
- “But the real danger wasn’t in the room.”
- “He didn’t yet realize what this night would take from him.”
- “The test they were about to give him would change everything.”

Do NOT resolve it immediately.

If all five elements are not present, rewrite the hook.


---

# STORY ARCHITECTURE (MANDATORY)

## Act 1 — Immersion & Escalation
- Introduce setting and threat environment
- Establish protagonist’s role (gradually)
- Build pressure through suspicion and instability
- Insert first destabilizer (unexpected tension spike)

---

## Act 2 — Deep Infiltration & Instability
- Expand key operations into cinematic scenes
- Add loyalty tests, suspicion moments, or near-exposure events
- Insert psychological degradation (identity erosion)
- Increase stakes gradually
- Every 3–5 minutes introduce a tension spike:
  - A rumor of a rat
  - A surprise test
  - A confrontation
  - A moral dilemma
  - A mission going wrong

Avoid smooth progression. Instability drives retention.

---

## Act 3 — Peak Confrontation
- Stretch the final takedown scene
- Slow down critical moments
- Use sensory detail
- Extend pre-arrest tension
- Add emotional conflict before resolution

The climax must feel prolonged, not abrupt.

---

## Act 4 — Aftermath & Psychological Residue
- Show consequences
- Show institutional impact (arrests, dismantling, scale)
- Reveal sentencing or fallout
- Highlight emotional cost
- End with a circular callback to the opening scene

The ending must feel reflective but unsettling.


---

# PSYCHOLOGICAL DEPTH REQUIREMENTS

You MUST include:

- Internal monologue moments
- Emotional detachment development
- Identity splitting
- Fear suppression techniques
- Moral tension
- Moments where protagonist adapts too well

The real story is transformation — not just events.


---

# CINEMATIC TECHNIQUES

Use:

- Sensory detail (sound, smell, light, texture)
- Scene stretching for key moments
- Short, punchy paragraphs for tension
- Longer reflective passages for psychology
- Cliffhanger transitions between acts
- Open loops at section endings


---

# COPYRIGHT SAFETY

- Change all names
- Change locations
- Change timeline details if needed
- Paraphrase everything
- Do not copy phrasing
- Do not follow original structure exactly

This must feel like an original documentary inspired by events, not a rewrite.


---

# TITLE GENERATION

After the script, generate 5 viral YouTube title options.

They must:
- Be emotionally provocative
- Imply transformation or danger
- Avoid generic phrasing
- Avoid clickbait exaggeration
- Sound like premium faceless documentary titles

Example tone:
- “He Lived With Them for 18 Months… They Never Knew”
- “The Night His Cover Almost Broke”
- “Inside the Cult That Almost Changed Him”

Do NOT reuse these examples.


---

# FINAL OUTPUT FORMAT

1. Viral Title Options (5)
2. Full Documentary Script (25–35 min)
3. Clean formatting for voiceover narration
4. No bullet points in script body
5. No stage directions
6. No commentary about structure


Now transform the subtitles into a high-retention documentary script.    
    `;

  const result = streamText({
    model: "gemini-3.1-pro-preview",
    prompt,
    output: Output.object({
      name: "DocumentaryScript",
      description:
        "Structured documentary script with titles, thumbnail texts, description, runtime, and full script.",
      schema: documentaryScriptSchema,
    }),
  });

  return result.toTextStreamResponse();
}
