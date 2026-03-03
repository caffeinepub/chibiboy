import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/context/UserContext";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function TermsPage() {
  const navigate = useNavigate();
  const { userData, setUserData } = useUserData();

  const [nombreEdad, setNombreEdad] = useState(userData.nombre);
  const [metas, setMetas] = useState(userData.metas);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleNo() {
    setErrorMsg(
      "Al no aceptar términos y condiciones no puedes continuar en esta página",
    );
  }

  function handleSi() {
    if (!nombreEdad.trim() || !metas.trim()) {
      setErrorMsg(
        "Por favor completa tu nombre/edad y tus metas antes de continuar",
      );
      return;
    }
    setErrorMsg(null);
    // Parse nombre and edad from the combined field (store together, split on display)
    setUserData({ nombre: nombreEdad.trim(), edad: "", metas: metas.trim() });
    navigate({ to: "/clausulas" });
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />
        <div className="absolute -top-6 right-0 h-32 w-32 rounded-full bg-accent/25 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
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
          data-ocid="terms.link"
          onClick={() => navigate({ to: "/" })}
          aria-label="Volver al inicio"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
            Términos y Condiciones
          </h1>
          <p className="text-xs text-muted-foreground">Chibi Boy Savings</p>
        </div>
      </motion.header>

      {/* Scrollable content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative z-10 flex-1 overflow-hidden px-4"
      >
        <ScrollArea className="h-full pr-1">
          <div className="space-y-5 pb-8">
            {/* Aviso de Privacidad */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-4"
            >
              <h2 className="font-display text-sm font-bold text-primary mb-2 uppercase tracking-wide">
                Aviso de Privacidad
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">
                ABUNDART, responsable de los productos ChibiBoy y ChibiBoy
                Savings, con domicilio en [indicar domicilio], es responsable
                del tratamiento y protección de los datos personales que
                recabamos de ti, de conformidad con la Ley Federal de Protección
                de Datos Personales en Posesión de los Particulares ("LFPDPPP")
                y su Reglamento.
              </p>
            </motion.div>

            {/* Formulario de datos */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-2xl bg-card border border-border px-4 py-4 space-y-4 shadow-xs"
            >
              <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">
                Cuéntanos sobre ti
              </h2>

              <div className="space-y-1.5">
                <Label
                  htmlFor="nombre-edad"
                  className="text-sm font-semibold text-foreground"
                >
                  ¿Cuál es tu nombre y edad?
                </Label>
                <Input
                  id="nombre-edad"
                  data-ocid="terms.nombre_input"
                  placeholder="Ej: María, 15 años"
                  value={nombreEdad}
                  onChange={(e) => setNombreEdad(e.target.value)}
                  className="h-11 rounded-xl border-border bg-background text-sm placeholder:text-muted-foreground focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="metas"
                  className="text-sm font-semibold text-foreground"
                >
                  ¿Cuáles son tus metas y para qué quieres ahorrar?
                </Label>
                <Textarea
                  id="metas"
                  data-ocid="terms.metas_textarea"
                  placeholder="Ej: Quiero ahorrar para comprar unos audífonos y aprender a gastar mejor mi dinero."
                  value={metas}
                  onChange={(e) => setMetas(e.target.value)}
                  rows={3}
                  className="rounded-xl border-border bg-background text-sm placeholder:text-muted-foreground resize-none focus-visible:ring-primary"
                />
              </div>
            </motion.div>

            {/* Uso de datos */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="rounded-2xl bg-card border border-border px-4 py-4 shadow-xs"
            >
              <h2 className="font-display text-base font-bold text-foreground mb-3">
                ¿Para qué usamos tus datos?
              </h2>
              <ul className="space-y-2 mb-3">
                {[
                  "Crear tu cuenta en la app.",
                  "Personalizar tu experiencia dentro de ChibiBoy Savings.",
                  "Registrar tu avance en los retos de 21 días.",
                  "Mejorar nuestra plataforma, analizando patrones de uso.",
                  "Mantener comunicación contigo, si necesitas soporte.",
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
              <p className="text-xs text-muted-foreground leading-relaxed">
                No compartiremos tus datos con nadie y, cualquier problema,
                contactar a{" "}
                <a
                  href="mailto:soportechibiboy@outlook.com"
                  className="text-primary font-medium underline underline-offset-2"
                >
                  soportechibiboy@outlook.com
                </a>
              </p>
            </motion.div>

            {/* Aceptación */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="rounded-2xl bg-card border border-border px-4 py-5 shadow-xs space-y-4"
            >
              <p className="text-center font-display text-base font-bold text-foreground">
                Acepto términos y condiciones
              </p>

              <div className="flex gap-3">
                <Button
                  data-ocid="terms.accept_no_button"
                  onClick={handleNo}
                  className="flex-1 h-14 rounded-2xl bg-destructive/90 text-base font-bold text-white hover:bg-destructive active:scale-[0.97] shadow-md shadow-destructive/20 transition-all duration-200"
                >
                  NO
                </Button>
                <Button
                  data-ocid="terms.accept_yes_button"
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
                    data-ocid="terms.error_state"
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
        </ScrollArea>
      </motion.div>
    </div>
  );
}
