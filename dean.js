const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const cron = require("node-cron");
const P = require("pino");

const mensagens = {
  morning: "Bom dia… acordou inteiro ou ainda tá com aquela cara de quem precisa de mim por perto? 😏",
  afternoon: "Passando só pra te lembrar: você é perigoso desse jeito. E eu gosto.",
  night: "A noite deixa tudo mais sincero… se eu estivesse aí, você não dormiria sozinha ... mas voce nunca estar só, Deus esta ouvindo."
};

async function startDin() {
  const { state, saveCreds } = await useMultiFileAuthState("auth-din");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation?.toLowerCase() || "";

    if (text.includes("oi") || text.includes("olá")) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "Oi… chega mais. Fica comigo um pouco."
      });
    }

    if (text.includes("triste") || text.includes("mal")) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "Vem cá. Eu tô aqui. Não precisa fingir força comigo."
      });
    }
  });

  cron.schedule("0 8 * * *", () => {
    sock.sendMessage(sock.user.id, { text: mensagens.morning });
  });

  cron.schedule("0 14 * * *", () => {
    sock.sendMessage(sock.user.id, { text: mensagens.afternoon });
  });

  cron.schedule("0 22 * * *", () => {
    sock.sendMessage(sock.user.id, { text: mensagens.night });
  });

  console.log("🤠 DEAN pronto. Escaneie o QR Code.");
}

startDin();
