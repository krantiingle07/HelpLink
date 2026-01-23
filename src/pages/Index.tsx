import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { CategoryCard } from '@/components/requests/CategoryCard';
import { HELP_CATEGORIES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useHelpRequests } from '@/hooks/useHelpRequests';
import { RequestCard } from '@/components/requests/RequestCard';
import { 
  HandHeart, 
  Users, 
  Clock, 
  Shield, 
  ArrowRight,
  Sparkles,
  Heart,
  Zap,
  Globe,
  CheckCircle2,
  Play,
  ChevronRight
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { requests, loading } = useHelpRequests({ status: 'open' });
  
  const urgentRequests = requests.filter(r => r.urgency === 'critical' || r.urgency === 'urgent').slice(0, 3);
  const recentRequests = requests.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl float" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
        
        <div className="container relative z-10 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="badge-modern">
                <Sparkles className="w-4 h-4" />
                <span>Community Help Platform</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            
            {/* Heading */}
            <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Help Someone Today
              <br />
              <span className="text-gradient-animated">Change a Life Forever</span>
            </h1>
            
            {/* Description */}
            <p className="text-center text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Connect with your community. Request help when you need it, 
              or become a helper and make a real difference.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="default" 
                className="btn-primary h-11 px-6 text-sm gap-2 w-full sm:w-auto"
                onClick={() => navigate(user ? '/create' : '/auth?mode=signup')}
              >
                <HandHeart className="w-4 h-4" />
                Request Help
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="default"
                variant="outline" 
                className="btn-secondary h-11 px-6 text-sm gap-2 w-full sm:w-auto"
                onClick={() => navigate('/browse')}
              >
                <Users className="w-4 h-4" />
                Browse & Help Others
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Shield, text: 'Secure & Private' },
                { icon: Zap, text: 'Instant Matching' },
                { icon: Globe, text: 'Available 24/7' },
                { icon: CheckCircle2, text: '100% Free' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-12 relative">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '10+', label: 'Categories', icon: Heart },
              { value: '24/7', label: 'Support', icon: Clock },
              { value: 'Fast', label: 'Response', icon: Zap },
              { value: 'Free', label: 'Forever', icon: Globe },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="feature-card text-center animate-fade-in p-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="icon-box inline-flex items-center justify-center w-10 h-10 mb-3">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Requests */}
      {urgentRequests.length > 0 && (
        <section className="py-12 relative">
          <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
          
          <div className="container relative">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                  </span>
                  <span className="badge-modern !bg-destructive/10 !text-destructive !border-destructive/20 text-xs">Urgent</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold">Needs Immediate Help</h2>
                <p className="text-sm text-muted-foreground mt-1">These requests require urgent attention</p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex gap-2 btn-secondary">
                <Link to="/browse?urgency=critical">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentRequests.map((request, i) => (
                <div key={request.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <RequestCard request={request} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute inset-0 bg-dots" />
        
        <div className="container relative">
          <div className="text-center mb-10">
            <div className="badge-modern mx-auto mb-4 text-xs">
              <Heart className="w-3 h-3" />
              <span>Categories</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">How Can We Help?</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Select a category to find help or offer your support
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HELP_CATEGORIES.map((category, i) => (
              <div key={category.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <CategoryCard
                  category={category}
                  onClick={() => navigate(`/browse?category=${category.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Requests */}
      <section className="py-14">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="badge-modern mb-3 text-xs">
                <Clock className="w-3 h-3" />
                <span>Recent</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold">Latest Requests</h2>
              <p className="text-sm text-muted-foreground mt-1">People in your community need help</p>
            </div>
            <Button variant="outline" asChild className="gap-2 btn-secondary hidden md:flex">
              <Link to="/browse">
                Browse All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl shimmer" />
              ))}
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRequests.map((request, i) => (
                <div key={request.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <RequestCard request={request} />
                </div>
              ))}
            </div>
          ) : (
            <div className="feature-card text-center py-12">
              <div className="icon-box inline-flex items-center justify-center w-14 h-14 mb-4">
                <HandHeart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">No requests yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Be the first to create a request or help someone!</p>
              <Button 
                className="btn-primary h-10 px-6 text-sm gap-2"
                onClick={() => navigate(user ? '/create' : '/auth')}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div className="flex justify-center mt-8 md:hidden">
            <Button variant="outline" asChild className="gap-2 btn-secondary">
              <Link to="/browse">
                Browse All Requests
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 relative">
        <div className="absolute inset-0 bg-gradient-mesh" />
        
        <div className="container relative">
          <div className="text-center mb-10">
            <div className="badge-modern mx-auto mb-4 text-xs">
              <Play className="w-3 h-3" />
              <span>How It Works</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Three Simple Steps</h2>
            <p className="text-sm text-muted-foreground">Get started in under a minute</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { 
                step: '01', 
                title: 'Create Account', 
                desc: 'Sign up for free as a seeker, helper, or both',
                icon: Users
              },
              { 
                step: '02', 
                title: 'Post or Browse', 
                desc: 'Submit a help request or find someone to help',
                icon: Heart
              },
              { 
                step: '03', 
                title: 'Connect & Help', 
                desc: 'Communicate directly and make a difference',
                icon: Zap
              },
            ].map((item, i) => (
              <div key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
                <div className="feature-card text-center relative p-5">
                  <div className="absolute top-3 right-4 text-4xl font-black text-muted/50">
                    {item.step}
                  </div>
                  <div className="icon-box inline-flex items-center justify-center w-12 h-12 mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { 
                icon: Shield, 
                title: 'Safe & Secure', 
                desc: 'Your privacy is our priority. All data is encrypted and protected.'
              },
              { 
                icon: Clock, 
                title: 'Fast Response', 
                desc: 'Urgent requests get priority. Get help when you need it most.'
              },
              { 
                icon: Users, 
                title: 'Community First', 
                desc: 'Built by and for the community. Together we are stronger.'
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="feature-card flex items-start gap-4 animate-fade-in p-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="icon-box shrink-0 w-10 h-10">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14">
        <div className="container">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
            <div className="absolute inset-0 bg-grid opacity-10" />
            
            {/* Decorative blurs */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-sm md:text-base text-primary-foreground/80 max-w-xl mx-auto mb-6">
                Join our community today and start helping or receiving help. It's completely free.
              </p>
              <Button 
                size="default"
                variant="secondary"
                className="h-10 px-6 text-sm font-semibold gap-2 hover:scale-105 transition-transform"
                onClick={() => navigate(user ? '/dashboard' : '/auth?mode=signup')}
              >
                {user ? 'Go to Dashboard' : 'Join Now — It\'s Free'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;