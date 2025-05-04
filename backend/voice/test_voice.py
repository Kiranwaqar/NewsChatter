from gtts import gTTS
from io import BytesIO
import os

def generate_audio(text, lang='en'):
    """
    Generate audio from text using gTTS and return the audio as an in-memory file.
    """
    lang_code_map = {
        "english": "en",
        "urdu": "ur",  # Urdu language code
        "spanish": "es",
        "french": "fr",
        "german": "de",
        "italian": "it",
        # Add more language mappings as needed
    }

    gtts_lang = lang_code_map.get(lang.lower(), "en")  # Default to English if not found

    try:
        # Generate audio in the target language
        tts = gTTS(text=text, lang=gtts_lang)

        # Create an in-memory BytesIO buffer to save the audio
        audio_file = BytesIO()
        
        # Write the generated audio directly to the in-memory buffer
        tts.write_to_fp(audio_file)
        
        # Reset the pointer to the beginning of the file
        audio_file.seek(0)

        # Optionally save the file to check if it's working (local debug step)
        with open("output_audio.mp3", "wb") as f:
            f.write(audio_file.read())
        print(f"Audio file saved as output_audio.mp3 in current directory")

        # Return the in-memory audio file
        return audio_file

    except Exception as e:
        print(f"Error in generating audio: {str(e)}")
        raise e

# Test audio generation for Urdu
text_to_translate = "سلام دنیا"  # Example Urdu text
audio_file = generate_audio_with_gtts(text_to_translate, lang="urdu")

# Check if audio is generated
if audio_file:
    print("Audio generated successfully.")
