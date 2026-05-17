"use client";

import { AdminGate } from "../_shared/AdminAuth";
import { GrantsPanel } from "./components/GrantsPanel";

export default function AdminGrantsPage() {
  return (
    <AdminGate>
      <GrantsPanel />
    </AdminGate>
  );
}
