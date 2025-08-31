import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Layout from "@/components/Layout";
import TipCard from "@/components/TipCard";
import TipForm from "@/components/TipForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: tips = [] } = useQuery({
    queryKey: ["/api/tips"],
    retry: false,
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  const { data: userTipHistory = [] } = useQuery({
    queryKey: ["/api/user/tip-history"],
    retry: false,
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.firstName || 'Member'}</span>
          </h1>
          <p className="text-muted-foreground">
            Your premium sports betting dashboard
          </p>
        </div>

        {/* User Stats */}
        {userStats && (
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2" data-testid="text-user-total-profit">
                  ${userStats.totalProfit.toFixed(2)}
                </div>
                <div className="text-muted-foreground">Total Profit</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2" data-testid="text-user-win-rate">
                  {userStats.winRate}%
                </div>
                <div className="text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2" data-testid="text-user-total-bets">
                  {userStats.totalBets}
                </div>
                <div className="text-muted-foreground">Total Bets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2" data-testid="text-user-roi">
                  {userStats.roi > 0 ? '+' : ''}{userStats.roi}%
                </div>
                <div className="text-muted-foreground">ROI</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="tips" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tips" data-testid="tab-tips">Latest Tips</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">My History</TabsTrigger>
            {user?.isAdmin && (
              <TabsTrigger value="admin" data-testid="tab-admin">Admin</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="tips" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Latest Tips</h2>
              <Button 
                onClick={() => window.location.href = "/tips"}
                data-testid="button-view-all"
              >
                View All Tips
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.slice(0, 6).map((tip: any) => (
                <TipCard key={tip.id} tip={tip} showFollowButton={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-semibold">My Betting History</h2>
            
            <div className="space-y-4">
              {userTipHistory.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No betting history yet.</p>
                    <Button 
                      className="mt-4"
                      onClick={() => window.location.href = "/tips"}
                      data-testid="button-browse-tips"
                    >
                      Browse Tips
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userTipHistory.map((history: any) => (
                  <Card key={history.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold" data-testid={`text-history-tip-${history.id}`}>
                            Tip #{history.tipId}
                          </h3>
                          <p className="text-muted-foreground">
                            Stake: ${history.stake} • Followed: {new Date(history.followedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {history.profit !== null && (
                          <div className={`font-bold ${Number(history.profit) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(history.profit) >= 0 ? '+' : ''}${history.profit}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {user?.isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Tip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TipForm />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full"
                      onClick={() => window.location.href = "/tips?admin=true"}
                      data-testid="button-manage-tips"
                    >
                      Manage Tips
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      data-testid="button-view-analytics"
                    >
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
