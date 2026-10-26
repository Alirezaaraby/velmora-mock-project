import Storefront from '../../storefront';

export const instant = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Storefront occasionSlug={slug} />;
}
