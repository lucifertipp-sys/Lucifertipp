import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    description: "Perfect for beginners",
    features: [
      "5 tips per week",
      "Basic analysis",
      "Email support",
      "Performance tracking",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 69,
    description: "For serious bettors",
    features: [
      "15 tips per week",
      "Detailed analysis",
      "Priority support",
      "Live notifications",
      "Discord access",
    ],
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: 149,
    description: "Maximum profits",
    features: [
      "Unlimited tips",
      "Premium analysis",
      "24/7 support",
      "Exclusive tips",
      "1-on-1 consultation",
      "Risk management",
    ],
    popular: false,
  },
];

export default function SubscriptionPlans() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      // In a real app, this would integrate with a payment processor
      await apiRequest("POST", "/api/subscription/update", {
        plan: planId,
        status: "active",
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your subscription has been updated successfully.",
      });
      // Redirect to dashboard
      window.location.href = "/";
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
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    
    subscriptionMutation.mutate(planId);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">
            Choose Your <span className="gradient-text">Winning Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get access to premium tips, detailed analysis, and expert insights. All plans include our win guarantee.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${
                plan.popular 
                  ? "border-2 border-primary scale-105" 
                  : "border border-border"
              }`}
              data-testid={`card-plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2" data-testid={`text-plan-name-${plan.id}`}>
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold mb-2">
                    <span className="text-accent" data-testid={`text-plan-price-${plan.id}`}>
                      ${plan.price}
                    </span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center" data-testid={`text-feature-${plan.id}-${index}`}>
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={subscriptionMutation.isPending}
                  className={`w-full py-3 font-semibold transition-colors ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : plan.id === "vip"
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                  data-testid={`button-select-plan-${plan.id}`}
                >
                  {subscriptionMutation.isPending ? "Processing..." : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">All plans include our 30-day money-back guarantee</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <span className="flex items-center">
              <i className="fas fa-shield-alt text-green-400 mr-2"></i>
              Secure Payment
            </span>
            <span className="flex items-center">
              <i className="fas fa-calendar-alt text-blue-400 mr-2"></i>
              Cancel Anytime
            </span>
            <span className="flex items-center">
              <i className="fas fa-trophy text-accent mr-2"></i>
              Win Guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
