import { StateCreator, StoreMutatorIdentifier } from "zustand"
import { immer } from "zustand/middleware/immer"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

type Immer = [StoreMutatorIdentifier, never]
type State<T> = StateCreator<T, [...[], Immer], []>

const createStore = <T>(state: State<T>) => createWithEqualityFn<T>()(immer(state), shallow)

export default createStore
