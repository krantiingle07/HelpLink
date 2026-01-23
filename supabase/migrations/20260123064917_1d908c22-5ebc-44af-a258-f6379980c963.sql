-- Create a public view for help_requests that excludes contact_phone
CREATE VIEW public.help_requests_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    user_id,
    category,
    urgency,
    status,
    title,
    description,
    city,
    location,
    image_url,
    additional_info,
    created_at,
    updated_at
  FROM public.help_requests;
-- Excludes: contact_phone

-- Create a public view for profiles that excludes phone
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    user_id,
    full_name,
    avatar_url,
    city,
    bio,
    is_helper,
    is_seeker,
    created_at,
    updated_at
  FROM public.profiles;
-- Excludes: phone

-- Update help_requests SELECT policy to restrict access to contact_phone
-- Only the request owner and helpers who responded can see full details
DROP POLICY IF EXISTS "Help requests are viewable by everyone" ON public.help_requests;

-- Allow everyone to see requests but only owner/helpers see contact_phone via base table
CREATE POLICY "Request owner and helpers can view full details"
  ON public.help_requests FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.uid() IN (
      SELECT helper_id FROM public.help_responses WHERE request_id = help_requests.id
    )
  );

-- Update profiles SELECT policy to restrict phone access
-- Only the profile owner can see their full profile with phone
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profile owner can view full details"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);