import { action, Action } from "easy-peasy";

export interface settingsStore {
  gridView: string;
  setGridView: Action<settingsStore, string>;
}

export const settings: settingsStore = {
  gridView: "grid",

  setGridView: action((state, value) => {
    state.gridView = value;
  }),
};
