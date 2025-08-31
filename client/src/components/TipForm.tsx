import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const tipFormSchema = z.object({
  sport: z.string().min(1, "Sport is required"),
  league: z.string().min(1, "League is required"),
  matchup: z.string().min(1, "Matchup is required"),
  betType: z.string().min(1, "Bet type is required"),
  odds: z.string().min(1, "Odds are required"),
  stake: z.string().optional(),
  analysis: z.string().optional(),
  confidence: z.number().min(1).max(10).optional(),
  gameDate: z.string().optional(),
  requiredPlan: z.string().default("free"),
});

type TipFormData = z.infer<typeof tipFormSchema>;

const sports = [
  { value: "nfl", label: "NFL" },
  { value: "nba", label: "NBA" },
  { value: "nhl", label: "NHL" },
  { value: "mlb", label: "MLB" },
  { value: "soccer", label: "Soccer" },
  { value: "tennis", label: "Tennis" },
  { value: "golf", label: "Golf" },
  { value: "boxing", label: "Boxing" },
  { value: "mma", label: "MMA" },
  { value: "other", label: "Other" },
];

const plans = [
  { value: "free", label: "Free" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "vip", label: "VIP" },
];

export default function TipForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TipFormData>({
    resolver: zodResolver(tipFormSchema),
    defaultValues: {
      sport: "",
      league: "",
      matchup: "",
      betType: "",
      odds: "",
      stake: "100",
      analysis: "",
      confidence: 7,
      gameDate: "",
      requiredPlan: "free",
    },
  });

  const createTipMutation = useMutation({
    mutationFn: async (data: TipFormData) => {
      const payload = {
        ...data,
        stake: data.stake ? parseFloat(data.stake) : 100,
        confidence: data.confidence || 7,
        gameDate: data.gameDate ? new Date(data.gameDate).toISOString() : null,
      };
      await apiRequest("POST", "/api/tips", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Tip created successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/tips"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tips"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create tip. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TipFormData) => {
    createTipMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-tip-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="league"
            render={({ field }) => (
              <FormItem>
                <FormLabel>League</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Premier League, NBA Regular Season" 
                    {...field}
                    data-testid="input-tip-league"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="matchup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matchup</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Lakers vs Warriors, Man City vs Liverpool" 
                  {...field}
                  data-testid="input-tip-matchup"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="betType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bet Type</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Lakers +7.5, Over 48.5 Points" 
                    {...field}
                    data-testid="input-tip-bet-type"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="odds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odds</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., -110, +140, 2.50" 
                    {...field}
                    data-testid="input-tip-odds"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="stake"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommended Stake ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="100" 
                    {...field}
                    data-testid="input-tip-stake"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confidence (1-10)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10" 
                    placeholder="7"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 7)}
                    data-testid="input-tip-confidence"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Plan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-tip-plan">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gameDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Date & Time</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field}
                  data-testid="input-tip-game-date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="analysis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Analysis</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide detailed analysis and reasoning for this tip..."
                  className="min-h-[120px]"
                  {...field}
                  data-testid="textarea-tip-analysis"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={createTipMutation.isPending}
          className="w-full"
          data-testid="button-create-tip"
        >
          {createTipMutation.isPending ? "Creating Tip..." : "Create Tip"}
        </Button>
      </form>
    </Form>
  );
}
