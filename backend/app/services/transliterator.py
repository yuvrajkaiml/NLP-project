import re
from typing import Dict

class Transliterator:
    """
    Converts Romanized Hindi / Hinglish into standard Devanagari script.
    Uses high-frequency vocabulary mapping, chat-slang normalization,
    English loanword transliteration, and intelligent phonetic substitution.
    """

    # Chat slang & spelling normalizer dictionary
    SLANG_MAP: Dict[str, str] = {
        "nhi": "nahi", "nh": "nahi", "nai": "nahi", "naa": "na",
        "yr": "yaar", "yar": "yaar", "bht": "bahut", "bohot": "bahut",
        "pyarr": "pyar", "pyaar": "pyar", "luv": "love",
        "kch": "kuch", "plz": "please", "pls": "please",
        "clg": "college", "sch": "school", "wrk": "work",
        "tym": "time", "msg": "message", "pic": "picture", "pics": "pictures",
        "btao": "batao", "btana": "batana", "krna": "karna", "kro": "karo",
        "dkh": "dekh", "smjh": "samajh", "bhaiya": "bhai", "bro": "bhai",
        "frnd": "friend", "frnds": "friends", "aakanksha": "aakansha"
    }

    # Direct vocabulary for common Hinglish words -> Devanagari
    WORD_MAP: Dict[str, str] = {
        # Pronouns & Possessives
        "mujhe": "मुझे", "mujhko": "मुझको", "main": "मैं", "mai": "मैं", "mera": "मेरा", "meri": "मेरी", "mere": "मेरे",
        "hum": "हम", "hume": "हमें", "humko": "हमको", "hamara": "हमारा", "hamari": "हमारी", "hamare": "हमारे",
        "tum": "तुम", "tumhe": "तुम्हें", "tumhara": "तुम्हारा", "tumhari": "तुम्हारी", "tumhare": "तुम्हारे",
        "tumne": "तुमने", "aap": "आप", "aapko": "आपको", "aapka": "आपका", "aapki": "आपकी", "aapke": "आपके",
        "aapne": "आपने", "tu": "तू", "tujhe": "तुझे", "tujhko": "तुझको", "tera": "तेरा", "teri": "तेरी", "tere": "तेरे",
        "wo": "वो", "woh": "वह", "usse": "उसे", "usko": "उसको", "uska": "उसका", "uski": "उसकी", "uske": "उसके",
        "usne": "उसने", "unhone": "उन्होंने", "unhe": "उन्हें", "unko": "उनको", "unka": "उनका", "unki": "उनकी", "unke": "उनके",
        "ye": "ये", "yeh": "यह", "isse": "इसे", "isko": "इसको", "iska": "इसका", "iski": "इसकी", "iske": "इसके",
        "isne": "इसने", "inhone": "इन्होंने", "inhe": "इन्हें", "apna": "अपना", "apni": "अपनी", "apne": "अपने",
        "sab": "सब", "koi": "कोई", "kuch": "कुछ", "kisi": "किसी", "kisko": "किसको", "kisse": "किससे", "kisne": "किसने",

        # Interrogatives
        "kya": "क्या", "kyun": "क्यों", "kyu": "क्यों", "kab": "कब", "kaha": "कहाँ", "kahan": "कहाँ",
        "kidhar": "किधर", "idhar": "इधर", "udhar": "उधर", "kaise": "कैसे", "kaisa": "कैसा", "kaisi": "कैसी",
        "kon": "कौन", "kaun": "कौन", "kitna": "कितना", "kitni": "कितनी", "kitne": "कितने",

        # Emotions, Feelings, Relationships
        "pyar": "प्यार", "pyaar": "प्यार", "ishq": "इश्क़", "mohabbat": "मोहब्बत", "prem": "प्रेम",
        "nafrat": "नफ़रत", "pasand": "पसंद", "gussa": "गुस्सा", "khushi": "खुशी", "dukh": "दुख",
        "dard": "दर्द", "bharosa": "भरोसा", "vishwas": "विश्वास", "yaad": "याद", "chahat": "चाहत",
        "dost": "दोस्त", "dosti": "दोस्ती", "yaar": "यार", "bhai": "भाई", "behen": "बहन",
        "maa": "माँ", "papa": "पापा", "family": "फैमिली", "rishta": "रिश्ता",

        # Common Names
        "ojas": "ओजस", "aakansha": "आकांक्षा", "aakanksha": "आकांक्षा",
        "rahul": "राहुल", "rohit": "रोहित", "priya": "प्रिया", "pooja": "पूजा",
        "neha": "नेहा", "anjali": "अंजलि", "amit": "अमित", "vikram": "विक्रम",
        "ayush": "आयुष", "aman": "अमन", "tanvi": "तन्वी", "sneha": "स्नेहा",
        "riya": "रिया", "aditya": "आदित्य", "shivam": "शिवम", "ananya": "अनन्या",

        # Common Verbs & Auxiliaries
        "hai": "है", "hain": "हैं", "ho": "हो", "hoon": "हूँ", "hun": "हूँ",
        "tha": "था", "thi": "थी", "the": "थे",
        "hoga": "होगा", "hogi": "होगी", "hoge": "होंगे",
        "raha": "रहा", "rahi": "रही", "rahe": "रहे",
        "kar": "कर", "karna": "करना", "karo": "करो", "karein": "करें", "karta": "करता", "karti": "करती", "karte": "करते", "kiya": "किया", "kiye": "किये",
        "de": "दे", "dena": "देना", "do": "दो", "dijiye": "दीजिए", "diya": "दिया", "diye": "दिए",
        "le": "ले", "lena": "लेना", "lo": "लो", "liya": "लिया", "liye": "लिए",
        "aa": "आ", "aana": "आना", "aao": "आओ", "aaya": "आया", "aayi": "आयी", "aaye": "आए",
        "ja": "जा", "jaana": "जाना", "jao": "जाओ", "gaya": "गया", "gayi": "गयी", "gaye": "गए", "jata": "जाता", "jati": "जाती",
        "chal": "चल", "chalo": "चलो", "chalte": "चलते", "chalein": "चले", "chala": "चला", "chali": "चली",
        "dekh": "देख", "dekho": "देखो", "dekhna": "देखना", "dekhne": "देखने", "dekha": "देखा", "dekhi": "देखी",
        "khao": "खाओ", "khana": "खाना", "khaya": "खाया", "khayi": "खायी",
        "peeyo": "पीओ", "peena": "पीना", "peene": "पीने", "piya": "पिया",
        "bol": "बोल", "bolo": "बोलो", "bolna": "बोलना", "bola": "बोला", "boli": "बोली",
        "samajh": "समझ", "samajhna": "समझना", "samjha": "समझा", "samjhi": "समझी",
        "sona": "सोना", "sone": "सोने", "soya": "सोया", "soyi": "सोयी",
        "padhna": "पढ़ना", "padh": "पढ़", "padha": "पढ़ा", "likhna": "लिखना", "likh": "लिख", "likha": "लिखा",
        "milna": "मिलना", "mila": "मिला", "mili": "मिली", "mile": "मिले", "mil": "मिल",
        "batana": "बताना", "batao": "बताओ", "bataya": "बताया", "bata": "बता",
        "sunna": "सुनना", "suno": "सुनो", "suna": "सुना",
        "chahiye": "चाहिए", "chahta": "चाहता", "chahti": "चाहती", "chahte": "चाहते",

        # Adjectives, Adverbs, Prepositions
        "bahut": "बहुत", "bohot": "बहुत", "zyada": "ज़्यादा", "jyada": "ज़्यादा", "thoda": "थोड़ा", "kam": "कम",
        "achha": "अच्छा", "achhi": "अच्छी", "achhe": "अच्छे", "accha": "अच्छा", "acchi": "अच्छी", "acche": "अच्छे",
        "bura": "बुरा", "buri": "बुरी", "bure": "बुरे",
        "theek": "ठीक", "thik": "ठीक", "kharab": "खराब", "kharaab": "खराब", "sahi": "सही", "galat": "गलत",
        "sundar": "सुंदर", "badhiya": "बढ़िया", "bada": "बड़ा", "chhota": "छोटा",
        "nahi": "नहीं", "nahin": "नहीं", "na": "ना", "mat": "मत",
        "bhi": "भी", "aur": "और", "ya": "या", "lekin": "लेकिन", "magar": "मगर", "par": "पर",
        "mein": "में", "me": "में", "se": "से", "ko": "को", "ke": "के", "ki": "की", "ka": "का",
        "saath": "साथ", "tak": "तक", "pe": "पे", "baad": "बाद", "pehle": "पहले",

        # Nouns, Time, Locations
        "log": "लोग", "duniya": "दुनिया", "desh": "देश", "shehar": "शहर", "gaon": "गाँव",
        "kal": "कल", "aaj": "आज", "parso": "परसों", "subah": "सुबह", "shaam": "शाम", "raat": "रात", "din": "दिन",
        "tabiyat": "तबीयत", "baat": "बात", "kaam": "काम", "ghar": "घर", "naam": "नाम",
        "paani": "पानी", "chai": "चाय", "khabar": "खबर", "waqt": "वक़्त", "samay": "समय",
        "shukriya": "शुक्रिया", "dhanyawad": "धन्यवाद", "alvida": "अलविदा",

        # Common English Loanwords in Hinglish
        "college": "कॉलेज", "presentation": "प्रेजेंटेशन", "phone": "फोन",
        "movie": "मूवी", "film": "फिल्म", "party": "पार्टी",
        "smart": "स्मार्ट", "class": "क्लास", "office": "ऑफिस",
        "laptop": "लैपटॉप", "car": "कार", "bike": "बाइक", "bus": "बस",
        "train": "ट्रेन", "flight": "फ्लाइट", "ticket": "टिकट",
        "problem": "प्रॉब्लम", "tension": "टेंशन", "meeting": "मीटिंग",
        "project": "प्रोजेक्ट", "friend": "फ्रेंड", "group": "ग्रुप",
        "doctor": "डॉक्टर", "hospital": "हॉस्पिटल", "medicine": "दवा",
        "time": "टाइम", "call": "कॉल", "message": "मैसेज", "help": "हेल्प"
    }

    # Consonant and conjunct maps
    CONSONANTS = [
        ("ksh", "क्ष"), ("gya", "ज्ञ"), ("tra", "त्र"), ("shh", "ष"),
        ("chh", "छ"), ("ch", "च"), ("jh", "झ"), ("kh", "ख"),
        ("gh", "घ"), ("th", "थ"), ("dh", "ध"), ("ph", "फ"),
        ("bh", "भ"), ("sh", "श"), ("rh", "ढ़"),
        ("py", "प्या"), ("ky", "क्या"), ("ty", "त्य"), ("dy", "द्य"),
        ("ny", "न्य"), ("my", "म्य"), ("ly", "ल्य"), ("vy", "व्य"),
        ("k", "क"), ("g", "ग"), ("j", "ज"), ("t", "त"),
        ("d", "द"), ("n", "न"), ("p", "प"), ("f", "फ़"),
        ("b", "ब"), ("m", "म"), ("y", "य"), ("r", "र"),
        ("l", "ल"), ("v", "व"), ("w", "व"), ("s", "स"),
        ("h", "ह"), ("z", "ज़"), ("x", "क्स")
    ]

    def normalize_word(self, word: str) -> str:
        w = word.lower().strip()
        # Reduce 3+ consecutive duplicate characters to 1 or 2
        w = re.sub(r'(.)\1{2,}', r'\1\1', w)
        if w in self.SLANG_MAP:
            return self.SLANG_MAP[w]
        # Check single reduced character
        single_red = re.sub(r'(.)\1+', r'\1', w)
        if single_red in self.WORD_MAP:
            return single_red
        return w

    def roman_to_devanagari_word(self, word: str) -> str:
        clean_w = self.normalize_word(word)
        if not clean_w:
            return ""

        # Check direct vocabulary
        if clean_w in self.WORD_MAP:
            return self.WORD_MAP[clean_w]

        # Use indic_transliteration if available
        try:
            from indic_transliteration import sanscript
            res = sanscript.transliterate(clean_w, sanscript.ITRANS, sanscript.DEVANAGARI)
            # Remove trailing halant if it ended with a vowel or common consonant name
            if res.endswith('्'):
                res = res[:-1]
            if res and not any(c in res for c in 'abcdefghijklmnopqrstuvwxyz'):
                return res
        except Exception:
            pass

        # Phonetic fallback substitution
        curr = clean_w
        for lat, dev in self.CONSONANTS:
            curr = curr.replace(lat, dev)

        # Basic vowels
        curr = curr.replace("aa", "ा").replace("ee", "ी").replace("oo", "ू")
        curr = curr.replace("a", "").replace("i", "ि").replace("u", "ु")
        curr = curr.replace("e", "े").replace("o", "ो")

        return curr

    def roman_to_devanagari(self, text: str) -> str:
        """
        Transliterates a sentence from Hinglish/Roman script to Devanagari.
        Preserves punctuation, whitespace, and capitalization structure.
        """
        if not text:
            return ""

        tokens = re.split(r'(\s+|[^\w\s])', text)
        result = []
        for token in tokens:
            if not token:
                continue
            if re.match(r'^[a-zA-Z]+$', token):
                normalized = self.normalize_word(token)
                dev = self.WORD_MAP.get(normalized)
                if dev:
                    result.append(dev)
                else:
                    result.append(self.roman_to_devanagari_word(token))
            else:
                result.append(token)

        return "".join(result)
