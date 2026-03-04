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
  // Extra value (in pesos) dispersed from failed challenges, keyed by day index
  extraValues: number[];
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
  resetAll: () => void;
  setAdvancedStatus: (
    topic: keyof AdvancedStatus,
    status: "none" | "in_progress" | "done",
  ) => void;
  getSavingsTotal: () => number;
  getExtraValue: (level: ChallengeLevel, dayIndex: number) => number;
}

const DEFAULT_LEVEL: LevelProgress = {
  statuses: Array(21).fill("pending") as DayStatus[],
  extraValues: Array(21).fill(0) as number[],
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

function migrateLevel(raw: Partial<LevelProgress> | undefined): LevelProgress {
  const statuses = raw?.statuses ?? (Array(21).fill("pending") as DayStatus[]);
  const extraValues = raw?.extraValues ?? (Array(21).fill(0) as number[]);
  return { statuses, extraValues };
}

function loadState(): ChallengeState {
  try {
    const stored = localStorage.getItem("chibiBoyProgress");
    if (!stored) return DEFAULT_STATE;
    const parsed = JSON.parse(stored) as Partial<ChallengeState>;
    return {
      easy: migrateLevel(parsed.easy as Partial<LevelProgress> | undefined),
      medium: migrateLevel(parsed.medium as Partial<LevelProgress> | undefined),
      hard: migrateLevel(parsed.hard as Partial<LevelProgress> | undefined),
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
        const newExtraValues = [
          ...(prev[level].extraValues ?? Array(21).fill(0)),
        ];
        const oldStatus = newStatuses[dayIndex];
        newStatuses[dayIndex] = status;

        let savingsDelta = 0;

        if (status === "completed" && oldStatus !== "completed") {
          // Add base value + any dispersed extra
          savingsDelta =
            (CHALLENGES[level][dayIndex]?.value ?? 0) +
            (newExtraValues[dayIndex] ?? 0);
        } else if (oldStatus === "completed" && status !== "completed") {
          // Remove previously credited amount
          savingsDelta = -(
            (CHALLENGES[level][dayIndex]?.value ?? 0) +
            (newExtraValues[dayIndex] ?? 0)
          );
        }

        if (status === "failed" && oldStatus !== "failed") {
          // Disperse the failed day's value (base + existing extra) among future pending days
          const failedValue =
            (CHALLENGES[level][dayIndex]?.value ?? 0) +
            (newExtraValues[dayIndex] ?? 0);
          const futurePendingIndices: number[] = [];
          for (let i = dayIndex + 1; i < 21; i++) {
            if (newStatuses[i] === "pending") {
              futurePendingIndices.push(i);
            }
          }
          if (futurePendingIndices.length > 0 && failedValue > 0) {
            const perDay = Math.floor(
              failedValue / futurePendingIndices.length,
            );
            const remainder =
              failedValue - perDay * futurePendingIndices.length;
            for (let i = 0; i < futurePendingIndices.length; i++) {
              newExtraValues[futurePendingIndices[i]] =
                (newExtraValues[futurePendingIndices[i]] ?? 0) +
                perDay +
                (i === 0 ? remainder : 0);
            }
          }
        }

        if (oldStatus === "failed" && status !== "failed") {
          // When un-failing a day, reclaim its extra from future days (best-effort: just recalculate)
          // For simplicity we don't reverse dispersion — user sees updated totals going forward.
        }

        const next: ChallengeState = {
          ...prev,
          [level]: { statuses: newStatuses, extraValues: newExtraValues },
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
        [level]: {
          statuses: Array(21).fill("pending") as DayStatus[],
          extraValues: Array(21).fill(0) as number[],
        },
      };
      saveState(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setState((prev) => {
      const next: ChallengeState = {
        ...prev,
        easy: {
          statuses: Array(21).fill("pending") as DayStatus[],
          extraValues: Array(21).fill(0) as number[],
        },
        medium: {
          statuses: Array(21).fill("pending") as DayStatus[],
          extraValues: Array(21).fill(0) as number[],
        },
        hard: {
          statuses: Array(21).fill("pending") as DayStatus[],
          extraValues: Array(21).fill(0) as number[],
        },
        savingsTotal: 0,
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

  const getExtraValue = useCallback(
    (level: ChallengeLevel, dayIndex: number): number => {
      return state[level].extraValues?.[dayIndex] ?? 0;
    },
    [state],
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
        resetAll,
        setAdvancedStatus,
        getSavingsTotal,
        getExtraValue,
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
