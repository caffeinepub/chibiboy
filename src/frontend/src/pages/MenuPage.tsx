import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChallenges } from "@/context/ChallengeContext";
import { useUserData } from "@/context/UserContext";
import { ALL_PHRASES } from "@/data/phrases";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ---------- Meta Principal helpers ----------
interface MetaPrincipalData {
  nombre: string; // nombre de la meta
  monto: number; // monto total a ahorrar
  plazo: number; // días
  ahorroPorDia: number; // calculado
  ahorroAcumulado: number; // lo que lleva ahorrado de esta meta
  extraPorDia: number; // extra dispersado de días fallidos
  ultimaFechaLogro: string; // ISO date string del último día en que se marcó
  ultimaFechaFallo: string; // ISO date string del último día en que se falló
  historialDias: { fecha: string; logrado: boolean; monto: number }[];
}

const META_KEY = "chibiBoyMetaPrincipalV2";

function loadMeta(): MetaPrincipalData | null {
  try {
    const s = localStorage.getItem(META_KEY);
    if (!s) return null;
    return JSON.parse(s) as MetaPrincipalData;
  } catch {
    return null;
  }
}

function saveMeta(m: MetaPrincipalData) {
  localStorage.setItem(META_KEY, JSON.stringify(m));
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function randomPhrase(): string {
  return ALL_PHRASES[Math.floor(Math.random() * ALL_PHRASES.length)];
}

// ---------- Component ----------
export default function MenuPage() {
  const { userData, setUserData } = useUserData();
  const { getSavingsTotal } = useChallenges();
  const navigate = useNavigate();

  // Tips
  const [showTips, setShowTips] = useState(false);
  const [currentFrase, setCurrentFrase] = useState<string>(() =>
    randomPhrase(),
  );

  // Mi Progreso
  const [showProgreso, setShowProgreso] = useState(false);

  // Configuración
  const [showConfig, setShowConfig] = useState(false);
  const [configNombre, setConfigNombre] = useState(userData.nombre || "");
  const [configEdad, setConfigEdad] = useState(userData.edad || "");
  const [configMeta, setConfigMeta] = useState(userData.metas || "");

  // Meta Principal
  const [showMetaPrincipal, setShowMetaPrincipal] = useState(false);
  const [metaData, setMetaData] = useState<MetaPrincipalData | null>(() =>
    loadMeta(),
  );

  // Formulario de nueva meta
  const [formNombre, setFormNombre] = useState("");
  const [formMonto, setFormMonto] = useState("");
  const [formPlazo, setFormPlazo] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Mensaje motivacional tras acción diaria
  const [showMotivacion, setShowMotivacion] = useState(false);
  const [motivacionMsg, setMotivacionMsg] = useState("");
  const [motivacionSuccess, setMotivacionSuccess] = useState(true);

  const displayName = userData.nombre || "Amigo/a";
  const savingsTotal = getSavingsTotal();

  // Derived: has the user already acted today?
  const today = todayStr();
  const alreadyActedToday = metaData
    ? metaData.ultimaFechaLogro === today || metaData.ultimaFechaFallo === today
    : false;

  // Pre-fill form when editing existing meta
  useEffect(() => {
    if (showForm && metaData) {
      setFormNombre(metaData.nombre);
      setFormMonto(String(metaData.monto));
      setFormPlazo(String(metaData.plazo));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, metaData]);

  function handleMenuItemClick(label: string) {
    if (label === "Retos de 21 Días") {
      navigate({ to: "/retos" });
    } else if (label === "Meta Principal") {
      setShowMetaPrincipal(true);
    } else if (label === "Mi Progreso") {
      setShowProgreso(true);
    } else if (label === "Configuración") {
      setConfigNombre(userData.nombre || "");
      setConfigEdad(userData.edad || "");
      setConfigMeta(userData.metas || "");
      setShowConfig(true);
    }
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

  // ---------- Meta Principal actions ----------

  function handleCrearMeta() {
    const monto = Number.parseFloat(formMonto);
    const plazo = Number.parseInt(formPlazo, 10);
    if (
      !formNombre.trim() ||
      Number.isNaN(monto) ||
      monto <= 0 ||
      Number.isNaN(plazo) ||
      plazo <= 0
    ) {
      toast.error("Por favor completa todos los campos correctamente.");
      return;
    }
    const ahorroPorDia = Math.ceil((monto / plazo) * 100) / 100;
    const nueva: MetaPrincipalData = {
      nombre: formNombre.trim(),
      monto,
      plazo,
      ahorroPorDia,
      ahorroAcumulado: 0,
      extraPorDia: 0,
      ultimaFechaLogro: "",
      ultimaFechaFallo: "",
      historialDias: [],
    };
    saveMeta(nueva);
    setMetaData(nueva);
    setShowForm(false);
    toast.success("¡Meta creada! Chibi te acompaña. 🌟");
  }

  function handleLogrado() {
    if (!metaData || alreadyActedToday) return;
    const montoDia = metaData.ahorroPorDia + metaData.extraPorDia;
    const updated: MetaPrincipalData = {
      ...metaData,
      ahorroAcumulado: metaData.ahorroAcumulado + montoDia,
      extraPorDia: 0,
      ultimaFechaLogro: today,
      historialDias: [
        ...metaData.historialDias,
        { fecha: today, logrado: true, monto: montoDia },
      ],
    };
    saveMeta(updated);
    setMetaData(updated);
    setMotivacionMsg(randomPhrase());
    setMotivacionSuccess(true);
    setShowMotivacion(true);
  }

  function handleNoLogrado() {
    if (!metaData || alreadyActedToday) return;
    const montoDia = metaData.ahorroPorDia + metaData.extraPorDia;
    // Disperse failed amount into next days
    const diasRestantes = calcDiasRestantes(metaData);
    const extraNuevo = diasRestantes > 0 ? montoDia / diasRestantes : 0;
    const updated: MetaPrincipalData = {
      ...metaData,
      extraPorDia: metaData.extraPorDia + extraNuevo,
      ultimaFechaFallo: today,
      historialDias: [
        ...metaData.historialDias,
        { fecha: today, logrado: false, monto: 0 },
      ],
    };
    saveMeta(updated);
    setMetaData(updated);
    setMotivacionMsg(
      "No te preocupes, mañana reintentamos. ¡Lo importante es seguir! 💪",
    );
    setMotivacionSuccess(false);
    setShowMotivacion(true);
  }

  function calcDiasRestantes(m: MetaPrincipalData): number {
    const diasTranscurridos = m.historialDias.length;
    return Math.max(0, m.plazo - diasTranscurridos - 1);
  }

  function calcProgresoPct(m: MetaPrincipalData): number {
    return Math.min(100, Math.round((m.ahorroAcumulado / m.monto) * 100));
  }

  const MENU_ITEMS = [
    {
      icon: Target,
      label: "Meta Principal",
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
        {/* Top bar */}
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

        {/* Mascot & greeting */}
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
                <p className="text-xs text-muted-foreground">Mi meta</p>
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
                  data-ocid={`menu.${i + 1}.button`}
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

          {/* TIPS DE AHORRO button */}
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

      {/* ===================== META PRINCIPAL OVERLAY ===================== */}
      <AnimatePresence>
        {showMetaPrincipal && (
          <motion.div
            data-ocid="meta-principal.dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                Meta Principal 🌟
              </h2>
              <button
                type="button"
                data-ocid="meta-principal.close_button"
                onClick={() => {
                  setShowMetaPrincipal(false);
                  setShowForm(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
                aria-label="Cerrar meta principal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col items-center pb-8 max-w-sm mx-auto w-full">
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
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-yellow-400/25 blur-md" />
                  <img
                    src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                    alt="Chibi Boy"
                    className="relative z-10 w-28 drop-shadow-md"
                    draggable={false}
                  />
                </motion.div>

                {/* ---- NO META YET or FORM ---- */}
                {!metaData || showForm ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="w-full"
                  >
                    {/* Instruction bubble */}
                    <div className="relative w-full rounded-2xl bg-yellow-400/15 border border-yellow-400/30 px-4 py-4 mb-5">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-yellow-400/15" />
                      <p className="text-sm font-bold text-foreground mb-1">
                        ¡Hola! Soy Chibi. 🐷
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Pon una meta de ahorro, dime cuánto necesitas y en
                        cuántos días quieres lograrlo. Yo calcularé
                        automáticamente cuánto debes ahorrar cada día. Cada día
                        podrás marcar si lo lograste o no.
                      </p>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-4 w-full">
                      <div>
                        <label
                          htmlFor="meta-nombre"
                          className="block text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1"
                        >
                          ¿Cuál es tu meta? (nombre)
                        </label>
                        <Input
                          id="meta-nombre"
                          data-ocid="meta-principal.input"
                          value={formNombre}
                          onChange={(e) => setFormNombre(e.target.value)}
                          placeholder="Ej: mis tenis nuevos, viaje, laptop..."
                          className="rounded-2xl border-yellow-400/40 bg-card h-12"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="meta-monto"
                          className="block text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1"
                        >
                          ¿Cuánto necesitas ahorrar? ($)
                        </label>
                        <Input
                          id="meta-monto"
                          data-ocid="meta-principal.input"
                          type="number"
                          value={formMonto}
                          onChange={(e) => setFormMonto(e.target.value)}
                          placeholder="Ej: 500"
                          className="rounded-2xl border-yellow-400/40 bg-card h-12"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="meta-plazo"
                          className="block text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1"
                        >
                          ¿En cuántos días? (plazo)
                        </label>
                        <Input
                          id="meta-plazo"
                          data-ocid="meta-principal.input"
                          type="number"
                          value={formPlazo}
                          onChange={(e) => setFormPlazo(e.target.value)}
                          placeholder="Ej: 30"
                          className="rounded-2xl border-yellow-400/40 bg-card h-12"
                        />
                      </div>

                      {/* Auto-calculation preview */}
                      {formMonto &&
                        formPlazo &&
                        Number.parseFloat(formMonto) > 0 &&
                        Number.parseInt(formPlazo) > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-2xl bg-green-500/15 border border-green-500/30 px-4 py-3 text-center"
                          >
                            <p className="text-xs text-green-700 font-bold uppercase tracking-wide mb-1">
                              Cálculo automático
                            </p>
                            <p className="text-2xl font-extrabold text-green-600">
                              $
                              {(
                                Math.ceil(
                                  (Number.parseFloat(formMonto) /
                                    Number.parseInt(formPlazo)) *
                                    100,
                                ) / 100
                              ).toFixed(2)}
                            </p>
                            <p className="text-xs text-green-700">
                              por día durante {formPlazo} días
                            </p>
                          </motion.div>
                        )}

                      <div className="flex gap-3 pt-2">
                        {showForm && metaData && (
                          <Button
                            data-ocid="meta-principal.cancel_button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="flex-1 h-12 rounded-2xl font-bold"
                          >
                            Cancelar
                          </Button>
                        )}
                        <Button
                          data-ocid="meta-principal.save_button"
                          onClick={handleCrearMeta}
                          className="flex-1 h-12 rounded-2xl bg-yellow-500 hover:bg-yellow-600 font-bold text-white shadow-md shadow-yellow-500/30"
                        >
                          {showForm && metaData
                            ? "Actualizar Meta"
                            : "Crear Meta 🌟"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ---- EXISTING META DASHBOARD ---- */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="w-full"
                  >
                    {/* Meta card */}
                    <div className="rounded-2xl bg-yellow-400/10 border border-yellow-400/30 px-5 py-4 mb-4">
                      <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide mb-1">
                        Tu meta
                      </p>
                      <p className="text-lg font-extrabold text-foreground mb-2">
                        {metaData.nombre}
                      </p>

                      {/* Progress bar */}
                      <div className="w-full h-3 rounded-full bg-yellow-200/40 mb-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-yellow-500 transition-all duration-700"
                          style={{ width: `${calcProgresoPct(metaData)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-3">
                        <span>
                          ${metaData.ahorroAcumulado.toFixed(2)} ahorrados
                        </span>
                        <span>${metaData.monto} meta total</span>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl bg-card border border-border px-2 py-2">
                          <p className="text-xs text-muted-foreground">
                            Por día
                          </p>
                          <p className="text-sm font-extrabold text-primary">
                            $
                            {(
                              metaData.ahorroPorDia + metaData.extraPorDia
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-card border border-border px-2 py-2">
                          <p className="text-xs text-muted-foreground">Plazo</p>
                          <p className="text-sm font-extrabold text-primary">
                            {metaData.plazo} días
                          </p>
                        </div>
                        <div className="rounded-xl bg-card border border-border px-2 py-2">
                          <p className="text-xs text-muted-foreground">
                            Progreso
                          </p>
                          <p className="text-sm font-extrabold text-primary">
                            {calcProgresoPct(metaData)}%
                          </p>
                        </div>
                      </div>

                      {metaData.extraPorDia > 0 && (
                        <div className="mt-3 rounded-xl bg-orange-500/10 border border-orange-400/30 px-3 py-2 text-xs text-orange-700 font-semibold">
                          +${metaData.extraPorDia.toFixed(2)} extra de días no
                          logrados distribuidos hoy
                        </div>
                      )}
                    </div>

                    {/* Daily action */}
                    <div className="rounded-2xl bg-card border border-border px-5 py-4 mb-4">
                      <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                        Acción de hoy
                      </p>
                      <p className="text-sm text-foreground/80 mb-3">
                        {alreadyActedToday
                          ? "Ya marcaste tu progreso de hoy. ¡Vuelve mañana! 🌙"
                          : `¿Lograste ahorrar $${(metaData.ahorroPorDia + metaData.extraPorDia).toFixed(2)} hoy?`}
                      </p>

                      {!alreadyActedToday ? (
                        <div className="flex gap-3">
                          <Button
                            data-ocid="meta-principal.confirm_button"
                            onClick={handleLogrado}
                            className="flex-1 h-12 rounded-2xl bg-green-500 hover:bg-green-600 font-bold text-white shadow-md shadow-green-500/25 gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Lo Logré ✅
                          </Button>
                          <Button
                            data-ocid="meta-principal.secondary_button"
                            onClick={handleNoLogrado}
                            variant="outline"
                            className="flex-1 h-12 rounded-2xl font-bold border-red-400/40 text-red-500 hover:bg-red-500/10 gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            No Logré ❌
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${metaData.ultimaFechaLogro === today ? "bg-green-500/15 text-green-700 border border-green-400/30" : "bg-red-500/10 text-red-600 border border-red-400/30"}`}
                        >
                          {metaData.ultimaFechaLogro === today
                            ? "¡Genial! Guardaste tu ahorro de hoy 🎉"
                            : "No te rindas, mañana es otro día 💪"}
                        </div>
                      )}
                    </div>

                    {/* Historial reciente */}
                    {metaData.historialDias.length > 0 && (
                      <div className="rounded-2xl bg-card border border-border px-5 py-4 mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                          Últimos días
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {metaData.historialDias.slice(-14).map((d) => (
                            <div
                              key={d.fecha}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${d.logrado ? "bg-green-500 text-white" : "bg-red-400 text-white"}`}
                              title={d.fecha}
                            >
                              {d.logrado ? "✓" : "✗"}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Edit button */}
                    <Button
                      data-ocid="meta-principal.edit_button"
                      variant="outline"
                      onClick={() => {
                        setFormNombre(metaData.nombre);
                        setFormMonto(String(metaData.monto));
                        setFormPlazo(String(metaData.plazo));
                        setShowForm(true);
                      }}
                      className="w-full h-11 rounded-2xl font-semibold border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    >
                      Editar Meta
                    </Button>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="px-5 pb-8 pt-4 flex-shrink-0">
              <Button
                data-ocid="meta-principal.cancel_button"
                variant="outline"
                onClick={() => {
                  setShowMetaPrincipal(false);
                  setShowForm(false);
                }}
                className="w-full h-12 rounded-2xl font-bold border-border"
              >
                Volver al Menú
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== MOTIVACION OVERLAY ===================== */}
      <AnimatePresence>
        {showMotivacion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-6"
            onClick={() => setShowMotivacion(false)}
          >
            <motion.div
              data-ocid="motivacion.modal"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className={`relative w-full max-w-xs rounded-3xl p-6 shadow-2xl text-center ${motivacionSuccess ? "bg-green-50 border border-green-300" : "bg-orange-50 border border-orange-300"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative mx-auto w-24 mb-2">
                <div
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full blur-md ${motivacionSuccess ? "bg-green-400/30" : "bg-orange-400/30"}`}
                />
                <img
                  src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                  alt="Chibi"
                  className="relative z-10 w-full drop-shadow-md"
                  draggable={false}
                />
              </div>
              <p
                className={`text-sm font-bold leading-relaxed mb-4 ${motivacionSuccess ? "text-green-800" : "text-orange-800"}`}
              >
                {motivacionMsg}
              </p>
              <Button
                data-ocid="motivacion.close_button"
                onClick={() => setShowMotivacion(false)}
                className={`w-full h-11 rounded-2xl font-bold text-white shadow-md ${motivacionSuccess ? "bg-green-500 hover:bg-green-600 shadow-green-500/30" : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"}`}
              >
                {motivacionSuccess ? "¡Genial! 🎉" : "Entendido 💪"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== MI PROGRESO OVERLAY ===================== */}
      <AnimatePresence>
        {showProgreso && (
          <motion.div
            data-ocid="progreso.dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            <div className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                Mi Progreso
              </h2>
              <button
                type="button"
                data-ocid="progreso.close_button"
                onClick={() => setShowProgreso(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col items-center pb-8 max-w-sm mx-auto w-full">
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
                  className="relative mb-2"
                >
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-primary/25 blur-md" />
                  <img
                    src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                    alt="Chibi Boy"
                    className="relative z-10 w-32 drop-shadow-md"
                    draggable={false}
                  />
                </motion.div>

                {/* Retos savings */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 w-full rounded-3xl bg-primary/15 border border-primary/30 px-6 py-5 text-center mb-4"
                >
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Ahorrado con Retos 🏆
                  </p>
                  <p className="text-5xl font-extrabold text-primary leading-tight">
                    ${savingsTotal}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    pesos de retos completados
                  </p>
                </motion.div>

                {/* Meta Principal savings — SEPARATE SECTION */}
                {metaData && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full rounded-3xl bg-yellow-400/15 border border-yellow-400/30 px-6 py-5 text-center mb-4"
                  >
                    <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">
                      Ahorrado · Meta Principal 🌟
                    </p>
                    <p className="text-4xl font-extrabold text-yellow-600 leading-tight">
                      ${metaData.ahorroAcumulado.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      de ${metaData.monto} —{" "}
                      <span className="font-semibold">{metaData.nombre}</span>
                    </p>
                    {/* Progress bar */}
                    <div className="w-full h-2.5 rounded-full bg-yellow-200/40 mt-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-yellow-500 transition-all duration-700"
                        style={{ width: `${calcProgresoPct(metaData)}%` }}
                      />
                    </div>
                    <p className="text-xs text-yellow-600 font-bold mt-1">
                      {calcProgresoPct(metaData)}% completado
                    </p>
                  </motion.div>
                )}

                {/* Chibi message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="relative w-full rounded-2xl bg-accent/20 border border-accent/40 px-4 py-4"
                >
                  <p className="text-sm text-foreground leading-relaxed font-medium text-center">
                    {savingsTotal > 0 ||
                    (metaData && metaData.ahorroAcumulado > 0)
                      ? "¡Vas muy bien! No es solo dinero, son decisiones que cuentan. ¡Sigue así! ✨"
                      : "¡Completa retos y cumple tu meta para ver crecer tu alcancía! 🌟"}
                  </p>
                </motion.div>
              </div>
            </ScrollArea>

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

      {/* ===================== CONFIGURACIÓN OVERLAY ===================== */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            data-ocid="config.dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            <div className="flex items-center justify-between px-5 pt-10 pb-4 flex-shrink-0">
              <h2 className="font-display text-xl font-bold text-foreground">
                Configuración
              </h2>
              <button
                type="button"
                data-ocid="config.close_button"
                onClick={() => setShowConfig(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col gap-5 pb-8 max-w-sm mx-auto w-full">
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
                <div>
                  <label
                    htmlFor="config-meta"
                    className="block text-xs font-bold text-primary uppercase tracking-wide mb-2"
                  >
                    Mi Meta
                  </label>
                  <Input
                    id="config-meta"
                    data-ocid="config.textarea"
                    value={configMeta}
                    onChange={(e) => setConfigMeta(e.target.value)}
                    placeholder="¿Qué quieres lograr con tu ahorro?"
                    className="rounded-2xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-12"
                  />
                </div>
              </div>
            </ScrollArea>

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

      {/* ===================== TIPS DE AHORRO MODAL ===================== */}
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
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-yellow-400/20 blur-2xl" />
              </div>
              <p className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-1">
                TIPS DE AHORRO 💡
              </p>
              <p className="text-[10px] text-amber-600/80 font-semibold mb-3">
                (Tips recomendados por el Banco de México)
              </p>
              <div className="relative mx-auto w-24 mb-1">
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-amber-400/30 blur-md" />
                <img
                  src="/assets/generated/chibi-pig-cloud-transparent.dim_400x500.png"
                  alt="Chibi Boy"
                  className="relative z-10 w-full drop-shadow-md"
                  draggable={false}
                />
              </div>
              <div className="relative mx-auto mb-5 rounded-2xl bg-amber-500/15 border border-amber-400/30 px-4 py-3">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-amber-500/15" />
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {currentFrase}
                </p>
              </div>
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
