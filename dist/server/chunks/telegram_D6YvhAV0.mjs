//#region src/lib/rateLimit.ts
var requestLog = /* @__PURE__ */ new Map();
var checkRateLimit = (ip, limit = 5, windowMs = 6e4) => {
	const now = Date.now();
	const recentRequests = (requestLog.get(ip) || []).filter((time) => now - time < windowMs);
	if (recentRequests.length >= limit) return false;
	recentRequests.push(now);
	requestLog.set(ip, recentRequests);
	if (requestLog.size > 1e3) requestLog.clear();
	return true;
};
//#endregion
//#region src/utils/telegram.ts
var sendTelegramNotification = async (text, token, chatId) => {
	if (!token || !chatId) {
		console.warn("Telegram Token/Chat ID belum diset");
		return;
	}
	const url = `https://api.telegram.org/bot${token}/sendMessage`;
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 5e3);
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text,
				parse_mode: "HTML"
			}),
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		if (!response.ok) {
			const errorData = await response.text();
			console.error(`Gagal kirim Telegram (HTTP ${response.status}):`, errorData);
		}
	} catch (error) {
		clearTimeout(timeoutId);
		if (error.name === "AbortError") console.error("Kirim Telegram Timeout");
		else console.error("Gagal koneksi ke Telegram:", error.message);
	}
};
//#endregion
export { checkRateLimit as n, sendTelegramNotification as t };
