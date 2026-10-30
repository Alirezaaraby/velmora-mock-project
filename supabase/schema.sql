-- Velmora product catalogue schema for Supabase
-- Run this file before seed.sql.
-- This creates a normalized catalogue with lookup and junction tables.

BEGIN;

CREATE TABLE public.categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.colours (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    colour_hex TEXT NOT NULL;
);

CREATE TABLE public.fabrics (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.fits (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.sizes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.occasions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES public.categories(id),
    price_gbp NUMERIC(10, 2) NOT NULL CHECK (price_gbp >= 0),
    fabric_id BIGINT NOT NULL REFERENCES public.fabrics(id),
    fit_id BIGINT REFERENCES public.fits(id),
    made_to_order BOOLEAN NOT NULL,
    lead_time_days INTEGER NOT NULL CHECK (lead_time_days >= 0),
    description TEXT NOT NULL,
    in_stock BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.product_colours (
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    colour_id BIGINT NOT NULL REFERENCES public.colours(id) ON DELETE RESTRICT,
    PRIMARY KEY (product_id, colour_id)
);

CREATE TABLE public.product_sizes (
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size_id BIGINT NOT NULL REFERENCES public.sizes(id) ON DELETE RESTRICT,
    PRIMARY KEY (product_id, size_id)
);

CREATE TABLE public.product_occasions (
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    occasion_id BIGINT NOT NULL REFERENCES public.occasions(id) ON DELETE RESTRICT,
    PRIMARY KEY (product_id, occasion_id)
);

CREATE INDEX products_category_id_idx ON public.products(category_id);
CREATE INDEX products_fabric_id_idx ON public.products(fabric_id);
CREATE INDEX products_fit_id_idx ON public.products(fit_id);
CREATE INDEX products_price_gbp_idx ON public.products(price_gbp);
CREATE INDEX product_colours_colour_id_idx ON public.product_colours(colour_id);
CREATE INDEX product_sizes_size_id_idx ON public.product_sizes(size_id);
CREATE INDEX product_occasions_occasion_id_idx ON public.product_occasions(occasion_id);

-- Enable row-level security on every exposed catalogue table.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_occasions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products"
    ON public.products FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read categories"
    ON public.categories FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read colours"
    ON public.colours FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read fabrics"
    ON public.fabrics FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read fits"
    ON public.fits FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read sizes"
    ON public.sizes FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read occasions"
    ON public.occasions FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read product colours"
    ON public.product_colours FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read product sizes"
    ON public.product_sizes FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public can read product occasions"
    ON public.product_occasions FOR SELECT TO anon, authenticated USING (TRUE);

COMMIT;
