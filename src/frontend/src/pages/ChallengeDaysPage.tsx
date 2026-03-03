import { Button } from "@/components/ui/button";
import { useChallenges } from "@/context/ChallengeContext";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const LEVEL_NAMES: Record<string, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

const LEVEL_COLORS: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    completed: string;
    failed: string;
    active: string;
    locked: string;
  }
> = {
  easy: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    completed: "bg-green-500 text-white border-green-600",
    failed: "bg-red-400 text-white border-red-500",
    active:
      "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 scale-105",
    locked: "bg-card text-muted-foreground border-border opacity-50",
  },
  medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    completed: "bg-green-500 text-white border-green-600",
    failed: "bg-red-400 text-white border-red-500",
    active:
      "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 scale-105",
    locked: "bg-card text-muted-foreground border-border opacity-50",
  },
  hard: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    completed: "bg-green-500 text-white border-green-600",
    failed: "bg-red-400 text-white border-red-500",
    active:
      "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 scale-105",
    locked: "bg-card text-muted-foreground border-border opacity-50",
  },
};

export default function ChallengeDaysPage() {
  const navigate = useNavigate();
  const params = useParams({ from: "/retos/$level" });
  const level = params.level as "easy" | "medium" | "hard";
  const {
    state,
    easyAllAnswered,
    mediumAllAnswered,
    hardAllAnswered,
    easyPassed,
    mediumPassed,
    hardPassed,
    resetLevel,
  } = useChallenges();

  const levelData = state[level] ?? { statuses: Array(21).fill("pending") };
  const statuses = levelData.statuses;
  const colors = LEVEL_COLORS[level] ?? LEVEL_COLORS.easy;

  const completedCount = statuses.filter((s) => s === "completed").length;
  const failedCount = statuses.filter((s) => s === "failed").length;

  const allAnsweredMap: Record<string, boolean> = {
    easy: easyAllAnswered,
    medium: mediumAllAnswered,
    hard: hardAllAnswered,
  };
  const passedMap: Record<string, boolean> = {
    easy: easyPassed,
    medium: mediumPassed,
    hard: hardPassed,
  };

  const levelAllAnswered = allAnsweredMap[level] ?? false;
  const levelPassed = passedMap[level] ?? false;

  // Active day = first pending day
  const activeDayIndex = statuses.findIndex((s) => s === "pending");

  function getDayClass(index: number): string {
    const status = statuses[index];
    if (status === "completed") return colors.completed;
    if (status === "failed") return colors.failed;
    if (index === activeDayIndex) return colors.active;
    return colors.locked;
  }

  function handleReset() {
    resetLevel(level);
  }

  function handleDayClick(dayIndex: number) {
    if (dayIndex !== activeDayIndex) return;
    navigate({
      to: "/retos/$level/$day",
      params: { level, day: String(dayIndex + 1) },
    });
  }

  return (
    <div
      data-ocid="days.page"
      className="relative flex h-screen w-full flex-col overflow-hidden bg-background"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-primary/12 blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center gap-3 px-4 pt-10 pb-3 flex-shrink-0"
      >
        <button
          type="button"
          data-ocid="days.link"
          onClick={() => navigate({ to: "/retos" })}
          aria-label="Volver a retos"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
            Nivel {LEVEL_NAMES[level] ?? level}
          </h1>
          <p className="text-xs text-muted-foreground">
            {completedCount}/21 completados · {failedCount}/21 fallados
          </p>
        </div>
      </motion.header>

      {/* Progress bar */}
      <div className="relative z-10 px-4 mb-3 flex-shrink-0">
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / 21) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-green-500"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {Math.round((completedCount / 21) * 100)}% completado
        </p>
      </div>

      {/* Day Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-3 gap-2.5">
          {statuses.map((status, index) => {
            const dayNumber = index + 1;
            const isActive = index === activeDayIndex;
            const isClickable = isActive && !levelAllAnswered;

            return (
              <motion.button
                key={dayNumber}
                data-ocid={`days.item.${dayNumber}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.05 + index * 0.02,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                whileHover={isClickable ? { scale: 1.08 } : {}}
                whileTap={isClickable ? { scale: 0.96 } : {}}
                onClick={() => handleDayClick(index)}
                disabled={!isClickable}
                className={`relative flex flex-col items-center justify-center rounded-2xl border p-3 h-20 transition-all ${getDayClass(index)}`}
              >
                <span className="text-xs font-bold opacity-70">Día</span>
                <span className="text-xl font-display font-black leading-tight">
                  {dayNumber}
                </span>
                {status === "completed" && (
                  <span className="text-base leading-none">✅</span>
                )}
                {status === "failed" && (
                  <span className="text-base leading-none">❌</span>
                )}
                {isActive && status === "pending" && (
                  <span className="text-base leading-none">👆</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Results / completion message */}
        <AnimatePresence>
          {levelAllAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4 }}
              className={`mt-5 rounded-2xl border px-4 py-4 text-center ${
                levelPassed
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {levelPassed ? (
                <>
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-display text-base font-bold text-green-700">
                    ¡Felicitaciones! Desbloqueaste el siguiente nivel
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Completaste {completedCount}/21 días (
                    {Math.round((completedCount / 21) * 100)}%)
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl mb-2">💪</p>
                  <p className="font-display text-base font-bold text-red-700">
                    No alcanzaste el 80%
                  </p>
                  <p className="text-sm text-red-600 mt-1 mb-3">
                    Lograste {completedCount}/21 días. Repite el nivel para
                    continuar.
                  </p>
                  <Button
                    data-ocid="days.primary_button"
                    onClick={handleReset}
                    className="rounded-2xl bg-primary font-bold text-primary-foreground h-11 px-6"
                  >
                    Reiniciar Nivel 🔄
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
