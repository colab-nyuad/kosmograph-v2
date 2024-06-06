import { z } from "zod";

export const QueryFormSchema = z.object({
	query: z
		.string()
		.describe("Query String")
		.min(6, { message: "Query must be at least 6 characters" })
		.refine((query) => query.trim().toLowerCase().startsWith("select"), {
			message: "Query must be a SPARQL form starting with 'SELECT'",
		})
		.refine((query) => query.toLowerCase().includes("where {"), {
			message: "Query must contain a WHERE clause with '{' '}'",
		}),
});
