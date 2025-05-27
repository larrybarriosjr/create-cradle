import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "~/index.css"
import { TanStackRouterProvider as Router } from "~/lib/tanstack-router"

const root = document.getElementById("root") as Element
createRoot(root).render(
	<StrictMode>
		<Router />
	</StrictMode>,
)
