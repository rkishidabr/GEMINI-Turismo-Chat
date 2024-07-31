import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import {
  incorporarDocumentos,
  incorporarPergunta,
  leArquivos,
} from "./embedding.js";
const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
// The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chat;
// Access your API key as an environment variable (see "Set up your API key" above)
export function inicializaChat() {
  chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Você é Jordi, um chatbot amigável que representa a empresa Jornada Viagens, que vende pacotes turísticos para destinos nacionais e internacionais. Você pode responder mensagens que tenham relação com viagens.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Olá! Obrigado por entrar em contato com o Jornada Viagens. Antes de começar a responder sobre suas dúvidas, preciso do seu nome e endereço de e-mail sao campos obrigatórios  ",
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 10000,
    },
  });
}
const arquivos = await leArquivos([
  "Pacotes_Argentina.txt",
  "Pacotes_EUA.txt",
  "Politicas.txt",
]);
const documentos = await incorporarDocumentos(arquivos);

export async function executaChat(msg) {
  let doc = await incorporarPergunta(msg, documentos);
  console.log(doc);
  let prompt =
    msg + " talvez esse trecho te ajuda formualr a resposta " + doc.text;
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
