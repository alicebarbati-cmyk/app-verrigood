// Fix: Import React to provide types for React.ReactNode and React.ComponentType.
import React from 'react';

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ onBack: () => void }>;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  type: 'multiple' | 'open' | 'definition';
  options?: string[];
  correct?: number;
  answer?: string;
}

export interface RoutineSlot {
    start: string;
    end: string;
    activity: string;
    type: 'study' | 'break' | 'commitment';
}

export interface LessonSection {
    title: string;
    content: string;
    duration: number;
}

export interface LessonPlan {
    title: string;
    objective: string;
    materials: string[];
    sections: LessonSection[];
    assessment: string;
}

export interface InterdisciplinaryConnection {
    subject: string;
    connection: string;
}