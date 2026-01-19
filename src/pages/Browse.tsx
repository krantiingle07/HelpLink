import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { RequestCard } from '@/components/requests/RequestCard';
import { CategoryCard } from '@/components/requests/CategoryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHelpRequests } from '@/hooks/useHelpRequests';
import { HELP_CATEGORIES, HelpCategory } from '@/lib/constants';
import { Search, Filter, X, Loader2, Sparkles, HandHeart } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type UrgencyLevelEnum = Database['public']['Enums']['urgency_level'];

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as HelpCategory | null;
  const urgencyParam = searchParams.get('urgency') as UrgencyLevelEnum | null;
  
  const [searchCity, setSearchCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | undefined>(categoryParam || undefined);
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevelEnum | undefined>(urgencyParam || undefined);
  const [showFilters, setShowFilters] = useState(false);

  const { requests, loading } = useHelpRequests({
    category: selectedCategory,
    urgency: selectedUrgency,
    status: 'open',
  });

  const filteredRequests = useMemo(() => {
    if (!searchCity) return requests;
    return requests.filter(r => 
      r.city?.toLowerCase().includes(searchCity.toLowerCase())
    );
  }, [requests, searchCity]);

  const handleCategorySelect = (categoryId: HelpCategory) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined);
      searchParams.delete('category');
    } else {
      setSelectedCategory(categoryId);
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleUrgencyChange = (value: string) => {
    if (value === 'all') {
      setSelectedUrgency(undefined);
      searchParams.delete('urgency');
    } else {
      setSelectedUrgency(value as UrgencyLevelEnum);
      searchParams.set('urgency', value);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedUrgency(undefined);
    setSearchCity('');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || selectedUrgency || searchCity;

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
          <div className="container py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Browse Help Requests</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl">
              Find requests in your community and offer your help to those who need it
            </p>
          </div>
        </div>

        <div className="container py-8">
          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-2xl border shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-11 h-12 bg-muted/50 border-0"
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <Select value={selectedUrgency || 'all'} onValueChange={handleUrgencyChange}>
                <SelectTrigger className="w-[160px] h-12 bg-muted/50 border-0">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="critical">🚨 Critical</SelectItem>
                  <SelectItem value="urgent">⚡ Urgent</SelectItem>
                  <SelectItem value="normal">📝 Normal</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 h-12"
              >
                <Filter className="h-4 w-4" />
                Categories
              </Button>
              
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2 h-12 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          {showFilters && (
            <div className="mb-8 p-6 rounded-2xl bg-muted/30 border animate-fade-in">
              <p className="text-sm font-medium text-muted-foreground mb-4">Filter by category:</p>
              <div className="flex flex-wrap gap-3">
                {HELP_CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    compact
                    selected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {loading ? (
                'Loading requests...'
              ) : (
                `Showing ${filteredRequests.length} help request${filteredRequests.length !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map((request, i) => (
                <div 
                  key={request.id} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                >
                  <RequestCard request={request} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed p-16 text-center bg-muted/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <HandHeart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mb-2">No requests found</p>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search criteria to find more requests'
                  : 'Be the first to post a help request!'}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
