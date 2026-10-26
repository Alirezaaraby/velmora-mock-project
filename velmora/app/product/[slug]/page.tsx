import Storefront from '../../storefront';
import { PIECES } from '@/data/catalog';

export function generateStaticParams() {
  return PIECES.map(({ slug }) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Storefront productSlug={slug} />;
}
