import { Suspense } from "react";
import WelcomeClient from "@/components/WelcomeClient";

export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-blue-600">Loading...</p>}>
      <WelcomeClient />
    </Suspense>
  );
}
