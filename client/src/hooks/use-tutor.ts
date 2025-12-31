import { useMutation } from "@tanstack/react-query";
import { api, type ChatInput, type ChatResponse, type PodcastResponse, type SummaryInput, type SummaryResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useChat() {
  const { toast } = useToast();
  
  return useMutation<ChatResponse, Error, ChatInput>({
    mutationFn: async (data) => {
      const res = await fetch(api.chat.path, {
        method: api.chat.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Failed to get response from AI");
      }
      
      return api.chat.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

export function useGeneratePodcast() {
  const { toast } = useToast();

  return useMutation<PodcastResponse, Error, void>({
    mutationFn: async () => {
      const res = await fetch(api.podcast.path, {
        method: api.podcast.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to generate podcast script");
      }

      return api.podcast.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message,
      });
    },
  });
}

export function useSummary() {
  const { toast } = useToast();

  return useMutation<SummaryResponse, Error, SummaryInput>({
    mutationFn: async (data) => {
      const res = await fetch(api.summary.path, {
        method: api.summary.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to generate video summary");
      }

      return api.summary.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Summary Failed",
        description: error.message,
      });
    },
  });
}
