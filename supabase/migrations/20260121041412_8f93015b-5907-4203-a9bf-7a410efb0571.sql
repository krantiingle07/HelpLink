-- Create storage bucket for help request images
INSERT INTO storage.buckets (id, name, public)
VALUES ('help-request-images', 'help-request-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload help request images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'help-request-images' 
  AND auth.uid() IS NOT NULL
);

-- Allow public read access to images
CREATE POLICY "Help request images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'help-request-images');

-- Allow users to update their own uploads
CREATE POLICY "Users can update their own help request images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'help-request-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own help request images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'help-request-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);