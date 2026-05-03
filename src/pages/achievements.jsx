/* eslint-disable react-hooks/immutability */
import { Trophy, Lock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../data_base/db.jsx";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const data = await db.achievements.toArray();
    setAchievements(data);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-6">
      <div className="pt-4 pb-10 text-center">
        <h1 className="text-4xl font-extrabold">
          Hall de <span className="text-blue-500">Conquistas</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item) => (
          <article
            key={item.id}
            className={`rounded-3xl border p-6 ${
              item.unlocked
                ? "bg-[#1a1d23] border-blue-500/20"
                : "bg-[#111317] border-white/5 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              {item.unlocked ? (
                <Trophy className="text-blue-400" />
              ) : (
                <Lock className="text-gray-500" />
              )}

              {item.unlocked && <CheckCircle2 className="text-green-400" />}
            </div>

            <h3 className="text-white font-bold">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}