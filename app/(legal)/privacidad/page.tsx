import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo GmSportStudio recoge, usa y protege tus datos personales.",
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: "1. Responsable del tratamiento",
    content: (
      <div className="space-y-1">
        <p><span className="text-white/70">Responsable:</span> José Carlos Galán Moscoso</p>
        <p><span className="text-white/70">NIF:</span> 44965596K</p>
        <p><span className="text-white/70">Domicilio:</span> Calle Playa de Bolonia 31, 11406 Jerez de la Frontera, Cádiz, España</p>
        <p><span className="text-white/70">Contacto:</span> info@gmsportstudio.com</p>
      </div>
    ),
  },
  {
    title: "2. Datos que recogemos",
    content: (
      <>
        <p>En el marco de la Beta, recogemos los siguientes datos personales que el usuario nos proporciona voluntariamente a través del formulario de registro:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Nombre y apellidos</li>
          <li>Club o entidad deportiva</li>
          <li>Número de teléfono</li>
          <li>Dispositivo (sistema operativo y versión)</li>
          <li>Correo electrónico (a través de Google Forms)</li>
        </ul>
        <p className="mt-2">
          Adicionalmente, cuando el usuario realiza un pago, los procesadores de pago (Stripe / Ko-fi) tratan los datos financieros conforme a sus propias políticas. GmSportStudio no almacena datos de tarjetas bancarias.
        </p>
      </>
    ),
  },
  {
    title: "3. Finalidad y base jurídica del tratamiento",
    content: (
      <div className="space-y-3">
        <div>
          <p className="text-white/70 font-semibold mb-1">Gestión del acceso a la Beta</p>
          <p>Base jurídica: ejecución de un contrato (Art. 6.1.b RGPD). Necesario para provisionar tu acceso a la Aplicación.</p>
        </div>
        <div>
          <p className="text-white/70 font-semibold mb-1">Comunicaciones sobre el producto</p>
          <p>Base jurídica: interés legítimo (Art. 6.1.f RGPD) y/o consentimiento. Te informaremos de actualizaciones, lanzamientos y ofertas relacionadas con GmSportStudio.</p>
        </div>
        <div>
          <p className="text-white/70 font-semibold mb-1">Mejora del producto</p>
          <p>Base jurídica: interés legítimo. Podemos analizar el uso anónimo de la Aplicación para mejorar la experiencia.</p>
        </div>
      </div>
    ),
  },
  {
    title: "4. Encargados del tratamiento (terceros)",
    content: (
      <>
        <p>Para prestar el servicio, utilizamos los siguientes encargados del tratamiento que ofrecen garantías suficientes de cumplimiento del RGPD:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><span className="text-white/70">Google Firebase</span> — autenticación y base de datos (EE. UU.; cláusulas contractuales tipo UE)</li>
          <li><span className="text-white/70">Stripe</span> — procesamiento de pagos (EE. UU.; certificado PCI-DSS)</li>
          <li><span className="text-white/70">Ko-fi</span> — procesamiento alternativo de pagos</li>
          <li><span className="text-white/70">Vercel</span> — hospedaje web y analítica sin cookies (EE. UU.; DPA disponible)</li>
          <li><span className="text-white/70">Google Forms</span> — recogida del formulario de registro Beta</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Plazo de conservación",
    content: (
      <p>
        Los datos personales se conservarán durante la fase Beta y hasta <strong className="text-white/70">un mes después del lanzamiento oficial</strong> del producto. Transcurrido ese plazo, los datos que no sean necesarios para la relación contractual o para cumplir obligaciones legales serán eliminados o anonimizados.
      </p>
    ),
  },
  {
    title: "6. Derechos del interesado",
    content: (
      <>
        <p>En virtud del RGPD y la LOPDGDD, puedes ejercitar en cualquier momento los siguientes derechos escribiendo a <span className="text-white/70">info@gmsportstudio.com</span>:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><span className="text-white/70">Acceso</span> — conocer qué datos tratamos sobre ti.</li>
          <li><span className="text-white/70">Rectificación</span> — corregir datos inexactos.</li>
          <li><span className="text-white/70">Supresión</span> — solicitar el borrado («derecho al olvido»).</li>
          <li><span className="text-white/70">Limitación</span> — restringir el tratamiento en ciertos casos.</li>
          <li><span className="text-white/70">Portabilidad</span> — recibir tus datos en formato estructurado.</li>
          <li><span className="text-white/70">Oposición</span> — oponerte al tratamiento basado en interés legítimo.</li>
        </ul>
        <p className="mt-2">
          Respondemos en un plazo máximo de <strong className="text-white/70">30 días</strong>. Si no quedas satisfecho, puedes reclamar ante la <strong className="text-white/70">Agencia Española de Protección de Datos (AEPD)</strong> en <span className="text-white/60">www.aepd.es</span>.
        </p>
      </>
    ),
  },
  {
    title: "7. Seguridad",
    content: (
      <p>
        Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o destrucción accidental, conforme al Art. 32 RGPD. Entre ellas: cifrado en tránsito (TLS), control de acceso basado en roles en Firebase y contraseñas con hash seguro.
      </p>
    ),
  },
  {
    title: "8. Modificaciones",
    content: (
      <p>
        Podemos actualizar esta política para reflejar cambios legales o del servicio. Notificaremos los cambios materiales por correo electrónico o mediante aviso destacado en el Sitio.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de Privacidad"
      subtitle="Protección de Datos"
      updated="18 de abril de 2026"
      sections={sections}
    />
  );
}
