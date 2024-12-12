import { writable } from 'svelte/store';

export const tariffs = writable([]);
export const currentReturn = writable(null);
export const currentNet = writable(null);
export const predictedGen = writable(null);
export const predictedUse = writable(null);
