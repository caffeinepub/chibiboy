import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-background px-6 py-10">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-2xl" />
      </div>

      {/* Top spacer */}
      <div className="flex-1" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-0 text-center">
        {/* Chibi Boy image */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          {/* Decorative glow ring behind character */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full bg-accent/40 blur-sm" />
          <img
            src="/assets/uploads/IMG-20260303-WA0003-1.jpg"
            alt="Chibi Boy mascot"
            className="relative z-10 w-[260px] max-w-[70vw] drop-shadow-lg"
            draggable={false}
          />
        </motion.div>

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex flex-col items-center gap-4"
        >
          {/* Primary brand */}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground">
            Chibi Boy Savings
          </h1>

          {/* Tagline */}
          <p className="font-display text-2xl font-bold text-primary">
            Ahorra Jugando
          </p>

          {/* Secondary message */}
          <div className="mt-1 flex flex-col items-center gap-1">
            <p className="font-display text-lg font-bold text-foreground">
              Crea tu hábito
            </p>
            <p className="text-base font-normal text-muted-foreground">
              Un poco al día hace la diferencia
            </p>
          </div>
        </motion.div>
      </div>

      {/* Flex spacer to push button down */}
      <div className="flex-1" />

      {/* CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Decorative progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="h-2 w-8 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-primary/40" />
          <span className="h-2 w-2 rounded-full bg-primary/20" />
        </div>

        <Button
          data-ocid="onboarding.primary_button"
          onClick={() => navigate({ to: "/terminos" })}
          className="group h-14 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
        >
          Continuar
          <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </motion.div>

      {/* Bottom safe area */}
      <div className="h-4" />
    </div>
  );
}
