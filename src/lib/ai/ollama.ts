import { Ollama } from "ollama";

export function getOllamaClient() {
  return new Ollama({
    host: "https://ollama.com",
    headers: {
      Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
    },
  })
}