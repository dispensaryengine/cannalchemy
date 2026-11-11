import React from 'react';
export default function GeneticsEvidence({ strain }) {
  const labels = {'breeder-reported':'Breeder-reported',reported:'Reported lineage','producer-reported':'Producer-reported','breeder-interview':'Breeder interview',unknown:'Unknown parentage',disputed:'Disputed lineage'};
  return <section className="genetics-evidence"><span className={`evidence-badge ${strain.genetics_status}`}>{labels[strain.genetics_status]||'Reported lineage'}</span><p>{strain.genetics_note}</p>
    {strain.sources?.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.publisher} ↗</a>)}
    <small>Published ancestry is not genetic authentication. Named clones and stabilized lines cannot be recreated exactly by repeating a cross.</small>
  </section>;
}
