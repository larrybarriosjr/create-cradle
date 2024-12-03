import { createStore } from "~/lib/zustand"

type SampleState = {
	sample: string[]
	addSample: (sample: string) => void
}

const useSampleStore = createStore<SampleState>((set, get) => ({
	sample: [],
	addSample: (sample: string) => {
		set((state) => {
			state.sample.push(sample)
		})
		console.log(get().sample)
	},
}))

export default useSampleStore
