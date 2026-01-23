-- Add is_verified column to help_requests for admin verification
ALTER TABLE public.help_requests ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Add verification metadata
ALTER TABLE public.help_requests ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id);
ALTER TABLE public.help_requests ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone;

-- Create admin view for all requests (including non-open ones)
CREATE OR REPLACE VIEW public.admin_requests_view AS
SELECT 
  hr.id,
  hr.user_id,
  hr.category,
  hr.title,
  hr.description,
  hr.urgency,
  hr.status,
  hr.city,
  hr.location,
  hr.image_url,
  hr.additional_info,
  hr.contact_phone,
  hr.is_verified,
  hr.verified_by,
  hr.verified_at,
  hr.created_at,
  hr.updated_at,
  p.full_name as requester_name,
  p.avatar_url as requester_avatar
FROM public.help_requests hr
LEFT JOIN public.profiles p ON hr.user_id = p.user_id;

-- Create admin view for all users with profiles
CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.phone,
  p.avatar_url,
  p.city,
  p.bio,
  p.is_helper,
  p.is_seeker,
  p.created_at,
  p.updated_at,
  (SELECT array_agg(ur.role) FROM public.user_roles ur WHERE ur.user_id = p.user_id) as roles
FROM public.profiles p;

-- RLS policy for admins to view all requests
CREATE POLICY "Admins can view all requests"
ON public.help_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to update any request (for verification/removal)
CREATE POLICY "Admins can update any request"
ON public.help_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to delete any request (for spam removal)
CREATE POLICY "Admins can delete any request"
ON public.help_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to view all user roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy for admins to manage user roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));