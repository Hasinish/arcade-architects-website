import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

/* Custom eases calibrated to Made for Award Component 031 */
export const EASE = {
  open: 'introOpen', // quick, crisp clip-path reveal
  fan: 'introFan', // deliberate vertical spread, soft stop
  settle: 'introSettle', // long, soft landing (typography & navbar)
  unveil: 'introUnveil', // slow start, decisive open (fullscreen clip-path)
  tally: 'introTally', // synchronized 0-100 counter curve
} as const;

let ready = false;

/** Registers GSAP plugins and CustomEase curves once on the client. */
export function setupGsap() {
  if (ready || typeof window === 'undefined') return;
  ready = true;
  gsap.registerPlugin(SplitText, CustomEase, useGSAP);
  CustomEase.create(EASE.open, 'M0,0 C0.2,0.8 0.3,1 1,1');
  CustomEase.create(EASE.fan, 'M0,0 C0.7,0 0.16,1 1,1');
  CustomEase.create(EASE.settle, 'M0,0 C0.14,1 0.34,1 1,1');
  CustomEase.create(EASE.unveil, 'M0,0 C0.62,0 0.08,1 1,1');
  CustomEase.create(EASE.tally, 'M0,0 C0.32,0 0.18,1 1,1');
}

export { gsap, SplitText, useGSAP };
