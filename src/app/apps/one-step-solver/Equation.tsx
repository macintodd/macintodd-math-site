"use client";
import { Math } from '@/components/Math';
import React from 'react';

export default function Equation({ latex }: { latex: string }) {
  return <Math display>{latex}</Math>;
}
