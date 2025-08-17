"use client";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import React from 'react';

export default function Equation({ latex }: { latex: string }) {
  return <BlockMath math={latex} />;
}
