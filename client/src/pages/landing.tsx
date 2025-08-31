import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import TipCard from "@/components/TipCard";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import PerformanceStats from "@/components/PerformanceStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const { data: recentTips = [] } = useQuery({
    queryKey: ["/api/tips"],
    retry: false,
  });

  const { data: tipsterStats } = useQuery({
    queryKey: ["/api/stats/tipster"],
    retry: false,
  });

  const handleStartTrial = () => {
    window.location.href = "/api/login";
  };

  const handleViewPricing = () => {
    window.location.href = "/pricing";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-card"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
                  <span className="gradient-text">Premium</span><br/>
                  <span className="text-foreground">Sports Tips</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Join thousands of winners with our expertly analyzed sports betting tips. 
                  Professional insights, proven results, maximum profits.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleStartTrial}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg transform hover:scale-105 transition-all"
                  data-testid="button-start-trial"
                >
                  Start Free Trial
                </Button>
                <Button 
                  onClick={handleViewPricing}
                  variant="outline"
                  size="lg"
                  className="border-border hover:border-accent text-foreground hover:text-accent px-8 py-4 text-lg"
                  data-testid="button-view-pricing"
                >
                  View Pricing
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent" data-testid="text-win-rate">
                    {(tipsterStats as any)?.winRate || 87}%
                  </div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent" data-testid="text-total-tips">
                    {(tipsterStats as any)?.totalTips || 2450}+
                  </div>
                  <div className="text-sm text-muted-foreground">Tips Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent" data-testid="text-total-members">
                    {(tipsterStats as any)?.totalMembers || 15000}+
                  </div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {(recentTips as any[]).slice(0, 2).map((tip: any) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
              
              {tipsterStats && (
                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <i className="fas fa-chart-line text-accent mr-2"></i>
                      This Week's Performance
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400" data-testid="text-weekly-wins">
                          {(tipsterStats as any).weeklyStats?.wins || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-400" data-testid="text-weekly-losses">
                          {(tipsterStats as any).weeklyStats?.losses || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Losses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent" data-testid="text-weekly-profit">
                          ${(tipsterStats as any).weeklyStats?.profit || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Profit</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Tips Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Recent <span className="gradient-text">Winning Tips</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See our latest predictions and their outcomes. Join our premium members to get real-time tips.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(recentTips as any[]).slice(0, 6).map((tip: any) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = "/tips"}
              data-testid="button-view-all-tips"
            >
              View All Tips
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* Performance Dashboard Preview */}
      <PerformanceStats />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Start <span className="gradient-text">Winning?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful bettors who trust LUCIFERTIPP for their sports betting insights. 
            Start your winning streak today with our proven strategies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleStartTrial}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg transform hover:scale-105 transition-all"
              data-testid="button-start-free-trial"
            >
              Start 7-Day Free Trial
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
            <Button 
              variant="outline"
              size="lg"
              data-testid="button-contact-us"
            >
              Contact Us
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </div>
        </div>
      </section>
    </Layout>
  );
}
