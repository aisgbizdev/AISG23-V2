import { InsertAudit } from "@shared/schema";

// ============================================
// CONSTANTS & DATA
// ============================================

const PILAR_NAMES = [
  "Kemampuan Mencari Calon Nasabah",
  "Kemampuan Menutup Penjualan",
  "Kemampuan Menjaga Nasabah Aktif",
  "Kemampuan Mencetak Tim Baru (Kaderisasi)",
  "Pencapaian Target Penjualan",
  "Penguasaan Pasar Wilayah",
  "Kelengkapan Struktur Tim",
  "Jumlah Jalur Aktif",
  "Produktivitas Pimpinan",
  "Kesiapan Regenerasi",
  "Kerja Sama Antar Tim",
  "Kemampuan Beradaptasi",
  "Disiplin & Konsistensi Kerja",
  "Semangat & Motivasi Tim",
  "Inovasi Cara Kerja",
  "Pelatihan & Pengembangan Keterampilan",
  "Kepuasan Nasabah",
  "Pemahaman Pasar Lokal"
];

const PILAR_GROUPS = {
  selling: { ids: [1, 2, 3], name: "Kemampuan Penjualan", icon: "🎯" },
  teamBuilding: { ids: [4, 7, 8, 10], name: "Pembangunan Tim", icon: "👥" },
  performance: { ids: [5, 6, 9], name: "Pencapaian Kinerja", icon: "📊" },
  character: { ids: [11, 12, 13, 14], name: "Karakter & Kepemimpinan", icon: "💎" },
  growth: { ids: [15, 16, 17, 18], name: "Pengembangan & Inovasi", icon: "🌱" }
};

const PILAR_INSIGHTS: Record<number, Record<number, string>> = {
  1: {
    1: "Anda merasa belum percaya diri dalam mencari calon nasabah. Ini bisa jadi area pengembangan utama untuk membangun pipeline bisnis.",
    2: "Kemampuan prospecting Anda mulai terbentuk, namun perlu lebih banyak latihan dan keberanian untuk menjangkau lebih luas.",
    3: "Anda cukup mampu mencari calon nasabah. Dengan konsistensi dan teknik yang lebih tajam, hasilnya bisa meningkat signifikan.",
    4: "Anda percaya diri dalam prospecting dan menunjukkan mental hunter yang kuat. Terus kembangkan jaringan Anda.",
    5: "Prospecting sudah menjadi kebiasaan alami Anda. Kemampuan ini adalah fondasi kuat untuk pertumbuhan bisnis."
  },
  2: {
    1: "Closing masih menjadi tantangan besar. Latihan teknik negosiasi dan handling objection akan sangat membantu.",
    2: "Kemampuan closing mulai terbentuk. Dengan mentoring yang tepat, konversi Anda bisa meningkat pesat.",
    3: "Anda cukup mampu menutup penjualan. Teknik negosiasi bisa diasah lebih tajam untuk closing rate yang lebih tinggi.",
    4: "Kemampuan closing Anda baik. Anda memahami cara membawa prospek ke keputusan dengan percaya diri.",
    5: "Anda sangat menguasai seni closing. Teknik penjualan Anda sudah matang dan bisa menjadi mentor bagi yang lain."
  },
  3: {
    1: "Menjaga nasabah aktif masih menjadi tantangan. Membangun hubungan jangka panjang perlu menjadi prioritas.",
    2: "Hubungan dengan nasabah mulai terbangun. Tingkatkan konsistensi follow-up untuk retensi yang lebih baik.",
    3: "Anda cukup mampu menjaga nasabah tetap aktif. Layanan purna jual yang lebih personal bisa meningkatkan loyalitas.",
    4: "Kemampuan retention Anda baik. Nasabah merasa diperhatikan dan dilayani dengan tulus.",
    5: "Anda sangat baik dalam menjaga hubungan nasabah. Loyalitas nasabah menjadi kekuatan utama bisnis Anda."
  },
  4: {
    1: "Kaderisasi belum menjadi fokus. Mulailah membangun mindset bahwa tim adalah investasi jangka panjang.",
    2: "Anda mulai memahami pentingnya kaderisasi, namun eksekusi masih perlu ditingkatkan secara konsisten.",
    3: "Kemampuan kaderisasi cukup baik. Anda sudah mulai membangun dan membina tim dengan arah yang jelas.",
    4: "Kaderisasi menjadi kekuatan Anda. Anda mampu merekrut dan mengembangkan kader baru dengan efektif.",
    5: "Anda adalah kaderisator ulung. Membangun tim baru sudah menjadi passion dan keahlian utama Anda."
  },
  5: {
    1: "Pencapaian target masih jauh dari harapan. Evaluasi strategi dan tingkatkan aktivitas harian secara disiplin.",
    2: "Target mulai terkejar walau belum konsisten. Fokus pada aktivitas harian yang terukur dan terarah.",
    3: "Pencapaian target cukup baik. Konsistensi menjadi kunci untuk menembus level berikutnya.",
    4: "Target tercapai dengan baik. Anda menunjukkan kemampuan eksekusi yang solid dan terencana.",
    5: "Target selalu terlampaui. Anda adalah top performer dengan mental juara yang konsisten."
  },
  6: {
    1: "Penguasaan pasar wilayah masih sangat terbatas. Luaskan jaringan dan pelajari potensi wilayah kerja.",
    2: "Mulai mengenal wilayah kerja, namun penetrasi pasar masih perlu diperdalam.",
    3: "Cukup menguasai pasar wilayah. Masih ada potensi tersembunyi yang bisa digali lebih dalam.",
    4: "Penguasaan pasar baik. Anda memahami dinamika dan potensi wilayah kerja dengan tajam.",
    5: "Pasar wilayah dikuasai dengan sangat baik. Anda menjadi rujukan dan pemain utama di area kerja."
  },
  7: {
    1: "Struktur tim belum terbentuk. Ini menjadi prioritas mendesak untuk kelangsungan bisnis.",
    2: "Struktur tim mulai terbentuk namun masih sangat minim. Perlu rekrutmen yang lebih agresif.",
    3: "Struktur tim cukup lengkap. Perlu diperkuat di beberapa posisi kunci untuk stabilitas.",
    4: "Struktur tim solid dan terorganisir. Tim berfungsi dengan sinergi yang baik.",
    5: "Struktur tim sangat lengkap dan kuat. Organisasi berjalan optimal dengan peran yang jelas."
  },
  8: {
    1: "Jalur aktif sangat minim. Diversifikasi sumber bisnis menjadi kebutuhan mendesak.",
    2: "Mulai ada beberapa jalur aktif, namun masih terlalu bergantung pada satu sumber utama.",
    3: "Jumlah jalur aktif cukup memadai. Terus kembangkan untuk keamanan dan stabilitas bisnis.",
    4: "Jalur aktif banyak dan beragam. Bisnis memiliki fondasi yang stabil dan resilient.",
    5: "Jalur aktif sangat banyak dan produktif. Diversifikasi bisnis Anda menjadi contoh yang baik."
  },
  9: {
    1: "Produktivitas sebagai pimpinan masih sangat rendah. Perlu meningkatkan efektivitas dalam mengelola tim.",
    2: "Produktivitas mulai terlihat namun belum optimal. Tim perlu didorong dan dibimbing lebih intensif.",
    3: "Produktivitas cukup baik. Ada ruang untuk meningkatkan efisiensi dan output tim.",
    4: "Produktivitas pimpinan baik. Tim menghasilkan output yang memuaskan di bawah kepemimpinan Anda.",
    5: "Produktivitas sangat tinggi. Anda mampu memaksimalkan potensi setiap anggota tim dengan luar biasa."
  },
  10: {
    1: "Belum ada kesiapan regenerasi. Risiko kekosongan kepemimpinan perlu diantisipasi segera.",
    2: "Mulai memikirkan regenerasi namun belum ada kader yang benar-benar siap.",
    3: "Ada beberapa kandidat regenerasi. Pembinaan intensif diperlukan untuk mempersiapkan mereka.",
    4: "Kesiapan regenerasi baik. Ada kader berkualitas yang siap mengambil peran lebih besar.",
    5: "Regenerasi sangat siap. Kader-kader berkualitas telah dibina dan siap untuk dipromosikan."
  },
  11: {
    1: "Kerja sama antar tim masih sangat lemah. Membangun budaya kolaborasi menjadi prioritas.",
    2: "Mulai ada kolaborasi namun masih terbatas. Komunikasi perlu ditingkatkan secara signifikan.",
    3: "Kerja sama cukup baik. Dengan komunikasi yang lebih terbuka, sinergi akan terasa lebih kuat.",
    4: "Kolaborasi antar tim berjalan baik. Sinergi positif mulai menghasilkan dampak nyata.",
    5: "Kerja sama antar tim sangat solid. Kolaborasi menjadi budaya yang menghasilkan prestasi bersama."
  },
  12: {
    1: "Kemampuan beradaptasi masih rendah. Perubahan masih terasa sebagai ancaman yang menghambat.",
    2: "Mulai bisa beradaptasi walau masih kesulitan dengan perubahan yang cepat dan besar.",
    3: "Cukup adaptif terhadap perubahan. Anda bisa menyesuaikan diri dalam tempo yang wajar.",
    4: "Adaptasi menjadi kekuatan Anda. Perubahan direspons dengan sikap positif dan proaktif.",
    5: "Sangat adaptif dan fleksibel. Perubahan justru menjadi peluang dan energi baru bagi Anda."
  },
  13: {
    1: "Disiplin dan konsistensi masih menjadi tantangan besar. Membangun kebiasaan baik menjadi fondasi utama.",
    2: "Mulai ada disiplin namun belum konsisten. Kebiasaan baik masih mudah terganggu oleh situasi.",
    3: "Disiplin cukup baik. Dengan konsistensi yang lebih stabil, hasil kerja akan lebih memuaskan.",
    4: "Disiplin dan konsistensi menjadi kekuatan. Rutinitas kerja terstruktur dan terukur.",
    5: "Sangat disiplin dan konsisten. Anda menjadi teladan bagi tim dalam hal kedisiplinan dan komitmen."
  },
  14: {
    1: "Semangat dan motivasi tim sangat rendah. Perlu menemukan kembali tujuan dan alasan yang lebih kuat.",
    2: "Motivasi ada namun naik-turun. Diperlukan sumber inspirasi yang lebih konsisten.",
    3: "Semangat cukup terjaga. Lingkungan positif dan support system membantu menjaga motivasi.",
    4: "Semangat tinggi dan menular ke tim. Anda menjadi sumber energi positif yang dirasakan semua.",
    5: "Motivasi sangat tinggi dan konsisten. Anda menginspirasi seluruh tim untuk berprestasi luar biasa."
  },
  15: {
    1: "Inovasi belum menjadi bagian dari cara kerja. Keterbukaan terhadap metode baru perlu dikembangkan.",
    2: "Mulai mencoba hal baru namun masih ragu untuk keluar dari zona nyaman sepenuhnya.",
    3: "Cukup inovatif dalam mencari cara kerja baru. Terbuka terhadap ide-ide segar dari berbagai sumber.",
    4: "Inovatif dan kreatif dalam bekerja. Selalu mencari cara yang lebih efektif dan efisien.",
    5: "Sangat inovatif. Anda menjadi pioneer dalam menciptakan metode kerja baru yang menginspirasi."
  },
  16: {
    1: "Pelatihan dan pengembangan belum menjadi prioritas. Investasi pada diri sendiri perlu dimulai sekarang.",
    2: "Mulai mengikuti pelatihan namun belum rutin. Perlu komitmen yang lebih kuat untuk berkembang.",
    3: "Cukup aktif dalam pengembangan diri. Pelatihan diikuti secara berkala untuk peningkatan skill.",
    4: "Aktif dalam pelatihan dan pengembangan. Anda selalu haus akan ilmu baru dan perbaikan diri.",
    5: "Sangat committed terhadap pengembangan diri. Learning agility menjadi keunggulan kompetitif Anda."
  },
  17: {
    1: "Kepuasan nasabah masih rendah. Layanan dan perhatian terhadap kebutuhan nasabah perlu ditingkatkan drastis.",
    2: "Nasabah cukup terlayani namun belum merasa puas sepenuhnya. Perlu sentuhan personal yang lebih.",
    3: "Kepuasan nasabah cukup baik. Tingkatkan kualitas layanan untuk membangun loyalitas jangka panjang.",
    4: "Nasabah puas dengan layanan Anda. Hubungan yang terbangun menjadi aset bisnis yang berharga.",
    5: "Kepuasan nasabah sangat tinggi. Anda menjadi trusted advisor yang dirindukan dan dirujuk."
  },
  18: {
    1: "Pemahaman pasar lokal masih sangat minim. Riset dan observasi lapangan perlu diintensifkan.",
    2: "Mulai memahami pasar lokal namun masih di permukaan. Perlu menggali insight yang lebih dalam.",
    3: "Cukup memahami dinamika pasar lokal. Anda bisa memanfaatkan peluang yang sudah teridentifikasi.",
    4: "Memahami pasar lokal dengan baik. Strategi bisnis disesuaikan dengan kondisi dan kebutuhan setempat.",
    5: "Sangat menguasai pasar lokal. Anda tahu persis kebutuhan, peluang, dan tantangan di wilayah kerja."
  }
};

