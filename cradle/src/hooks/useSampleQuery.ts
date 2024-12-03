import { useQuery } from "@tanstack/react-query"
import { API_URL } from "~/constants/env"
import { QUERY_KEYS } from "~/constants/keys"
import { QUERY_URLS } from "~/constants/urls"

const useSampleQuery = () => {
	const query = useQuery({
		queryKey: [QUERY_KEYS.SAMPLE],
		queryFn: async () => {
			const url = new URL(`${API_URL}${QUERY_URLS.SAMPLE}`)
			const response = await fetch(url)
			return await response.json()
		},
	})

	return query
}

export default useSampleQuery
