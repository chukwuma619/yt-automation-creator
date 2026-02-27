"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useCallback, useRef } from "react";
import { documentaryScriptSchema } from "@/lib/documentary-schema";

export default function Home() {
  const {
    object,
    submit,
    isLoading,
    error,
    stop,
  } = useObject({
    api: "/api/subtitle-to-script",
    schema: documentaryScriptSchema,
  });
  const subtitleRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.name.endsWith(".txt")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? "");
        if (subtitleRef.current) subtitleRef.current.value = text;
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = subtitleRef.current?.value?.trim();
      if (!text) return;
      submit({ subtitle: text });
    },
    [submit]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Subtitle → Documentary Script
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Paste or upload YouTube subtitles (.txt). The script prompt runs on
            Gemini and streams structured output.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label
                htmlFor="subtitle"
                className="text-sm font-medium text-zinc-300"
              >
                Subtitles
              </label>
              <label className="cursor-pointer rounded bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700">
                Upload .txt
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
            <textarea
              ref={subtitleRef}
              id="subtitle"
              name="subtitle"
              rows={12}
              placeholder="Paste YouTube subtitles here or use “Upload .txt”…"
              className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
            >
              {isLoading ? "Generating…" : "Generate script"}
            </button>
            {isLoading && (
              <button
                type="button"
                onClick={stop}
                className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Stop
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error.message}
          </div>
        )}

        {object && (
          <section className="mt-10 space-y-8">
            {(object.viralTitles?.length ?? 0) > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Viral title options
                </h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-200">
                  {(object.viralTitles ?? []).map((title, i) => (
                    <li key={i}>{title}</li>
                  ))}
                </ul>
              </div>
            )}

            {(object.thumbnailTexts?.length ?? 0) > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Thumbnail text options (max 4 words)
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {(object.thumbnailTexts ?? []).map((text, i) => (
                    <li
                      key={i}
                      className="rounded bg-zinc-800 px-2.5 py-1 text-sm text-zinc-200"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {object.description && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  YouTube description
                </h2>
                <p className="text-sm leading-relaxed text-zinc-200">
                  {object.description}
                </p>
              </div>
            )}

            {object.estimatedRuntimeMinutes != null && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Estimated runtime
                </h2>
                <p className="text-sm text-zinc-200">
                  {object.estimatedRuntimeMinutes} minutes
                </p>
              </div>
            )}

            {object.fullScript && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Full documentary script
                </h2>
                <div className="whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-sm leading-relaxed text-zinc-200">
                  {object.fullScript}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
