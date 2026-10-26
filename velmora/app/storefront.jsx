'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import DeliveryStrip from '@/components/DeliveryStrip';
import OccasionCard from '@/components/OccasionCard';
import PieceCard from '@/components/PieceCard';
import ProductGallery from '@/components/ProductGallery';
import { FACTS, OCCASIONS, STATUS } from '@/data/catalog';
import { useApp } from '@/lib/AppContext';
import { createClient } from '@/utils/supabase/client';
import ClientProviders from './product/client-providers';

const PRODUCTS_PAGE_SIZE = 20;
const COLOUR_SWATCHES = {
  champagne: '#D8C7A9',
  emerald: '#255045',
  ivory: '#F1EAE0',
  oxblood: '#6B1F2A',
  stone: '#CFC6BA',
};

const productQuery = `
  id,
  name,
  price_gbp,
  description,
  made_to_order,
  in_stock,
  fabrics(name),
  fits(name),
  product_colours(colours(name)),
  product_sizes(sizes(name))
`;

function mapProduct(product) {
  const colours = (product.product_colours || []).map(({ colours: colour }) => ({
    name: colour.name,
    hex: COLOUR_SWATCHES[colour.name.toLowerCase()] || '#CFC6BA',
  }));
  const sizes = (product.product_sizes || []).map(({ sizes: size }) => size.name);

  return {
    slug: product.id,
    name: product.name,
    image: product.image,
    price: Number(product.price_gbp),
    fabric: product.fabrics?.name || 'Unknown fabric',
    fit: product.fits?.name || 'Relaxed',
    status: product.made_to_order ? 'made_to_order' : 'in_stock',
    colours: colours.length ? colours : [{ name: 'Stone', hex: '#CFC6BA' }],
    sizes,
    detail: product.description,
  };
}

