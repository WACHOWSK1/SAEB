'use client';

import { useSyncExternalStore } from 'react';
import { DEFAULT_THRESHOLDS, PerformanceThresholds } from '../types/saeb';

const KEY = 'saeb-2023-thresholds';
const EVENT = 'saeb-thresholds-change';
let cachedRaw: string | null = null;
let cached = DEFAULT_THRESHOLDS;

export function validThresholds(value: PerformanceThresholds): boolean {
  const { criticoMax: a, atencaoMax: b, intermediarioMax: c } = value;
  return [a, b, c].every(Number.isFinite) && 0 <= a && a < b && b < c && c <= 100;
}

function snapshot() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = raw ? JSON.parse(raw) : DEFAULT_THRESHOLDS;
      cached = parsed && validThresholds(parsed) ? parsed : DEFAULT_THRESHOLDS;
    }
  } catch { cached = DEFAULT_THRESHOLDS; }
  return cached;
}

function subscribe(notify: () => void) {
  window.addEventListener(EVENT, notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener(EVENT, notify);
    window.removeEventListener('storage', notify);
  };
}

export function saveThresholds(value: PerformanceThresholds) {
  if (!validThresholds(value)) throw new Error('Informe limites crescentes entre 0 e 100.');
  localStorage.setItem(KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

export function useThresholds() {
  return useSyncExternalStore(subscribe, snapshot, () => DEFAULT_THRESHOLDS);
}
