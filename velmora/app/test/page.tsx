import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

async function CategoriesAndOccasions() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { data: categories, error: categoriesError },
    { data: occasions, error: occasionsError },
  ] = await Promise.all([
    supabase.from("categories").select("id,name"),
    supabase.from("occasions").select("id,name"),
  ]);

  if (categoriesError) {
    throw categoriesError;
  }

  if (occasionsError) {
    throw occasionsError;
  }

  return (
    <>
      <h2 className="text-xl font-bold">Categories</h2>
      <ul>
        {categories?.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
      <h2 className="text-xl font-bold">Occasions</h2>
      <ul>
        {occasions?.map((occasion) => (
          <li key={occasion.id}>{occasion.name}</li>
        ))}
      </ul>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading categories and occasions...</p>}>
      <CategoriesAndOccasions />
    </Suspense>
  );
}
