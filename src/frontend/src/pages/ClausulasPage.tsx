import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, ChevronLeft, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const MINOR_POLICY = [
  {
    num: "1",
    title: "Supervisión y acompañamiento",
    intro: "Recomendamos que madres, padres o tutores:",
    items: [
      "Conozcan la app y sus funciones",
      "Acompañen a su hijo(a) en la definición de metas",
      "Dialoguen sobre el contenido educativo y las decisiones financieras",
    ],
  },
  {
    num: "2",
    title: "Contenido apto para jóvenes",
    intro: "La app:",
    items: [
      "No maneja dinero real",
      "No solicita datos sensibles",
      "No promueve endeudamiento, apuestas ni actividades de riesgo",
      "No ofrece servicios financieros ni inversiones directas",
    ],
  },
  {
    num: "3",
    title: "Interacción y privacidad",
    intro: "El usuario menor debe saber que:",
    items: [
      "Puede eliminar sus datos cuando quiera",
      "Su información no se comparte con terceros",
      "Nunca se le pedirá información privada ni bancaria",
    ],
  },
  {
    num: "4",
    title: "Tiempo de uso recomendado",
    intro: "Para mantener una relación saludable con la tecnología:",
    items: [
      "Se recomienda usar la app menos de 15 minutos al día",
      "La experiencia está diseñada para ser ligera, motivadora y sin dependencia",
    ],
  },
  {
    num: "5",
    title: "Seguridad emocional",
    intro:
      "La app está diseñada para acompañar, no presionar. Si un joven siente ansiedad, frustración o presión por el ahorro, se recomienda:",
    items: [
      "Pausar el reto",
      "Consultarlo con mamá/papá/tutor",
      "Ajustar la meta a algo más realista y amable",
    ],
  },
];

export default function ClausulasPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleNo() {
    setErrorMsg(
      "Al no aceptar términos y condiciones no puedes continuar en esta página",
    );
  }

  function handleSi() {
    setErrorMsg(null);
    localStorage.setItem("chibiBoyOnboarded", "true");
    navigate({ to: "/menu" });
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background overflow-y-auto">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-20 bg-background/95 backdrop-blur relative flex items-center gap-3 px-4 pt-10 pb-4"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/terminos" })}
          aria-label="Volver a términos"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold leading-tight text-foreground">
            Cláusulas de Registro
          </h1>
          <p className="text-xs text-muted-foreground">Chibi Boy Savings</p>
        </div>
      </motion.header>

      {/* Scrollable content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative z-10 px-4"
      >
        <div className="space-y-5 pb-8">
          {/* Sección A: Cláusulas de Registro */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-4"
          >
            <h2 className="font-display text-base font-bold text-primary mb-3 uppercase tracking-wide">
              Cláusulas de Registro en la App
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              Al dar clic en "Aceptar todo y continuar" confirmas que:
            </p>
            <ul className="space-y-2">
              {[
                "Has leído y aceptas el Aviso de Privacidad",
                "Has leído y aceptas los Términos y Condiciones de Uso",
                "Entiendes que ChibiBoy Savings es una herramienta educativa y no una institución financiera",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Sección B: Política para Menores */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl bg-card border border-border px-4 py-4 shadow-xs space-y-4"
          >
            <h2 className="font-display text-base font-bold text-foreground uppercase tracking-wide">
              Política de Uso Responsable para Menores
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              ChibiBoy Savings está diseñada para jóvenes a partir de 13 años
              interesados en mejorar sus hábitos de ahorro y bienestar personal.
              Aunque el contenido es seguro, educativo y amigable, fomentamos un
              uso responsable cuando el usuario es menor de edad.
            </p>

            {/* Numbered sections 1-5 */}
            {MINOR_POLICY.map((section, i) => (
              <motion.div
                key={section.num}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                className="rounded-xl bg-secondary/60 border border-border/50 px-3 py-3 space-y-2"
              >
                <h3 className="font-display text-sm font-bold text-foreground">
                  <span className="text-primary mr-1">{section.num}.</span>
                  {section.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {section.intro}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-foreground/75 leading-relaxed"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Section 6: Comunicación */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="rounded-xl bg-secondary/60 border border-border/50 px-3 py-3 space-y-2"
            >
              <h3 className="font-display text-sm font-bold text-foreground">
                <span className="text-primary mr-1">6.</span>Comunicación
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cualquier inquietud que detecten padres o tutores pueden
                canalizarla a:
              </p>
              <a
                href="mailto:soportechibiboy@outlook.com"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold underline underline-offset-2"
              >
                <Mail className="h-3.5 w-3.5" />
                soportechibiboy@outlook.com
              </a>
            </motion.div>
          </motion.div>

          {/* Aceptación final */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="rounded-2xl bg-card border border-border px-4 py-5 shadow-xs space-y-4"
          >
            <p className="text-center font-display text-base font-bold text-foreground">
              Acepto términos y condiciones
            </p>

            <div className="flex gap-3">
              <Button
                data-ocid="clausulas.accept_no_button"
                onClick={handleNo}
                className="flex-1 h-14 rounded-2xl bg-destructive/90 text-base font-bold text-white hover:bg-destructive active:scale-[0.97] shadow-md shadow-destructive/20 transition-all duration-200"
              >
                NO
              </Button>
              <Button
                data-ocid="clausulas.accept_yes_button"
                onClick={handleSi}
                className="flex-1 h-14 rounded-2xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.97] shadow-md shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                SÍ
              </Button>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  data-ocid="clausulas.error_state"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-3"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive font-medium leading-snug">
                    {errorMsg}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="h-2" />
        </div>
      </motion.div>
    </div>
  );
}
