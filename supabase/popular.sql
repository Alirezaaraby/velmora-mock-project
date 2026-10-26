-- Velmora popular products
-- Run after schema.sql (depends on public.products).

BEGIN;

CREATE TABLE public.popular (
    product_id TEXT PRIMARY KEY
        REFERENCES public.products(id)
        ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX popular_sort_order_idx ON public.popular(sort_order);

ALTER TABLE public.popular ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read popular"
    ON public.popular FOR SELECT TO anon, authenticated USING (TRUE);

COMMIT;

INSERT INTO public.popular (product_id, sort_order) VALUES
    ('VLM-003', 1),  -- Isola dress, champagne jersey column, winter wedding
    ('VLM-012', 2),  -- Isola dress, ivory crepe wrap, winter wedding
    ('VLM-010', 3),  -- Livia dress, sequinned tulle wrap, NYE / winter wedding
    ('VLM-028', 4),  -- Giada jumpsuit, silk satin, winter wedding
    ('VLM-016', 5),  -- Livia dress, champagne crepe wrap, in stock
    ('VLM-035', 6)   -- Livia top, sapphire wool crepe, in stock
ON CONFLICT (product_id) DO UPDATE
    SET sort_order = EXCLUDED.sort_order;