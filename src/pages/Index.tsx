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
  Star
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { requests, loading } = useHelpRequests({ status: 'open' });
  
  const urgentRequests = requests.filter(r => r.urgency === 'critical' || r.urgency === 'urgent').slice(0, 3);
  const recentRequests = requests.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section with Glassmorphism */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-gradient">
        {/* Animated gradient orbs */}
        <div className="gradient-orb gradient-orb-primary w-[600px] h-[600px] -top-40 -right-40" />
        <div className="gradient-orb gradient-orb-secondary w-[500px] h-[500px] -bottom-40 -left-40" style={{ animationDelay: '2s' }} />
        <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] top-1/3 left-1/4" style={{ animationDelay: '4s' }} />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-[10%] w-20 h-20 rounded-2xl glass-subtle float rotate-12 hidden lg:block" />
        <div className="absolute bottom-32 right-[15%] w-16 h-16 rounded-full glass-subtle float-delayed hidden lg:block" />
        <div className="absolute top-1/3 right-[10%] w-12 h-12 rounded-xl glass-subtle float hidden lg:block" style={{ animationDelay: '1s' }} />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-dots" />
        
        <div className="container py-20 md:py-32 relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full glass-primary px-6 py-3 text-sm font-semibold text-primary animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Connecting Hearts, Building Hope
              <Star className="h-3 w-3 fill-primary" />
            </div>
            
            {/* Main heading */}
            <h1 className="mb-8 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl hero-text animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Help Someone Today,
              <br />
              <span className="text-gradient">Change a Life Forever</span>
            </h1>
            
            {/* Subheading in glass card */}
            <div className="glass-card max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg text-muted-foreground md:text-xl">
                HELPLINK connects people who need help with people who want to help. 
                From medical emergencies to food support, find or offer help in your community.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="lg" 
                className="gap-2 h-16 px-10 text-lg font-semibold btn-glow rounded-2xl" 
                onClick={() => navigate(user ? '/create' : '/auth?mode=signup')}
              >
                <HandHeart className="h-6 w-6" />
                Request Help
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 h-16 px-10 text-lg font-semibold btn-glass rounded-2xl border-2" 
                onClick={() => navigate('/browse')}
              >
                <Users className="h-6 w-6" />
                Become a Helper
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section with Glass Cards */}
      <section className="relative -mt-16 z-20">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { value: '10+', label: 'Help Categories', icon: Heart, color: 'text-primary' },
              { value: '24/7', label: 'Available Support', icon: Clock, color: 'text-secondary' },
              { value: 'Fast', label: 'Response Time', icon: Zap, color: 'text-accent' },
              { value: '100%', label: 'Free to Use', icon: Globe, color: 'text-primary' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="glass-card text-center group card-hover animate-fade-in" 
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="icon-glass inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div className="stat-number mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Requests Section */}
      {urgentRequests.length > 0 && (
        <section className="container py-24">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-critical glow-primary"></span>
                </span>
                <h2 className="text-3xl font-bold md:text-4xl">Urgent Requests</h2>
              </div>
              <p className="text-muted-foreground text-lg">These requests need immediate attention</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex btn-glass">
              <Link to="/browse?urgency=critical">View All Urgent</Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {urgentRequests.map((request, i) => (
              <div key={request.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <RequestCard request={request} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section with Aurora Background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 aurora" />
        <div className="absolute inset-0 pattern-grid" />
        
        <div className="container relative z-10">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl hero-text">How Can We Help You?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Choose a category to find or offer help in your community
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

      {/* Recent Requests Section */}
      <section className="py-24 relative">
        <div className="gradient-orb gradient-orb-secondary w-[400px] h-[400px] top-20 -right-40 opacity-30" />
        
        <div className="container relative z-10">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl mb-2 hero-text">Recent Requests</h2>
              <p className="text-muted-foreground text-lg">People in your community need your help</p>
            </div>
            <Button variant="outline" asChild className="gap-2 btn-glass">
              <Link to="/browse">
                Browse All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl shimmer glass-subtle" />
              ))}
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentRequests.map((request, i) => (
                <div key={request.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <RequestCard request={request} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card text-center py-16">
              <div className="icon-glass inline-flex items-center justify-center w-20 h-20 rounded-full mb-6">
                <HandHeart className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-xl font-medium mb-2">No help requests yet</p>
              <p className="text-muted-foreground mb-8">Be the first to post or help!</p>
              <Button onClick={() => navigate(user ? '/create' : '/auth')} className="btn-glow rounded-xl">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots" />
        
        <div className="container relative z-10">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl hero-text">How HELPLINK Works</h2>
            <p className="text-muted-foreground text-lg">Simple steps to give or receive help</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up for free as a help seeker, helper, or both', gradient: 'from-primary to-primary/70' },
              { step: 2, title: 'Post or Browse', desc: 'Post a help request or browse existing requests to help', gradient: 'from-secondary to-secondary/70' },
              { step: 3, title: 'Connect & Help', desc: 'Connect with helpers or seekers and make a difference', gradient: 'from-accent to-accent/70' },
            ].map((item, i) => (
              <div key={i} className="relative text-center animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-muted-foreground/30 to-transparent" />
                )}
                <div className="glass-card card-hover">
                  <div className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-3xl font-bold text-white shadow-xl glow-primary`}>
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Safe & Secure', desc: 'Your data is protected and all connections are verified', color: 'text-primary', gradient: 'from-primary/20 to-primary/5' },
              { icon: Clock, title: 'Quick Response', desc: 'Urgent requests are highlighted for faster help', color: 'text-secondary', gradient: 'from-secondary/20 to-secondary/5' },
              { icon: Users, title: 'Community Driven', desc: 'Built by the community, for the community', color: 'text-accent', gradient: 'from-accent/20 to-accent/5' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="glass-card card-hover flex items-start gap-4 animate-fade-in" 
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`icon-glass rounded-xl bg-gradient-to-br ${item.gradient}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Premium Glass Effect */}
      <section className="container py-24">
        <div className="relative rounded-[2rem] overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
          
          {/* Glass overlay pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 pattern-dots opacity-20" />
          
          {/* Content */}
          <div className="relative z-10 p-12 md:p-20 text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2 text-sm font-medium mb-8">
              <Heart className="h-4 w-4" />
              Join thousands making a difference
            </div>
            
            <h2 className="mb-6 text-4xl font-bold md:text-6xl">
              Ready to Make a Difference?
            </h2>
            <p className="mb-10 text-xl opacity-90 max-w-xl mx-auto">
              Join HELPLINK today and be part of a community that cares
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2 h-16 px-12 text-lg font-semibold shadow-2xl rounded-2xl hover:scale-105 transition-transform"
              onClick={() => navigate(user ? '/dashboard' : '/auth?mode=signup')}
            >
              {user ? 'Go to Dashboard' : 'Join Now - It\'s Free'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;