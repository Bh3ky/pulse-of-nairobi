// types/react-scrollama.d.ts
declare module 'react-scrollama' {
  import { ReactNode } from 'react';

  export interface StepData {
    data: any;
    index: number;
    element: HTMLElement;
  }

  export interface ScrollamaProps {
    onStepEnter?: (response: StepData) => void;
    onStepExit?: (response: StepData) => void;
    onStepProgress?: (response: StepData & { progress: number }) => void;
    offset?: number;
    threshold?: number;
    progress?: boolean;
    debug?: boolean;
    children?: ReactNode;
  }

  export interface StepProps {
    data?: any;
    children?: ReactNode;
  }

  export const Scrollama: React.FC<ScrollamaProps>;
  export const Step: React.FC<StepProps>;
}
