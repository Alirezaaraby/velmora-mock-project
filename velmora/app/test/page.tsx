"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [occasions, setOccasions] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const [
        { data: categoryData, error: categoriesError },
        { data: occasionData, error: occasionsError },
      ] = await Promise.all([
        supabase.from("categories").select("id,name"),
        supabase.from("occasions").select("id,name"),
      ]);

      const queryError = categoriesError || occasionsError;
      if (queryError) {
        setError(queryError.message);
        return;
      }

      setCategories(categoryData || []);
      setOccasions(occasionData || []);
    };

    void loadData();
  }, []);

  return (
    <>
      {error && <p>{error}</p>}
      <h2 className="text-xl font-bold">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
      <h2 className="text-xl font-bold">Occasions</h2>
      <ul>
        {occasions.map((occasion) => (
          <li key={occasion.id}>{occasion.name}</li>
        ))}
      </ul>
    </>
  );
}
