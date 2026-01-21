import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CategoryCard } from '@/components/requests/CategoryCard';
import { ImageUpload } from '@/components/requests/ImageUpload';
import { useAuth } from '@/hooks/useAuth';
import { useCreateRequest } from '@/hooks/useHelpRequests';
import { HELP_CATEGORIES, HelpCategory, URGENCY_CONFIG } from '@/lib/constants';
import { ArrowLeft, ArrowRight, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';

type UrgencyLevelEnum = Database['public']['Enums']['urgency_level'];

export default function CreateRequestPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { createRequest, loading } = useCreateRequest();
  
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<HelpCategory | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevelEnum>('normal');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to post a help request
          </p>
          <Button onClick={() => navigate('/auth')}>
            Sign In / Sign Up
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async () => {
    if (!category || !title || !description) return;

    const { error, data } = await createRequest({
      category,
      title,
      description,
      urgency,
      city: city || undefined,
      location: location || undefined,
      contact_phone: contactPhone || undefined,
      image_url: imageUrl || undefined,
    });

    if (!error && data) {
      navigate(`/request/${data.id}`);
    }
  };

  const canProceedStep1 = category !== null;
  const canProceedStep2 = title.length >= 10 && description.length >= 20;
  const canSubmit = canProceedStep1 && canProceedStep2;

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Post a Help Request</h1>
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>What type of help do you need?</CardTitle>
              <CardDescription>
                Select the category that best describes your situation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {HELP_CATEGORIES.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    selected={category === cat.id}
                    onClick={() => setCategory(cat.id)}
                  />
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Request Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Describe your request</CardTitle>
              <CardDescription>
                Provide details so helpers can understand your situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of what you need help with"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters (minimum 10)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Explain your situation in detail. What help do you need? Why is it important?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/2000 characters (minimum 20)
                </p>
              </div>

              <div className="space-y-3">
                <Label>Urgency Level</Label>
                <RadioGroup
                  value={urgency}
                  onValueChange={(v) => setUrgency(v as UrgencyLevelEnum)}
                  className="flex flex-col gap-3"
                >
                  {(Object.keys(URGENCY_CONFIG) as UrgencyLevelEnum[]).map((level) => {
                    const config = URGENCY_CONFIG[level];
                    return (
                      <div
                        key={level}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                          urgency === level ? config.borderColor + " " + config.bgColor : "hover:bg-muted/50"
                        )}
                        onClick={() => setUrgency(level)}
                      >
                        <RadioGroupItem value={level} id={level} />
                        <Label htmlFor={level} className="flex-1 cursor-pointer">
                          <span className={cn("font-medium", config.color)}>
                            {config.label}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {level === 'normal' && 'Standard request, no immediate urgency'}
                            {level === 'urgent' && 'Needs attention within 24-48 hours'}
                            {level === 'critical' && 'Life-threatening or time-sensitive emergency'}
                          </p>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Add an Image (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a photo to help illustrate your request
                </p>
                <ImageUpload
                  userId={user.id}
                  imageUrl={imageUrl}
                  onImageChange={setImageUrl}
                  disabled={loading}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Contact & Location */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Location & Contact (Optional)</CardTitle>
              <CardDescription>
                Help others find and contact you more easily
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Area / Landmark</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Near Central Station"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be visible to helpers who respond to your request
                </p>
              </div>

              {/* Preview */}
              <div className="rounded-lg border p-4 bg-muted/30">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Request Preview
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Category:</strong> {HELP_CATEGORIES.find(c => c.id === category)?.label}</p>
                  <p><strong>Title:</strong> {title}</p>
                  <p><strong>Urgency:</strong> {URGENCY_CONFIG[urgency].label}</p>
                  {city && <p><strong>City:</strong> {city}</p>}
                  {imageUrl && (
                    <div className="mt-2">
                      <strong>Image:</strong>
                      <img src={imageUrl} alt="Request preview" className="mt-1 rounded-md h-20 object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {urgency === 'critical' && (
                <div className="rounded-lg border border-warning bg-warning/10 p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Critical Request Notice</p>
                    <p className="text-muted-foreground">
                      Critical requests are highlighted for immediate attention. Please ensure 
                      this is truly an emergency situation.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  className="gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Post Help Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}