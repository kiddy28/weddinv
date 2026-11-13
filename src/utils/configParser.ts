import type { AppConfig } from "../types";

const monthMap: Record<string, number> = {
  januari: 0, jan: 0, january: 0,
  februari: 1, feb: 1, february: 1,
  maret: 2, mar: 2, march: 2,
  april: 3, apr: 3,
  mei: 4, may: 4,
  juni: 5, jun: 5, june: 5,
  juli: 6, jul: 6, july: 6,
  agustus: 7, agu: 7, ags: 7, aug: 7, august: 7,
  september: 8, sep: 8,
  oktober: 9, okt: 9, oct: 9, october: 9,
  november: 10, nov: 10,
  desember: 11, des: 11, dec: 11, december: 11,
};

export function parseDateFromText(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const mStr = match[2].toLowerCase();
  const year = parseInt(match[3], 10);
  const month = monthMap[mStr];
  if (month === undefined) return null;

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

export function parseConfig(raw: Record<string, string>): AppConfig {
  const parseJson = <T>(str: string, fallback: T): T => {
    try {
      return JSON.parse(str) as T;
    } catch {
      return fallback;
    }
  };

  const akadTextDate = parseDateFromText(raw.AKAD_DATE, raw.AKAD_START);
  const akadIsoDate = raw.AKAD_ISO_START ? new Date(raw.AKAD_ISO_START) : null;
  const akadStartDateTime =
    akadTextDate ||
    (akadIsoDate && !isNaN(akadIsoDate.getTime())
      ? akadIsoDate
      : new Date("2027-12-25T08:00:00+07:00"));

  const akadEndIso = raw.AKAD_ISO_END ? new Date(raw.AKAD_ISO_END) : null;
  const akadEndDateTime =
    akadEndIso && !isNaN(akadEndIso.getTime())
      ? akadEndIso
      : new Date(akadStartDateTime.getTime() + 2 * 60 * 60 * 1000);

  const resepsiTextDate = parseDateFromText(raw.RESEPSI_DATE, raw.RESEPSI_START);
  const resepsiIsoDate = raw.RESEPSI_ISO_START
    ? new Date(raw.RESEPSI_ISO_START)
    : null;
  const resepsiStartDateTime =
    resepsiTextDate ||
    (resepsiIsoDate && !isNaN(resepsiIsoDate.getTime())
      ? resepsiIsoDate
      : new Date("2027-12-25T11:00:00+07:00"));

  const resepsiEndIso = raw.RESEPSI_ISO_END
    ? new Date(raw.RESEPSI_ISO_END)
    : null;
  const resepsiEndDateTime =
    resepsiEndIso && !isNaN(resepsiEndIso.getTime())
      ? resepsiEndIso
      : new Date(resepsiStartDateTime.getTime() + 3 * 60 * 60 * 1000);

  return {
    couple: {
      bride: {
        name: raw.BRIDE_NICKNAME ?? "Bride",
        fullName: raw.BRIDE_FULLNAME ?? "Bride",
        parents: raw.BRIDE_PARENTS ?? "",
        instagram: raw.BRIDE_INSTAGRAM ?? "",
        image: raw.BRIDE_IMAGE ?? "https://placehold.co/600x800",
      },
      groom: {
        name: raw.GROOM_NICKNAME ?? "Groom",
        fullName: raw.GROOM_FULLNAME ?? "Groom",
        parents: raw.GROOM_PARENTS ?? "",
        instagram: raw.GROOM_INSTAGRAM ?? "",
        image: raw.GROOM_IMAGE ?? "https://placehold.co/600x800",
      },
    },
    venue: {
      name: raw.VENUE_NAME ?? "",
      address: raw.VENUE_ADDRESS ?? "",
      latitude: parseFloat(raw.VENUE_LAT ?? "0"),
      longitude: parseFloat(raw.VENUE_LNG ?? "0"),
    },
    events: {
      akad: {
        title: raw.AKAD_TITLE ?? "Akad Nikah",
        day: raw.AKAD_DAY ?? "",
        date: raw.AKAD_DATE ?? "",
        startTime: raw.AKAD_START ?? "",
        endTime: raw.AKAD_END ?? "",
        startDateTime: akadStartDateTime,
        endDateTime: akadEndDateTime,
      },
      resepsi: {
        title: raw.RESEPSI_TITLE ?? "Resepsi",
        day: raw.RESEPSI_DAY ?? "",
        date: raw.RESEPSI_DATE ?? "",
        startTime: raw.RESEPSI_START ?? "",
        endTime: raw.RESEPSI_END ?? "",
        startDateTime: resepsiStartDateTime,
        endDateTime: resepsiEndDateTime,
      },
    },
    hero: {
      image: raw.HERO_IMAGE ?? "",
      city: raw.HERO_CITY ?? "",
    },
    music: {
      url: raw.MUSIC_URL ?? "",
    },
    rsvp: {
      maxGuests: parseInt(raw.RSVP_MAX_GUESTS ?? "10", 10),
    },
    bankAccounts: parseJson(raw.BANK_ACCOUNTS, []),
    loveStory: parseJson(raw.LOVE_STORY, []),
    galleryImages: parseJson(raw.GALLERY_IMAGES, []),
    text: {
      opening: {
        salam: raw.TEXT_SALAM_OPENING ?? "",
      },
      quote: {
        ar_rum: raw.TEXT_QUOTE_AR_RUM ?? "",
        source: raw.TEXT_QUOTE_SOURCE ?? "",
      },
      invitation: raw.TEXT_INVITATION ?? "",
      closing: {
        text: raw.TEXT_CLOSING ?? "",
        salam: raw.TEXT_SALAM_CLOSING ?? "",
        signature: raw.TEXT_SIGNATURE ?? "",
        family: raw.TEXT_FAMILY ?? "",
      },
      gift: {
        title: raw.TEXT_GIFT_TITLE ?? "",
        desc: raw.TEXT_GIFT_DESC ?? "",
      },
    },
    gift: {
      address:
        raw.GIFT_ADDRESS ||
        "Jl. Mawar Indah No. 88, RT 03/RW 05, Kel. Sukamaju, Kec. Cilodong, Kota Kediri, Jawa Timur 64129",
      receiver:
        raw.GIFT_RECEIVER ||
        "Keluarga Bpk. Uzumaki / Londo (0812-3456-7890)",
    },
    telegram: {
      botToken: raw.TELEGRAM_BOT_TOKEN ?? "",
      chatId: raw.TELEGRAM_CHAT_ID ?? "",
    },
  };
}
