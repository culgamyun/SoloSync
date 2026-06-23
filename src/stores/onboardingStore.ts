'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { OnboardingDraft } from '@/types/onboarding';

const initialDraft: OnboardingDraft = {
  displayName: '',
  city: '',
  livingSituation: null,
  socialSatisfactionScore: 5,
  introversionLevel: 5,
  barriers: [],
  relationshipMap: {
    close_friends: 1,
    casual_friends: 3,
    family: 2,
    colleagues: 4
  },
  goals: ['deepen_existing'],
  comfortLevel: 'medium',
  routineSpaces: ['cafe'],
  socialFears: ['being_judged']
};

type OnboardingState = {
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  updateRelationshipMap: (key: keyof OnboardingDraft['relationshipMap'], value: number) => void;
  toggleListValue: (field: 'barriers' | 'goals' | 'routineSpaces' | 'socialFears', value: string) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
      updateRelationshipMap: (key, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            relationshipMap: {
              ...state.draft.relationshipMap,
              [key]: value
            }
          }
        })),
      toggleListValue: (field, value) =>
        set((state) => {
          const values = (state.draft[field] ?? []) as string[];
          return {
            draft: {
              ...state.draft,
              [field]: values.includes(value)
                ? values.filter((current) => current !== value)
                : [...values, value]
            }
          };
        }),
      reset: () => set({ draft: initialDraft })
    }),
    {
      name: 'solosync-onboarding'
    }
  )
);
