import { useChallenges } from "@/context/ChallengeContext";
import { CHALLENGES } from "@/data/challenges";
import { ENCOURAGEMENT_PHRASES, SUCCESS_PHRASES } from "@/data/phrases";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface ResultState {
  type: "success" | "failed";
  phrase: string;
}

function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChallengeDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ from: "/retos/$level/$day" });
  const level = params.level as "easy" | "medium" | "hard";
  const dayNumber = Number.parseInt(params.day, 10);
  const dayIndex = dayNumber - 1;

  const { setDayStatus } = useChallenges();
  const [showResult, setShowResult] = useState<ResultState | null>(null);

  const challenge = CHALLENGES[level]?.[dayIndex];

  if (!challenge) {
    navigate({ to: "/retos" });
    return null;
  }

  function handleLogrado() {
    setDayStatus(level, dayIndex, "completed");
    setShowResult({ type: "success", phrase: randomFrom(SUCCESS_PHRASES) });
  }

  function handleNoLogrado() {
    setDayStatus(level, dayIndex, "failed");
    setShowResult({
      type: "failed",
      phrase: randomFrom(ENCOURAGEMENT_PHRASES),
    });
  }

  function handleContinuar() {
    setShowResult(null);
    navigate({ to: "/retos/$level", params: { level } });
  }

  const LEVEL_NAMES: Record<string, string> = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
  };

  return (
    <div
      data-ocid="detail.page"
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
          data-ocid="detail.link"
          onClick={() => navigate({ to: "/retos/$level", params: { level } })}
          aria-label="Volver a días"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold leading-tight text-foreground">
            Nivel {LEVEL_NAMES[level]} · Día {dayNumber}
          </h1>
          <p className="text-xs text-muted-foreground">Reto de hoy</p>
        </div>
      </motion.header>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-6">
        {/* Mascot with speech bubble */}
        <div className="flex flex-col items-center mb-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-accent/40 blur-md" />
            <img
              src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
              alt="Chibi Boy"
              className="relative z-10 w-28 drop-shadow-md"
              draggable={false}
            />
          </motion.div>

          {/* Speech bubble with title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mt-1 max-w-xs w-full rounded-2xl bg-accent/25 border border-accent/40 px-4 py-3 text-center"
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-accent/25" />
            <p className="font-display text-base font-bold text-foreground leading-snug">
              {challenge.title}
            </p>
          </motion.div>
        </div>

        {/* Description card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-2xl bg-card border border-border px-5 py-4 shadow-xs mb-5"
        >
          <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
            El reto de hoy
          </p>
          <p className="text-base text-foreground leading-relaxed">
            {challenge.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              💰 Valor: ${challenge.value} pesos
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="space-y-3"
        >
          <button
            type="button"
            data-ocid="detail.primary_button"
            onClick={handleLogrado}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-[0.97] text-white font-display text-lg font-bold h-16 shadow-lg shadow-green-500/30 transition-all duration-200"
          >
            <span className="text-2xl">✅</span>
            Lo Logré
          </button>
          <button
            type="button"
            data-ocid="detail.secondary_button"
            onClick={handleNoLogrado}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-400 hover:bg-red-500 active:scale-[0.97] text-white font-display text-lg font-bold h-16 shadow-lg shadow-red-400/30 transition-all duration-200"
          >
            <span className="text-2xl">❌</span>
            No Lo Logré
          </button>
        </motion.div>
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            key="result-overlay"
            data-ocid={
              showResult.type === "success"
                ? "detail.success_state"
                : "detail.error_state"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 ${
              showResult.type === "success"
                ? "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600"
                : "bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600"
            }`}
          >
            {/* Decorative circles */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div
                className={`absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-40 ${
                  showResult.type === "success" ? "bg-lime-300" : "bg-red-300"
                }`}
              />
              <div
                className={`absolute -bottom-10 -left-10 h-48 w-48 rounded-full blur-3xl opacity-40 ${
                  showResult.type === "success" ? "bg-cyan-300" : "bg-pink-300"
                }`}
              />
            </div>

            {/* Big emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 300,
                damping: 18,
              }}
              className="text-7xl mb-2 drop-shadow-lg select-none"
              aria-hidden
            >
              {showResult.type === "success" ? "🎉" : "💪"}
            </motion.div>

            {/* Pig */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="relative"
            >
              <div
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full blur-xl opacity-60 ${
                  showResult.type === "success"
                    ? "bg-lime-200"
                    : "bg-yellow-200"
                }`}
              />
              <img
                src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                alt="Chibi Boy"
                className="relative z-10 w-32 drop-shadow-lg"
                draggable={false}
              />
            </motion.div>

            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="relative mt-2 w-full max-w-xs rounded-2xl bg-white/90 border border-white/60 px-5 py-4 text-center shadow-lg"
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white/90" />
              <p className="font-display text-base font-bold text-gray-800 leading-snug">
                {showResult.phrase}
              </p>
            </motion.div>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-4 text-white/90 font-bold text-lg drop-shadow text-center"
            >
              {showResult.type === "success"
                ? "¡Reto completado!"
                : "¡Sigue intentando!"}
            </motion.p>

            {/* Continue button */}
            <motion.button
              type="button"
              data-ocid="detail.confirm_button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              onClick={handleContinuar}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-8 w-full max-w-xs rounded-2xl bg-white text-gray-800 font-display text-lg font-bold h-14 shadow-xl shadow-black/20 transition-all duration-200 active:scale-[0.97]"
            >
              Continuar →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
