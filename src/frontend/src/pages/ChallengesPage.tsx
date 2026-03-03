import { Badge } from "@/components/ui/badge";
import { useChallenges } from "@/context/ChallengeContext";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Lock } from "lucide-react";
import { motion } from "motion/react";

interface LevelCardProps {
  emoji: string;
  label: string;
  sublabel: string;
  unlocked: boolean;
  allAnswered: boolean;
  passed: boolean;
  completedCount: number;
  onClick: () => void;
  delay: number;
  ocid: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

function LevelCard({
  emoji,
  label,
  sublabel,
  unlocked,
  allAnswered,
  passed,
  completedCount,
  onClick,
  delay,
  ocid,
  colorClass,
  bgClass,
  borderClass,
}: LevelCardProps) {
  const needsRetry = allAnswered && !passed;

  return (
    <motion.button
      data-ocid={ocid}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={unlocked ? { scale: 1.02 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      onClick={unlocked ? onClick : undefined}
      disabled={!unlocked}
      className={`relative w-full flex items-center gap-4 rounded-2xl border ${borderClass} ${bgClass} px-4 py-4 shadow-xs text-left transition-all ${
        unlocked
          ? "hover:shadow-md cursor-pointer"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      {/* Emoji / Lock */}
      <div
        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-2xl ${unlocked ? "bg-white/60" : "bg-white/30"}`}
      >
        {unlocked ? emoji : <Lock className="h-6 w-6 text-muted-foreground" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-display text-base font-bold ${colorClass}`}>
            {label}
          </p>
          {needsRetry && (
            <Badge
              variant="destructive"
              className="text-xs px-1.5 py-0 h-5 rounded-full"
            >
              Repite el nivel
            </Badge>
          )}
          {passed && (
            <Badge className="text-xs px-1.5 py-0 h-5 rounded-full bg-green-100 text-green-700 border-green-200">
              ✅ Completado
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
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          {completedCount}/21 días completados
        </p>
      </div>

      {/* Arrow */}
      {unlocked && (
        <ChevronLeft
          className={`h-5 w-5 flex-shrink-0 rotate-180 ${colorClass} opacity-70`}
        />
      )}
    </motion.button>
  );
}

export default function ChallengesPage() {
  const navigate = useNavigate();
  const {
    state,
    mediumUnlocked,
    hardUnlocked,
    advancedUnlocked,
    easyAllAnswered,
    mediumAllAnswered,
    hardAllAnswered,
    easyPassed,
    mediumPassed,
    hardPassed,
  } = useChallenges();

  const easyCompleted = state.easy.statuses.filter(
    (s) => s === "completed",
  ).length;
  const mediumCompleted = state.medium.statuses.filter(
    (s) => s === "completed",
  ).length;
  const hardCompleted = state.hard.statuses.filter(
    (s) => s === "completed",
  ).length;

  return (
    <div
      data-ocid="retos.page"
      className="relative flex h-screen w-full flex-col overflow-hidden bg-background"
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
          data-ocid="retos.link"
          onClick={() => navigate({ to: "/menu" })}
          aria-label="Volver al menú"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
            Retos de 21 Días
          </h1>
          <p className="text-xs text-muted-foreground">
            Elige tu nivel de desafío
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
            src="/assets/generated/chibiboy-pig-transparent.dim_400x400.png"
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
          className="relative mt-1 rounded-2xl bg-accent/25 border border-accent/40 px-4 py-2.5 max-w-xs text-center"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-accent/25" />
          <p className="text-sm font-semibold text-foreground">
            ¡Elige tu nivel de reto! 🏆
          </p>
        </motion.div>
      </div>

      {/* Level cards */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-8 space-y-3">
        <LevelCard
          ocid="retos.primary_button.1"
          emoji="🟢"
          label="Fácil"
          sublabel="21 retos para empezar a ahorrar"
          unlocked={true}
          allAnswered={easyAllAnswered}
          passed={easyPassed}
          completedCount={easyCompleted}
          onClick={() =>
            navigate({ to: "/retos/$level", params: { level: "easy" } })
          }
          delay={0.3}
          colorClass="text-green-700"
          bgClass="bg-green-50"
          borderClass="border-green-200"
        />
        <LevelCard
          ocid="retos.primary_button.2"
          emoji="🟡"
          label="Medio"
          sublabel="Retos más retadores para crecer"
          unlocked={mediumUnlocked}
          allAnswered={mediumAllAnswered}
          passed={mediumPassed}
          completedCount={mediumCompleted}
          onClick={() =>
            navigate({ to: "/retos/$level", params: { level: "medium" } })
          }
          delay={0.38}
          colorClass="text-yellow-700"
          bgClass="bg-yellow-50"
          borderClass="border-yellow-200"
        />
        <LevelCard
          ocid="retos.primary_button.3"
          emoji="🔴"
          label="Difícil"
          sublabel="Para campeones del ahorro"
          unlocked={hardUnlocked}
          allAnswered={hardAllAnswered}
          passed={hardPassed}
          completedCount={hardCompleted}
          onClick={() =>
            navigate({ to: "/retos/$level", params: { level: "hard" } })
          }
          delay={0.46}
          colorClass="text-red-700"
          bgClass="bg-red-50"
          borderClass="border-red-200"
        />
        <LevelCard
          ocid="retos.primary_button.4"
          emoji="⭐"
          label="Avanzado"
          sublabel="Mundo real del dinero"
          unlocked={advancedUnlocked}
          allAnswered={false}
          passed={false}
          completedCount={0}
          onClick={() => navigate({ to: "/avanzado" })}
          delay={0.54}
          colorClass="text-primary"
          bgClass="bg-primary/5"
          borderClass="border-primary/20"
        />
      </div>
    </div>
  );
}
