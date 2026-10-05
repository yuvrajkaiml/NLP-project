import re
from typing import Dict

class Transliterator:
    """
    Converts Romanized Hindi / Hinglish into standard Devanagari script.
    Uses high-frequency vocabulary mapping, English loanword transliteration,
    and phonetic substitution rules.
    """

    # Direct vocabulary for common Hinglish words
    WORD_MAP: Dict[str, str] = {
        # Pronouns
        "mujhe": "मुझे", "mujhko": "मुझको", "main": "मैं", "mera": "मेरा", "meri": "मेरी", "mere": "मेरे",
        "hum": "हम", "hume": "हमें", "humko": "हमको", "hamara": "हमारा", "hamari": "हमारी", "hamare": "हमारे",
        "tum": "तुम", "tumhe": "तुम्हें", "tumhara": "तुम्हारा", "tumhari": "तुम्हारी", "tumhare": "तुम्हारे",
        "tumne": "तुमने", "aap": "आप", "aapko": "आपको", "aapka": "आपका", "aapki": "आपकी", "aapke": "आपके",
        "aapne": "आपने", "tu": "तू", "tujhe": "तुझे", "tera": "तेरा", "teri": "तेरी", "tere": "तेरे",
        "wo": "वो", "woh": "वह", "usse": "उसे", "usko": "उसको", "uska": "उसका", "uski": "उसकी", "uske": "उसके",
        "usne": "उसने", "unhone": "उन्होंने", "unhe": "उन्हें", "unka": "उनका", "unki": "उनकी", "unke": "उनके",
        "ye": "ये", "yeh": "यह", "isse": "इसे", "isko": "इसको", "iska": "इसका", "iski": "इसकी", "iske": "इसके",
        "isne": "इसने", "inhone": "इन्होंने", "apna": "अपना", "apni": "अपनी", "apne": "अपने",

        # Interrogatives
        "kya": "क्या", "kyun": "क्यों", "kyu": "क्यों", "kab": "कब", "kaha": "कहाँ", "kahan": "कहाँ",
        "kidhar": "किधर", "kaise": "कैसे", "kaisa": "कैसा", "kaisi": "कैसी", "kon": "कौन", "kaun": "कौन",
        "kitna": "कितना", "kitni": "कितनी", "kitne": "कितने", "kisko": "किसको", "kisse": "किससे", "kisne": "किसने",

        # Common Verbs & Auxiliaries
        "hai": "है", "hain": "हैं", "ho": "हो", "hoon": "हूँ", "hun": "हूँ",
        "tha": "था", "thi": "थी", "the": "थे",
        "hoga": "होगा", "hogi": "होगी", "hoge": "होंगे",
        "raha": "रहा", "rahi": "रही", "rahe": "रहे",
        "kar": "कर", "karna": "करना", "karo": "करो", "karein": "करें", "karta": "करता", "karti": "करती", "karte": "करते", "kiya": "किया", "kiye": "किये",
        "de": "दे", "dena": "देना", "do": "दो", "dijiye": "दीजिए", "diya": "दिया", "diye": "दिए",
        "le": "ले", "lena": "लेना", "lo": "लो", "liya": "लिया", "liye": "लिए",
        "aa": "आ", "aana": "आना", "aao": "आओ", "aaya": "आया", "aayi": "आयी", "aaye": "आए",
        "ja": "जा", "jaana": "जाना", "jao": "जाओ", "gaya": "गया", "gayi": "गयी", "gaye": "गए",
        "chal": "चल", "chalo": "चलो", "chalte": "चलते", "chalein": "चले", "chala": "चला", "chali": "चली",
        "dekh": "देख", "dekho": "देखो", "dekhna": "देखना", "dekhne": "देखने", "dekha": "देखा",
        "khao": "खाओ", "khana": "खाना", "khaya": "खाया", "khayi": "खायी",
        "peeyo": "पीओ", "peena": "पीना", "peene": "पीने", "piya": "पिया",
        "bol": "बोल", "bolo": "बोलो", "bolna": "बोलना", "bola": "बोला",
        "samajh": "समझ", "samajhna": "समझना", "samjha": "समझा",
        "sona": "सोना", "sone": "सोने", "soya": "सोया",
        "padhna": "पढ़ना", "padh": "पढ़", "likhna": "लिखना", "likh": "लिख",

        # Adjectives, Adverbs, Prepositions
        "bahut": "बहुत", "bohot": "बहुत", "zyada": "ज़्यादा", "thoda": "थोड़ा", "kam": "कम",
        "achha": "अच्छा", "achhi": "अच्छी", "achhe": "अच्छे",
        "bura": "बुरा", "buri": "बुरी", "bure": "बुरे",
        "theek": "ठीक", "thik": "ठीक", "kharab": "खराब", "sahi": "सही", "galat": "गलत",
        "nahi": "नहीं", "nahin": "नहीं", "na": "ना", "mat": "मत",
        "bhi": "भी", "aur": "और", "ya": "या", "lekin": "लेकिन", "magar": "मगर", "par": "पर",
        "mein": "में", "me": "में", "se": "से", "ko": "को", "ke": "के", "ki": "की", "ka": "का",
        "saath": "साथ", "tak": "तक", "pe": "पे", "baad": "बाद", "pehle": "पहले",

        # Nouns, Time, Relations
        "yaar": "यार", "bhai": "भाई", "dost": "दोस्त", "sab": "सब", "log": "लोग",
        "kal": "कल", "aaj": "आज", "parso": "परसों", "subah": "सुबह", "shaam": "शाम", "raat": "रात", "din": "दिन",
        "tabiyat": "तबीयत", "baat": "बात", "kaam": "काम", "ghar": "घर", "naam": "नाम",
        "paani": "पानी", "chai": "चाय", "khabar": "खबर", "waqt": "वक़्त", "samay": "समय",

        # Common English Loanwords in Hinglish
        "college": "कॉलेज", "presentation": "प्रेजेंटेशन", "phone": "फोन",
        "movie": "मूवी", "film": "फिल्म", "party": "पार्टी",
        "smart": "स्मार्ट", "class": "क्लास", "office": "ऑफिस",
        "laptop": "लैपटॉप", "car": "कार", "bike": "बाइक", "bus": "बस",
        "train": "ट्रेन", "flight": "फ्लाइट", "ticket": "टिकट",
        "problem": "प्रॉब्लम", "tension": "टेंशन", "meeting": "मीटिंग",
        "project": "प्रोजेक्ट", "friend": "फ्रेंड", "group": "ग्रुप",
        "family": "फैमिली", "doctor": "डॉक्टर", "hospital": "हॉस्पिटल",
        "medicine": "दवा", "time": "टाइम", "call": "कॉल", "message": "मैसेज"
    }

    # Phonetic consonant clusters and letters for transliteration fallback
    PHONETIC_RULES = [
        ("ksh", "क्ष"), ("gya", "ज्ञ"), ("tra", "त्र"), ("shh", "ष"),
        ("ch", "च"), ("chh", "छ"), ("jh", "झ"), ("kh", "ख"),
        ("gh", "घ"), ("th", "थ"), ("dh", "ध"), ("ph", "फ"),
        ("bh", "भ"), ("sh", "श"), ("rh", "ढ़"),
        ("k", "क"), ("g", "ग"), ("j", "ज"), ("t", "त"),
        ("d", "द"), ("n", "न"), ("p", "प"), ("f", "फ़"),
        ("b", "ब"), ("m", "म"), ("y", "य"), ("r", "र"),
        ("l", "ल"), ("v", "व"), ("w", "व"), ("s", "स"),
        ("h", "ह"), ("z", "ज़"), ("x", "क्स")
    ]

    def roman_to_devanagari_word(self, word: str) -> str:
        clean_w = word.strip().lower()
        if not clean_w:
            return ""

        # Check direct dictionary
        if clean_w in self.WORD_MAP:
            return self.WORD_MAP[clean_w]

        # Use indic_transliteration if available
        try:
            from indic_transliteration import sanscript
            # Standard ITRANS or WX scheme
            res = sanscript.transliterate(clean_w, sanscript.ITRANS, sanscript.DEVANAGARI)
            if res and not any(c in res for c in 'abcdefghijklmnopqrstuvwxyz'):
                return res
        except Exception:
            pass

        # Phonetic fallback
        curr = clean_w
        for lat, dev in self.PHONETIC_RULES:
            curr = curr.replace(lat, dev)

        return curr

    def roman_to_devanagari(self, text: str) -> str:
        """
        Transliterates a sentence from Hinglish/Roman script to Devanagari.
        Preserves punctuation, whitespace, and capitalization structure.
        """
        if not text:
            return ""

        # Tokenize preserving spaces and punctuations
        tokens = re.split(r'(\s+|[^\w\s])', text)
        result = []
        for token in tokens:
            if not token:
                continue
            if re.match(r'^[a-zA-Z]+$', token):
                lower_token = token.lower()
                dev = self.WORD_MAP.get(lower_token)
                if dev:
                    result.append(dev)
                else:
                    result.append(self.roman_to_devanagari_word(token))
            else:
                result.append(token)

        return "".join(result)
