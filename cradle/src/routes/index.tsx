import { createFileRoute } from "@tanstack/react-router"
import useSampleQuery from "~/hooks/useSampleQuery"
import useSampleStore from "~/store/sample"

export const Route = createFileRoute("/")({
	component: RouteComponent,
})

function RouteComponent() {
	const { data, isLoading } = useSampleQuery()
	const [addSample] = useSampleStore((state) => [state.addSample])

	console.log(isLoading ? "loading..." : data)

	return <button onClick={() => addSample("a")}>Sample</button>
}
