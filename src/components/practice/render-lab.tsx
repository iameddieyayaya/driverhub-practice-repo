"use client";

import { useEffect, useState } from "react";

export function RenderLab({ vehicles }: { vehicles: { id: string; make: string; model: string }[] }) {
  const [clock, setClock] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);
  // TODO(PRACTICE): Profile this component, identify why every row renders twice per second, and propose the smallest fix.
  return <section><p>Profiler clock: {clock}</p>{vehicles.map((vehicle) => <div key={vehicle.id}>{vehicle.make} {vehicle.model} · rendered at {clock}</div>)}</section>;
}
