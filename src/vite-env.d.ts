/// <reference types="vite/client" />

import { Equation } from "./types/classes/Equation";
import { TargetFunction } from "./types/classes/TargetFunction";
import { ExtremumType } from "./types/enums/ExtremumType";
import { FractionView } from "./types/enums/FractionVIew";
import { TaskMode } from "./types/enums/TaskMode";

// Interface
type MenuItem = {
  title: string;
  icon?: React.JSX.Element;
  address: string;
}

type StepInfoData = {
  title: string;
  description: string;
  status: StepStatus;
  isLocked?: boolean;
  lockedMessage?: string;
}

type CardData = {
  title: string;
  description: string;
  image: string;
  action: (...args: unknown[]) => unknown;
}

type RequirementProps = {
  title: string;
  info: string;
  values: string[];
}

// General
type TaskData = {
  target: TargetFunction;
  constraints: Equation[];
  type: ExtremumType;
  fractionView: FractionView;
}

type InputData = {
  target: {
    coefficients: string;
    constant: number;
  },
  constraints: [{
    coefficients: string;
    value: number;
  }],
  type: ExtremumType;
  view: FractionView;
}
