import { createStore, createTypedHooks, Store } from "easy-peasy";

export interface globalStore {}

export const globalStore: Store<globalStore> = createStore({});

const typedHooks = createTypedHooks<globalStore>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
