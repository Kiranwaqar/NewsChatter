from openai import OpenAI
import os
from flask import Flask, jsonify, send_file, request
from gtts import gTTS
from io import BytesIO
from flask_cors import CORS
from dotenv import load_dotenv
import os
from IPython.display import Audio


# Explicitly load the .env file using full pat

# Explicit path to .env
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))


app = Flask(__name__)
CORS(app)



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




def translate_text_with_openai(text, target_language):
    prompt = f"Translate the following text to {target_language}:\n\n{text}"
    print("Sending prompt to OpenAI API for translation")
    openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a professional translator."},
            {"role": "user", "content": prompt}
        ]
    )
    return response["choices"][0]["message"]["content"].strip()

def generate_audio_with_gtts(text, lang='en'):
    lang_code_map = {
        "english": "en",
        "urdu": "ur",
        "spanish": "es",
        "french": "fr",
        "german": "de",
        "italian": "it",
    }
    gtts_lang = lang_code_map.get(lang.lower(), "en")
    audio = generate_audio(text,gtts_lang)
    return audio

    

    

@app.route('/translate', methods=['GET'])
def translate_and_generate_audio():
    print(f"Received request at /translate with params: {dict(request.args)}")
    text_to_translate = request.args.get('text')
    target_language = request.args.get('lang')

    if not text_to_translate or not target_language:
        print("Missing text or language parameter")
        return jsonify({"error": "Missing 'text' or 'lang' parameter"}), 400

    try:
        print(f"Translating text: {text_to_translate} to {target_language}")
        translated_text = translate_text_with_openai(text_to_translate, target_language)
        print(f"Original Text: {text_to_translate}")
        print(f"Translated Text: {translated_text}")
        
        audio_file = generate_audio_with_gtts(translated_text, lang=target_language)
        print(f"Generated audio file")
        
        return send_file(audio_file, mimetype="audio/mpeg", as_attachment=True, download_name="translated_audio.mp3")
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def hello():
    return "Flask server is running! Try the /translate endpoint with text and lang parameters."

if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0')
