import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navigation = [
    { name: "Tips", href: "/tips" },
    { name: "Pricing", href: "/pricing" },
  ];

  const NavItems = () => (
    <>
      {navigation.map((item) => (
        <Link key={item.name} href={item.href}>
          <a
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location === item.href
                ? "text-accent"
                : "text-muted-foreground hover:text-accent"
            }`}
            data-testid={`link-${item.name.toLowerCase()}`}
          >
            {item.name}
          </a>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex-shrink-0" data-testid="link-home">
                  <h1 className="text-2xl font-display font-bold gradient-text">LUCIFERTIPP</h1>
                </a>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <NavItems />
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                          <AvatarFallback>
                            {user?.firstName?.[0] || user?.email?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/">
                          <a className="flex items-center" data-testid="link-dashboard">
                            <i className="fas fa-tachometer-alt mr-2"></i>
                            Dashboard
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="/api/logout" className="flex items-center" data-testid="link-logout">
                          <i className="fas fa-sign-out-alt mr-2"></i>
                          Logout
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <a 
                      href="/api/login" 
                      className="text-muted-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="link-login"
                    >
                      Login
                    </a>
                    <a 
                      href="/api/login" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="link-signup"
                    >
                      Sign Up
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                    <i className="fas fa-bars text-xl"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <NavItems />
                    
                    <div className="border-t border-border pt-4">
                      {isAuthenticated ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                              <AvatarFallback>
                                {user?.firstName?.[0] || user?.email?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user?.firstName || "User"}</p>
                              <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                          </div>
                          <Link href="/">
                            <a className="block px-3 py-2 text-sm" data-testid="link-mobile-dashboard">
                              Dashboard
                            </a>
                          </Link>
                          <a 
                            href="/api/logout" 
                            className="block px-3 py-2 text-sm text-red-400"
                            data-testid="link-mobile-logout"
                          >
                            Logout
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <a 
                            href="/api/login" 
                            className="block px-3 py-2 text-sm"
                            data-testid="link-mobile-login"
                          >
                            Login
                          </a>
                          <a 
                            href="/api/login" 
                            className="block bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm text-center"
                            data-testid="link-mobile-signup"
                          >
                            Sign Up
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-bold gradient-text">LUCIFERTIPP</h1>
              <p className="text-muted-foreground">
                Premium sports betting tips and analysis for serious bettors.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-twitter">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-telegram">
                  <i className="fab fa-telegram text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-discord">
                  <i className="fab fa-discord text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/tips"><a className="hover:text-accent transition-colors">Sports Tips</a></Link></li>
                <li><a href="#" className="hover:text-accent transition-colors">Performance Analytics</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Expert Analysis</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Risk Management</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Live Chat</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Disclaimer</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Responsible Gaming</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © 2024 LUCIFERTIPP. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <i className="fas fa-shield-alt text-green-400 mr-2"></i>
                  Secure & Licensed
                </span>
                <span className="flex items-center">
                  <i className="fas fa-users text-blue-400 mr-2"></i>
                  15,000+ Members
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
