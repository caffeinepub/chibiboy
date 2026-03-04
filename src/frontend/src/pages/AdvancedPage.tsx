import { Badge } from "@/components/ui/badge";
import { useChallenges } from "@/context/ChallengeContext";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Lock } from "lucide-react";
import { motion } from "motion/react";

interface TopicButtonProps {
  icon: string;
  label: string;
  unlocked: boolean;
  status: "none" | "in_progress" | "done";
  onClick: () => void;
  delay: number;
  ocid: string;
}

function TopicButton({
  icon,
  label,
  unlocked,
  status,
  onClick,
  delay,
  ocid,
}: TopicButtonProps) {
  return (
    <motion.button
      data-ocid={ocid}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={unlocked ? { scale: 1.02 } : {}}
      whileTap={unlocked ? { scale: 0.97 } : {}}
      onClick={unlocked ? onClick : undefined}
      disabled={!unlocked}
      className={`w-full flex items-center gap-4 rounded-2xl border px-4 py-4 shadow-xs text-left transition-all ${
        unlocked
          ? "bg-card border-primary/25 hover:shadow-md cursor-pointer hover:border-primary/40"
          : "bg-card/60 border-border opacity-55 cursor-not-allowed"
      }`}
    >
      <div
        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-2xl ${
          unlocked ? "bg-primary/10" : "bg-muted"
        }`}
      >
        {unlocked ? icon : <Lock className="h-6 w-6 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-display text-sm font-bold text-foreground">
            {label}
          </p>
          {status === "done" && (
            <Badge className="text-xs px-1.5 py-0 h-5 rounded-full bg-green-100 text-green-700 border-green-200">
              ✅ Completado
            </Badge>
          )}
          {status === "in_progress" && (
            <Badge
              variant="secondary"
              className="text-xs px-1.5 py-0 h-5 rounded-full"
            >
              ⏳ En progreso
            </Badge>
          )}
          {!unlocked && (
            <Badge
              variant="secondary"
              className="text-xs px-1.5 py-0 h-5 rounded-full"
            >
              Bloqueado
            </Badge>
          )}
        </div>
        {!unlocked && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Completa el módulo anterior para desbloquear
          </p>
        )}
      </div>
      {unlocked && (
        <ChevronLeft className="h-5 w-5 flex-shrink-0 rotate-180 text-primary opacity-70" />
      )}
    </motion.button>
  );
}

export default function AdvancedPage() {
  const navigate = useNavigate();
  const { state } = useChallenges();
  const { advancedStatus } = state;

  const inversionUnlocked = advancedStatus.cuenta_ahorro === "done";
  const cetesUnlocked = advancedStatus.inversion === "done";

  return (
    <div
      data-ocid="avanzado.page"
      className="relative flex min-h-screen w-full flex-col bg-background"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-primary/12 blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center gap-3 px-4 pt-10 pb-4 flex-shrink-0"
      >
        <button
          type="button"
          data-ocid="avanzado.link"
          onClick={() => navigate({ to: "/retos" })}
          aria-label="Volver a retos"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
            Nivel Avanzado ⭐
          </h1>
          <p className="text-xs text-muted-foreground">
            Desbloqueado por tu disciplina
          </p>
        </div>
      </motion.header>

      {/* Mascot */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-accent/40 blur-md" />
          <img
            src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
            alt="Chibi Boy"
            className="relative z-10 w-24 drop-shadow-md"
            draggable={false}
          />
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mt-1 rounded-2xl bg-accent/25 border border-accent/40 px-4 py-3 max-w-sm w-full text-center"
        >
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-accent/25" />
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            ¡Llegaste al nivel avanzado! Ahora aprenderás a usar tu dinero en el
            mundo real. 🌟
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-muted-foreground mt-3 text-center max-w-xs leading-relaxed"
        >
          Aquí comienzas a usar tu dinero en el mundo real: ahorrar, invertir y
          hacerlo crecer con inteligencia.
        </motion.p>
      </div>

      {/* Topic buttons */}
      <div className="relative z-10 px-4 pb-8 space-y-3">
        <TopicButton
          ocid="avanzado.primary_button.1"
          icon="🏦"
          label="Abrir mi primera cuenta de ahorro"
          unlocked={true}
          status={advancedStatus.cuenta_ahorro}
          onClick={() =>
            navigate({
              to: "/avanzado/$topic",
              params: { topic: "cuenta_ahorro" },
            })
          }
          delay={0.3}
        />
        <TopicButton
          ocid="avanzado.primary_button.2"
          icon="📈"
          label="Hacer crecer mi dinero (Inversión)"
          unlocked={inversionUnlocked}
          status={advancedStatus.inversion}
          onClick={() =>
            navigate({
              to: "/avanzado/$topic",
              params: { topic: "inversion" },
            })
          }
          delay={0.38}
        />
        <TopicButton
          ocid="avanzado.primary_button.3"
          icon="🧾"
          label="Invertir seguro con CETES"
          unlocked={cetesUnlocked}
          status={advancedStatus.cetes}
          onClick={() =>
            navigate({
              to: "/avanzado/$topic",
              params: { topic: "cetes" },
            })
          }
          delay={0.46}
        />
      </div>
    </div>
  );
}
