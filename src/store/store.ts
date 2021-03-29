import { createStore, createTypedHooks, Store } from "easy-peasy";
import { settings, settingsStore } from "./settings";

export interface globalStore {
  settings: settingsStore;
}

export const globalStore: Store<globalStore> = createStore({ settings });

const typedHooks = createTypedHooks<globalStore>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
