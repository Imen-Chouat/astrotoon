import React from 'react';

export default function InfoBadges({ infos, labels }) {
  const badgeList = [
    { label: labels.age, val: infos.age },
    { label: labels.planet, val: infos.planet },
    { label: labels.gender, val: infos.gender },
    { label: labels.skill, val: infos.specialSkill }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-auto px-4 justify-center items-center">
      {badgeList.map((info, idx) => (
        <div 
          key={idx} 
          className="bg-slate-900/80 px-4 py-2.5 rounded-xl border-2 border-amber-400 text-center shadow-[4px_4px_0px_0px_rgba(56,189,248,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all duration-300 group cursor-default min-w-60"
        >
          <span className="text-[10px] md:text-sm font-mono text-slate-400 uppercase block tracking-wider transition-colors group-hover:text-amber-400">
            {info.label}
          </span>
          <span className="text-lg font-black text-white block truncate">
            {info.val}
          </span>
        </div>
      ))}
    </div>
  );
}