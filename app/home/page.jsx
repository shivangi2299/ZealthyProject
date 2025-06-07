"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");

  useEffect(() => {
    const queryName = searchParams.get("name");
    setName(queryName || "");
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to Zealthy</h1>
        {name && (
          <p className="text-xl text-gray-600">Hello, {name}! 🎉</p>
        )}
      </div>
    </div>
  );
}
