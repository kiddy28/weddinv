//#region src/utils/configParser.ts
var monthMap = {
	januari: 0,
	jan: 0,
	january: 0,
	februari: 1,
	feb: 1,
	february: 1,
	maret: 2,
	mar: 2,
	march: 2,
	april: 3,
	apr: 3,
	mei: 4,
	may: 4,
	juni: 5,
	jun: 5,
	june: 5,
	juli: 6,
	jul: 6,
	july: 6,
	agustus: 7,
	agu: 7,
	ags: 7,
	aug: 7,
	august: 7,
	september: 8,
	sep: 8,
	oktober: 9,
	okt: 9,
	oct: 9,
	october: 9,
	november: 10,
	nov: 10,
	desember: 11,
	des: 11,
	dec: 11,
	december: 11
};
function parseDateFromText(dateStr, timeStr) {
	if (!dateStr) return null;
	const match = dateStr.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
	if (!match) return null;
	const day = parseInt(match[1], 10);
	const mStr = match[2].toLowerCase();
	const year = parseInt(match[3], 10);
	const month = monthMap[mStr];
	if (month === void 0) return null;
	let hour = 8;
	let min = 0;
	if (timeStr) {
		const tMatch = timeStr.match(/(\d{1,2})[:.](\d{2})/);
		if (tMatch) {
			hour = parseInt(tMatch[1], 10);
			min = parseInt(tMatch[2], 10);
		}
	}
	return new Date(year, month, day, hour, min, 0);
}
//#endregion
export { parseDateFromText as t };