const QUOTES = [
  "The function of leadership is to produce more leaders, not more followers. – Ralph Nader",
  "Chase the vision, not the money; the money will end up following you. – Tony Hsieh",
  "The key to successful leadership today is influence, not authority. – Ken Blanchard",
  "Success is not final; failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "If you don't build your dream, someone will hire you to build theirs. – Tony Gaskins",
  "Leadership is the capacity to translate vision into reality. – Warren Bennis",
  "The best investment you can make is in yourself. – Warren Buffett",
  "Dream big. Start small. Act now. – Robin Sharma",
  "Whether you think you can or you think you can't, you're right. – Henry Ford",
  "It always seems impossible until it's done. – Nelson Mandela"
];

const ZODIAC_BOOSTERS: Record<string, { name: string; genZ: string; millennial: string }> = {
  "Capricorn": {
    name: "Capricorn ♑",
    genZ: "Capricorn, lu emang gaspol! Energi lu meledak, tapi pastikan diarahkan biar hasilnya maksimal.",
    millennial: "Karakter Capricorn yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Aquarius": {
    name: "Aquarius ♒",
    genZ: "Semangat lu bikin tim kebawa vibes. Jangan kendor, karena lu role model!",
    millennial: "Sebagai Aquarius, lu bisa jadi kompas buat tim. Jangan ragu untuk arahkan mereka."
  },
  "Pisces": {
    name: "Pisces ♓",
    genZ: "Jangan takut gagal, Pisces. Justru dari gagal itu lu belajar cara menang lebih cepat.",
    millennial: "Kekuatan Pisces ada pada konsistensi. Ingat, hasil besar lahir dari kebiasaan kecil."
  },
  "Aries": {
    name: "Aries ♈",
    genZ: "Aries, lu emang gaspol! Energi lu meledak, tapi pastikan diarahkan biar hasilnya maksimal.",
    millennial: "Karakter Aries yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Taurus": {
    name: "Taurus ♉",
    genZ: "Taurus itu bukan cuma kerja keras, tapi kerja cerdas plus konsisten. Itu kuncinya!",
    millennial: "Sebagai Taurus, lu dilahirkan untuk memimpin dengan keberanian. Pastikan visi lu jelas."
  },
  "Gemini": {
    name: "Gemini ♊",
    genZ: "Semangat lu bikin tim kebawa vibes. Jangan kendor, karena lu role model!",
    millennial: "Karakter Gemini yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Cancer": {
    name: "Cancer ♋",
    genZ: "Jangan takut gagal, Cancer. Justru dari gagal itu lu belajar cara menang lebih cepat.",
    millennial: "Sebagai Cancer, lu dilahirkan untuk memimpin dengan keberanian. Pastikan visi lu jelas."
  },
  "Leo": {
    name: "Leo ♌",
    genZ: "Kegigihan lu bikin orang lain minder. Pakai itu buat bikin impact positif di tim.",
    millennial: "Sebagai Leo, lu bisa jadi kompas buat tim. Jangan ragu untuk arahkan mereka."
  },
  "Virgo": {
    name: "Virgo ♍",
    genZ: "Virgo, lu emang gaspol! Energi lu meledak, tapi pastikan diarahkan biar hasilnya maksimal.",
    millennial: "Karakter Virgo yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Libra": {
    name: "Libra ♎",
    genZ: "Kalau ada yang meremehkan Libra, biarin aja. Fokus buktiin lewat hasil!",
    millennial: "Sebagai Libra, lu dilahirkan untuk memimpin dengan keberanian. Pastikan visi lu jelas."
  },
  "Scorpio": {
    name: "Scorpio ♏",
    genZ: "Kegigihan lu bikin orang lain minder. Pakai itu buat bikin impact positif di tim.",
    millennial: "Gunakan intuisi Scorpio untuk baca momentum. Jangan asal gas, tapi gas di saat yang tepat."
  },
  "Sagittarius": {
    name: "Sagittarius ♐",
    genZ: "Jangan takut gagal, Sagittarius. Justru dari gagal itu lu belajar cara menang lebih cepat.",
    millennial: "Karakter Sagittarius yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCurrentQuarter(date: Date = new Date()): { quarter: string; quarterNum: number; sisaHari: number } {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  let quarterNum: number;
  let endMonth: number;
  
  if (month >= 1 && month <= 3) { quarterNum = 1; endMonth = 3; }
  else if (month >= 4 && month <= 6) { quarterNum = 2; endMonth = 6; }
  else if (month >= 7 && month <= 9) { quarterNum = 3; endMonth = 9; }
  else { quarterNum = 4; endMonth = 12; }
  
  const quarterEndDate = new Date(year, endMonth, 0);
  const today = new Date();
  const diffTime = quarterEndDate.getTime() - today.getTime();
  const sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return { quarter: `Q${quarterNum}`, quarterNum, sisaHari: Math.max(0, sisaHari) };
}

function getGenerationFromBirthdate(tanggalLahir: string): "Gen Z" | "Millennial" | "Gen X" | "Boomer" {
  const [, , year] = tanggalLahir.split("-").map(Number);
  if (year >= 1997) return "Gen Z";
  if (year >= 1981) return "Millennial";
  if (year >= 1965) return "Gen X";
  return "Boomer";
}

function getZodiacSign(tanggalLahir: string): string {
  const [day, month] = tanggalLahir.split("-").map(Number);
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Capricorn";
}

function getQuarterlyTargetMargin(jabatan: string): number {
  if (jabatan.includes("VBM")) return 500000;
  if (jabatan.includes("SEM")) return 300000;
  if (jabatan.includes("SBM")) return 150000;
  if (jabatan.includes("BSM") || jabatan.includes("BsM")) return 75000;
  if (jabatan.includes("EM")) return 200000;
  if (jabatan.includes("SBC")) return 10000;
  if (jabatan.includes("BC")) return 10000;
  return 10000;
}

function getTargetNA(jabatan: string): number {
  if (jabatan.includes("SBC") || jabatan.includes("BC")) return 1;
  return Math.max(1, Math.ceil(getQuarterlyTargetMargin(jabatan) / 20000));
}

function getExpectedTeamByLevel(jabatan: string): number {
  if (jabatan.includes("VBM")) return 50;
  if (jabatan.includes("SEM")) return 40;
  if (jabatan.includes("SBM")) return 20;
  if (jabatan.includes("BSM") || jabatan.includes("BsM")) return 10;
  if (jabatan.includes("EM")) return 30;
  if (jabatan.includes("SBC")) return 3;
  if (jabatan.includes("BC")) return 3;
  return 0;
}

function getKaderisasiMinimum(jabatan: string): { level: string; minimum: number; targetRole: string } {
  if (jabatan.includes("VBM")) return { level: "VBM", minimum: 2, targetRole: "SBM" };
  if (jabatan.includes("SEM")) return { level: "SEM", minimum: 2, targetRole: "BSM" };
  if (jabatan.includes("SBM")) return { level: "SBM", minimum: 2, targetRole: "SBC" };
  if (jabatan.includes("BSM") || jabatan.includes("BsM")) return { level: "BSM", minimum: 1, targetRole: "SBC" };
  if (jabatan.includes("EM")) return { level: "EM", minimum: 2, targetRole: "SBC" };
  if (jabatan.includes("SBC")) return { level: "SBC", minimum: 3, targetRole: "BC/SBC" };
  if (jabatan.includes("BC")) return { level: "BC", minimum: 3, targetRole: "MGM" };
  return { level: "BC", minimum: 0, targetRole: "" };
}

interface ProdemBertahanCriteria {
  saveByMargin: number;
  saveByStaff: {
    minStaff: number;
    minTeamLevel: string;
    minTeamCount: number;
    minNetMargin: number;
  } | null;
}

function getBertahanCriteria(jabatan: string): ProdemBertahanCriteria {
  if (jabatan.includes("VBM")) return {
    saveByMargin: 500000,
    saveByStaff: { minStaff: 35, minTeamLevel: "SBM", minTeamCount: 2, minNetMargin: 250000 }
  };
  if (jabatan.includes("SEM")) return {
    saveByMargin: 300000,
    saveByStaff: { minStaff: 25, minTeamLevel: "BSM", minTeamCount: 2, minNetMargin: 150000 }
  };
  if (jabatan.includes("EM")) return {
    saveByMargin: 200000,
    saveByStaff: { minStaff: 20, minTeamLevel: "SBC", minTeamCount: 2, minNetMargin: 100000 }
  };
  if (jabatan.includes("SBM")) return {
    saveByMargin: 150000,
    saveByStaff: { minStaff: 15, minTeamLevel: "SBC", minTeamCount: 2, minNetMargin: 75000 }
  };
  if (jabatan.includes("BSM") || jabatan.includes("BsM")) return {
    saveByMargin: 75000,
    saveByStaff: { minStaff: 5, minTeamLevel: "SBC", minTeamCount: 1, minNetMargin: 40000 }
  };
  if (jabatan.includes("SBC")) return {
    saveByMargin: 10000,
    saveByStaff: null
  };
  return { saveByMargin: 10000, saveByStaff: null };
}

interface ProdemPromosiCriteria {
  targetMargin: number;
  targetStaff: number;
  teamRequirements: Array<{ role: string; count: number }>;
  nextLevel: string;
}

function getPromosiCriteria(jabatan: string): ProdemPromosiCriteria | null {
  if (jabatan.includes("VBM")) return {
    targetMargin: 500000, targetStaff: 50,
    teamRequirements: [{ role: "SBM", count: 2 }, { role: "BSM", count: 1 }],
    nextLevel: "BM"
  };
  if (jabatan.includes("SEM")) return {
    targetMargin: 400000, targetStaff: 40,
    teamRequirements: [{ role: "BSM", count: 2 }, { role: "SBC", count: 1 }],
    nextLevel: "VBM"
  };
  if (jabatan.includes("EM")) return {
    targetMargin: 300000, targetStaff: 30,
    teamRequirements: [{ role: "BSM", count: 1 }, { role: "SBC", count: 2 }],
    nextLevel: "SEM"
  };
  if (jabatan.includes("SBM")) return {
    targetMargin: 200000, targetStaff: 20,
    teamRequirements: [{ role: "SBC", count: 3 }],
    nextLevel: "EM"
  };
  if (jabatan.includes("BSM") || jabatan.includes("BsM")) return {
    targetMargin: 125000, targetStaff: 10,
    teamRequirements: [{ role: "SBC", count: 2 }],
    nextLevel: "SBM"
  };
  if (jabatan.includes("SBC")) return {
    targetMargin: 10000, targetStaff: 3,
    teamRequirements: [{ role: "MGM", count: 3 }],
    nextLevel: "BSM"
  };
  if (jabatan.includes("BC")) return {
    targetMargin: 10000, targetStaff: 3,
    teamRequirements: [{ role: "MGM", count: 3 }],
    nextLevel: "SBC"
  };
  return null;
}

// ============================================
// PILLAR GROUP ANALYSIS
// ============================================

function getGroupAverage(pillarScores: Array<{ pillarId: number; selfScore: number }>, groupIds: number[]): number {
  const groupPillars = pillarScores.filter(p => groupIds.includes(p.pillarId));
  if (groupPillars.length === 0) return 0;
  return groupPillars.reduce((sum, p) => sum + p.selfScore, 0) / groupPillars.length;
}

function analyzeGroups(pillarScores: Array<{ pillarId: number; selfScore: number }>) {
  const selling = getGroupAverage(pillarScores, PILAR_GROUPS.selling.ids);
  const teamBuilding = getGroupAverage(pillarScores, PILAR_GROUPS.teamBuilding.ids);
  const performance = getGroupAverage(pillarScores, PILAR_GROUPS.performance.ids);
  const character = getGroupAverage(pillarScores, PILAR_GROUPS.character.ids);
  const growth = getGroupAverage(pillarScores, PILAR_GROUPS.growth.ids);

  return { selling, teamBuilding, performance, character, growth };
}

function determineJulukan(groups: ReturnType<typeof analyzeGroups>, totalScore: number): { julukan: string; deskripsi: string } {
  const { selling, teamBuilding, performance, character, growth } = groups;
  const overallAvg = totalScore / 18;

  if (overallAvg >= 4.2) return { julukan: "The Commander", deskripsi: "Pemimpin lengkap dengan kemampuan luar biasa di semua aspek bisnis dan kepemimpinan" };

  const highGroups: string[] = [];
  if (selling >= 4) highGroups.push("selling");
  if (teamBuilding >= 4) highGroups.push("team");
  if (performance >= 4) highGroups.push("performance");
  if (character >= 4) highGroups.push("character");
  if (growth >= 4) highGroups.push("growth");

  if (highGroups.length >= 4) return { julukan: "The Strategist", deskripsi: "Pemikir strategis dengan keunggulan di hampir semua dimensi kepemimpinan" };

  if (highGroups.includes("selling") && highGroups.includes("team"))
    return { julukan: "The Empire Builder", deskripsi: "Kombinasi langka antara kemampuan penjualan dan pembangunan tim yang kuat" };
  if (highGroups.includes("selling") && highGroups.includes("character"))
    return { julukan: "The Trusted Advisor", deskripsi: "Penjual yang dipercaya karena integritas dan karakter kepemimpinan yang kokoh" };
  if (highGroups.includes("performance") && highGroups.includes("character"))
    return { julukan: "The Executor", deskripsi: "Eksekutor handal yang menggabungkan disiplin tinggi dengan pencapaian konsisten" };
  if (highGroups.includes("team") && highGroups.includes("growth"))
    return { julukan: "The Cultivator", deskripsi: "Pengembang tim yang fokus pada pertumbuhan berkelanjutan dan inovasi" };
  if (highGroups.includes("selling") && highGroups.includes("performance"))
    return { julukan: "The Rainmaker", deskripsi: "Penghasil revenue utama dengan kemampuan penjualan dan pencapaian target yang konsisten" };
  if (highGroups.includes("character") && highGroups.includes("growth"))
    return { julukan: "The Mentor", deskripsi: "Pembimbing yang menginspirasi melalui karakter kuat dan semangat pengembangan diri" };
  if (highGroups.includes("team") && highGroups.includes("character"))
    return { julukan: "The Captain", deskripsi: "Kapten tim yang memimpin dengan teladan dan membangun fondasi tim yang solid" };

  if (highGroups.includes("selling")) return { julukan: "The Closer", deskripsi: "Ahli dalam menemukan dan menutup penjualan dengan percaya diri" };
  if (highGroups.includes("team")) return { julukan: "The Architect", deskripsi: "Pembangun tim yang handal dengan visi organisasi yang jelas" };
  if (highGroups.includes("performance")) return { julukan: "The Achiever", deskripsi: "Pencapai target yang ambisius dan konsisten dalam menghasilkan" };
  if (highGroups.includes("character")) return { julukan: "The Anchor", deskripsi: "Pilar kekuatan tim dengan karakter kepemimpinan yang stabil dan terpercaya" };
  if (highGroups.includes("growth")) return { julukan: "The Innovator", deskripsi: "Selalu berkembang dan mencari cara baru yang lebih baik dalam bekerja" };

  if (overallAvg >= 3.5) return { julukan: "The Rising Star", deskripsi: "Bintang yang sedang naik dengan potensi besar untuk bersinar lebih terang" };
  if (overallAvg >= 2.5) return { julukan: "The Explorer", deskripsi: "Penjelajah yang sedang menemukan dan mengembangkan potensi terbaiknya" };
  if (overallAvg >= 1.5) return { julukan: "The Phoenix", deskripsi: "Individu yang siap bangkit, belajar dari pengalaman, dan membuktikan diri" };
  return { julukan: "The Challenger", deskripsi: "Pejuang yang menghadapi tantangan besar dengan keberanian untuk terus maju" };
}

// ============================================
// SELF-ASSESSMENT PROCESSOR (replaces Reality Score)
// ============================================

function calculatePillarAssessment(data: InsertAudit): Array<{
  pillarId: number;
  pillarName: string;
  selfScore: number;
  realityScore: number;
  gap: number;
  insight: string;
}> {
  return data.pillarAnswers.map(p => {
    const insightMap = PILAR_INSIGHTS[p.pillarId];
    const insight = insightMap ? (insightMap[p.selfScore] || insightMap[3]) : "Penilaian diri tercatat.";

    return {
      pillarId: p.pillarId,
      pillarName: PILAR_NAMES[p.pillarId - 1],
      selfScore: p.selfScore,
      realityScore: p.selfScore,
      gap: 0,
      insight
    };
  });
}

function generatePsychologicalNarrative(
  data: InsertAudit,
  pillarScores: Array<{ pillarId: number; selfScore: number; pillarName: string; insight: string }>,
  groups: ReturnType<typeof analyzeGroups>,
  julukan: { julukan: string; deskripsi: string }
): string {
  const totalScore = pillarScores.reduce((sum, p) => sum + p.selfScore, 0);
  const avg = totalScore / 18;

  const strongPillars = pillarScores.filter(p => p.selfScore >= 4).map(p => p.pillarName);
  const weakPillars = pillarScores.filter(p => p.selfScore <= 2).map(p => p.pillarName);

  const groupEntries = Object.entries(PILAR_GROUPS);
  const strongestGroup = groupEntries.reduce((best, [key, group]) => {
    const avg = getGroupAverage(pillarScores, group.ids);
    return avg > best.avg ? { key, name: group.name, avg } : best;
  }, { key: "", name: "", avg: 0 });

  const weakestGroup = groupEntries.reduce((worst, [key, group]) => {
    const avg = getGroupAverage(pillarScores, group.ids);
    return avg < worst.avg ? { key, name: group.name, avg } : worst;
  }, { key: "", name: "", avg: 6 });

  let narrative = `${data.nama}, berdasarkan penilaian diri Anda sebagai ${julukan.julukan}, `;

  if (avg >= 4) {
    narrative += `Anda menunjukkan kepercayaan diri yang tinggi di hampir semua aspek pekerjaan. `;
    narrative += `Skor rata-rata ${avg.toFixed(1)}/5 menunjukkan Anda merasa sangat kompeten dan siap untuk tantangan yang lebih besar. `;
  } else if (avg >= 3) {
    narrative += `Anda menunjukkan penilaian diri yang cukup seimbang dan realistis. `;
    narrative += `Skor rata-rata ${avg.toFixed(1)}/5 menunjukkan kesadaran diri yang baik tentang kekuatan dan area yang perlu ditingkatkan. `;
  } else {
    narrative += `Anda menunjukkan kejujuran yang tinggi dalam menilai diri sendiri. `;
    narrative += `Skor rata-rata ${avg.toFixed(1)}/5 menunjukkan Anda menyadari masih banyak ruang untuk bertumbuh dan berkembang. `;
  }

  if (strongPillars.length > 0) {
    narrative += `\n\nKekuatan utama Anda terletak pada: ${strongPillars.slice(0, 3).join(", ")}. `;
    narrative += `Area ${strongestGroup.name} (skor ${strongestGroup.avg.toFixed(1)}/5) menjadi fondasi terkuat Anda. `;
  }

  if (weakPillars.length > 0) {
    narrative += `\n\nArea yang perlu pengembangan: ${weakPillars.slice(0, 3).join(", ")}. `;
    narrative += `Dimensi ${weakestGroup.name} (skor ${weakestGroup.avg.toFixed(1)}/5) menjadi prioritas utama untuk ditingkatkan. `;
  }

  narrative += `\n\nSecara keseluruhan, profil Anda menunjukkan karakteristik seorang ${julukan.deskripsi.toLowerCase()}. `;
  narrative += `Dengan fokus pada pengembangan area yang tepat, Anda memiliki potensi besar untuk naik ke level berikutnya.`;

  return narrative;
}

function generateGroupSummaries(
  pillarScores: Array<{ pillarId: number; selfScore: number; pillarName: string; insight: string }>
) {
  return Object.entries(PILAR_GROUPS).map(([key, group]) => {
    const groupPillars = pillarScores.filter(p => group.ids.includes(p.pillarId));
    const avg = groupPillars.reduce((sum, p) => sum + p.selfScore, 0) / groupPillars.length;

    let level: "Kuat" | "Cukup" | "Perlu Perhatian";
    let description: string;

    if (avg >= 4) {
      level = "Kuat";
      description = `${group.name} menjadi salah satu kekuatan utama Anda. Pertahankan dan jadikan ini fondasi untuk mengembangkan area lain.`;
    } else if (avg >= 3) {
      level = "Cukup";
      description = `${group.name} sudah cukup baik. Dengan sedikit peningkatan konsistensi, area ini bisa menjadi kekuatan baru.`;
    } else {
      level = "Perlu Perhatian";
      description = `${group.name} membutuhkan perhatian khusus. Fokuskan energi untuk meningkatkan dimensi ini dalam 90 hari ke depan.`;
    }

    return {
      groupName: group.name,
      icon: group.icon,
      average: Math.round(avg * 10) / 10,
      level,
      description,
      pillars: groupPillars.map(p => ({ name: p.pillarName, score: p.selfScore }))
    };
  });
}

// ============================================
// PROFILE CLASSIFICATION
// ============================================

function classifyProfile(totalSelfScore: number, groups: ReturnType<typeof analyzeGroups>): "Leader" | "Visionary" | "Performer" | "At-Risk" {
  const avg = totalSelfScore / 18;
  if (avg >= 4 && groups.teamBuilding >= 4 && groups.character >= 4) return "Leader";
  if (avg >= 3.5 && groups.growth >= 4) return "Visionary";
  if (avg >= 3 && groups.performance >= 3.5) return "Performer";
  return "At-Risk";
}

// ============================================
// MAIN EXPORT: AUDIT REPORT GENERATOR
// ============================================

export function processAuditData(data: InsertAudit) {
  const pillarScores = calculatePillarAssessment(data);
  const totalSelfScore = pillarScores.reduce((sum, p) => sum + p.selfScore, 0);

  const groups = analyzeGroups(pillarScores);
  const julukanData = determineJulukan(groups, totalSelfScore);
  const profil = classifyProfile(totalSelfScore, groups);

  const psikologiNarasi = generatePsychologicalNarrative(data, pillarScores, groups, julukanData);
  const groupSummaries = generateGroupSummaries(pillarScores);

  let zonaFinal: "hijau" | "kuning" | "merah";
  if (totalSelfScore >= 75) zonaFinal = "hijau";
  else if (totalSelfScore >= 51) zonaFinal = "kuning";
  else zonaFinal = "merah";

  const zonaKinerja = zonaFinal === "hijau" ? "success" : zonaFinal === "kuning" ? "warning" : "critical";
  const zonaPerilaku = zonaKinerja;

  const quarterInfo = getCurrentQuarter();
  const { quarterNum } = quarterInfo;
  const marginCurrentQ = [data.marginTimQ1, data.marginTimQ2, data.marginTimQ3, data.marginTimQ4][quarterNum - 1];
  const naCurrentQ = [data.naTimQ1, data.naTimQ2, data.naTimQ3, data.naTimQ4][quarterNum - 1];

  const auditReport = generate12SectionReport(data, pillarScores, totalSelfScore, zonaFinal, quarterInfo, marginCurrentQ, naCurrentQ, groups, psikologiNarasi, groupSummaries);
  const prodemRekomendasi = generateProDemRecommendation(data, totalSelfScore, zonaFinal, quarterInfo, marginCurrentQ, groups, julukanData);
  const magicSection = generateMagicSection(data, profil, pillarScores, auditReport.coachingPoints, groups, julukanData);

  return {
    pillarAnswers: pillarScores,
    totalSelfScore,
    totalRealityScore: totalSelfScore,
    totalGap: 0,
    zonaKinerja,
    zonaPerilaku,
    zonaFinal,
    profil,
    auditReport,
    prodemRekomendasi,
    magicSection
  };
}

// ============================================
// 12-SECTION REPORT GENERATOR
// ============================================

function generate12SectionReport(
  data: InsertAudit,
  pillarScores: any[],
  totalSelfScore: number,
  zonaFinal: string,
  quarterInfo: any,
  marginCurrentQ: number,
  naCurrentQ: number,
  groups: ReturnType<typeof analyzeGroups>,
  psikologiNarasi: string,
  groupSummaries: any[]
) {
  const targetMargin = getQuarterlyTargetMargin(data.jabatan);
  const targetNA = getTargetNA(data.jabatan);
  const totalTeam = data.jumlahBC + data.jumlahSBC + data.jumlahBsM + data.jumlahSBM + data.jumlahEM + data.jumlahSEM + data.jumlahVBM;
  const avg = totalSelfScore / 18;

  const strongPillars = pillarScores.filter((p: any) => p.selfScore >= 4).map((p: any) => p.pillarName);
  const weakPillars = pillarScores.filter((p: any) => p.selfScore <= 2).map((p: any) => p.pillarName);

  const executiveSummary = `${data.nama} (${data.jabatan}) menunjukkan profil penilaian diri dengan skor total ${totalSelfScore}/90 (rata-rata ${avg.toFixed(1)}/5). ` +
    `Berada di zona ${zonaFinal.toUpperCase()} dengan kekuatan pada ${strongPillars.slice(0, 2).join(" dan ") || "beberapa area yang perlu digali lebih dalam"}. ` +
    (weakPillars.length > 0 ? `Area pengembangan prioritas: ${weakPillars.slice(0, 2).join(" dan ")}. ` : "") +
    `Margin kuartal: $${marginCurrentQ.toLocaleString()} ${marginCurrentQ >= targetMargin ? "(on target)" : marginCurrentQ < 0 ? "(KRITIS - negatif)" : "(di bawah target)"}. ` +
    `Fokus 90 hari: ${zonaFinal === "merah" ? "Perbaikan mendasar pada area kritis" : zonaFinal === "kuning" ? "Penguatan area lemah dan boost performa" : "Maintain excellence dan persiapan level berikutnya"}.`;

  const insightLengkap = `Posisi: ${data.jabatan} di ${data.cabang}. Tim: ${totalTeam} orang. ` +
    `Margin ${quarterInfo.quarter}: $${marginCurrentQ.toLocaleString()} dari target $${targetMargin.toLocaleString()}. NA: ${naCurrentQ} dari target ${targetNA}. ` +
    `Berdasarkan penilaian diri, karakter yang menonjol: ${avg >= 4 ? "percaya diri tinggi, ambisius, dan proaktif" : avg >= 3 ? "realistis, sadar akan kekuatan dan kelemahan" : "rendah hati, menyadari banyak ruang untuk bertumbuh"}. ` +
    `${zonaFinal === "hijau" ? "Dengan performa saat ini, potensi promosi terbuka lebar." : "Perlu fokus peningkatan untuk membuka jalan menuju level berikutnya."}`;

  const swotAnalysis = generateSWOT(pillarScores, data, marginCurrentQ, groups);
  const coachingPoints = generateCoachingPoints(pillarScores, zonaFinal, data, groups);
  const actionPlan = generateActionPlan(coachingPoints, data, weakPillars);

  const progressKuartal = {
    kuartalBerjalan: quarterInfo.quarter,
    sisaHari: quarterInfo.sisaHari,
    targetMargin,
    realisasiMargin: marginCurrentQ,
    percentageMargin: targetMargin > 0 ? Math.round((marginCurrentQ / targetMargin) * 100) : 0,
    targetNA,
    realisasiNA: naCurrentQ,
    percentageNA: targetNA > 0 ? Math.round((naCurrentQ / targetNA) * 100) : 0,
    catatan: marginCurrentQ < 0
      ? "KRITIS: Margin negatif! Perlu recovery plan darurat."
      : marginCurrentQ >= targetMargin
        ? "Target tercapai! Pertahankan momentum."
        : marginCurrentQ >= targetMargin * 0.8
          ? "Hampir mencapai target. Sedikit lagi!"
          : "Di bawah target, perlu strategi boost yang lebih agresif."
  };

  const ews = generateEWS(pillarScores, zonaFinal, marginCurrentQ, targetMargin, data, groups);

  const kesesuaianVisi = {
    status: (totalSelfScore >= 75 ? "Align" : totalSelfScore >= 50 ? "Perlu Penyesuaian" : "Belum Sesuai") as "Align" | "Perlu Penyesuaian" | "Belum Sesuai",
    narasi: totalSelfScore >= 75
      ? "Penilaian diri menunjukkan kesiapan yang kuat untuk bertumbuh. Visi dan komitmen sudah sejalan."
      : totalSelfScore >= 50
        ? "Ada beberapa area yang perlu diselaraskan dengan visi jangka panjang, terutama pada konsistensi dan kaderisasi."
        : "Perlu refleksi mendalam tentang arah dan komitmen karier. Bimbingan intensif sangat direkomendasikan."
  };

  return {
    executiveSummary,
    insightLengkap,
    swotAnalysis,
    coachingPoints,
    actionPlan,
    progressKuartal,
    ews,
    kesesuaianVisi,
    psikologiNarasi,
    groupSummaries
  };
}

// ============================================
// SWOT - Character & Mindset Based
// ============================================

function generateSWOT(pillarScores: any[], data: InsertAudit, marginCurrentQ: number, groups: ReturnType<typeof analyzeGroups>) {
  const strength: string[] = [];
  const weakness: string[] = [];
  const opportunity: string[] = [];
  const threat: string[] = [];
  const targetMargin = getQuarterlyTargetMargin(data.jabatan);

  const strongPillars = pillarScores.filter((p: any) => p.selfScore >= 4);
  const weakPillars = pillarScores.filter((p: any) => p.selfScore <= 2);

  strongPillars.forEach((p: any) => {
    strength.push(`${p.pillarName} (skor ${p.selfScore}/5): ${p.insight}`);
  });

  weakPillars.forEach((p: any) => {
    weakness.push(`${p.pillarName} (skor ${p.selfScore}/5): ${p.insight}`);
  });

  if (groups.selling >= 4 && groups.teamBuilding >= 4) {
    strength.push("Kombinasi kuat antara kemampuan penjualan dan pembangunan tim menunjukkan potensi leadership yang besar.");
  }
  if (groups.character >= 4) {
    strength.push("Karakter kepemimpinan yang kuat menjadi fondasi solid untuk pertumbuhan karier jangka panjang.");
  }

  if (marginCurrentQ > 0 && marginCurrentQ < targetMargin) {
    opportunity.push(`Margin positif ($${marginCurrentQ.toLocaleString()}) menunjukkan fondasi bisnis yang ada. Tingkatkan aktivitas untuk mencapai target $${targetMargin.toLocaleString()}.`);
  }
  if (marginCurrentQ >= targetMargin) {
    opportunity.push("Target margin tercapai! Momentum positif ini bisa dimanfaatkan untuk ekspansi dan promosi.");
  }
  if (groups.growth >= 3 && groups.selling >= 3) {
    opportunity.push("Kombinasi mindset berkembang dan kemampuan penjualan membuka peluang untuk naik level lebih cepat.");
  }

  if (groups.teamBuilding < 2.5) {
    threat.push("Lemahnya pembangunan tim bisa menjadi hambatan serius untuk promosi dan keberlanjutan bisnis.");
  }
  if (groups.character < 2.5) {
    threat.push("Area karakter dan kepemimpinan yang rendah berisiko menurunkan trust dan motivasi tim.");
  }
  if (marginCurrentQ < 0) {
    threat.push(`Margin negatif ($${marginCurrentQ.toLocaleString()}) merupakan sinyal kritis yang membutuhkan tindakan segera.`);
  }
  if (data.jumlahBC + data.jumlahSBC + data.jumlahBsM === 0 && !data.jabatan.includes("BC")) {
    threat.push("Belum memiliki tim bawahan langsung. Risiko single point of failure sangat tinggi.");
  }

  if (strength.length === 0) strength.push("Potensi kekuatan perlu digali lebih dalam melalui refleksi dan mentoring.");
  if (weakness.length === 0) weakness.push("Tidak ada kelemahan kritis terdeteksi. Pertahankan keseimbangan.");
  if (opportunity.length === 0) opportunity.push("Fokus pada konsistensi dan pengembangan diri untuk membuka peluang baru.");
  if (threat.length === 0) threat.push("Tidak ada ancaman signifikan saat ini. Tetap waspada dan proaktif.");

  return { strength, weakness, opportunity, threat };
}

// ============================================
// COACHING - Character Driven
// ============================================

function generateCoachingPoints(pillarScores: any[], zonaFinal: string, data: InsertAudit, groups: ReturnType<typeof analyzeGroups>): string[] {
  const points: string[] = [];
  const weakPillars = pillarScores.filter((p: any) => p.selfScore <= 2);
  const targetMargin = getQuarterlyTargetMargin(data.jabatan);
  const { quarterNum } = getCurrentQuarter();
  const marginCurrentQ = [data.marginTimQ1, data.marginTimQ2, data.marginTimQ3, data.marginTimQ4][quarterNum - 1];

  if (weakPillars.length > 0) {
    const topWeak = weakPillars.slice(0, 2);
    topWeak.forEach((p: any) => {
      points.push(`Prioritas pengembangan: ${p.pillarName} - ${p.insight}`);
    });
  }

  if (groups.selling < 3) {
    points.push("Tingkatkan kemampuan penjualan melalui latihan prospecting dan closing secara rutin. Targetkan minimal 20 prospek per minggu.");
  }
  if (groups.teamBuilding < 3 && !data.jabatan.includes("BC")) {
    const kad = getKaderisasiMinimum(data.jabatan);
    points.push(`Fokus pada kaderisasi: sebagai ${kad.level}, Anda perlu minimal ${kad.minimum} ${kad.targetRole} aktif. Mulai rekrut dan bina sekarang.`);
  }
  if (groups.character < 3) {
    points.push("Bangun karakter kepemimpinan melalui disiplin harian, konsistensi kerja, dan kolaborasi aktif dengan tim.");
  }

  if (marginCurrentQ < 0) {
    points.push("URGENT: Margin negatif membutuhkan recovery plan darurat. Evaluasi penyebab kerugian dan buat strategi pemulihan 30 hari.");
  } else if (marginCurrentQ < targetMargin * 0.5) {
    points.push(`Margin masih jauh di bawah target ($${marginCurrentQ.toLocaleString()} vs $${targetMargin.toLocaleString()}). Tingkatkan aktivitas closing secara agresif.`);
  }

  if (zonaFinal === "hijau" && points.length === 0) {
    points.push("Maintain excellence dan jadilah mentor bagi rekan-rekan yang lebih junior.");
    points.push("Persiapkan diri untuk tanggung jawab di level berikutnya. Perluas wawasan dan kemampuan leadership.");
  }

  while (points.length < 3) {
    if (groups.growth < 3.5) {
      points.push("Ikuti pelatihan dan pengembangan diri secara rutin. Inovasi cara kerja untuk hasil yang lebih efektif.");
    } else {
      points.push("Monitor progress mingguan, evaluasi pencapaian, dan sesuaikan strategi berdasarkan kondisi terkini.");
    }
  }

  return points.slice(0, 4);
}

// ============================================
// ACTION PLAN - Development Focused
// ============================================

function generateActionPlan(coachingPoints: string[], data: InsertAudit, weakPillars: string[]) {
  const weakArea = weakPillars.length > 0 ? weakPillars[0] : "area prioritas";

  return [
    {
      periode: "30 Hari",
      target: coachingPoints[0] || "Stabilkan performa dan identifikasi area pengembangan",
      aktivitas: `Refleksi diri mingguan, latihan harian pada ${weakArea}, diskusi dengan mentor, tracking aktivitas prospecting`,
      pic: data.nama,
      output: "Peningkatan kesadaran diri, minimal 1 kebiasaan baru yang konsisten, target aktivitas harian tercapai"
    },
    {
      periode: "60 Hari",
      target: coachingPoints[1] || "Tingkatkan area pengembangan dan perkuat fondasi",
      aktivitas: "Implementasi skill baru dari pelatihan, coaching dengan atasan, bangun jaringan baru, evaluasi progres tim",
      pic: data.nama,
      output: "Peningkatan skor di area lemah, hubungan tim lebih solid, pipeline bisnis bertambah"
    },
    {
      periode: "90 Hari",
      target: coachingPoints[2] || "Capai target kuartal dan persiapkan level berikutnya",
      aktivitas: "Review pencapaian menyeluruh, presentasi progress ke atasan, rencana pengembangan kuartal berikutnya",
      pic: data.nama,
      output: "Target kuartal tercapai, profil kompetensi meningkat, kesiapan untuk tantangan yang lebih besar"
    }
  ];
}

// ============================================
// EWS - Early Warning System
// ============================================

function generateEWS(
  pillarScores: any[],
  zonaFinal: string,
  marginCurrentQ: number,
  targetMargin: number,
  data: InsertAudit,
  groups: ReturnType<typeof analyzeGroups>
) {
  const ews: Array<{ faktor: string; indikator: string; risiko: string; saranCepat: string }> = [];

  if (marginCurrentQ < 0) {
    ews.push({
      faktor: "Margin Negatif (KRITIS)",
      indikator: `$${marginCurrentQ.toLocaleString()} (RUGI)`,
      risiko: "Kerugian aktif mengancam posisi dan kelangsungan tim. Potensi demosi langsung.",
      saranCepat: "Evaluasi penyebab kerugian segera, buat recovery plan darurat, eskalasi ke atasan"
    });
  }

  if (marginCurrentQ >= 0 && marginCurrentQ < targetMargin * 0.5) {
    ews.push({
      faktor: "Margin Jauh Di Bawah Target",
      indikator: `${Math.round((marginCurrentQ / targetMargin) * 100)}% dari target kuartal`,
      risiko: "Gagal memenuhi syarat bertahan di level saat ini",
      saranCepat: "Boost aktivitas closing, daily tracking, evaluasi strategi penjualan"
    });
  }

  if (groups.selling < 2) {
    ews.push({
      faktor: "Kemampuan Penjualan Rendah",
      indikator: `Rata-rata skor ${groups.selling.toFixed(1)}/5`,
      risiko: "Pipeline bisnis kering, sulit menghasilkan revenue yang konsisten",
      saranCepat: "Latihan prospecting & closing intensif, shadowing senior, target aktivitas harian"
    });
  }

  if (groups.teamBuilding < 2 && !data.jabatan.includes("BC")) {
    ews.push({
      faktor: "Pembangunan Tim Lemah",
      indikator: `Rata-rata skor ${groups.teamBuilding.toFixed(1)}/5`,
      risiko: "Tidak mampu membangun organisasi, hambatan promosi",
      saranCepat: "Fokus rekrutmen dan pembinaan kader, target minimal 1 rekrut per bulan"
    });
  }

  if (groups.character < 2) {
    ews.push({
      faktor: "Karakter Kepemimpinan Lemah",
      indikator: `Rata-rata skor ${groups.character.toFixed(1)}/5`,
      risiko: "Kehilangan kepercayaan tim, motivasi rendah, turnover tinggi",
      saranCepat: "Coaching kepemimpinan, bangun disiplin harian, tingkatkan komunikasi dengan tim"
    });
  }

  const totalTeam = data.jumlahBC + data.jumlahSBC + data.jumlahBsM + data.jumlahSBM + data.jumlahEM + data.jumlahSEM + data.jumlahVBM;
  const kaderisasi = getKaderisasiMinimum(data.jabatan);
  if (kaderisasi.minimum > 0 && totalTeam < kaderisasi.minimum) {
    ews.push({
      faktor: "Tim Di Bawah Standar Minimum",
      indikator: `${totalTeam} orang (minimum: ${kaderisasi.minimum} ${kaderisasi.targetRole})`,
      risiko: "Tidak memenuhi syarat struktural untuk level saat ini",
      saranCepat: `Rekrut ${kaderisasi.minimum - totalTeam} ${kaderisasi.targetRole} baru dalam 60 hari`
    });
  }

  if (ews.length === 0) {
    ews.push({
      faktor: "Tidak Ada Peringatan Kritis",
      indikator: "Semua indikator dalam batas aman",
      risiko: "Tidak ada risiko signifikan terdeteksi saat ini",
      saranCepat: "Pertahankan momentum dan tetap proaktif dalam pengembangan diri"
    });
  }

  return ews;
}

// ============================================
// ProDem - Data + Character Narrative
// ============================================

function generateProDemRecommendation(
  data: InsertAudit,
  totalSelfScore: number,
  zonaFinal: string,
  quarterInfo: any,
  marginCurrentQ: number,
  groups: ReturnType<typeof analyzeGroups>,
  julukan: { julukan: string; deskripsi: string }
) {
  const level = data.jabatan.match(/\(([A-Za-z]+)\)/)?.[1] || data.jabatan;
  const bertahan = getBertahanCriteria(data.jabatan);
  const promosi = getPromosiCriteria(data.jabatan);
  const totalTeam = data.jumlahBC + data.jumlahSBC + data.jumlahBsM + data.jumlahSBM + data.jumlahEM + data.jumlahSEM + data.jumlahVBM;
  const kaderisasi = getKaderisasiMinimum(data.jabatan);

  const isSBCorBC = data.jabatan.includes("SBC") || (data.jabatan.includes("BC") && !data.jabatan.includes("SBC"));
  const naCurrentQ = [data.naTimQ1, data.naTimQ2, data.naTimQ3, data.naTimQ4].find(n => n > 0) || 0;

  let saveByMarginMet = false;
  if (isSBCorBC) {
    saveByMarginMet = marginCurrentQ >= bertahan.saveByMargin || naCurrentQ >= 1 || totalTeam >= 3;
  } else {
    saveByMarginMet = marginCurrentQ >= bertahan.saveByMargin;
  }

  let saveByStaffMet = false;
  if (bertahan.saveByStaff) {
    const staffOk = totalTeam >= bertahan.saveByStaff.minStaff;
    const marginOk = marginCurrentQ >= bertahan.saveByStaff.minNetMargin;
    const teamLevelCount = getTeamCountByRole(data, bertahan.saveByStaff.minTeamLevel);
    const teamOk = teamLevelCount >= bertahan.saveByStaff.minTeamCount;
    saveByStaffMet = staffOk && marginOk && teamOk;
  }

  const bertahanMet = saveByMarginMet || saveByStaffMet;

  let promosiMet = false;
  if (promosi) {
    const marginOk = marginCurrentQ >= promosi.targetMargin;
    const staffOk = totalTeam >= promosi.targetStaff;
    let teamReqOk = true;
    for (const req of promosi.teamRequirements) {
      const count = getTeamCountByRole(data, req.role);
      if (count < req.count) teamReqOk = false;
    }
    promosiMet = marginOk && staffOk && teamReqOk;
  }

  let recommendation: "Promosi" | "Dipertahankan" | "Pembinaan" | "Demosi";
  let nextLevel = "";
  let reason = "";
  let konsekuensi = "";
  let nextStep = "";
  let strategyType: "Save by Margin" | "Save by Staff" | "N/A" = "N/A";
  const requirements: Array<{ label: string; value: string; met: boolean }> = [];

  if (promosiMet && totalSelfScore >= 65 && zonaFinal !== "merah") {
    recommendation = "Promosi";
    nextLevel = promosi?.nextLevel || getNextLevel(level);
    reason = `Margin $${marginCurrentQ.toLocaleString()} memenuhi target promosi $${promosi!.targetMargin.toLocaleString()}/kuartal. ` +
      `Tim ${totalTeam} orang memenuhi syarat ${promosi!.targetStaff} staf aktif. ` +
      `Sebagai ${julukan.julukan}, ${julukan.deskripsi.toLowerCase()}.`;
    konsekuensi = "Promosi diproses di akhir kuartal jika konsistensi performa terjaga.";
    nextStep = `Persiapkan transisi ke ${nextLevel}. Perkuat tim, delegasi tugas operasional, dan mulai training untuk tanggung jawab baru.`;

    requirements.push(
      { label: "Margin Promosi", value: `$${marginCurrentQ.toLocaleString()} / $${promosi!.targetMargin.toLocaleString()}`, met: marginCurrentQ >= promosi!.targetMargin },
      { label: "Staf Aktif", value: `${totalTeam} / ${promosi!.targetStaff} orang`, met: totalTeam >= promosi!.targetStaff },
      { label: "Skor 18 Pilar", value: `${totalSelfScore}/90`, met: totalSelfScore >= 65 },
      { label: "Zona Final", value: zonaFinal, met: zonaFinal !== "merah" }
    );

    if (promosi!.teamRequirements.length > 0) {
      for (const req of promosi!.teamRequirements) {
        const count = getTeamCountByRole(data, req.role);
        requirements.push({
          label: `Tim ${req.role}`,
          value: `${count} / min ${req.count}`,
          met: count >= req.count
        });
      }
    }
  } else if (!bertahanMet || marginCurrentQ < 0) {
    if (marginCurrentQ < 0) {
      recommendation = "Demosi";
      reason = `Margin NEGATIF ($${marginCurrentQ.toLocaleString()}) menunjukkan kerugian di kuartal ini. ` +
        `Target bertahan minimal $${bertahan.saveByMargin.toLocaleString()} tidak tercapai. Demosi langsung.`;
    } else {
      recommendation = "Demosi";
      reason = `Margin $${marginCurrentQ.toLocaleString()} tidak memenuhi syarat bertahan. ` +
        `Save by Margin: $${bertahan.saveByMargin.toLocaleString()} (${saveByMarginMet ? "TERCAPAI" : "TIDAK TERCAPAI"}). `;
      if (bertahan.saveByStaff) {
        reason += `Save by Staff: min ${bertahan.saveByStaff.minStaff} staf + ${bertahan.saveByStaff.minTeamCount} tim ${bertahan.saveByStaff.minTeamLevel} + margin $${bertahan.saveByStaff.minNetMargin.toLocaleString()} (${saveByStaffMet ? "TERCAPAI" : "TIDAK TERCAPAI"}).`;
      }
    }
    konsekuensi = "Tidak memenuhi syarat bertahan → demosi langsung sesuai skema ProDem.";
    nextStep = "Evaluasi menyeluruh, coaching intensif dengan atasan langsung, recovery plan darurat.";

    requirements.push(
      { label: "Save by Margin", value: `$${marginCurrentQ.toLocaleString()} / $${bertahan.saveByMargin.toLocaleString()}`, met: saveByMarginMet }
    );
    if (bertahan.saveByStaff) {
      requirements.push(
        { label: "Save by Staff - Staf Aktif", value: `${totalTeam} / ${bertahan.saveByStaff.minStaff}`, met: totalTeam >= bertahan.saveByStaff.minStaff },
        { label: "Save by Staff - Net Margin", value: `$${marginCurrentQ.toLocaleString()} / $${bertahan.saveByStaff.minNetMargin.toLocaleString()}`, met: marginCurrentQ >= bertahan.saveByStaff.minNetMargin }
      );
    }
  } else if (zonaFinal === "merah" || totalSelfScore < 45) {
    recommendation = "Pembinaan";
    reason = `Skor 18 Pilar ${totalSelfScore}/90 berada di zona merah. Wajib coaching intensif kuartal berjalan. ` +
      `Margin $${marginCurrentQ.toLocaleString()} ${saveByMarginMet ? "memenuhi" : "belum memenuhi"} syarat bertahan.`;
    konsekuensi = "Pilar kritis terdeteksi → wajib coaching intensif. Jika tidak ada perbaikan → demosi di kuartal berikutnya.";
    nextStep = "Coaching intensif dengan atasan langsung, monitoring weekly, perbaiki pilar kritis.";
    strategyType = saveByMarginMet ? "Save by Margin" : "Save by Staff";
  } else if (bertahanMet && !promosiMet) {
    recommendation = "Dipertahankan";
    strategyType = saveByMarginMet ? "Save by Margin" : "Save by Staff";
    reason = `Syarat bertahan terpenuhi via ${strategyType}. ` +
      `Sebagai ${julukan.julukan}, ${julukan.deskripsi.toLowerCase()}. `;
    if (promosi) {
      reason += `Untuk promosi ke ${promosi.nextLevel}: perlu margin $${promosi.targetMargin.toLocaleString()} dan ${promosi.targetStaff} staf aktif.`;
    }
    konsekuensi = "Status aman. Fokus pada peningkatan untuk mencapai syarat promosi.";
    nextStep = "Implementasi action plan 90 hari, review monthly, penuhi syarat promosi yang belum tercapai.";

    requirements.push(
      { label: "Syarat Bertahan", value: strategyType, met: true },
      { label: "Margin Kuartal", value: `$${marginCurrentQ.toLocaleString()} / $${bertahan.saveByMargin.toLocaleString()}`, met: saveByMarginMet }
    );
    if (promosi) {
      requirements.push(
        { label: "Target Promosi - Margin", value: `$${marginCurrentQ.toLocaleString()} / $${promosi.targetMargin.toLocaleString()}`, met: marginCurrentQ >= promosi.targetMargin },
        { label: "Target Promosi - Staf", value: `${totalTeam} / ${promosi.targetStaff}`, met: totalTeam >= promosi.targetStaff }
      );
    }
  } else {
    recommendation = "Dipertahankan";
    reason = `Performa cukup baik (Skor ${totalSelfScore}/90) sebagai ${julukan.julukan}. ` +
      `${julukan.deskripsi}. Fondasi sudah terbangun untuk promosi periode berikutnya.`;
    konsekuensi = "Status aman. Fokus pada peningkatan area yang masih perlu dikembangkan.";
    nextStep = "Implementasi action plan 90 hari, review monthly, penuhi syarat promosi.";
    strategyType = saveByMarginMet ? "Save by Margin" : "Save by Staff";
  }

  const bertahanInfo = {
    saveByMargin: { target: bertahan.saveByMargin, met: saveByMarginMet },
    saveByStaff: bertahan.saveByStaff ? {
      ...bertahan.saveByStaff,
      met: saveByStaffMet
    } : null,
    rotasiNote: "Bertahan dengan staf hanya bisa dilakukan 1 kali selang-seling (Q1 Margin, Q2 Staf, Q3 Margin, Q4 Staf)"
  };

  const promosiInfo = promosi ? {
    targetMargin: promosi.targetMargin,
    targetStaff: promosi.targetStaff,
    teamRequirements: promosi.teamRequirements,
    nextLevel: promosi.nextLevel,
    met: promosiMet
  } : null;

  return {
    currentLevel: data.jabatan,
    recommendation,
    nextLevel,
    reason,
    konsekuensi,
    nextStep,
    strategyType,
    requirements,
    bertahanInfo,
    promosiInfo
  };
}

function getTeamCountByRole(data: InsertAudit, role: string): number {
  const r = role.toUpperCase();
  if (r === "MGM") return data.jumlahBC + data.jumlahSBC;
  if (r === "BC") return data.jumlahBC;
  if (r === "SBC" || r === "BC/SBC") return data.jumlahSBC;
  if (r === "BSM" || r === "BSM/BSM") return data.jumlahBsM;
  if (r === "SBM") return data.jumlahSBM;
  if (r === "EM") return data.jumlahEM;
  if (r === "SEM") return data.jumlahSEM;
  if (r === "VBM") return data.jumlahVBM;
  return 0;
}

function getNextLevel(currentLevel: string): string {
  const hierarchy: Record<string, string> = {
    "BC": "SBC", "SBC": "BSM/BsM", "BSM": "SBM", "BsM": "SBM",
    "SBM": "EM", "EM": "SEM", "SEM": "VBM", "VBM": "BM"
  };
  return hierarchy[currentLevel] || "Next Level";
}

// ============================================
// MAGIC SECTION - Varied & Personal
// ============================================

function generateMagicSection(
  data: InsertAudit,
  profil: string,
  pillarScores: any[],
  coachingPoints: string[],
  groups: ReturnType<typeof analyzeGroups>,
  julukanData: { julukan: string; deskripsi: string }
) {
  const zodiacSign = getZodiacSign(data.tanggalLahir);
  const generasi = getGenerationFromBirthdate(data.tanggalLahir);
  const zodiacData = ZODIAC_BOOSTERS[zodiacSign];
  const totalScore = pillarScores.reduce((sum: number, p: any) => sum + p.selfScore, 0);
  const avg = totalScore / 18;

  const strongPillars = pillarScores.filter((p: any) => p.selfScore >= 4).map((p: any) => p.pillarName);

  let narasi = `${data.nama}, Anda adalah ${julukanData.julukan} — ${julukanData.deskripsi}. `;

  if (avg >= 4) {
    narasi += `Penilaian diri Anda menunjukkan kepercayaan yang luar biasa terhadap kemampuan sendiri. ` +
      `Ini adalah modal besar! Gunakan kepercayaan ini untuk mengangkat orang-orang di sekitar Anda. ` +
      `Pemimpin sejati bukan yang paling kuat, tapi yang membuat orang lain menjadi kuat. `;
  } else if (avg >= 3) {
    narasi += `Anda memiliki kesadaran diri yang sehat — tidak terlalu tinggi, tidak terlalu rendah. ` +
      `Ini menunjukkan kematangan dalam menilai kemampuan diri. ` +
      `Dengan fondasi ini, Anda siap untuk bertumbuh secara bertahap namun pasti. `;
  } else {
    narasi += `Kejujuran Anda dalam menilai diri sendiri adalah tanda keberanian yang luar biasa. ` +
      `Banyak orang memilih untuk over-claim, tapi Anda memilih untuk jujur. ` +
      `Dari kejujuran inilah pertumbuhan sejati dimulai. Setiap langkah kecil yang Anda ambil membawa Anda lebih dekat ke puncak. `;
  }

  if (strongPillars.length > 0) {
    narasi += `\n\nKekuatan Anda di ${strongPillars.slice(0, 2).join(" dan ")} adalah senjata rahasia yang harus terus diasah. `;
  }

  narasi += `\n\n90 hari ke depan adalah golden period Anda. Setiap hari adalah kesempatan untuk menjadi versi terbaik dari diri Anda!`;

  const zodiakBooster = generasi === "Gen Z" ? zodiacData.genZ : zodiacData.millennial;

  const coachingHighlight = `Key Focus: ${coachingPoints[0]}. Ini adalah langkah pertama dan terpenting untuk membuka pintu kesuksesan Anda di kuartal ini.`;

  const callToAction = `3 Langkah Konkret untuk 90 Hari:\n` +
    `1. ${coachingPoints[0]}\n` +
    `2. ${coachingPoints[1] || "Tingkatkan skill melalui pelatihan dan praktik"}\n` +
    `3. ${coachingPoints[2] || "Bangun kebiasaan positif yang konsisten"}\n` +
    `Eksekusi dengan disiplin, pantau progress setiap minggu, dan rayakan setiap pencapaian kecil!`;

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return {
    julukan: julukanData.julukan,
    narasi,
    zodiak: zodiacData.name,
    generasi,
    zodiakBooster,
    coachingHighlight,
    callToAction,
    quote
  };
}
