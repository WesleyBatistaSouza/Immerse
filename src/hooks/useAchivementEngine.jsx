import { evaluateAchievements } from "../services/achievementService";
import { notifySuccess } from "../core/notification";

export function useAchievementEngine() {
  const triggerAchievement = async (trigger) => {
    const unlocked = await evaluateAchievements(trigger);

    if (unlocked) {
      notifySuccess(`🏆 Conquista desbloqueada: ${unlocked.title}`);
    }
  };

  return { triggerAchievement };
}