import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Información legal sobre el titular y condiciones de uso de GmSportStudio.",
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: "1. Datos identificativos del titular",
    content: (
      <div className="space-y-1">
        <p><span className="text-white/70">Titular:</span> José Carlos Galán Moscoso</p>
        <p><span className="text-white/70">NIF:</span> 44965596K</p>
        <p><span className="text-white/70">Domicilio:</span> Calle Playa de Bolonia 31, 11406 Jerez de la Frontera, Cádiz, España</p>
        <p><span className="text-white/70">Correo electrónico:</span> ceo@gmsportstudio.com</p>
        <p><span className="text-white/70">Sitio web:</span> https://www.gmsportstudio.com</p>
      </div>
    ),
  },
  {
    title: "2. Objeto y ámbito de aplicación",
    content: (
      <>
        <p>
          El presente Aviso Legal regula el acceso y uso del sitio web <strong className="text-white/70">www.gmsportstudio.com</strong> (en adelante, «el Sitio»), así como del software de escritorio GmSportStudio (en adelante, «la Aplicación»), titularidad de José Carlos Galán Moscoso.
        </p>
        <p>
          El acceso al Sitio atribuye la condición de usuario e implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal, en la Política de Privacidad y en los Términos de la Beta vigentes en el momento del acceso.
        </p>
      </>
    ),
  },
  {
    title: "3. Propiedad intelectual e industrial",
    content: (
      <>
        <p>
          Todos los contenidos del Sitio y de la Aplicación —incluyendo, sin carácter limitativo, código fuente, código objeto, algoritmos, modelos de análisis deportivo, diseño, logotipos, textos, gráficos, vídeos y capturas— son propiedad exclusiva del titular o dispone de licencia para su uso, y están protegidos por el <strong className="text-white/70">Real Decreto Legislativo 1/1996 de Propiedad Intelectual</strong>, la <strong className="text-white/70">Directiva 2009/24/CE</strong> sobre protección jurídica de programas de ordenador y el <strong className="text-white/70">Convenio de Berna</strong>.
        </p>
        <p>
          Queda expresamente prohibida cualquier reproducción, distribución, comunicación pública o transformación, total o parcial, sin autorización escrita previa del titular.
        </p>
        <p className="text-white/70 font-semibold mt-2">Prohibición absoluta de ingeniería inversa</p>
        <p>
          Con carácter específico, y sin perjuicio de lo dispuesto en los <strong className="text-white/70">Términos de la Beta</strong>, queda <strong className="text-white/70">terminante y absolutamente prohibido</strong>:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Descompilar, desensamblar o realizar ingeniería inversa (<em>reverse engineering</em>) sobre cualquier componente de la Aplicación.</li>
          <li>Desofuscar, depurar o instrumentar la Aplicación para reconstruir su lógica interna o código fuente.</li>
          <li>Eludir, eliminar o alterar cualquier medida tecnológica de protección implementada, en vulneración del Art. 160 LPI y el Art. 6 de la Directiva 2001/29/CE.</li>
          <li>Crear obras derivadas basadas en el código, diseño o lógica de GmSportStudio.</li>
        </ul>
        <p className="mt-2">
          El incumplimiento podrá dar lugar a acciones civiles por daños y perjuicios (Arts. 138–140 LPI) y, en su caso, a acciones penales conforme al Art. 270 del Código Penal español.
        </p>
      </>
    ),
  },
  {
    title: "4. Condiciones de uso del Sitio",
    content: (
      <>
        <p>El usuario se compromete a utilizar el Sitio y la Aplicación de conformidad con la ley, la moral, el orden público y el presente Aviso Legal. En particular, el usuario se abstiene de:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Reproducir o distribuir los contenidos sin autorización.</li>
          <li>Utilizar el Sitio con fines fraudulentos o ilícitos.</li>
          <li>Introducir, almacenar o difundir mediante el Sitio virus u otro tipo de programas o archivos dañinos.</li>
          <li>Intentar acceder a áreas restringidas del Sitio o de la Aplicación.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Responsabilidad y exención de garantías",
    content: (
      <>
        <p>
          El titular no garantiza la disponibilidad, continuidad ni infalibilidad del Sitio, y queda eximido de cualquier responsabilidad por daños y perjuicios de cualquier naturaleza derivados de la falta de disponibilidad o de continuidad del funcionamiento del Sitio.
        </p>
        <p>
          Durante la fase Beta, la Aplicación se ofrece «tal cual» (<em>as is</em>). El titular no responde por errores, pérdidas de datos o interrupciones del servicio que puedan producirse en el marco de dicha fase de pruebas.
        </p>
      </>
    ),
  },
  {
    title: "6. Hipervínculos",
    content: (
      <p>
        El Sitio puede contener enlaces a sitios web de terceros. El titular no se hace responsable del contenido, exactitud o disponibilidad de dichos sitios, ni de los productos o servicios que en ellos se ofrezcan.
      </p>
    ),
  },
  {
    title: "7. Legislación aplicable y jurisdicción",
    content: (
      <p>
        El presente Aviso Legal se rige por la legislación española, en particular por la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), y el Real Decreto Legislativo 1/1996 de Propiedad Intelectual. Para la resolución de cualquier controversia, el titular y el usuario se someten, con renuncia expresa a cualquier otro fuero, a los juzgados y tribunales de Jerez de la Frontera (Cádiz), salvo que la normativa aplicable imponga otro fuero imperativo.
      </p>
    ),
  },
  {
    title: "8. Modificaciones",
    content: (
      <p>
        El titular se reserva el derecho a modificar el presente Aviso Legal en cualquier momento. Los cambios serán efectivos desde su publicación en el Sitio. Se recomienda consultarlo periódicamente.
      </p>
    ),
  },
];

export default function AvisoLegalPage() {
  return (
    <LegalPage
      title="Aviso Legal"
      subtitle="Información Legal"
      updated="18 de abril de 2026"
      sections={sections}
    />
  );
}
