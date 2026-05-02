import { db } from "../data_base/db.jsx";
import { notifySuccess } from "../core/notification.jsx";

export async function checkAchievement(achievementId) {
  try {
    const achievement = await db.achievements.get(achievementId);

    if (!achievement || achievement.unlocked) return false;

    let shouldUnlock = false;

    switch (achievementId) {
      case "first_import":
      case "first_favorite":
        shouldUnlock = true;
        break;

      case "book_collector": {
        const total = await db.books.count();
        shouldUnlock = total >= 5;
        break;
      }

      case "library_master": {
        const total = await db.books.count();
        shouldUnlock = total >= 10;
        break;
      }

      case "first_finish": {
        const completed = await db.books.filter(book => book.completed).count();
        shouldUnlock = completed >= 1;
        break;
      }

      case "bookworm": {
        const completed = await db.books.filter(book => book.completed).count();
        shouldUnlock = completed >= 5;
        break;
      }

      case "reading_master": {
        const completed = await db.books.filter(book => book.completed).count();
        shouldUnlock = completed >= 10;
        break;
      }

      default:
        break;
    }

    if (shouldUnlock) {
      await db.achievements.update(achievementId, {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      });

      notifySuccess(`🏆 Conquista desbloqueada!`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro em achievementService:", error);
    return false;
  }
}