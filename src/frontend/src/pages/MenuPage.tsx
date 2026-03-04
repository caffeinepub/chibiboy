import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useChallenges } from "@/context/ChallengeContext";
import { useUserData } from "@/context/UserContext";
import { ALL_PHRASES } from "@/data/phrases";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function randomPhrase(): string {
  return ALL_PHRASES[Math.floor(Math.random() * ALL_PHRASES.length)];
}

export default function MenuPage() {
  const { userData, setUserData } = useUserData();
  const { getSavingsTotal } = useChallenges();
  const navigate = useNavigate();

  const [showMetas, setShowMetas] = useState(false);
  const [metaText, setMetaText] = useState<string>(
    () => localStorage.getItem("chibiBoyMeta") || "",
  );
  const [showTips, setShowTips] = useState(false);
  const [currentFrase, setCurrentFrase] = useState<string>(() =>
    randomPhrase(),
  );
  const [showProgreso, setShowProgreso] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configNombre, setConfigNombre] = useState(userData.nombre || "");
  const [configEdad, setConfigEdad] = useState(userData.edad || "");
  const [configMeta, setConfigMeta] = useState(userData.metas || "");

  const displayName = userData.nombre || "Amigo/a";
  const savingsTotal = getSavingsTotal();

  function handleMenuItemClick(label: string) {
    if (label === "Retos de 21 Días") {
      navigate({ to: "/retos" });
    } else if (label === "Mis Metas Secundarias") {
      setShowMetas(true);
    } else if (label === "Mi Progreso") {
      setShowProgreso(true);
    } else if (label === "Configuración") {
      setConfigNombre(userData.nombre || "");
      setConfigEdad(userData.edad || "");
      setConfigMeta(userData.metas || "");
      setShowConfig(true);
    }
  }

  function handleSaveMeta() {
    localStorage.setItem("chibiBoyMeta", metaText);
    setShowMetas(false);
    toast.success("¡Meta guardada! Chibi está contigo. 🐷");
  }

  function handleSaveConfig() {
    setUserData({ nombre: configNombre, edad: configEdad, metas: configMeta });
    setShowConfig(false);
    toast.success("¡Perfil actualizado! 🐷");
  }

  function handleVerOnboarding() {
    localStorage.removeItem("chibiBoyOnboarded");
    navigate({ to: "/" });
  }

  function handleNewTip() {
    setCurrentFrase(randomPhrase());
  }

  function handleOpenTips() {
    setCurrentFrase(randomPhrase());
    setShowTips(true);
  }

  const MENU_ITEMS = [
    {
      icon: Target,
      label: "Mis Metas Secundarias",
      description: "Define y sigue tus objetivos de ahorro",
      color: "bg-primary/15 text-primary",
      accent: "border-primary/30",
    },
    {
      icon: Trophy,
      label: "Retos de 21 Días",
      description: "Completa retos diarios y forma hábitos",
      color: "bg-accent/30 text-foreground",
      accent: "border-accent/40",
    },
    {
      icon: TrendingUp,
      label: "Mi Progreso",
      description: "Visualiza tu avance y logros",
      color: "bg-primary/10 text-primary",
      accent: "border-primary/20",
    },
    {
      icon: Settings,
      label: "Configuración",
      description: "Ajusta tu perfil y preferencias",
      color: "bg-secondary text-foreground",
      accent: "border-border",
    },
  ];

  return (
    <div
      data-ocid="menu.page"
      className="relative flex h-screen w-full flex-col overflow-hidden bg-background"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/15 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col h-full overflow-y-auto">
        {/* Top bar with Instrucciones button */}
        <div className="flex items-center justify-between px-5 pt-10 pb-0">
          <div className="flex-1" />
          <Button
            data-ocid="menu.open_modal_button"
            variant="outline"
            size="sm"
            onClick={() =>
              window.open("https://youtube.com/shorts/VmwrV0qycxE", "_blank")
            }
            className="flex items-center gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 h-8"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Instrucciones
          </Button>
        </div>

        {/* Top section with mascot and greeting */}
        <div className="flex flex-col items-center px-6 pt-4 pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-accent/40 blur-md" />
            <img
              src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
              alt="Chibi Boy mascota"
              className="relative z-10 w-28 max-w-[35vw] drop-shadow-md"
              draggable={false}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 text-center"
          >
            <h1 className="font-display text-3xl font-bold text-foreground">
              ¡Hola, {displayName}! 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Bienvenido/a a tu espacio de ahorro
            </p>
          </motion.div>
        </div>

        {/* User data card */}
        {(userData.nombre || userData.metas) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mx-4 mb-4 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
              Tu perfil
            </p>
            {userData.nombre && (
              <div className="mb-1.5">
                <p className="text-xs text-muted-foreground">Nombre y edad</p>
                <p className="text-sm font-semibold text-foreground">
                  {userData.nombre}
                  {userData.edad ? ` · ${userData.edad} años` : ""}
                </p>
              </div>
            )}
            {userData.metas && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Mis metas secundarias
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
                  {userData.metas}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Menu grid */}
        <div className="px-4 pb-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1"
          >
            Menú Principal
          </motion.p>
          <div className="grid grid-cols-2 gap-3">
            {MENU_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  data-ocid={`menu.${item.label === "Retos de 21 Días" ? "primary_button" : item.label === "Mis Metas Secundarias" ? "secondary_button" : "button"}.${i + 1}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + i * 0.08,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleMenuItemClick(item.label)}
                  className={`flex flex-col items-start gap-2 rounded-2xl bg-card border ${item.accent} p-4 shadow-xs text-left transition-shadow hover:shadow-md`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-foreground leading-tight">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                      {item.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* TIPS DE AHORRO button — full width below the grid */}
          <motion.button
            type="button"
            data-ocid="tips.button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.72,
              duration: 0.4,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenTips}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-400/20 border border-amber-400/30 px-4 py-3.5 text-sm font-bold text-foreground shadow-xs hover:shadow-md transition-shadow"
          >
            <Lightbulb className="h-4 w-4 text-amber-500" />
            TIPS DE AHORRO 💡
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-auto px-4 pb-6 pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Hecho con ❤️ usando{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>

      {/* Mis Metas Overlay */}
      <AnimatePresence>
        {showMetas && (
          <motion.div
            data-ocid="metas.dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                Mis Metas Secundarias
              </h2>
              <button
                type="button"
                data-ocid="metas.cancel_button"
                onClick={() => setShowMetas(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
                aria-label="Cerrar mis metas secundarias"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col items-center pb-8">
                {/* Pig */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="relative mb-1"
                >
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-primary/25 blur-md" />
                  <img
                    src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                    alt="Chibi Boy"
                    className="relative z-10 w-32 drop-shadow-md"
                    draggable={false}
                  />
                </motion.div>

                {/* Speech bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative w-full max-w-sm rounded-2xl bg-primary/15 border border-primary/30 px-4 py-4 mt-2"
                >
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary/15" />
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    ¿Qué quieres lograr y para qué quieres ahorrar? Cuéntame tu
                    meta, yo te acompaño en este camino. 🐷✨
                  </p>
                </motion.div>

                {/* Textarea */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-sm mt-5"
                >
                  <label
                    htmlFor="meta-textarea"
                    className="block text-xs font-bold text-primary uppercase tracking-wide mb-2"
                  >
                    Mi meta secundaria de ahorro
                  </label>
                  <Textarea
                    id="meta-textarea"
                    data-ocid="metas.textarea"
                    value={metaText}
                    onChange={(e) => setMetaText(e.target.value)}
                    placeholder="Escribe aquí tu meta de ahorro..."
                    className="min-h-[120px] resize-none rounded-2xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </motion.div>
              </div>
            </ScrollArea>

            {/* Bottom buttons */}
            <div className="flex gap-3 px-5 pb-8 pt-4 flex-shrink-0">
              <Button
                data-ocid="metas.cancel_button"
                variant="outline"
                onClick={() => setShowMetas(false)}
                className="flex-1 h-12 rounded-2xl font-bold border-border"
              >
                Volver
              </Button>
              <Button
                data-ocid="metas.save_button"
                onClick={handleSaveMeta}
                className="flex-1 h-12 rounded-2xl bg-primary font-bold text-primary-foreground shadow-md shadow-primary/30"
              >
                Guardar Meta Secundaria 💾
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mi Progreso Overlay */}
      <AnimatePresence>
        {showProgreso && (
          <motion.div
            data-ocid="progreso.dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                Mi Progreso
              </h2>
              <button
                type="button"
                data-ocid="progreso.close_button"
                onClick={() => setShowProgreso(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
                aria-label="Cerrar progreso"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col items-center pb-8">
                {/* Pig */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="relative mb-1"
                >
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-primary/25 blur-md" />
                  <img
                    src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                    alt="Chibi Boy"
                    className="relative z-10 w-36 drop-shadow-md"
                    draggable={false}
                  />
                </motion.div>

                {/* Savings amount */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 w-full max-w-sm rounded-3xl bg-primary/15 border border-primary/30 px-6 py-6 text-center"
                >
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Lo que llevas ahorrado
                  </p>
                  <p className="text-5xl font-extrabold text-primary leading-tight">
                    ${savingsTotal}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">pesos 🐷</p>
                </motion.div>

                {/* Speech bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative w-full max-w-sm rounded-2xl bg-accent/20 border border-accent/40 px-4 py-4 mt-5"
                >
                  <p className="text-sm text-foreground leading-relaxed font-medium text-center">
                    {savingsTotal > 0
                      ? `¡Llevas $${savingsTotal} ahorrados! No es solo dinero, son decisiones que cuentan. ¡Sigue así! ✨`
                      : "¡Completa retos para ver crecer tu alcancía! Cada peso cuenta. 🌟"}
                  </p>
                </motion.div>
              </div>
            </ScrollArea>

            {/* Bottom button */}
            <div className="px-5 pb-8 pt-4 flex-shrink-0">
              <Button
                data-ocid="progreso.cancel_button"
                variant="outline"
                onClick={() => setShowProgreso(false)}
                className="w-full h-12 rounded-2xl font-bold border-border"
              >
                Volver al Menú
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuración Overlay */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            data-ocid="config.dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                Configuración
              </h2>
              <button
                type="button"
                data-ocid="config.close_button"
                onClick={() => setShowConfig(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
                aria-label="Cerrar configuración"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col gap-5 pb-8 max-w-sm mx-auto w-full">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="config-nombre"
                    className="block text-xs font-bold text-primary uppercase tracking-wide mb-2"
                  >
                    Nombre
                  </label>
                  <Input
                    id="config-nombre"
                    data-ocid="config.input"
                    value={configNombre}
                    onChange={(e) => setConfigNombre(e.target.value)}
                    placeholder="¿Cómo te llamas?"
                    className="rounded-2xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-12"
                  />
                </div>

                {/* Edad */}
                <div>
                  <label
                    htmlFor="config-edad"
                    className="block text-xs font-bold text-primary uppercase tracking-wide mb-2"
                  >
                    Edad
                  </label>
                  <Input
                    id="config-edad"
                    data-ocid="config.input"
                    type="number"
                    value={configEdad}
                    onChange={(e) => setConfigEdad(e.target.value)}
                    placeholder="¿Cuántos años tienes?"
                    className="rounded-2xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-12"
                  />
                </div>

                {/* Meta */}
                <div>
                  <label
                    htmlFor="config-meta"
                    className="block text-xs font-bold text-primary uppercase tracking-wide mb-2"
                  >
                    Mi Meta
                  </label>
                  <Textarea
                    id="config-meta"
                    data-ocid="config.textarea"
                    value={configMeta}
                    onChange={(e) => setConfigMeta(e.target.value)}
                    placeholder="¿Qué quieres lograr con tu ahorro?"
                    className="min-h-[100px] resize-none rounded-2xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </div>
              </div>
            </ScrollArea>

            {/* Bottom buttons */}
            <div className="flex flex-col gap-3 px-5 pb-8 pt-4 flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  data-ocid="config.cancel_button"
                  variant="outline"
                  onClick={() => setShowConfig(false)}
                  className="flex-1 h-12 rounded-2xl font-bold border-border"
                >
                  Cancelar
                </Button>
                <Button
                  data-ocid="config.save_button"
                  onClick={handleSaveConfig}
                  className="flex-1 h-12 rounded-2xl bg-primary font-bold text-primary-foreground shadow-md shadow-primary/30"
                >
                  Guardar 💾
                </Button>
              </div>
              <Button
                data-ocid="config.secondary_button"
                variant="outline"
                onClick={handleVerOnboarding}
                className="w-full h-11 rounded-2xl font-semibold border-border text-muted-foreground gap-2 hover:text-foreground hover:border-primary/40"
              >
                <RotateCcw className="h-4 w-4" />
                Ver Onboarding de nuevo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TIPS DE AHORRO Modal */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
            onClick={() => setShowTips(false)}
          >
            <motion.div
              data-ocid="tips.modal"
              initial={{ scale: 0.85, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 24 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative w-full max-w-xs rounded-3xl bg-card p-6 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative gradient ring */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-yellow-400/20 blur-2xl" />
              </div>

              {/* Title */}
              <p className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-1">
                TIPS DE AHORRO 💡
              </p>
              <p className="text-[10px] text-amber-600/80 font-semibold mb-3">
                (Tips recomendados por el Banco de México)
              </p>

              {/* Pig */}
              <div className="relative mx-auto w-24 mb-1">
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-amber-400/30 blur-md" />
                <img
                  src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                  alt="Chibi Boy"
                  className="relative z-10 w-full drop-shadow-md"
                  draggable={false}
                />
              </div>

              {/* Speech bubble */}
              <div className="relative mx-auto mb-5 rounded-2xl bg-amber-500/15 border border-amber-400/30 px-4 py-3">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-amber-500/15" />
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {currentFrase}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  data-ocid="tips.secondary_button"
                  variant="outline"
                  onClick={handleNewTip}
                  className="flex-1 h-11 rounded-2xl font-bold border-amber-400/40 text-amber-600 hover:bg-amber-500/10 gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Otro tip
                </Button>
                <Button
                  data-ocid="tips.close_button"
                  onClick={() => setShowTips(false)}
                  className="flex-1 h-11 rounded-2xl bg-amber-500 hover:bg-amber-600 font-bold text-white shadow-md shadow-amber-500/30"
                >
                  Cerrar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
