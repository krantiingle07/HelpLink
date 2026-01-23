-- Allow helpers who have responded to a request to see full details including contact_phone
CREATE POLICY "Helpers can view requests they responded to"
ON public.help_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.help_responses
    WHERE help_responses.request_id = help_requests.id
    AND help_responses.helper_id = auth.uid()
  )
);