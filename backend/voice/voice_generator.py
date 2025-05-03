import base64
from io import BytesIO
from PIL import Image
from IPython.display import Audio, display
from openai import OpenAI
import os

def talker(message):
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")
    
    openai = OpenAI()
    # Generate audio
    response = openai.audio.speech.create(
        model="tts-1",
        voice="onyx",
        input=message
    )

    audio_stream = BytesIO(response.content)
    output_filename = "output_audio.mp3"
    with open(output_filename, "wb") as f:
        f.write(audio_stream.read())

    # Play the generated audio
    return (Audio(output_filename, autoplay=True))


display(talker("Hey there. Today's news shows that build with ai is really hard."))