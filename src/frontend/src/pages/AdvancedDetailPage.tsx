import { Button } from "@/components/ui/button";
import { useChallenges } from "@/context/ChallengeContext";
import { useUserData } from "@/context/UserContext";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type TopicKey = "cuenta_ahorro" | "inversion" | "cetes";

interface Step {
  number: number;
  title: string;
  body: string;
  note?: string;
}

interface TopicContent {
  title: string;
  subtitle: string;
  steps: Step[];
  chibiBubble: string;
  doneMessage: (name: string) => string;
  inProgressMessage: (name: string) => string;
}

const TOPICS: Record<TopicKey, TopicContent> = {
  cuenta_ahorro: {
    title: "Cuenta de ahorro",
    subtitle: "Cómo abrir tu primera cuenta de ahorro (México)",
    steps: [
      {
        number: 1,
        title: "Elige un banco sin comisiones",
        body: "Pregunta por una cuenta de ahorro básica. Prioriza opciones sin cobro por manejo de cuenta.",
      },
      {
        number: 2,
        title: "Ten tus documentos listos",
        body: "Lleva tu INE y tu celular. Algunos bancos también piden comprobante de domicilio y RFC.",
        note: "Si aún no cumples 18: Puedes abrir una cuenta para menores con tu mamá, papá o tutor. Lleven: Acta de nacimiento, CURP, INE del tutor, Comprobante de domicilio. Tip: pide una cuenta 'sin comisiones para menores'.",
      },
      {
        number: 3,
        title: "Abre tu cuenta (Sucursal o App)",
        body: "En sucursal pide la apertura y revisa comisiones y saldo mínimo. En app, regístrate y valida tu identidad (INE + selfie).",
      },
      {
        number: 4,
        title: "Activa la seguridad",
        body: "Crea un NIP fuerte y activa notificaciones de movimientos y bloqueo desde la app.",
      },
      {
        number: 5,
        title: "Deposita tu primer monto",
        body: "Aunque sea poco, lo importante es empezar el hábito.",
      },
      {
        number: 6,
        title: "Regla de oro",
        body: "No compartas tu NIP, evita préstamos rápidos y separa ahorro de gasto.",
      },
    ],
    chibiBubble:
      "Programa una transferencia automática semanal aunque sea de $50. La constancia gana. 🐷",
    doneMessage: (name) =>
      `¡Excelente ${name}! Ya estás en el mundo real del dinero. 🎉`,
    inProgressMessage: (name) =>
      `No lo dejes ${name}, ya casi estás en el mundo real del dinero. ¡Tú puedes! 💪`,
  },
  inversion: {
    title: "Inversión",
    subtitle: "Primera inversión (México) | Paso a paso",
    steps: [
      {
        number: 1,
        title: "Define tu objetivo",
        body: "Puede ser fondo de emergencia, una meta a 6 meses o crecimiento a largo plazo.",
      },
      {
        number: 2,
        title: "Elige tu plazo",
        body: "Corto si puedes necesitar el dinero pronto; largo si puedes dejarlo trabajando.",
      },
      {
        number: 3,
        title: "Empieza simple y de bajo riesgo",
        body: "Invierte en algo que entiendas y puedas explicar.",
      },
      {
        number: 4,
        title: "Revisa Comisiones",
        body: "Evita activar productos con cobros de manejo si no son necesarios.",
      },
      {
        number: 5,
        title: "Invierte poco para aprender",
        body: "Empieza con un monto pequeño y observa cómo funcionan rendimientos y movimientos.",
      },
      {
        number: 6,
        title: "Regla de oro",
        body: "No inviertas dinero que puedas necesitar para gastos básicos.",
        note: "Si aún no cumples 18: Haz inversiones acompañado por tu mamá, papá o tutor. Puede estar a nombre del tutor. Tú participas en las decisiones. Así aprendes sin riesgos.",
      },
    ],
    chibiBubble:
      "Empieza pequeño, aprende el camino y repite. Sin prisa, pero sin pausa. 📈",
    doneMessage: (name) =>
      `¡Excelente ${name}! Ya estás haciendo crecer tu dinero en el mundo real. 🎉`,
    inProgressMessage: (name) =>
      `No lo dejes ${name}, ya casi estás en el mundo real del dinero. ¡Tú puedes! 💪`,
  },
  cetes: {
    title: "CETES (México)",
    subtitle:
      '¿QUÉ SON LOS CETES? Son instrumentos del Gobierno de México. "Prestas" tu dinero por un plazo y al final recibes tu dinero con rendimiento.',
    steps: [
      {
        number: 1,
        title: "Crea tu cuenta en CETES directo",
        body: "Usa el sitio o la app oficial.",
      },
      {
        number: 2,
        title: "Ten tus datos listos",
        body: "INE, CURP, correo y una cuenta bancaria a tu nombre (CLABE).",
      },
      {
        number: 3,
        title: "Elige CETES y un plazo",
        body: "Para empezar, un plazo corto como 28 días es buena práctica.",
      },
      {
        number: 4,
        title: "Selecciona el monto",
        body: "Si quieres, activa la reinversión automática.",
      },
      {
        number: 5,
        title: "Da seguimiento",
        body: "Revisa fechas y aprende cómo se reflejan los rendimientos.",
        note: "Si aún no cumples 18: Cetes directo requiere mayoría de edad. Pide a tu tutor que abra la cuenta a su nombre. Úsenla juntos como proyecto familiar.",
      },
    ],
    chibiBubble:
      "Empieza con poco para dominar el proceso, luego subes monto con calma. 🧾",
    doneMessage: (name) =>
      `¡Excelente ${name}! Ya estás haciendo crecer tu dinero en el mundo real. 🎉`,
    inProgressMessage: (name) =>
      `No lo dejes ${name}, ya casi estás en el mundo real del dinero. ¡Tú puedes! 💪`,
  },
};

