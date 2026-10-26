-- Velmora product image URLs from Unsplash.
-- Each product is assigned a distinct Unsplash photo ID.
-- Images are illustrative editorial placeholders; review image relevance and URL availability before production.

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image text;

UPDATE public.products AS p
SET image = v.image
FROM (VALUES
  ('VLM-001', 'https://images.unsplash.com/photo-1741250781111-495c70c21b95?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-002', 'https://images.unsplash.com/photo-1668873882581-6e0784eee43b?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-003', 'https://images.unsplash.com/photo-1667218578593-1d8d433e4b33?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-004', 'https://images.unsplash.com/photo-1734390151133-f6b8e8abceb0?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-005', 'https://images.unsplash.com/photo-1740564014446-f07ea2da269c?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-006', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-007', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-008', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-009', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-010', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-011', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-012', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-013', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-014', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-015', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-016', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-017', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-018', 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-019', 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-020', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-021', 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-022', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-023', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-024', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-025', 'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-026', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-027', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-028', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-029', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-030', 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-031', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-032', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-033', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-034', 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-035', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-036', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-037', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-038', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-039', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-040', 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-041', 'https://images.unsplash.com/photo-1632149877166-f75d49000351?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-042', 'https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-043', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-044', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-045', 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-046', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-047', 'https://images.unsplash.com/photo-1614435930083-a4b2e35032ce?auto=format&fit=crop&w=1200&q=80'),
  ('VLM-048', 'https://images.unsplash.com/photo-1648538604499-d1f6bee958ab?auto=format&fit=crop&w=1200&q=80')
) AS v(id, image)
WHERE p.id = v.id;

-- Verify every product has an image and check for duplicate image URLs:
-- SELECT id, image FROM public.products ORDER BY id;
-- SELECT image, COUNT(*) FROM public.products GROUP BY image HAVING COUNT(*) > 1;

