"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DoctorLoginContent() {
  const searchParams = useSearchParams();

  return (
    <div>
      {/* Your existing Doctor Login UI goes here */}
    </div>
  );
}

export default function DoctorLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DoctorLoginContent />
    </Suspense>
  );
}