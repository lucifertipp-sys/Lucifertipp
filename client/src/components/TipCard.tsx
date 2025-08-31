import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TipCardProps {
  tip: any;
  showFollowButton?: boolean;
}

const getSportIcon = (sport: string) => {
  const icons: { [key: string]: string } = {
    nfl: "fas fa-football-ball",
    nba: "fas fa-basketball-ball",
    nhl: "fas fa-hockey-puck",
    mlb: "fas fa-baseball-ball",
    soccer: "fas fa-futbol",
    tennis: "fas fa-table-tennis",
    golf: "fas fa-golf-ball",
    boxing: "fas fa-fist-raised",
    mma: "fas fa-fist-raised",
  };
  return icons[sport] || "fas fa-trophy";
};

const getSportColor = (sport: string) => {
  const colors: { [key: string]: string } = {
    nfl: "bg-orange-500/20 text-orange-400",
    nba: "bg-blue-500/20 text-blue-400",
    nhl: "bg-cyan-500/20 text-cyan-400",
    mlb: "bg-green-500/20 text-green-400",
    soccer: "bg-emerald-500/20 text-emerald-400",
    tennis: "bg-yellow-500/20 text-yellow-400",
    golf: "bg-lime-500/20 text-lime-400",
    boxing: "bg-red-500/20 text-red-400",
    mma: "bg-purple-500/20 text-purple-400",
  };
  return colors[sport] || "bg-accent/20 text-accent";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "won":
      return "bg-green-500/20 text-green-400";
    case "lost":
      return "bg-red-500/20 text-red-400";
    case "void":
      return "bg-gray-500/20 text-gray-400";
    case "pending":
    default:
      return "bg-blue-500/20 text-blue-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "won":
      return "fas fa-check-circle";
    case "lost":
      return "fas fa-times-circle";
    case "void":
      return "fas fa-minus-circle";
    case "pending":
    default:
      return "fas fa-clock";
  }
};

export default function TipCard({ tip, showFollowButton = false }: TipCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [stake, setStake] = useState("100");
  const [followDialogOpen, setFollowDialogOpen] = useState(false);

  const followTipMutation = useMutation({
    mutationFn: async (data: { tipId: string; stake: string }) => {
      await apiRequest("POST", "/api/user/follow-tip", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tip followed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/tip-history"] });
      setFollowDialogOpen(false);
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
        description: "Failed to follow tip. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFollowTip = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    
    followTipMutation.mutate({
      tipId: tip.id,
      stake,
    });
  };

  const isWinStreak = tip.status === "won";
  const isLossStreak = tip.status === "lost";

  return (
    <Card 
      className={`hover:border-accent/50 transition-all duration-300 ${
        isWinStreak ? "win-streak" : isLossStreak ? "loss-streak" : ""
      }`}
      data-testid={`card-tip-${tip.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSportColor(tip.sport)}`}>
              <i className={getSportIcon(tip.sport)}></i>
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize" data-testid={`text-sport-${tip.id}`}>
                {tip.sport} - {tip.league}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-matchup-${tip.id}`}>
                {tip.matchup}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(tip.status)} data-testid={`badge-status-${tip.id}`}>
            <i className={`${getStatusIcon(tip.status)} mr-1`}></i>
            {tip.status.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bet Type:</span>
            <span className="text-foreground font-medium" data-testid={`text-bet-type-${tip.id}`}>
              {tip.betType}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Odds:</span>
            <span className="text-accent font-semibold" data-testid={`text-odds-${tip.id}`}>
              {tip.odds}
            </span>
          </div>
          {tip.profit !== null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {tip.status === "won" ? "Profit:" : "Loss:"}
              </span>
              <span 
                className={`font-bold ${Number(tip.profit) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                data-testid={`text-profit-${tip.id}`}
              >
                {Number(tip.profit) >= 0 ? '+' : ''}${tip.profit}
              </span>
            </div>
          )}
          {tip.confidence && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confidence:</span>
              <span className="text-accent font-medium" data-testid={`text-confidence-${tip.id}`}>
                {tip.confidence}/10
              </span>
            </div>
          )}
        </div>

        {tip.analysis && (
          <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 mb-4">
            <p><strong>Analysis:</strong> {tip.analysis}</p>
          </div>
        )}

        {tip.gameDate && (
          <div className="text-xs text-muted-foreground mb-4">
            Game Date: {new Date(tip.gameDate).toLocaleDateString()}
          </div>
        )}

        {showFollowButton && tip.status === "pending" && (
          <Dialog open={followDialogOpen} onOpenChange={setFollowDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full"
                data-testid={`button-follow-tip-${tip.id}`}
              >
                Follow This Tip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Follow Tip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    You're about to follow: <strong>{tip.betType}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Odds: <strong>{tip.odds}</strong>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Stake Amount ($)</label>
                  <Input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    placeholder="100"
                    min="1"
                    data-testid={`input-stake-${tip.id}`}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleFollowTip}
                    disabled={followTipMutation.isPending}
                    className="flex-1"
                    data-testid={`button-confirm-follow-${tip.id}`}
                  >
                    {followTipMutation.isPending ? "Following..." : "Follow Tip"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setFollowDialogOpen(false)}
                    data-testid={`button-cancel-follow-${tip.id}`}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {tip.requiredPlan && tip.requiredPlan !== "free" && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-center">
              <Badge variant="outline" className="border-primary text-primary">
                {tip.requiredPlan.toUpperCase()}
              </Badge>
              <span className="ml-2">plan required</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
