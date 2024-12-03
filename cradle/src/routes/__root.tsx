import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackQueryProvider } from "~/lib/tanstack-query"

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	return (
		<TanStackQueryProvider>
			<Outlet />
		</TanStackQueryProvider>
	)
}