// Stable particle data for fireworks (no random keys)
const FIREWORK_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6BC8",
  "#A855F7",
];
const FIREWORK_PARTICLES = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * 360;
  const distance = 100 + ((i * 7) % 150);
  const rad = (angle * Math.PI) / 180;
  return {
    id: `fw-${i}`,
    tx: Math.cos(rad) * distance,
    ty: Math.sin(rad) * distance,
    color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
    delay: (i % 6) * 0.04,
  };
});

// Fireworks animation component
function Fireworks({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      onAnimationComplete={onDone}
    >
      {FIREWORK_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: "50vw", y: "50vh", scale: 0, opacity: 1 }}
          animate={{
            x: `calc(50vw + ${p.tx}px)`,
            y: `calc(50vh + ${p.ty}px)`,
            scale: [0, 1.5, 0.8, 0],
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: 1.4,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute h-3 w-3 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </motion.div>
  );
}

export default function AdvancedDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ from: "/avanzado/$topic" });
  const topic = params.topic as TopicKey;
  const { setAdvancedStatus } = useChallenges();
  const { userData } = useUserData();

  const [overlay, setOverlay] = useState<null | "done" | "in_progress">(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const content = TOPICS[topic];
  const name = userData.nombre || "Amigo/a";

  if (!content) {
    navigate({ to: "/avanzado" });
    return null;
  }

  function handleDone() {
    setAdvancedStatus(topic, "done");
    setShowFireworks(true);
    setOverlay("done");
  }

  function handleInProgress() {
    setAdvancedStatus(topic, "in_progress");
    setOverlay("in_progress");
  }

  function handleBack() {
    navigate({ to: "/avanzado" });
  }

  return (
    <div
      data-ocid="avanzado-detail.page"
      className="relative flex min-h-screen w-full flex-col bg-background overflow-y-auto"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-20 bg-background/95 backdrop-blur relative flex items-center gap-3 px-4 pt-10 pb-3"
      >
        <button
          type="button"
          data-ocid="avanzado-detail.link"
          onClick={handleBack}
          aria-label="Volver al nivel avanzado"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold leading-tight text-foreground text-center flex-1">
            {content.title}
          </h1>
        </div>
      </motion.header>

      {/* Scrollable body */}
      <div className="relative z-10 flex-1">
        <div className="px-4 pb-6 space-y-4">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm font-semibold text-muted-foreground leading-relaxed"
          >
            {content.subtitle}
          </motion.p>

          {/* Steps */}
          {content.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
              className="rounded-2xl bg-card border border-border px-4 py-4 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-bold text-foreground">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {step.body}
                  </p>
                  {step.note && (
                    <div className="mt-2 rounded-xl bg-accent/20 border border-accent/30 px-3 py-2">
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {step.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Chibi with speech bubble */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center py-2"
          >
            <div className="relative">
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-accent/30 blur-md" />
              <img
                src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                alt="Chibi Boy"
                className="relative z-10 w-20 drop-shadow-md"
                draggable={false}
              />
            </div>
            <div className="relative mt-1 max-w-xs w-full rounded-2xl bg-accent/25 border border-accent/40 px-4 py-3 text-center">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-accent/25" />
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                {content.chibiBubble}
              </p>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2.5 pt-2"
          >
            <Button
              data-ocid="avanzado-detail.cancel_button"
              variant="outline"
              onClick={handleBack}
              className="w-full h-12 rounded-2xl font-bold border-border"
            >
              Volver
            </Button>
            <Button
              data-ocid="avanzado-detail.confirm_button"
              onClick={handleDone}
              className="w-full h-12 rounded-2xl bg-green-500 hover:bg-green-600 font-bold text-white shadow-md shadow-green-500/25"
            >
              Hecho 💳
            </Button>
            <Button
              data-ocid="avanzado-detail.secondary_button"
              variant="outline"
              onClick={handleInProgress}
              className="w-full h-12 rounded-2xl font-bold border-accent/50 text-foreground hover:bg-accent/20"
            >
              En progreso ⏳
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Fireworks */}
      <AnimatePresence>
        {showFireworks && <Fireworks onDone={() => setShowFireworks(false)} />}
      </AnimatePresence>

      {/* Result overlay */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            data-ocid="avanzado-detail.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-6"
            onClick={() => setOverlay(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative w-full max-w-xs rounded-3xl bg-card p-6 shadow-xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                alt="Chibi Boy"
                className="mx-auto w-24 drop-shadow-md mb-3"
                draggable={false}
              />
              {/* Speech bubble */}
              <div className="relative mx-auto mb-4 max-w-[260px] rounded-2xl bg-accent/30 border border-accent/50 px-4 py-3">
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {overlay === "done"
                    ? content.doneMessage(name)
                    : content.inProgressMessage(name)}
                </p>
              </div>
              <Button
                data-ocid="avanzado-detail.close_button"
                onClick={() => {
                  setOverlay(null);
                  if (overlay === "done") {
                    navigate({ to: "/avanzado" });
                  }
                }}
                className={`w-full rounded-2xl font-bold h-11 ${
                  overlay === "done"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {overlay === "done"
                  ? "¡Increíble! 🎉"
                  : "¡Seguiré adelante! 💪"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
