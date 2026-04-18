import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Información sobre el uso de cookies y tecnologías similares en GmSportStudio.",
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: "1. ¿Qué son las cookies?",
    content: (
      <p>
        Las cookies son pequeños archivos de texto que un sitio web deposita en el navegador del usuario. Existen también tecnologías similares como el almacenamiento local (<em>localStorage</em>) o el almacenamiento de sesión (<em>sessionStorage</em>), que funcionan de manera análoga pero no envían datos al servidor de forma automática.
      </p>
    ),
  },
  {
    title: "2. Cookies y tecnologías que utilizamos",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-white/70 font-semibold mb-1">Analítica web — Vercel Analytics</p>
          <p>
            Utilizamos Vercel Analytics para medir el tráfico y el comportamiento de los usuarios en el Sitio. Vercel Analytics es <strong className="text-white/70">cookieless by design</strong>: no instala ninguna cookie en tu navegador ni recopila datos personales identificables. Los datos son agregados y anónimos. Por este motivo, no se requiere consentimiento para su uso conforme a la normativa ePrivacy.
          </p>
        </div>
        <div>
          <p className="text-white/70 font-semibold mb-1">Autenticación — Firebase (localStorage)</p>
          <p>
            La Aplicación utiliza Google Firebase para la autenticación. Firebase almacena el token de sesión en el <strong className="text-white/70">localStorage</strong> del navegador, no en cookies. Este almacenamiento es estrictamente necesario para mantener tu sesión activa y no puede desactivarse sin afectar al funcionamiento del servicio.
          </p>
        </div>
        <div>
          <p className="text-white/70 font-semibold mb-1">Pasarela de pago — Stripe / Ko-fi</p>
          <p>
            Cuando accedes al proceso de pago, Stripe y/o Ko-fi pueden instalar sus propias cookies para prevenir el fraude y garantizar la seguridad de la transacción. Estas cookies son gestionadas íntegramente por dichos proveedores y se rigen por sus propias políticas de privacidad.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "3. Clasificación de las tecnologías utilizadas",
    content: (
      <div className="overflow-x-auto">
        <table className="w-full text-xs mt-1 border-collapse">
          <thead>
            <tr className="text-white/50 border-b border-white/10">
              <th className="text-left py-2 pr-4 font-semibold">Tecnología</th>
              <th className="text-left py-2 pr-4 font-semibold">Tipo</th>
              <th className="text-left py-2 font-semibold">Duración</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-2 pr-4 text-white/60">Vercel Analytics</td>
              <td className="py-2 pr-4">Sin cookies (cookieless)</td>
              <td className="py-2">—</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-white/60">Firebase Auth (localStorage)</td>
              <td className="py-2 pr-4">Técnica / Necesaria</td>
              <td className="py-2">Sesión / Persistente</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-white/60">Stripe</td>
              <td className="py-2 pr-4">Seguridad / Anti-fraude</td>
              <td className="py-2">Sesión</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-white/60">Ko-fi</td>
              <td className="py-2 pr-4">Seguridad / Anti-fraude</td>
              <td className="py-2">Sesión</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    title: "4. Base jurídica",
    content: (
      <p>
        Las tecnologías estrictamente necesarias (Firebase Auth localStorage) no requieren consentimiento conforme al Art. 22.2 de la LSSI-CE y la Directiva ePrivacy, ya que son imprescindibles para el funcionamiento del servicio solicitado por el usuario. La analítica de Vercel no requiere consentimiento al ser completamente cookieless y no tratar datos personales. Las cookies de terceros (Stripe, Ko-fi) están vinculadas a una transacción iniciada por el propio usuario.
      </p>
    ),
  },
  {
    title: "5. Cómo gestionar o eliminar el almacenamiento local",
    content: (
      <>
        <p>Puedes eliminar el localStorage de Firebase en cualquier momento desde tu navegador:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><span className="text-white/70">Chrome / Edge:</span> Configuración → Privacidad → Borrar datos de navegación → Almacenamiento local.</li>
          <li><span className="text-white/70">Firefox:</span> Opciones → Privacidad y seguridad → Datos del sitio → Gestionar datos.</li>
          <li><span className="text-white/70">Safari:</span> Preferencias → Privacidad → Gestionar datos del sitio web.</li>
        </ul>
        <p className="mt-2 text-white/40 text-xs">
          Ten en cuenta que eliminar el localStorage cerrará tu sesión en la Aplicación.
        </p>
      </>
    ),
  },
  {
    title: "6. Cambios en esta política",
    content: (
      <p>
        Podemos actualizar esta Política de Cookies si incorporamos nuevas tecnologías o cambia la normativa aplicable. Te notificaremos cualquier cambio relevante a través del Sitio o por correo electrónico.
      </p>
    ),
  },
  {
    title: "7. Contacto",
    content: (
      <p>
        Si tienes preguntas sobre el uso de cookies o tecnologías similares, puedes contactarnos en <span className="text-white/70">info@gmsportstudio.com</span>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de Cookies"
      subtitle="Privacidad & Tecnología"
      updated="18 de abril de 2026"
      sections={sections}
    />
  );
}
