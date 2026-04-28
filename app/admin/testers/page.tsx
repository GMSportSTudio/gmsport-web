"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, where, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminGate } from "../invitaciones/components/AdminAuth";
import { InviteTesterForm } from "./components/InviteTesterForm";
import { TesterRow, type BetaTesterDoc } from "./components/TesterRow";

// Polling: cada 30s recargamos la tabla. Útil durante el lanzamiento Beta
// para ver quién se va registrando (pasa de "Sin registrar" → "Activo")
// sin tener que pulsar manualmente "Actualizar".
const POLL_INTERVAL_MS = 30_000;

function TestersTable() {
  const [testers, setTesters] = useState<BetaTesterDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // ── Query 1: licenses con planTier=beta_tester (testers ya registrados)
      let licDocs: BetaTesterDoc[] = [];
      try {
        const q = query(
          collection(db, "licenses"),
          where("planTier", "==", "beta_tester"),
          orderBy("invitedAt", "desc"),
          limit(200),
        );
        const snap = await getDocs(q);
        licDocs = snap.docs.map(d => ({ id: d.id, _origin: "license", ...d.data() } as BetaTesterDoc));
      } catch {
        // Index compuesto (planTier+invitedAt) puede no existir → fallback sin orderBy.
        const fallback = query(
          collection(db, "licenses"),
          where("planTier", "==", "beta_tester"),
          limit(200),
        );
        const snap = await getDocs(fallback);
        licDocs = snap.docs.map(d => ({ id: d.id, _origin: "license", ...d.data() } as BetaTesterDoc));
      }

      // ── Query 2: invitations source=beta_tester_invite (incluye los aún
      // no registrados — los "pendientes de registro"). pendingInvites NO
      // se consulta porque solo guarda el hash del email (no el plano), y
      // queremos mostrar el correo legible al admin.
      let invDocs: BetaTesterDoc[] = [];
      try {
        const qInv = query(
          collection(db, "invitations"),
          where("source", "==", "beta_tester_invite"),
          orderBy("created_at", "desc"),
          limit(300),
        );
        const snap = await getDocs(qInv);
        // Mapear shape invitation → BetaTesterDoc para reusar la fila.
        // Nota: el script de batch (founder_batch) marca created_by="founder_batch_..."
        // y source="beta_tester_invite". El CF inviteBetaTester marca igual.
        invDocs = snap.docs
          .filter(d => !d.data().revoked)
          .map(d => {
            const x = d.data();
            return {
              id: d.id,
              email: x.email,
              planTier: "beta_tester",
              planStatus: "pending_registration",
              isBetaTester: true,
              source: x.source || "beta_tester_invite",
              invitedBy: x.created_by || "—",
              invitedAt: x.created_at,
              activeUntil: x.beta_license_until,
              _origin: "invitation",
            } as BetaTesterDoc;
          });
      } catch (errInv) {
        console.warn("Listado de invitations falló (sin index):", errInv);
      }

      // ── Merge: para cada email solo dejamos UNA fila. Si tiene licencia
      // (registrado), gana la de licenses (estado real). Si no, se queda
      // la de invitations como "pendiente".
      const byEmail = new Map<string, BetaTesterDoc>();
      // Primero las invitaciones (pendientes), luego sobreescribimos con
      // licencias si existen → el admin ve siempre el estado más avanzado.
      for (const t of invDocs) {
        const k = (t.email || t.id).toLowerCase();
        byEmail.set(k, t);
      }
      for (const t of licDocs) {
        const k = (t.email || t.id).toLowerCase();
        byEmail.set(k, t);
      }
      const merged = Array.from(byEmail.values()).sort((a, b) => {
        const ta = a.invitedAt?.seconds || 0;
        const tb = b.invitedAt?.seconds || 0;
        return tb - ta;
      });
      setTesters(merged);
      setLastSync(new Date());
    } catch (e) {
      console.error("Listado testers falló:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  const active   = testers.filter(t => t.planStatus === "active");
  const pending  = testers.filter(t => t.planStatus === "pending_registration");
  const expired  = testers.filter(t =>
    t.planStatus !== "active" && t.planStatus !== "pending_registration"
  );

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
              {testers.length} total · <strong style={{ color: "#4ade80" }}>{active.length} registrados</strong>
              {" · "}<strong style={{ color: "#ff6b1a" }}>{pending.length} sin registrar</strong>
              {expired.length > 0 ? ` · ${expired.length} caducados/revocados` : ""}
              {lastSync && (
                <span style={{ color: "#3a3f50", marginLeft: 12, fontSize: 11 }}>
                  · sync {lastSync.toLocaleTimeString("es-ES")} (auto cada 30s)
                </span>
              )}
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
