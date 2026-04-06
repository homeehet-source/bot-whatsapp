const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")
const cron = require("node-cron")

async function startCastiel() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_castiel")

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" })
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const text = msg.message.conversation?.toLowerCase() || ""

        if (text.includes("oi") || text.includes("olá")) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "Olá. Eu estou aqui. Mesmo quando o mundo parece silencioso."
            })
        }

        if (text.includes("triste") || text.includes("mal")) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "A dor não te define. Eu permaneço com você."
            })
        }
    })

    const mensagens = {
        morning: "Bom dia. Que sua mente encontre paz hoje ... Deus esta contigo, lembra.",
        afternoon: "Continue. Mesmo em silêncio, você está avançando.",
        night: "Descanse. Até os guerreiros precisam parar ... reagrupar... reequipar ... refletir e depois voltar ao jogo."
    }

    cron.schedule("0 9 * * *", () => {
        sock.sendMessage(sock.user.id, { text: mensagens.morning })
    })

    cron.schedule("0 12 * * *", () => {
        sock.sendMessage(sock.user.id, { text: mensagens.afternoon })
    })

    cron.schedule("0 18 * * *", () => {
        sock.sendMessage(sock.user.id, { text: mensagens.night })
    })

    console.log("👼 CASTIEL pronto. Escaneie o QR Code.")
}

startCastiel()
