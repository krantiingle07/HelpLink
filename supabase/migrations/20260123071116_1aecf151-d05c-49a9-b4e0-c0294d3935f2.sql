-- Fix infinite recursion by using a security definer function
-- This function checks if a user has responded to a specific request

CREATE OR REPLACE FUNCTION public.user_has_responded_to_request(_user_id uuid, _request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.help_responses
    WHERE helper_id = _user_id
      AND request_id = _request_id
  )
$$;

-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Helpers can view requests they responded to" ON public.help_requests;

-- Recreate the policy using the security definer function
CREATE POLICY "Helpers can view requests they responded to"
ON public.help_requests
FOR SELECT
USING (public.user_has_responded_to_request(auth.uid(), id));

-- Also fix the help_responses policy to avoid recursion
-- First, create a function to check if user owns a request
CREATE OR REPLACE FUNCTION public.user_owns_request(_user_id uuid, _request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.help_requests
    WHERE id = _request_id
      AND user_id = _user_id
  )
$$;

-- Drop and recreate the help_responses SELECT policy
DROP POLICY IF EXISTS "Responses viewable by request owner and responder" ON public.help_responses;

CREATE POLICY "Responses viewable by request owner and responder"
ON public.help_responses
FOR SELECT
USING (
  auth.uid() = helper_id 
  OR public.user_owns_request(auth.uid(), request_id)
);