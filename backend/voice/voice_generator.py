import openai
import os
from flask import Flask, jsonify, send_file, request
from gtts import gTTS
from io import BytesIO

# Ensure the API key is set
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

def translate_text_with_openai(text, target_language):
    """
    Use OpenAI API to translate the given text into the target language.
    """
    if not openai.api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")
    
    # Create a prompt for translation
    prompt = f"Translate the following text to {target_language}:\n\n{text}"
    
    # Call the GPT model
    response = openai.ChatCompletion.create(
        model="gpt-4",  # Use "gpt-3.5-turbo" if you don't have access to GPT-4
        messages=[
            {"role": "system", "content": "You are a professional translator."},
            {"role": "user", "content": prompt}
        ]
    )
    
    # Extract and return the translated text
    return response["choices"][0]["message"]["content"].strip()

def generate_audio_with_gtts(text, lang='en'):
    """
    Generate audio from text using gTTS and return the audio as an in-memory file.
    """
    tts = gTTS(text=text, lang=lang)  # Generate audio in the target language
    audio_file = BytesIO()  # Create an in-memory file
    tts.save(audio_file)  # Save the audio to the in-memory file
    audio_file.seek(0)  # Reset pointer to the beginning of the file
    return audio_file

@app.route('/translate', methods=['GET'])
def translate_and_generate_audio():
    """
    Endpoint to translate text and return generated audio.
    Expects the 'text' and 'lang' query parameters.
    """
    # Get 'text' and 'lang' from query parameters
    text_to_translate = request.args.get('text')  # Get text from query parameter
    target_language = request.args.get('lang')  # Get target language from query parameter

    if not text_to_translate or not target_language:
        return jsonify({"error": "Missing 'text' or 'lang' parameter"}), 400
    
    try:
        # Translate text to the target language
        translated_text = translate_text_with_openai(text_to_translate, target_language)
        print(f"Original Text: {text_to_translate}")
        print(f"Translated Text ({target_language}): {translated_text}")
        
        # Generate audio for the translated text
        audio_file = generate_audio_with_gtts(translated_text, lang=target_language)
        
        # Return the audio file as a response
        return send_file(audio_file, mimetype="audio/mpeg", as_attachment=True, download_name="translated_audio.mp3")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
