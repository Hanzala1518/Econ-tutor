import { z } from "zod";

export const api = {
  chat: {
    method: 'POST' as const,
    path: '/api/chat',
    input: z.object({
      query: z.string()
    }),
    responses: {
      200: z.object({
        answer: z.string()
      }),
      500: z.object({
        message: z.string()
      })
    }
  },
  podcast: {
    method: 'POST' as const,
    path: '/api/generate-podcast',
    input: z.object({}),
    responses: {
      200: z.object({
        script: z.array(z.object({
          speaker: z.string(),
          text: z.string()
        }))
      }),
      500: z.object({
        message: z.string()
      })
    }
  },
  summary: {
    method: 'POST' as const,
    path: '/api/summary',
    input: z.object({
      videoId: z.string()
    }),
    responses: {
      200: z.object({
        summary: z.string()
      }),
      404: z.object({
        message: z.string()
      }),
      500: z.object({
        message: z.string()
      })
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ChatInput = z.infer<typeof api.chat.input>;
export type ChatResponse = z.infer<typeof api.chat.responses[200]>;
export type PodcastResponse = z.infer<typeof api.podcast.responses[200]>;
export type SummaryInput = z.infer<typeof api.summary.input>;
export type SummaryResponse = z.infer<typeof api.summary.responses[200]>;
