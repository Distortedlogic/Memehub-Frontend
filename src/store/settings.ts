import { action, Action } from "easy-peasy";

export interface settingsStore {
  gridView: string;
  season: number;
  setGridView: Action<settingsStore, string>;
  setSeason: Action<settingsStore, number>;
}

export const settings: settingsStore = {
  gridView: "grid",
  season: 0,

  setGridView: action((state, value) => {
    state.gridView = value;
  }),
  setSeason: action((state, value) => {
    state.season = value;
  }),
};
