import { useState } from "react";

const days = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

const routineSteps = [
  {
    id: 1,
    time: "Ráno (5 min)",
    emoji: "🌅",
    title: "Záměr dne",
    desc: "Před otevřením telefonu si polož otázku: 'O čem dnes napíšu?' Zapiš 1 větu – nápad na článek nebo pokračování rozepsaného.",
    color: "bg-amber-50 border-amber-300",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: 2,
    time: "Dopoledne / odpoledne (30–45 min)",
    emoji: "✍️",
    title: "Blok psaní",
    desc: "Zavři sociální sítě (telefon na letový režim nebo do jiné místnosti). Piš bez opravování – cíl je dostat myšlenky na papír. Klidně jen 300 slov.",
    color: "bg-blue-50 border-blue-300",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    time: "Volný moment (max 15 min)",
    emoji: "📱",
    title: "Vědomé okno pro sítě",
    desc: "Povol si jedno konkrétní časové okno pro sociální sítě – ne scrollování kdykoli. Nastav si časovač. Až zavoní, zavři.",
    color: "bg-purple-50 border-purple-300",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    time: "Večer (5 min)",
    emoji: "✅",
    title: "Reflexe",
    desc: "Napsal/a jsi dnes? Jak ses cítil/a bez scrollování? Zapiš 1–2 věty. Tato drobná reflexe buduje sebevědomí autora.",
    color: "bg-green-50 border-green-300",
    badge: "bg-green-100 text-green-700",
  },
];

const tips = [
  "Odinstaluj appky sociálních sítí z telefonu, nech je jen v prohlížeči.",
  "Nastav v telefonu 'Screen Time' limit na sítě (iOS) nebo 'Digital Wellbeing' (Android).",
  "Piš v aplikaci bez notifikací – Notion, Bear, nebo prostý Poznámkový blok.",
  "Každý dokončený článek = malá odměna (káva, procházka, epizoda seriálu).",
];

export default function App() {
  const initialChecked = {};
  days.forEach(d => routineSteps.forEach(s => { initialChecked[`${d}-${s.id}`] = false; }));
  const [checked, setChecked] = useState(initialChecked);
  const [activeDay, setActiveDay] = useState("Po");
  const [socialMinutes, setSocialMinutes] = useState(90);
  const [writingMinutes, setWritingMinutes] = useState(0);
  const [showTips, setShowTips] = useState(false);

  const toggle = (stepId) => {
    const key = `${activeDay}-${stepId}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const dayProgress = () => {
    const done = routineSteps.filter(s => checked[`${activeDay}-${s.id}`]).length;
    return Math.round((done / routineSteps.length) * 100);
  };

  const totalWriting = Object.entries(checked)
    .filter(([k, v]) => v && k.endsWith("-2")).length * 37;
  const totalSocialSaved = Object.entries(checked)
    .filter(([k, v]) => v && k.endsWith("-3")).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 font-sans">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🖊️</div>
          <h1 className="text-2xl font-bold text-slate-800">Méně scrollování, více psaní</h1>
          <p className="text-slate-500 text-sm mt-1">Denní rutina pro autora webu</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalWriting} min</div>
            <div className="text-xs text-slate-500 mt-1">Celkem psaní tento týden</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-green-600">{totalSocialSaved * 75} min</div>
            <div className="text-xs text-slate-500 mt-1">Ušetřeno na sítích tento týden</div>
          </div>
        </div>

        {/* Day selector */}
        <div className="flex gap-1.5 justify-center mb-5">
          {days.map(d => {
            const done = routineSteps.filter(s => checked[`${d}-${s.id}`]).length;
            const allDone = done === routineSteps.length;
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-all relative ${
                  activeDay === d
                    ? "bg-blue-600 text-white shadow-md scale-110"
                    : allDone
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {d}
                {allDone && <span className="absolute -top-1 -right-1 text-xs">✅</span>}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-5">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span className="font-medium">{activeDay} – dnešní pokrok</span>
            <span className="font-bold text-blue-600">{dayProgress()}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${dayProgress()}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-5">
          {routineSteps.map(step => {
            const key = `${activeDay}-${step.id}`;
            const isDone = checked[key];
            return (
              <div
                key={step.id}
                onClick={() => toggle(step.id)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                  isDone ? "opacity-60 bg-slate-50 border-slate-200" : step.color
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone ? "bg-green-500 border-green-500" : "border-slate-300 bg-white"
                  }`}>
                    {isDone && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{step.emoji}</span>
                      <span className="font-semibold text-slate-800">{step.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${step.badge}`}>{step.time}</span>
                    </div>
                    <p className={`text-sm mt-1 ${isDone ? "line-through text-slate-400" : "text-slate-600"}`}>{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips toggle */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition mb-3"
        >
          {showTips ? "▲ Skrýt tipy" : "💡 Zobraz tipy pro úspěch"}
        </button>
        {showTips && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-5 space-y-2">
            {tips.map((t, i) => (
              <div key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-yellow-500 font-bold">→</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-slate-400 pb-4">Klikni na krok pro označení jako hotovo ✓</p>
      </div>
    </div>
  );
}
