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
        const errorData = await res.json().catch(() => ({}));
        
        // Check if it's an API limit error (429 status)
        if (res.status === 429) {
          const error = new Error(errorData.detail || errorData.message || "API limit reached");
          (error as any).isApiLimit = true;
          throw error;
        }
        
        throw new Error(errorData.message || "Failed to get response from AI");
      }
      
      return api.chat.responses[200].parse(await res.json());
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.isApiLimit ? "⚠️ API Limit Reached" : "Error",
        description: error.message,
        duration: error.isApiLimit ? 10000 : 5000,
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
        const errorData = await res.json().catch(() => ({}));
        
        // Check if it's an API limit error (429 status)
        if (res.status === 429) {
          const error = new Error(errorData.detail || errorData.message || "API limit reached");
          (error as any).isApiLimit = true;
          throw error;
        }
        
        throw new Error(errorData.message || "Failed to generate podcast script");
      }

      return api.podcast.responses[200].parse(await res.json());
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.isApiLimit ? "⚠️ API Limit Reached" : "Generation Failed",
        description: error.message,
        duration: error.isApiLimit ? 10000 : 5000,
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
        const errorData = await res.json().catch(() => ({}));
        
        // Check if it's an API limit error (429 status)
        if (res.status === 429) {
          const error = new Error(errorData.detail || errorData.message || "API limit reached");
          (error as any).isApiLimit = true;
          throw error;
        }
        
        throw new Error(errorData.message || "Failed to generate video summary");
      }

      return api.summary.responses[200].parse(await res.json());
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.isApiLimit ? "⚠️ API Limit Reached" : "Summary Failed",
        description: error.message,
        duration: error.isApiLimit ? 10000 : 5000,
      });
    },
  });
}
