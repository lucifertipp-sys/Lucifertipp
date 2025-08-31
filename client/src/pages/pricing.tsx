import Layout from "@/components/Layout";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { Card, CardContent } from "@/components/ui/card";

export default function Pricing() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6">
            Choose Your <span className="gradient-text">Winning Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get access to premium tips, detailed analysis, and expert insights. 
            All plans include our win guarantee and 30-day money-back guarantee.
          </p>
        </div>

        {/* Subscription Plans */}
        <SubscriptionPlans />

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">How does the free trial work?</h3>
                <p className="text-muted-foreground">
                  You get 7 days of full access to our Pro plan features, including all tips, 
                  analysis, and notifications. No credit card required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">What's your win guarantee?</h3>
                <p className="text-muted-foreground">
                  If you don't profit in your first 30 days, we'll refund your entire subscription 
                  fee and extend your access for another month completely free.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Can I change my plan anytime?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                  immediately and you'll be charged the prorated difference.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">How are tips delivered?</h3>
                <p className="text-muted-foreground">
                  Tips are posted on our platform and sent via email. Pro and VIP members also 
                  get real-time notifications and Discord access for instant updates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">What sports do you cover?</h3>
                <p className="text-muted-foreground">
                  We cover all major sports including NFL, NBA, NHL, MLB, Soccer, Tennis, 
                  Golf, Boxing, and MMA with expert analysis for each sport.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Is my payment secure?</h3>
                <p className="text-muted-foreground">
                  Absolutely. We use industry-standard encryption and secure payment processing. 
                  Your financial information is never stored on our servers.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you choose the right plan and maximize your profits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@lucifertipp.com" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                  data-testid="link-email-support"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Email Support
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-border hover:border-accent text-foreground hover:text-accent rounded-lg font-medium transition-colors"
                  data-testid="link-live-chat"
                >
                  <i className="fas fa-comments mr-2"></i>
                  Live Chat
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