function CollectionPage() {
  const [products, setProducts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPage = useCallback(async (cursor = null, replace = false) => {
    setLoading(true);
    setError('');

    let query = createClient()
      .from('products')
      .select(productQuery)
      .order('id', { ascending: true })
      .limit(PRODUCTS_PAGE_SIZE + 1);

    if (cursor) {
      query = query.gt('id', cursor);
    }

    const { data, error: queryError } = await query;

    if (queryError) {
      setLoading(false);
      setError(queryError.message);
      return;
    }

    const page = (data || []).map(mapProduct);
    const hasMore = page.length > PRODUCTS_PAGE_SIZE;
    const visibleProducts = hasMore ? page.slice(0, PRODUCTS_PAGE_SIZE) : page;

    setProducts((current) => (replace ? visibleProducts : [...current, ...visibleProducts]));
    setNextCursor(hasMore ? visibleProducts[visibleProducts.length - 1].slug : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => loadPage(null, true));
  }, [loadPage]);

  return (
    <>
      <section className="mx-auto max-w-[120rem] px-6 py-20 md:px-[4vw] md:py-28">
        <p className="eyebrow text-oxblood">Velmora / The collection</p>
        <div className="mt-5 flex max-w-3xl flex-col gap-6">
          <h1 className="font-heading text-5xl font-light leading-none md:text-7xl">
            Evening wear, made to order.
          </h1>
          <p className="max-w-xl leading-relaxed text-ink/75">
            Explore the collection of dresses designed in London and made in small quantities.
            Choose a piece to see its details, colours, and available sizes.
          </p>
        </div>
      </section>
      <DeliveryStrip />
      <section className="mx-auto max-w-[120rem] px-6 py-16 md:px-[4vw] md:py-24">
        {error && (
          <div className="mb-8 border border-oxblood/30 bg-oxblood/5 px-5 py-4 text-sm">
            <p>We couldn&apos;t load the collection.</p>
            <p className="mt-1 text-ink/70">{error}</p>
            <button
              type="button"
              onClick={() => loadPage(null, true)}
              className="mt-3 text-xs uppercase tracking-[0.2em] text-oxblood underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}
        {loading && products.length === 0 && (
          <p className="text-sm text-ink/70">Loading the collection...</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-sm text-ink/70">No pieces are available yet.</p>
        )}
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((piece) => (
            <PieceCard key={piece.slug} piece={piece} />
          ))}
        </div>
        {nextCursor && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={() => loadPage(nextCursor)}
              disabled={loading}
              className="border border-oxblood px-6 py-4 text-xs uppercase tracking-[0.2em] text-oxblood transition-colors hover:bg-oxblood hover:text-ivory disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function OccasionPage({ slug }) {
  const [occasion, setOccasion] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOccasion = useCallback(async () => {
    setLoading(true);
    setError('');

    const client = createClient();
    const { data: occasionData, error: occasionError } = await client
      .from('occasions')
      .select('id,name')
      .eq('id', slug)
      .maybeSingle();

    if (occasionError) {
      setError(occasionError.message);
      setLoading(false);
      return;
    }

    if (!occasionData) {
      setError('This occasion could not be found.');
      setLoading(false);
      return;
    }

    const { data: productData, error: productsError } = await client
      .from('products')
      .select(`${productQuery}, product_occasions!inner(occasion_id)`)
      .eq('product_occasions.occasion_id', slug)
      .order('id', { ascending: true });

    if (productsError) {
      setError(productsError.message);
      setLoading(false);
      return;
    }

    setOccasion(occasionData);
    setPieces((productData || []).map(mapProduct));
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    queueMicrotask(loadOccasion);
  }, [loadOccasion]);

  const title = occasion?.name || 'Occasion';

  return (
    <>
      <section className="mx-auto max-w-[120rem] px-6 py-20 md:px-[4vw] md:py-28">
        <Link
          href="/#collection"
          className="text-xs uppercase tracking-[0.18em] text-ink/70 underline decoration-stone underline-offset-4 hover:text-oxblood"
        >
          All occasions
        </Link>
        <div className="mt-8">
          <p className="eyebrow text-oxblood">Velmora / Occasion</p>
          <h1 className="mt-4 font-heading text-5xl font-light leading-none md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-ink/75">
            Pieces selected for {title.toLowerCase()}.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[120rem] px-6 pb-20 md:px-[4vw] md:pb-28">
        {error && (
          <div className="border border-oxblood/30 bg-oxblood/5 px-5 py-4 text-sm">
            <p>We couldn&apos;t load this occasion.</p>
            <p className="mt-1 text-ink/70">{error}</p>
            <button
              type="button"
              onClick={loadOccasion}
              className="mt-3 text-xs uppercase tracking-[0.2em] text-oxblood underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}
        {loading && <p className="text-sm text-ink/70">Loading pieces...</p>}
        {!loading && !error && pieces.length === 0 ? (
          <p className="text-sm text-ink/70">No pieces are available for this occasion yet.</p>
        ) : !loading && !error ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {pieces.map((piece) => (
              <PieceCard key={piece.slug} piece={piece} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}

function ProductPage({ slug }) {
  const { addToBag, setBagOpen } = useApp();
  const [piece, setPiece] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState(0);
  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [added, setAdded] = useState(false);
  const [popularPieces, setPopularPieces] = useState([]);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error: queryError } = await createClient()
      .from('products')
      .select(productQuery)
      .eq('id', slug)
      .maybeSingle();

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setError('This product could not be found.');
      setLoading(false);
      return;
    }

    const nextPiece = mapProduct(data);
    setPiece(nextPiece);
    setColour(nextPiece.colours[0].name);
    setSize('');
    setAdded(false);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    queueMicrotask(loadProduct);
  }, [loadProduct]);

  useEffect(() => {
    let active = true;

    async function loadPopularPieces() {
      const client = createClient();
      const { data: popularRows, error: popularError } = await client
        .from('popular')
        .select('product_id,sort_order')
        .order('sort_order', { ascending: true })
        .limit(4);

      if (popularError || !popularRows?.length) {
        return;
      }

      const { data: products, error: productsError } = await client
        .from('products')
        .select(productQuery)
        .in('id', popularRows.map(({ product_id: productId }) => productId));

      if (productsError || !active) {
        return;
      }

      const productsById = new Map((products || []).map((product) => [product.id, product]));
      setPopularPieces(
        popularRows
          .map(({ product_id: productId }) => productsById.get(productId))
          .filter((product) => product && product.id !== slug)
          .slice(0, 3)
          .map(mapProduct),
      );
    }

    loadPopularPieces();

    return () => {
      active = false;
    };
  }, [slug]);

  const handleAddToBag = () => {
    if (!piece || !size) return;

    addToBag({
      slug: piece.slug,
      name: piece.name,
      price: piece.price,
      status: piece.status,
      colour,
      size,
    });
    setAdded(true);
  };

  if (loading) {
    return <p className="mx-auto max-w-[120rem] px-6 py-20 text-sm text-ink/70 md:px-[4vw]">Loading product...</p>;
  }

  if (error || !piece) {
    return (
      <div className="mx-auto max-w-[120rem] px-6 py-20 md:px-[4vw]">
        <div className="border border-oxblood/30 bg-oxblood/5 px-5 py-4 text-sm">
          <p>We couldn&apos;t load this product.</p>
          <p className="mt-1 text-ink/70">{error || 'This product could not be found.'}</p>
          <button
            type="button"
            onClick={loadProduct}
            className="mt-3 text-xs uppercase tracking-[0.2em] text-oxblood underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[120rem] px-6 py-8 md:px-[4vw] md:py-12">
        <Link
          href="/product"
          className="text-xs uppercase tracking-[0.18em] text-ink/70 underline decoration-stone underline-offset-4 hover:text-oxblood"
        >
          All pieces
        </Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:gap-20">
          <ProductGallery slug={piece.slug} view={view} onView={setView} />
          <div className="lg:py-6">
            <p className="eyebrow text-oxblood">{piece.fabric}, {piece.fit}</p>
            <h1 className="mt-4 font-heading text-5xl font-light leading-none md:text-6xl">
              {piece.name}
            </h1>
            <p className="mt-5 text-lg">£{piece.price}</p>
            <p className="mt-6 max-w-lg leading-relaxed text-ink/75">{piece.detail}</p>
            <p className="eyebrow mt-6 text-ink/70">{STATUS[piece.status].label}</p>

            <div className="mt-10 border-t border-stone/70 pt-8">
              <fieldset>
                <legend className="eyebrow">Colour: {colour}</legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {piece.colours.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setColour(option.name)}
                      aria-label={`Choose ${option.name}`}
                      aria-pressed={colour === option.name}
                      className={`h-10 w-10 rounded-full border-2 p-1 ${
                        colour === option.name ? 'border-oxblood' : 'border-transparent'
                      }`}
                    >
                      <span
                        className="block h-full w-full rounded-full border border-ink/15"
                        style={{ backgroundColor: option.hex }}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="eyebrow mt-8 block" htmlFor="size">
                Size
              </label>
              <select
                id="size"
                value={size}
                onChange={(event) => {
                  setSize(event.target.value);
                  setAdded(false);
                }}
                className="mt-3 h-12 w-full border border-stone bg-ivory px-4 text-sm"
              >
                <option value="">Select a size</option>
                {piece.sizes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddToBag}
                disabled={!size}
                className="mt-5 w-full border border-oxblood bg-oxblood px-6 py-4 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:border-stone disabled:bg-stone disabled:text-ink/60"
              >
                {added ? 'Added to bag' : 'Add to bag'}
              </button>
              {added && (
                <button
                  type="button"
                  onClick={() => setBagOpen(true)}
                  className="mt-3 w-full py-3 text-xs uppercase tracking-[0.2em] text-oxblood underline underline-offset-4"
                >
                  View bag
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <section className="border-y border-stone/70 bg-stone/20">
        <div className="mx-auto max-w-[120rem] px-6 py-12 md:px-[4vw]">
          <p className="eyebrow text-ink/70">You may also like</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {popularPieces.map((item) => (
              <PieceCard key={item.slug} piece={item} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function HomePage() {
  const [occasions, setOccasions] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [visibleOccasions, setVisibleOccasions] = useState(4);
  const [occasionsLoading, setOccasionsLoading] = useState(true);
  const [occasionsError, setOccasionsError] = useState('');
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState('');

  const loadOccasions = useCallback(async () => {
    setOccasionsLoading(true);
    setOccasionsError('');

    const { data, error } = await createClient()
      .from('occasions')
      .select('id,name,image')
      .order('id', { ascending: true });

    if (error) {
      setOccasionsError(error.message);
      setOccasionsLoading(false);
      return;
    }

    setOccasions(
      (data || []).map((occasion) => ({
        ...occasion,
        count: OCCASIONS.find((item) => item.id === occasion.id)?.count ?? 0,
      })),
    );
    setOccasionsLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(loadOccasions);
  }, [loadOccasions]);

  const loadPopularProducts = useCallback(async () => {
    setPopularLoading(true);
    setPopularError('');

    const client = createClient();
    const { data: popular, error: popularQueryError } = await client
      .from('popular')
      .select('product_id,sort_order')
      .order('sort_order', { ascending: true });

    if (popularQueryError) {
      setPopularError(popularQueryError.message);
      setPopularLoading(false);
      return;
    }

    const popularRows = popular || [];
    if (popularRows.length === 0) {
      setPopularProducts([]);
      setPopularLoading(false);
      return;
    }

    const productIds = popularRows.map(({ product_id: productId }) => productId);
    const { data: products, error: productsQueryError } = await client
      .from('products')
      .select(productQuery)
      .in('id', productIds);

    if (productsQueryError) {
      setPopularError(productsQueryError.message);
      setPopularLoading(false);
      return;
    }

    const productsById = new Map((products || []).map((product) => [product.id, product]));
    setPopularProducts(
      popularRows
        .map(({ product_id: productId }) => productsById.get(productId))
        .filter(Boolean)
        .map(mapProduct),
    );
    setPopularLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(loadPopularProducts);
  }, [loadPopularProducts]);

  return (
    <>
      <section className="mx-auto grid max-w-[120rem] gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-[4vw] md:py-32">
        <div className="flex flex-col justify-center">
          <p className="eyebrow text-oxblood">Velmora / London</p>
          <h1 className="mt-5 max-w-3xl font-heading text-6xl font-light leading-[0.9] md:text-8xl">
            Evening wear, made to order.
          </h1>
          <p className="mt-8 max-w-lg leading-relaxed text-ink/75">
            A considered collection of {FACTS.collectionSize} pieces for the nights worth dressing
            for. Designed in London, made for you.
          </p>
          <Link
            href="/#collection"
            className="mt-10 w-fit border border-oxblood px-6 py-4 text-xs uppercase tracking-[0.2em] text-oxblood transition-colors hover:bg-oxblood hover:text-ivory"
          >
            View the collection
          </Link>
        </div>
        <div className="min-h-[28rem] bg-[url('https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center md:min-h-[38rem]" />
      </section>
      <DeliveryStrip />

      <section id="collection" className="scroll-mt-24">
        <div className="mx-auto max-w-[120rem] px-6 py-16 md:px-[4vw] md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-heading text-3xl font-light md:text-5xl">Shop by occasion</h2>
            <p className="max-w-sm text-sm leading-relaxed text-ink/75">
              Routes through the {FACTS.collectionSize}-piece collection. Choose one and the
              stylist starts there.
            </p>
          </div>
          {occasionsError && (
            <div className="mt-8 border border-oxblood/30 bg-oxblood/5 px-5 py-4 text-sm">
              <p>We couldn&apos;t load the occasions.</p>
              <p className="mt-1 text-ink/70">{occasionsError}</p>
              <button
                type="button"
                onClick={loadOccasions}
                className="mt-3 text-xs uppercase tracking-[0.2em] text-oxblood underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}
          {occasionsLoading && occasions.length === 0 && (
            <p className="mt-12 text-sm text-ink/70">Loading occasions...</p>
          )}
          {!occasionsLoading && !occasionsError && occasions.length === 0 && (
            <p className="mt-12 text-sm text-ink/70">No occasions are available yet.</p>
          )}
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {occasions.slice(0, visibleOccasions).map((occasion) => (
              <OccasionCard
                key={occasion.id}
                occasion={occasion}
              />
            ))}
          </div>
          {visibleOccasions < occasions.length && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleOccasions((current) => current + 4)}
                className="border border-oxblood px-6 py-4 text-xs uppercase tracking-[0.2em] text-oxblood transition-colors hover:bg-oxblood hover:text-ivory"
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="scroll-mt-24 mx-auto max-w-[120rem] px-6 py-20 md:px-[4vw] md:py-28">
        <p className="eyebrow text-ink/70">The collection</p>
        <h2 className="mt-3 font-heading text-4xl font-light md:text-5xl">The pieces</h2>
        {popularError && (
          <div className="mt-8 border border-oxblood/30 bg-oxblood/5 px-5 py-4 text-sm">
            <p>We couldn&apos;t load the popular pieces.</p>
            <p className="mt-1 text-ink/70">{popularError}</p>
            <button
              type="button"
              onClick={loadPopularProducts}
              className="mt-3 text-xs uppercase tracking-[0.2em] text-oxblood underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}
        {popularLoading && popularProducts.length === 0 && (
          <p className="mt-10 text-sm text-ink/70">Loading popular pieces...</p>
        )}
        {!popularLoading && !popularError && popularProducts.length === 0 && (
          <p className="mt-10 text-sm text-ink/70">No popular pieces are available yet.</p>
        )}
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {popularProducts.map((piece) => (
            <PieceCard key={piece.slug} piece={piece} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link
            href="/product"
            className="bg-black text-white hover:bg-white hover:text-black mt-10 block w-fit border border-ink bg-ink px-6 py-4 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-ink hover:bg-ivory hover:text-ink"
          >
            View the all the pieces
          </Link>  
        </div>
      </section>
    </>
  );
}

/** @param {{ productSlug?: string; occasionSlug?: string; home?: boolean }} props */
export default function Storefront({ productSlug, occasionSlug, home = false }) {
  return (
    <ClientProviders>
      {home ? (
        <HomePage />
      ) : productSlug ? (
        <ProductPage slug={productSlug} />
      ) : occasionSlug ? (
        <OccasionPage slug={occasionSlug} />
      ) : (
        <CollectionPage />
      )}
    </ClientProviders>
  );
}
