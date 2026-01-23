-- Fix infinite recursion in RLS policy on help_requests by removing helper subquery
-- (helpers can use the public view; owners can still read full rows)

DROP POLICY IF EXISTS "Request owner and helpers can view full details" ON public.help_requests;

CREATE POLICY "Request owners can view full details"
ON public.help_requests
FOR SELECT
USING (auth.uid() = user_id);
