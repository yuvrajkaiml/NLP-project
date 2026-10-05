import re

class PostProcessor:
    """
    Cleans up and normalizes translation output:
    - Capitalization (first letter of sentence, pronoun 'I', proper nouns)
    - Punctuation spacing and normalization
    - Redundant whitespace and model artifact removal
    """

    def process(self, text: str, lang: str = "en") -> str:
        if not text:
            return ""

        cleaned = text.strip()

        # Remove common BPE / SentencePiece artifacts if any
        cleaned = cleaned.replace(" ", " ")
        cleaned = re.sub(r'<\/?s>|<pad>|<unk>|__\w+__', '', cleaned)

        # Normalize spaces
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()

        # Remove spaces before punctuation marks
        cleaned = re.sub(r'\s+([,.\?!;:])', r'\1', cleaned)

        # Ensure single space after punctuation marks if followed by a letter/number
        cleaned = re.sub(r'([,.\?!;:])([A-Za-z0-9\u0900-\u097F])', r'\1 \2', cleaned)

        if lang == "en":
            # Fix standalone lowercase 'i' -> 'I'
            cleaned = re.sub(r'\bi\b', 'I', cleaned)
            cleaned = re.sub(r"\bi'm\b", "I'm", cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r"\bi'll\b", "I'll", cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r"\bi've\b", "I've", cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r"\bi'd\b", "I'd", cleaned, flags=re.IGNORECASE)

            # Capitalize the first letter of each sentence
            sentences = re.split(r'([.?!]\s+)', cleaned)
            processed_sentences = []
            for part in sentences:
                if part and not re.match(r'^[.?!]\s+$', part):
                    processed_sentences.append(part[:1].upper() + part[1:])
                else:
                    processed_sentences.append(part)
            cleaned = "".join(processed_sentences)

            # Ensure sentence ends with appropriate punctuation if missing
            if cleaned and cleaned[-1] not in ".?!":
                cleaned += "."

        return cleaned
