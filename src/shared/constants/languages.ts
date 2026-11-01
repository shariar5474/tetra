export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  dialects?: { code: string; name: string; notes: string }[];
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    dialects: [
      {
        code: 'bn-ctg',
        name: 'Chittagong / Chatgaiya (চাঁটগাঁইয়া)',
        notes: 'Preserves authentic Chattogram phonetic spellings and regional colloquial vocabulary (e.g., অনরে, হনডে, খাইস্যন, গম আছননি, বেয়াইগ্গুন) without standardizing.',
      },
      {
        code: 'bn-std',
        name: 'Standard Bengali (প্রমিত বাংলা)',
        notes: 'Standard literary and conversational Bengali.',
      },
      {
        code: 'bn-syl',
        name: 'Sylheti (সিলেটি)',
        notes: 'Sylheti regional dialect preservation.',
      },
    ],
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dialects: [
      { code: 'en-us', name: 'American English', notes: 'US spelling and cinematic idioms' },
      { code: 'en-uk', name: 'British English', notes: 'UK spelling and expressions' },
    ],
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dialects: [
      { code: 'hi-std', name: 'Standard Hindi', notes: 'Devanagari script preservation' },
    ],
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    dialects: [
      { code: 'ur-std', name: 'Standard Urdu', notes: 'Nastaliq / Urdu script preservation' },
    ],
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dialects: [
      { code: 'ar-msa', name: 'Modern Standard Arabic', notes: 'Fusha cinematic tone' },
    ],
  },
];
