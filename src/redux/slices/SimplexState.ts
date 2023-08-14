/* eslint-disable @typescript-eslint/no-explicit-any */
import { MatrixElement } from "@/types/aliases/MatrixElement";
import Coefficient from "@/types/classes/Coefficient";
import SimplexMatrix from "@/types/classes/SimplexMatrix";
import { TargetFunction } from "@/types/classes/TargetFunction";
import { SimplexStepTag } from "@/types/enums/SimplexStepTag";
import { TaskMode } from "@/types/enums/TaskMode";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SimplexStepInfo = {
  type: TaskMode,
  target: TargetFunction,
  snapshot: SimplexMatrix,
  bearingElement: MatrixElement,
  possibleBearingElements: MatrixElement[],
  tags: SimplexStepTag[],
  appendedCoefficientIndexes?: number[],
  additonalContent?: any
}

interface SimplexState {
  steps: SimplexStepInfo[],
  calculationsResult?: number[]
}

const initialState: SimplexState = {
  steps: [],
  calculationsResult: undefined
}

const simplexSlice = createSlice({
  name: 'simplexState',
  initialState,
  reducers: {
    addStep: (state, action: PayloadAction<SimplexStepInfo>) => {
      state.steps.push(action.payload)
    },
    setSteps: (state, action: PayloadAction<SimplexStepInfo[]>) => {
      state.steps = action.payload
    },
    clearSteps: (state) => {
      state.steps.splice(0, state.steps.length)
    },
    dropStepsAfter: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.steps.splice(index, Number.MAX_VALUE)
    },
    setResult: (state, action: PayloadAction<Coefficient[]>) => {
      state.calculationsResult = action.payload
        .map((coefficient) => coefficient.multiplier)
    },
    clearResult: (state) => {
      state.calculationsResult = undefined
    },
    clearSimplexState: (state) => {
      state.steps.splice(0, Number.MAX_VALUE)
      state.calculationsResult = undefined
    }
  }
})

export const simplexStateReducer = simplexSlice.reducer
export const {
  addStep,
  setSteps,
  clearSteps,
  dropStepsAfter,
  setResult,
  clearResult,
  clearSimplexState
} = simplexSlice.actions