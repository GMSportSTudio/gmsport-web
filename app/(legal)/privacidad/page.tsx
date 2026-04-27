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
          Adicionalmente, cuando el usuario realiza un pago, <strong className="text-white/70">Gumroad, Inc.</strong> actúa como <strong className="text-white/70">Merchant of Record (MoR)</strong> y trata los datos financieros (nombre, dirección de facturación, datos de tarjeta) conforme a su propia política de privacidad. Gumroad es responsable del cobro, la facturación, la gestión del IVA europeo y la emisión del recibo. GmSportStudio no almacena datos de tarjetas bancarias en ningún momento; recibe únicamente confirmación del pago, identificador de venta (sale_id), email del comprador y país de facturación a efectos de habilitar el acceso a la Aplicación.
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
        <p>Para prestar el servicio, utilizamos los siguientes encargados del tratamiento (o, en el caso de Gumroad, responsable autónomo en su rol de MoR) que ofrecen garantías suficientes de cumplimiento del RGPD:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><span className="text-white/70">Gumroad, Inc.</span> — Merchant of Record y procesamiento de pagos (EE. UU.; certificado PCI-DSS; transferencia internacional amparada en el marco <em>EU-US Data Privacy Framework</em> y/o cláusulas contractuales tipo de la Comisión Europea). Gumroad gestiona el cobro, el IVA europeo y la facturación al consumidor final.</li>
          <li><span className="text-white/70">Google Firebase</span> (Google Cloud EMEA Ltd.) — autenticación, base de datos en tiempo real, almacenamiento y Cloud Functions en región <em>europe-west1</em>; los datos en reposo permanecen en la UE. Posibles transferencias técnicas a EE. UU. amparadas en cláusulas contractuales tipo UE.</li>
          <li><span className="text-white/70">Resend</span> — envío de emails transaccionales (confirmación de compra, invitaciones, notificaciones). Procesamiento en EE. UU. con cláusulas contractuales tipo.</li>
          <li><span className="text-white/70">Vercel, Inc.</span> — hospedaje web y analítica sin cookies (EE. UU.; DPA firmado).</li>
          <li><span className="text-white/70">Sentry</span> (Functional Software Inc.) — monitorización de errores en la Aplicación. Los eventos enviados se anonimizan (hash del UID con sal, eliminación de paths con nombre de usuario, sin tarjetas ni emails en logs).</li>
          <li><span className="text-white/70">Google Forms</span> — recogida del formulario de registro a la lista de espera de la Beta.</li>
        </ul>
        <p className="mt-3 text-white/40 text-xs">
          Los enlaces a las políticas de privacidad de cada encargado están disponibles previa solicitud por correo electrónico a <span className="text-white/60">info@gmsportstudio.com</span>.
        </p>
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
      updated="27 de abril de 2026"
      sections={sections}
    />
  );
}
