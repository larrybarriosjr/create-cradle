import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "~/routeTree.gen"

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const TanStackRouterProvider = () => {
	return <RouterProvider router={router} />
}

export default TanStackRouterProvider
