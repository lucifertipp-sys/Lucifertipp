import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformanceStats() {
  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  const { data: userTipHistory = [] } = useQuery({
    queryKey: ["/api/user/tip-history"],
    retry: false,
  });

  // Get recent activity (last 5 items)
  const recentActivity = userTipHistory.slice(0, 5);

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">
            Track Your <span className="gradient-text">Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get detailed analytics and performance insights to optimize your betting strategy.
          </p>
        </div>
        
        <Card className="border border-border">
          <CardContent className="p-8">
            {userStats ? (
              <>
                <div className="grid lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2" data-testid="text-dashboard-total-profit">
                      ${userStats.totalProfit.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Total Profit</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-accent mb-2" data-testid="text-dashboard-win-rate">
                      {userStats.winRate}%
                    </div>
                    <div className="text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2" data-testid="text-dashboard-total-bets">
                      {userStats.totalBets}
                    </div>
                    <div className="text-muted-foreground">Total Bets</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2" data-testid="text-dashboard-roi">
                      {userStats.roi > 0 ? '+' : ''}{userStats.roi}%
                    </div>
                    <div className="text-muted-foreground">ROI</div>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <i className="fas fa-chart-bar text-accent mr-2"></i>
                      Monthly Performance
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4 h-48 flex items-center justify-center">
                      <p className="text-muted-foreground">Chart visualization coming soon</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <i className="fas fa-list text-accent mr-2"></i>
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {recentActivity.length === 0 ? (
                        <div className="bg-muted/30 rounded-lg p-6 text-center">
                          <p className="text-muted-foreground">No recent activity</p>
                        </div>
                      ) : (
                        recentActivity.map((activity: any, index: number) => (
                          <div 
                            key={activity.id}
                            className="flex items-center justify-between bg-muted/30 rounded-lg p-3"
                            data-testid={`activity-item-${index}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activity.profit !== null 
                                  ? Number(activity.profit) >= 0 
                                    ? "bg-green-500/20" 
                                    : "bg-red-500/20"
                                  : "bg-blue-500/20"
                              }`}>
                                <i className={`text-xs ${
                                  activity.profit !== null 
                                    ? Number(activity.profit) >= 0 
                                      ? "fas fa-check text-green-400" 
                                      : "fas fa-times text-red-400"
                                    : "fas fa-clock text-blue-400"
                                }`}></i>
                              </div>
                              <div>
                                <p className="font-medium">Tip #{activity.tipId.slice(-8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(activity.followedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className={`font-semibold ${
                              activity.profit !== null 
                                ? Number(activity.profit) >= 0 
                                  ? "text-green-400" 
                                  : "text-red-400"
                                : "text-muted-foreground"
                            }`}>
                              {activity.profit !== null 
                                ? `${Number(activity.profit) >= 0 ? '+' : ''}$${activity.profit}`
                                : "Pending"
                              }
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-chart-line text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">Performance Dashboard</h3>
                <p className="text-muted-foreground mb-6">
                  Sign in to view your detailed performance analytics and betting history.
                </p>
                <a 
                  href="/api/login" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                  data-testid="button-sign-in-dashboard"
                >
                  Sign In to View Stats
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
