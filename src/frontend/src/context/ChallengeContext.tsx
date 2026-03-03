import { CHALLENGES } from "@/data/challenges";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export type DayStatus = "pending" | "completed" | "failed";
export type ChallengeLevel = "easy" | "medium" | "hard";

interface LevelProgress {
  statuses: DayStatus[];
}

interface AdvancedStatus {
  cuenta_ahorro: "none" | "in_progress" | "done";
  inversion: "none" | "in_progress" | "done";
  cetes: "none" | "in_progress" | "done";
}

interface ChallengeState {
  easy: LevelProgress;
  medium: LevelProgress;
  hard: LevelProgress;
  advancedStatus: AdvancedStatus;
  savingsTotal: number;
}

interface ChallengeContextValue {
  state: ChallengeState;
  // Computed
  mediumUnlocked: boolean;
  hardUnlocked: boolean;
  advancedUnlocked: boolean;
  easyAllAnswered: boolean;
  mediumAllAnswered: boolean;
  hardAllAnswered: boolean;
  easyPassed: boolean;
  mediumPassed: boolean;
  hardPassed: boolean;
  // Actions
  setDayStatus: (
    level: ChallengeLevel,
    dayIndex: number,
    status: DayStatus,
  ) => void;
  resetLevel: (level: ChallengeLevel) => void;
  setAdvancedStatus: (
    topic: keyof AdvancedStatus,
    status: "none" | "in_progress" | "done",
  ) => void;
  getSavingsTotal: () => number;
}

const DEFAULT_LEVEL: LevelProgress = {
  statuses: Array(21).fill("pending") as DayStatus[],
};

const DEFAULT_STATE: ChallengeState = {
  easy: { ...DEFAULT_LEVEL, statuses: [...DEFAULT_LEVEL.statuses] },
  medium: { ...DEFAULT_LEVEL, statuses: [...DEFAULT_LEVEL.statuses] },
  hard: { ...DEFAULT_LEVEL, statuses: [...DEFAULT_LEVEL.statuses] },
  advancedStatus: {
    cuenta_ahorro: "none",
    inversion: "none",
    cetes: "none",
  },
  savingsTotal: 0,
};

function loadState(): ChallengeState {
  try {
    const stored = localStorage.getItem("chibiBoyProgress");
    if (!stored) return DEFAULT_STATE;
    const parsed = JSON.parse(stored) as Partial<ChallengeState>;
    return {
      easy: parsed.easy ?? {
        statuses: Array(21).fill("pending") as DayStatus[],
      },
      medium: parsed.medium ?? {
        statuses: Array(21).fill("pending") as DayStatus[],
      },
      hard: parsed.hard ?? {
        statuses: Array(21).fill("pending") as DayStatus[],
      },
      advancedStatus: parsed.advancedStatus ?? {
        cuenta_ahorro: "none",
        inversion: "none",
        cetes: "none",
      },
      savingsTotal: parsed.savingsTotal ?? 0,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: ChallengeState) {
  localStorage.setItem("chibiBoyProgress", JSON.stringify(state));
}

function countCompleted(statuses: DayStatus[]): number {
  return statuses.filter((s) => s === "completed").length;
}

function allAnswered(statuses: DayStatus[]): boolean {
  return statuses.every((s) => s !== "pending");
}

const ChallengeContext = createContext<ChallengeContextValue | undefined>(
  undefined,
);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChallengeState>(loadState);

  const setDayStatus = useCallback(
    (level: ChallengeLevel, dayIndex: number, status: DayStatus) => {
      setState((prev) => {
        const newStatuses = [...prev[level].statuses];
        const oldStatus = newStatuses[dayIndex];
        newStatuses[dayIndex] = status;

        // Add value to savings only when marking completed
        let savingsDelta = 0;
        if (status === "completed" && oldStatus !== "completed") {
          savingsDelta = CHALLENGES[level][dayIndex]?.value ?? 0;
        } else if (oldStatus === "completed" && status !== "completed") {
          savingsDelta = -(CHALLENGES[level][dayIndex]?.value ?? 0);
        }

        const next: ChallengeState = {
          ...prev,
          [level]: { statuses: newStatuses },
          savingsTotal: Math.max(0, prev.savingsTotal + savingsDelta),
        };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const resetLevel = useCallback((level: ChallengeLevel) => {
    setState((prev) => {
      const next: ChallengeState = {
        ...prev,
        [level]: { statuses: Array(21).fill("pending") as DayStatus[] },
      };
      saveState(next);
      return next;
    });
  }, []);

  const setAdvancedStatus = useCallback(
    (topic: keyof AdvancedStatus, status: "none" | "in_progress" | "done") => {
      setState((prev) => {
        const next: ChallengeState = {
          ...prev,
          advancedStatus: {
            ...prev.advancedStatus,
            [topic]: status,
          },
        };
        saveState(next);
        return next;
      });
    },
    [],
  );

  const getSavingsTotal = useCallback(
    () => state.savingsTotal,
    [state.savingsTotal],
  );

  const easyCompleted = countCompleted(state.easy.statuses);
  const mediumCompleted = countCompleted(state.medium.statuses);
  const hardCompleted = countCompleted(state.hard.statuses);

  const easyAllAnswered = allAnswered(state.easy.statuses);
  const mediumAllAnswered = allAnswered(state.medium.statuses);
  const hardAllAnswered = allAnswered(state.hard.statuses);

  const easyPassed = easyCompleted >= 17;
  const mediumPassed = mediumCompleted >= 17;
  const hardPassed = hardCompleted >= 17;

  const mediumUnlocked = easyPassed;
  const hardUnlocked = mediumPassed;
  const advancedUnlocked = hardPassed;

  return (
    <ChallengeContext.Provider
      value={{
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
        setDayStatus,
        resetLevel,
        setAdvancedStatus,
        getSavingsTotal,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenges() {
  const ctx = useContext(ChallengeContext);
  if (!ctx)
    throw new Error("useChallenges must be used within ChallengeProvider");
  return ctx;
}
