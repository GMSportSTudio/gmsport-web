"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminGate } from "./components/AdminAuth";
import { InviteForm } from "./components/InviteForm";
import { InvitationRow, type Invitation } from "./components/InvitationRow";

function InvitacionesTable() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading]         = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(
      query(collection(db, "invitations"), orderBy("created_at", "desc"), limit(100))
    );
    setInvitations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Invitation)));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const active   = invitations.filter(i => !i.revoked && i.expires_at.seconds > Date.now() / 1000);
  const used     = invitations.filter(i => i.downloads?.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", padding: "48px 32px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "#e8eaf0", fontSize: 24, fontWeight: 800, margin: 0 }}>
              GMSport<span style={{ color: "#ff6b1a" }}>Studio</span>
              <span style={{ color: "#555d6e", fontSize: 16, fontWeight: 400, marginLeft: 12 }}>/ Admin / Invitaciones</span>
            </h1>
            <p style={{ color: "#555d6e", fontSize: 13, margin: "6px 0 0" }}>
              {invitations.length} total · {active.length} activas · {used.length} con descargas
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
            ) : invitations.length === 0 ? (
              <p style={{ color: "#555d6e", padding: 24, textAlign: "center" }}>Sin invitaciones todavía.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #23272f" }}>
                    {["Email", "Invitado", "Expira", "Descargas", "Última IP", "Plataforma", "Estado", ""].map(h => (
                      <th key={h} style={{ padding: "10px 16px", color: "#555d6e", fontSize: 11, fontWeight: 600, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invitations.map(inv => (
                    <InvitationRow key={inv.id} inv={inv} onChanged={load} />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Form */}
          <InviteForm onInvited={load} />
        </div>
      </div>
    </div>
  );
}

export default function AdminInvitacionesPage() {
  return (
    <AdminGate>
      <InvitacionesTable />
    </AdminGate>
  );
}
