import Storefront from '../../storefront';
// import { OCCASIONS } from '@/data/catalog';

// export function generateStaticParams() {
//   return OCCASIONS.map(({ id }) => ({ slug: id }));
// }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Storefront occasionSlug={slug} />;
}
