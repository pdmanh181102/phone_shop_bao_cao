// app/(main)/receipts/create/page.tsx
import LoadingScreen from "@component/loading_screen";
import { Suspense } from "react";
import ReceiptPage from "./_component/page_component";

export default function CreateReceiptPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ReceiptPage />
    </Suspense>
  );
}
