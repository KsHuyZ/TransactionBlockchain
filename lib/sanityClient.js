import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "fz3khpdd",
  dataset: "production",
  apiVersion: "v1",
  token:
    "skvusIfiSNalUpcq4kwlEAIrV7ppnNrUbUA8WEau0M9UMNZ5GlhUJG1lmXQdj7SJJv0294Htp5H3TfritcCTmM5Pn12bTznH3KnePMsaH93YnPOZphnp5GnvtYvjGMowxZaym6emZcG3SuF27x7Q22Cksc3KBfOuT8j65prSZByG3MjwgnUF",
  useCdn: false,
});
