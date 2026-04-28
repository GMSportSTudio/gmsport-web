"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, where, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminGate } from "../invitaciones/components/AdminAuth";
import { InviteTesterForm } from "./components/InviteTesterForm";
import { TesterRow, type BetaTesterDoc } from "./components/TesterRow";

function TestersTable() {
  const [testers, setTesters] = useState<BetaTesterDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "licenses"),
        where("planTier", "==", "beta_tester"),
        orderBy("invitedAt", "desc"),
        limit(200),
      );
      const snap = await getDocs(q);
      setTesters(snap.docs.map(d => ({ id: d.id, ...d.data() } as BetaTesterDoc)));
    } catch (err: unknown) {
      // Si el index compuesto (planTier + invitedAt) no existe todavía,
      // caemos a una query simple por planTier sin orderBy.
      try {
        const fallback = query(
          collection(db, "licenses"),
          where("planTier", "==", "beta_tester"),
          limit(200),
        );
        const snap = await getDocs(fallback);
        setTesters(snap.docs.map(d => ({ id: d.id, ...d.data() } as BetaTesterDoc)));
      } catch (e2) {
        console.error("Listado testers falló:", e2);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const active   = testers.filter(t => t.planStatus === "active");
  const expired  = testers.filter(t => t.planStatus !== "active");

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", padding: "48px 32px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "#e8eaf0", fontSize: 24, fontWeight: 800, margin: 0 }}>
              GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
              <span style={{ color: "#555d6e", fontSize: 16, fontWeight: 400, marginLeft: 12 }}>/ Admin / Beta Testers</span>
            </h1>
            <p style={{ color: "#555d6e", fontSize: 13, margin: "6px 0 0" }}>
              {testers.length} total · {active.length} activos · {expired.length} caducados/revocados
            </p>
          </div>
          <button onClick={load} style={{ background: "transparent", border: "1px solid #2a2f3a", borderRadius: 8, padding: "8px 16px", color: "#9095a0", fontSize: 13, cursor: "pointer" }}>
            ↻ Actualizar
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* Tabla */}
          <div style={{ background: "#161920", border: "1px solid #23272f", borderRadius: 12, overflow: "hidden" }}>
            {loading ? (
              <p style={{ color: "#555d6e", padding: 24, textAlign: "center" }}>Cargando…</p>
            ) : testers.length === 0 ? (
              <p style={{ color: "#555d6e", padding: 24, textAlign: "center" }}>
                Sin testers Beta todavía. Invita al primero con el formulario de la derecha →
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #23272f" }}>
                    {["Email", "Invitado", "Acceso hasta", "Estado", "Origen", ""].map(h => (
                      <th key={h} style={{ padding: "10px 16px", color: "#555d6e", fontSize: 11, fontWeight: 600, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {testers.map(t => (
                    <TesterRow key={t.id} tester={t} onChanged={load} />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Form */}
          <InviteTesterForm onInvited={load} />
        </div>

        <p style={{ color: "#555d6e", fontSize: 12, marginTop: 24, textAlign: "center" }}>
          Listado limitado a los 200 últimos. La fecha "Invitado" se ordena del más reciente al más antiguo.
        </p>
      </div>
    </div>
  );
}

export default function AdminTestersPage() {
  return (
    <AdminGate>
      <TestersTable />
    </AdminGate>
  );
}
