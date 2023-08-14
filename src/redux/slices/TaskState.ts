/* eslint-disable @typescript-eslint/no-explicit-any */
import { Equation } from "@/types/classes/Equation";
import { TargetFunction } from "@/types/classes/TargetFunction";
import { ExtremumType } from "@/types/enums/ExtremumType";
import { FractionView } from "@/types/enums/FractionVIew";
import { TaskMode } from "@/types/enums/TaskMode";
import { TaskData } from "@/vite-env";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface TaskState {
  target: TargetFunction;
  constraints: Equation[];
  type: ExtremumType;
  fractionView: FractionView;
  mode: TaskMode;
  parameters: any
}

const initialState: Partial<TaskState> = {
  target: undefined,
  constraints: [],
  type: undefined,
  fractionView: undefined,
  mode: undefined,
  parameters: {}
}

const taskState = createSlice({
  name: 'taskState',
  initialState,
  reducers: {
    setTargetFunction: (state, action: PayloadAction<TargetFunction>) => {
      state.target = action.payload
    },
    clearTargetFunction: (state) => {
      state.target = undefined
    },
    setConstraints: (state, action: PayloadAction<Equation[]>) => {
      state.constraints = action.payload
    },
    appendConstraint: (state, action: PayloadAction<Equation>) => {
      state.constraints?.push(action.payload)
    },
    clearConstraints: (state) => {
      state.constraints = undefined
    },
    setExtremumType: (state, action: PayloadAction<ExtremumType>) => {
      state.type = action.payload
    },
    clearExtremumType: (state) => {
      state.type = undefined
    },
    setFractionView: (state, action: PayloadAction<FractionView>) => {
      state.fractionView = action.payload
    },
    clearFractionView: (state) => {
      state.fractionView = undefined
    },
    setMode: (state, action: PayloadAction<TaskMode>) => {
      state.mode = action.payload
    },
    clearMode: (state) => {
      state.mode = undefined
    },
    setConfiguration: (state, action: PayloadAction<TaskData>) => {
      const {target, constraints, type, fractionView} = action.payload

      state.target = target;
      state.constraints = constraints;
      state.type = type;
      state.fractionView = fractionView;
    },
    clearConfiguration: (state) => {
      state.target = undefined;
      state.constraints = undefined;
      state.type = undefined;
      state.fractionView = undefined;
      state.mode = undefined;
      state.parameters = {}
    },
    setTaskMode: (state, action: PayloadAction<TaskMode>) => {
      state.mode = action.payload
    },
    clearTaskMode: (state) => {
      state.mode = undefined
    },
    setParameters: (state, action: PayloadAction<object>) => {
      state.parameters = action.payload
    },
    appendParameters: (state, action: PayloadAction<object>) => {
      if (!state.parameters) {
        state.parameters = {}
      }

      Object.entries(action.payload).forEach((entry) => {
        state.parameters[entry[0]] = entry[1]
      })
    },
    clearParameters: (state) => {
      state.parameters = undefined
    }
  }
})

export const taskStateReducer = taskState.reducer
export const {
  setTargetFunction,
  clearTargetFunction,
  setConstraints,
  appendConstraint,
  clearConstraints,
  setExtremumType,
  clearExtremumType,
  setFractionView,
  clearFractionView,
  setConfiguration,
  clearConfiguration,
  setTaskMode,
  clearTaskMode,
  setParameters,
  appendParameters,
  clearParameters
} = taskState.actions