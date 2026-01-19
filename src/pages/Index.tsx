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
  Globe
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 pattern-dots">
        <div className="container py-20 md:py-32 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary animate-fade-in border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Connecting Hearts, Building Hope
            </div>
            
            <h1 className="mb-8 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl hero-text animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Help Someone Today,
              <br />
              <span className="text-gradient">Change a Life Forever</span>
            </h1>
            
            <p className="mb-12 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              HELPLINK connects people who need help with people who want to help. 
              From medical emergencies to food support, find or offer help in your community.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="gap-2 h-14 px-8 text-base font-semibold btn-glow shadow-lg shadow-primary/25" onClick={() => navigate(user ? '/create' : '/auth?mode=signup')}>
                <HandHeart className="h-5 w-5" />
                Request Help
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-base font-semibold border-2 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all" onClick={() => navigate('/browse')}>
                <Users className="h-5 w-5" />
                Become a Helper
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card relative overflow-hidden">
        <div className="container py-16">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: '10+', label: 'Help Categories', icon: Heart, color: 'text-primary' },
              { value: '24/7', label: 'Available Support', icon: Clock, color: 'text-secondary' },
              { value: 'Fast', label: 'Response Time', icon: Zap, color: 'text-accent' },
              { value: '100%', label: 'Free to Use', icon: Globe, color: 'text-primary' },
            ].map((stat, i) => (
              <div key={i} className="text-center group animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4 group-hover:scale-110 transition-transform">
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
        <section className="container py-20">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-critical"></span>
                </span>
                <h2 className="text-2xl font-bold md:text-3xl">Urgent Requests</h2>
              </div>
              <p className="text-muted-foreground">These requests need immediate attention</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
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

      {/* Categories Section */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-4xl">How Can We Help You?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
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
      <section className="py-20">
        <div className="container">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl mb-2">Recent Requests</h2>
              <p className="text-muted-foreground">People in your community need your help</p>
            </div>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/browse">
                Browse All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-xl shimmer" />
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
            <div className="rounded-2xl border-2 border-dashed p-16 text-center bg-muted/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <HandHeart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">No help requests yet</p>
              <p className="text-muted-foreground mb-6">Be the first to post or help!</p>
              <Button onClick={() => navigate(user ? '/create' : '/auth')} className="btn-glow">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-4xl">How HELPLINK Works</h2>
            <p className="text-muted-foreground">Simple steps to give or receive help</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up for free as a help seeker, helper, or both', color: 'bg-primary' },
              { step: 2, title: 'Post or Browse', desc: 'Post a help request or browse existing requests to help', color: 'bg-secondary' },
              { step: 3, title: 'Connect & Help', desc: 'Connect with helpers or seekers and make a difference', color: 'bg-accent' },
            ].map((item, i) => (
              <div key={i} className="relative text-center animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-muted-foreground/20 to-transparent" />
                )}
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} text-2xl font-bold text-white shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Safe & Secure', desc: 'Your data is protected and all connections are verified', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Clock, title: 'Quick Response', desc: 'Urgent requests are highlighted for faster help', color: 'text-secondary', bg: 'bg-secondary/10' },
              { icon: Users, title: 'Community Driven', desc: 'Built by the community, for the community', color: 'text-accent', bg: 'bg-accent/10' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-card border card-interactive animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`rounded-xl ${item.bg} p-3`}>
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

      {/* CTA Section */}
      <section className="container py-20">
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 md:p-20 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              Ready to Make a Difference?
            </h2>
            <p className="mb-10 text-xl opacity-90 max-w-xl mx-auto">
              Join HELPLINK today and be part of a community that cares
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2 h-14 px-10 text-base font-semibold shadow-xl"
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
