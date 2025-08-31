import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import TipCard from "@/components/TipCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tips() {
  const [sportFilter, setSportFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [planFilter, setPlanFilter] = useState<string>("");

  const { data: tips = [], isLoading } = useQuery({
    queryKey: ["/api/tips", { sport: sportFilter, status: statusFilter, plan: planFilter }],
    retry: false,
  });

  const sports = [
    { value: "", label: "All Sports" },
    { value: "nfl", label: "NFL" },
    { value: "nba", label: "NBA" },
    { value: "nhl", label: "NHL" },
    { value: "mlb", label: "MLB" },
    { value: "soccer", label: "Soccer" },
    { value: "tennis", label: "Tennis" },
    { value: "golf", label: "Golf" },
    { value: "boxing", label: "Boxing" },
    { value: "mma", label: "MMA" },
  ];

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" },
    { value: "void", label: "Void" },
  ];

  const plans = [
    { value: "", label: "All Plans" },
    { value: "free", label: "Free" },
    { value: "basic", label: "Basic" },
    { value: "pro", label: "Pro" },
    { value: "vip", label: "VIP" },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">
            Sports <span className="gradient-text">Tips</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional sports betting tips with detailed analysis and proven results.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sport</label>
                <Select value={sportFilter} onValueChange={setSportFilter}>
                  <SelectTrigger data-testid="select-sport-filter">
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger data-testid="select-status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Plan Level</label>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger data-testid="select-plan-filter">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSportFilter("");
                  setStatusFilter("");
                  setPlanFilter("");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tips.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">No tips found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or check back later for new tips.
              </p>
              <Button 
                onClick={() => {
                  setSportFilter("");
                  setStatusFilter("");
                  setPlanFilter("");
                }}
                data-testid="button-reset-search"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip: any) => (
              <TipCard key={tip.id} tip={tip} showFollowButton={true} />
            ))}
          </div>
        )}

        {/* Load More */}
        {tips.length > 0 && tips.length % 12 === 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" data-testid="button-load-more">
              Load More Tips
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
