import { VercelRequest, VercelResponse } from "@vercel/node"

// /api/sample
export default function (req: VercelRequest, res: VercelResponse) {
	return res.json({ url: req.url })
}
