CREATE OR REPLACE FUNCTION public.match_products(
    p_occasion_ids BIGINT[] DEFAULT NULL,
    p_size_ids BIGINT[] DEFAULT NULL,
    p_min_gbp NUMERIC DEFAULT 0,
    p_max_gbp NUMERIC DEFAULT 500
)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    category TEXT,
    price_gbp NUMERIC,
    image TEXT,
    fabric TEXT,
    fit TEXT,
    colours TEXT[],
    sizes TEXT[],
    occasions TEXT[],
    made_to_order BOOLEAN,
    lead_time_days INTEGER,
    description TEXT,
    in_stock BOOLEAN
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        p.id,
        p.name,
        c.name AS category,
        p.price_gbp,
        p.image_url,
        f.name AS fabric,
        ft.name AS fit,

        ARRAY(
            SELECT DISTINCT co.name
            FROM public.product_colours pc
            JOIN public.colours co ON co.id = pc.colour_id
            WHERE pc.product_id = p.id
            ORDER BY co.name
        ) AS colours,

        ARRAY(
            SELECT DISTINCT s.name
            FROM public.product_sizes ps
            JOIN public.sizes s ON s.id = ps.size_id
            WHERE ps.product_id = p.id
            ORDER BY s.name
        ) AS sizes,

        ARRAY(
            SELECT DISTINCT o.name
            FROM public.product_occasions po
            JOIN public.occasions o ON o.id = po.occasion_id
            WHERE po.product_id = p.id
            ORDER BY o.name
        ) AS occasions,

        p.made_to_order,
        p.lead_time_days,
        p.description,
        p.in_stock

    FROM public.products p
    JOIN public.categories c
        ON c.id = p.category_id
    JOIN public.fabrics f
        ON f.id = p.fabric_id
    LEFT JOIN public.fits ft
        ON ft.id = p.fit_id

    WHERE
        p.made_to_order = TRUE
        AND p.price_gbp >= p_min_gbp
        AND p.price_gbp <= p_max_gbp
        AND (
            COALESCE(cardinality(p_occasion_ids), 0) = 0
            OR EXISTS (
                SELECT 1
                FROM public.product_occasions po
                WHERE po.product_id = p.id
                  AND po.occasion_id = ANY(p_occasion_ids)
            )
        )
        AND (
            COALESCE(cardinality(p_size_ids), 0) = 0
            OR EXISTS (
                SELECT 1
                FROM public.product_sizes ps
                WHERE ps.product_id = p.id
                  AND ps.size_id = ANY(p_size_ids)
            )
        )
    ORDER BY p.price_gbp ASC, p.id ASC;
$$;