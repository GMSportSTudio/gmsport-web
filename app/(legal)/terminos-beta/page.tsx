import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Términos de la Beta",
  description: "Condiciones de acceso y uso del programa Beta de GmSportStudio.",
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: "1. Descripción del programa Beta",
    content: (
      <p>
        El Pase Beta de GmSportStudio es un acceso anticipado a una versión en desarrollo (<em>pre-release</em>) de la Aplicación. El objetivo es recoger feedback real de entrenadores para mejorar el producto antes de su lanzamiento oficial. Como producto en Beta, puede contener errores, funcionalidades incompletas y sufrir cambios sin previo aviso.
      </p>
    ),
  },
  {
    title: "2. Precio y pago",
    content: (
      <>
        <p>
          El precio del Pase Beta es de <strong className="text-white/70">9,99 € (pago único)</strong>, impuestos incluidos. El pago se realiza a través de Stripe o Ko-fi, plataformas seguras y certificadas PCI-DSS.
        </p>
        <p>
          Este pago único cubre el acceso durante toda la fase Beta. No se realizarán cobros adicionales sin tu consentimiento expreso.
        </p>
      </>
    ),
  },
  {
    title: "3. Política de reembolso",
    content: (
      <>
        <p>
          Al adquirir el Pase Beta Fundador, el Usuario acepta expresamente que la ejecución del contrato comienza con el inicio de la descarga del software, y que, conforme al artículo 103.m del Real Decreto Legislativo 1/2007 (TRLGDCU), pierde el derecho de desistimiento de 14 días aplicable a contratos a distancia. El Usuario reconoce haber sido informado de esta consecuencia con carácter previo a la compra.
        </p>
        <p className="mt-3">
          <strong className="text-white/70">No se admiten reembolsos</strong> una vez concedido el acceso a la Beta. Al adquirir el Pase Beta, reconoces y aceptas expresamente que:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Estás adquiriendo acceso a software en desarrollo.</li>
          <li>El producto puede presentar errores o cambios.</li>
          <li>El acceso es inmediato tras la verificación del pago, lo que implica la pérdida del derecho de desistimiento conforme al Art. 103.m) del Real Decreto Legislativo 1/2007.</li>
        </ul>
        <p className="mt-2">
          En caso de problemas técnicos graves imputables exclusivamente al titular, se estudiará la situación de forma individual contactando con <span className="text-white/70">ceo@gmsportstudio.com</span>.
        </p>
      </>
    ),
  },
  {
    title: "4. Beneficio para Fundadores (Beta Founders)",
    content: (
      <>
        <p>
          Los usuarios que adquieran el Pase Beta durante la fase de lanzamiento inicial serán reconocidos como <strong className="text-white/70">Beta Founders</strong> y recibirán:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Un <strong className="text-white/70">50% de descuento de por vida</strong> sobre el precio público de suscripción, en los términos y con las limitaciones detalladas a continuación (subapartados 4.2, 4.3 y 4.4).</li>
          <li>Reconocimiento especial en el producto.</li>
        </ul>

        <p className="mt-4">
          <strong className="text-white/70">4.2. Planes elegibles.</strong> El descuento del 50% se aplica <strong className="text-white/70">exclusivamente a las suscripciones individuales</strong> (mensual y anual) destinadas a uso personal de un único entrenador o analista. <strong className="text-white/70">No es aplicable</strong> a los planes Pro Club ni a cualquier otro plan de equipo, club o empresa que pueda lanzarse en el futuro.
        </p>

        <p className="mt-3">
          <strong className="text-white/70">4.3. Refund o disputa del Pase Beta.</strong> Si el comprador solicita la devolución del importe del Pase Beta —ya sea por desistimiento, refund voluntario o disputa (chargeback)— pierde de forma automática y permanente el estatus de Beta Founder y, con él, el derecho al descuento del 50%. La devolución del importe se considera incompatible con la conservación del beneficio.
        </p>

        <p className="mt-3">
          <strong className="text-white/70">4.4. Vigencia del descuento.</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong className="text-white/70">(a)</strong> El descuento se mantiene mientras el Beta Founder conserve una suscripción individual activa, sin interrupción.</li>
          <li><strong className="text-white/70">(b)</strong> Si la suscripción se interrumpe (cancelación voluntaria, fallo de pago, pausa, etc.), el Beta Founder dispone de <strong className="text-white/70">12 meses</strong> desde la última desconexión para reactivarla conservando el descuento. Pasado dicho plazo de 12 meses sin haber reactivado, el beneficio del 50% caduca de forma definitiva.</li>
        </ul>

        <p className="mt-3 text-white/40 text-xs">
          El descuento se aplica de forma automatizada mediante enlaces personales e intransferibles emitidos por GmSportStudio. El titular se reserva el derecho a modificar la estructura de precios; el descuento del 50% para Fundadores en los planes individuales se mantiene como compromiso firme dentro de los términos definidos en este apartado.
        </p>
      </>
    ),
  },
  {
    title: "5. Licencia de uso y limitaciones",
    content: (
      <>
        <p>
          El titular concede al usuario una licencia <strong className="text-white/70">personal, no exclusiva, intransferible y revocable</strong> para instalar y usar la Aplicación en <strong className="text-white/70">un (1) dispositivo simultáneo</strong>.
        </p>
        <p>Queda expresamente prohibido:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Compartir, revender o ceder el acceso Beta a terceros.</li>
          <li>Descompilar, realizar ingeniería inversa o modificar la Aplicación.</li>
          <li>Usar la Aplicación con fines comerciales no autorizados por el titular.</li>
          <li>Reproducir o distribuir el software o sus componentes.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5 bis. Propiedad intelectual del software — Prohibición absoluta de ingeniería inversa",
    content: (
      <>
        <p>
          GmSportStudio y todos sus componentes —incluyendo, sin carácter limitativo, el código fuente, código objeto, bytecode, algoritmos, estructuras de datos, modelos de análisis deportivo, interfaces gráficas, recursos visuales y documentación técnica— son obras originales protegidas por la <strong className="text-white/70">Ley de Propiedad Intelectual (Real Decreto Legislativo 1/1996)</strong>, la <strong className="text-white/70">Directiva 2009/24/CE</strong> sobre protección jurídica de programas de ordenador, y el <strong className="text-white/70">Convenio de Berna</strong>. Todos los derechos están reservados en su integridad al titular.
        </p>
        <p>
          Queda <strong className="text-white/70">terminante y absolutamente prohibido</strong>, con independencia del fin alegado:
        </p>
        <ul className="list-disc list-inside space-y-1.5 mt-2">
          <li><strong className="text-white/60">Descompilar</strong> total o parcialmente la Aplicación mediante cualquier herramienta o método.</li>
          <li><strong className="text-white/60">Realizar ingeniería inversa</strong> (<em>reverse engineering</em>) sobre el código objeto, los ejecutables empaquetados o cualquier componente cifrado o protegido de la Aplicación.</li>
          <li><strong className="text-white/60">Desofuscar, depurar o instrumentar</strong> la Aplicación con el objetivo de reconstruir su lógica interna, sus algoritmos o su código fuente.</li>
          <li><strong className="text-white/60">Extraer, copiar o derivar</strong> cualquier parte del código fuente, ya sea directa o indirectamente.</li>
          <li><strong className="text-white/60">Eliminar, eludir o alterar</strong> cualquier medida tecnológica de protección (DRM, ofuscación, firma de código, licencias) implementada en la Aplicación, en vulneración del Art. 160 LPI y el Art. 6 de la Directiva 2001/29/CE.</li>
          <li><strong className="text-white/60">Crear obras derivadas</strong> basadas total o parcialmente en el código, diseño o lógica de GmSportStudio.</li>
          <li><strong className="text-white/60">Divulgar, publicar o compartir</strong> cualquier hallazgo, código o información obtenida mediante alguna de las acciones anteriores.</li>
        </ul>
        <p className="mt-3">
          La excepción prevista en el Art. 100.5 LPI (interoperabilidad) únicamente se podrá invocar previa solicitud escrita y autorización expresa del titular. En ningún caso se entenderá tácitamente concedida.
        </p>
        <p className="mt-2 text-[#FF5722]/80 font-semibold text-xs tracking-wide uppercase">
          Consecuencias del incumplimiento
        </p>
        <p className="mt-1">
          Cualquier vulneración de lo dispuesto en esta cláusula constituirá una infracción grave de los derechos de propiedad intelectual del titular y podrá dar lugar a:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Revocación inmediata e irrevocable de la licencia de uso, sin reembolso.</li>
          <li>Ejercicio de acciones civiles por daños y perjuicios, incluyendo la cesación de la actividad infractora y la indemnización por lucro cesante (Arts. 138–140 LPI).</li>
          <li>Denuncia ante las autoridades penales competentes, dado que la elusión de medidas tecnológicas de protección puede ser constitutiva de delito conforme al Art. 270 del Código Penal español.</li>
          <li>Comunicación a las plataformas o servicios utilizados para llevar a cabo la infracción.</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Duración y fin de la Beta",
    content: (
      <p>
        El acceso Beta estará disponible hasta que el titular declare oficialmente el fin de la fase Beta y el lanzamiento del producto. <strong className="text-white/70">Al finalizar la Beta, los accesos se desactivarán</strong>. Los usuarios Fundadores recibirán instrucciones para migrar a la versión oficial con su descuento aplicado.
      </p>
    ),
  },
  {
    title: "7. Feedback y comunicación",
    content: (
      <p>
        Al participar en la Beta, el usuario acepta proporcionar feedback sobre la Aplicación cuando sea solicitado. Cualquier idea, sugerencia o informe de error enviado al titular podrá ser utilizado libremente para mejorar el producto, sin derecho a compensación adicional.
      </p>
    ),
  },
  {
    title: "8. Exención de garantías y limitación de responsabilidad",
    content: (
      <p>
        La Aplicación se proporciona en fase Beta «tal cual» y sin garantía de funcionamiento ininterrumpido. El titular no será responsable de pérdidas de datos, daños directos o indirectos derivados del uso de la Aplicación durante la fase Beta. Se recomienda mantener copias de seguridad de los proyectos de análisis.
      </p>
    ),
  },
  {
    title: "9. Modificaciones de los términos",
    content: (
      <p>
        El titular puede modificar estos Términos durante la fase Beta. Los cambios materiales serán comunicados por correo electrónico con un preaviso de al menos <strong className="text-white/70">7 días</strong>. El uso continuado de la Aplicación tras la notificación implica la aceptación de los nuevos términos.
      </p>
    ),
  },
  {
    title: "10. Legislación aplicable",
    content: (
      <p>
        Estos Términos se rigen por la legislación española. Para cualquier controversia derivada de la relación contractual con empresas (B2B), serán competentes los Juzgados y Tribunales de Jerez de la Frontera, Cádiz. En el caso de consumidores, se aplicará el fuero que corresponda conforme al artículo 90.2 del Real Decreto Legislativo 1/2007 (TRLGDCU) y el artículo 52.3 de la Ley de Enjuiciamiento Civil, generalmente el del domicilio del consumidor.
      </p>
    ),
  },
];

export default function TerminosBetaPage() {
  return (
    <LegalPage
      title="Términos de la Beta"
      subtitle="Condiciones de Acceso"
      updated="18 de abril de 2026"
      sections={sections}
    />
  );
}
