import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import NewsCategories from "./NewsCategories";
import NewsService from "./NewsService";
import LanguageSelector from "./LanguageSelector";
import NewsVoiceService from "./NewsVoiceService";

// Avatar component that handles the 3D model and animations
const Avatar = ({ speaking, currentViseme }) => {
  const modelRef = useRef();
  // Preload the model as part of the component instead of waiting
  const { scene, animations } = useGLTF(
    "https://models.readyplayer.me/681629408ab2ab92492f09bf.glb",
    true
  );
  useAnimations(animations, modelRef);

  // Setup the model when it loads
  useEffect(() => {
    if (modelRef.current) {
      const model = scene.clone();

      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
      }

      modelRef.current.add(model);

      model.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;

          if (object.material) {
            object.material.needsUpdate = true;
            object.material.side = THREE.FrontSide;
          }
        }
      });

      // Position the model higher up to focus on the face
      model.position.set(0, -1.8, 0); // Adjusted y-position to bring face into view
      model.rotation.set(0, Math.PI + 20, 0); // Face forward
    }
  }, [scene]);

  // Apply visemes to the avatar's face when speaking
  useEffect(() => {
    // If not speaking or no model, reset mouth to closed position
    if (!modelRef.current) return;

    // Find head in the model
    const head = modelRef.current.getObjectByName("Wolf3D_Head");

    if (head && head.morphTargetDictionary && head.morphTargetInfluences) {
      // Enhanced mapping of viseme indices to morph targets for better lip sync
      const morphTargets = {
        0: "mouthClosed", // Neutral
        1: "mouthOpen", // Slightly open
        2: "mouthSmile", // Medium open
        3: "mouthOpen", // Wide open with intense
        4: "mouthO", // Rounded O shape
      };

      // Additional morph targets for more natural speech
      const supportMorphs = {
        jawForward: 0,
        jawLeft: 0,
        jawRight: 0,
        jawOpen: 0,
        mouthClose: 0,
        mouthDimple: 0,
        mouthStretch: 0,
        mouthRollLower: 0,
        mouthRollUpper: 0,
        mouthSmile: 0,
        mouthFrown: 0,
        mouthPucker: 0,
        mouthShrugLower: 0,
        mouthShrugUpper: 0,
        mouthLeft: 0,
        mouthRight: 0,
      };

      // Reset all mouth morphs first
      Object.values(morphTargets).forEach((target) => {
        if (head.morphTargetDictionary[target] !== undefined) {
          head.morphTargetInfluences[head.morphTargetDictionary[target]] = 0;
        }
      });

      Object.keys(supportMorphs).forEach((target) => {
        if (head.morphTargetDictionary[target] !== undefined) {
          head.morphTargetInfluences[head.morphTargetDictionary[target]] = 0;
        }
      });

      // Apply facial expressions if speaking
      if (speaking) {
        // Get the current viseme morph target
        const targetName = morphTargets[currentViseme % 5];

        // Apply the current viseme if it exists
        if (head.morphTargetDictionary[targetName] !== undefined) {
          // Enhanced intensity based on the viseme type for more pronounced movement
          const intensity =
            currentViseme === 3
              ? 0.9 // More intense for wide open
              : currentViseme === 2
              ? 0.65 // More pronounced for medium open
              : currentViseme === 1
              ? 0.45 // More visible for slightly open
              : currentViseme === 4
              ? 0.7 // Strong for O shape
              : 0.2;

          head.morphTargetInfluences[head.morphTargetDictionary[targetName]] =
            intensity;

          // Add stronger jaw movement for more natural speech
          if (head.morphTargetDictionary["jawOpen"] !== undefined) {
            head.morphTargetInfluences[head.morphTargetDictionary["jawOpen"]] =
              intensity * 0.8; // Increased jaw movement for better sync
          }

          // Add slight jaw forward for certain visemes
          if (
            head.morphTargetDictionary["jawForward"] !== undefined &&
            (currentViseme === 4 || currentViseme === 3)
          ) {
            head.morphTargetInfluences[
              head.morphTargetDictionary["jawForward"]
            ] = intensity * 0.2;
          }

          // Add mouth stretch for certain visemes
          if (
            head.morphTargetDictionary["mouthStretch"] !== undefined &&
            currentViseme === 2
          ) {
            head.morphTargetInfluences[
              head.morphTargetDictionary["mouthStretch"]
            ] = intensity * 0.3;
          }

          // Add mouth pucker for O shape
          if (
            head.morphTargetDictionary["mouthPucker"] !== undefined &&
            currentViseme === 4
          ) {
            head.morphTargetInfluences[
              head.morphTargetDictionary["mouthPucker"]
            ] = intensity * 0.5;
          }

          // Add occasional eye squint for emphasis (every ~8 visemes)
          if (Math.random() < 0.12 && currentViseme !== 0) {
            if (head.morphTargetDictionary["eyeSquintLeft"] !== undefined) {
              head.morphTargetInfluences[
                head.morphTargetDictionary["eyeSquintLeft"]
              ] = 0.3;
            }
            if (head.morphTargetDictionary["eyeSquintRight"] !== undefined) {
              head.morphTargetInfluences[
                head.morphTargetDictionary["eyeSquintRight"]
              ] = 0.3;
            }
          }
        }
      } else {
        // Reset to closed mouth if not speaking
        if (head.morphTargetDictionary["mouthClosed"] !== undefined) {
          head.morphTargetInfluences[
            head.morphTargetDictionary["mouthClosed"]
          ] = 0.05;
        }
      }
    }
  }, [currentViseme, speaking]);

  return <group ref={modelRef} position={[0, 0, 0]} />;
};

// Component for news text display and controls
const NewsControls = ({
  text,
  setText,
  isSpeaking,
  setIsSpeaking,
  isLoading,
  language,
}) => {
  return (
    <div className="absolute bottom-8 left-8 right-8 bg-black bg-opacity-70 p-4 rounded-lg">
      <textarea
        className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-600 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Enter news content here..."
      />

      <div className="flex justify-between items-center">
        <button
          className={`px-4 py-2 ${
            isSpeaking
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded transition`}
          onClick={() => setIsSpeaking(!isSpeaking)}
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : isSpeaking
            ? "Stop"
            : `Start Broadcasting in ${
                language === "en"
                  ? "English"
                  : language === "es"
                  ? "Spanish"
                  : language === "fr"
                  ? "French"
                  : language === "de"
                  ? "German"
                  : language === "it"
                  ? "Italian"
                  : language === "zh-CN"
                  ? "Chinese"
                  : language === "ja"
                  ? "Japanese"
                  : language === "ko"
                  ? "Korean"
                  : language === "ar"
                  ? "Arabic"
                  : language === "ru"
                  ? "Russian"
                  : language === "hi"
                  ? "Hindi"
                  : language === "ur"
                  ? "Urdu"
                  : "Selected Language"
              }`}
        </button>

        <div className="text-gray-300 text-sm italic">
          {isLoading
            ? "Fetching news..."
            : "Select a category to change news content"}
        </div>
      </div>
    </div>
  );
};

// Enhanced Speech Synthesis with language support and lip sync
const useSpeechSynthesis = (
  text,
  isSpeaking,
  setIsSpeaking,
  language,
  customAudioUrl
) => {
  const [currentViseme, setCurrentViseme] = useState(0);

  const speechRef = useRef(null);
  const audioRef = useRef(null);
  const visemeTimersRef = useRef([]);
  const animationRef = useRef(null);
  const speechEndedRef = useRef(false);

  const clearAllTimers = () => {
    visemeTimersRef.current.forEach((timer) => clearTimeout(timer));
    visemeTimersRef.current = [];

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const estimateSpeechDuration = (text) => {
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    return words.length * 400;
  };

  const startContinuousVisemeAnimation = () => {
    let lastVisemeTime = Date.now();
    let currentPattern = 0;
    let lastSyllableTime = Date.now();
    let syllableCount = 0;

    const syllablesPerSecond = 3.5;

    const patterns = [
      [1, 3, 2, 0, 1],
      [2, 1, 4, 0, 2],
      [3, 1, 0, 2, 1],
      [4, 2, 1, 0, 4],
      [1, 2, 1, 0, 1],
      [2, 3, 4, 2, 0],
    ];

    const animate = () => {
      const now = Date.now();

      const syllableDuration = 1000 / syllablesPerSecond;
      const rhythmVariation = syllableDuration * 0.3;

      if (now - lastVisemeTime > 100 + Math.random() * 80) {
        const pattern = patterns[currentPattern % patterns.length];
        const visemeIndex = Math.floor(syllableCount % pattern.length);

        setCurrentViseme(pattern[visemeIndex]);

        if (
          now - lastSyllableTime >
          syllableDuration -
            rhythmVariation +
            Math.random() * (rhythmVariation * 2)
        ) {
          syllableCount++;
          lastSyllableTime = now;

          if (syllableCount % 8 === 0) {
            currentPattern = (currentPattern + 1) % patterns.length;
          }
        }

        lastVisemeTime = now;
      }

      if (isSpeaking && !speechEndedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentViseme(0);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    clearAllTimers();
    speechEndedRef.current = false;

    if (isSpeaking && text) {
      const speechDuration = estimateSpeechDuration(text);

      if (customAudioUrl) {
        audioRef.current = new Audio(customAudioUrl);

        audioRef.current.onended = () => {
          speechEndedRef.current = true;
          setTimeout(() => {
            setIsSpeaking(false);
            setCurrentViseme(0);
          }, 300);
        };

        audioRef.current.onerror = () => {
          console.error("Error playing translated audio");
          speechEndedRef.current = true;
          setIsSpeaking(false);
          setCurrentViseme(0);
        };

        audioRef.current.play().catch((err) => {
          console.error("Error playing translated audio:", err);
          speechEndedRef.current = true;
          setIsSpeaking(false);
        });

        const endTimer = setTimeout(() => {
          if (isSpeaking) {
            speechEndedRef.current = true;
            setIsSpeaking(false);
          }
        }, Math.max(speechDuration * 1.5, 30000));

        visemeTimersRef.current.push(endTimer);
      } else if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        speechRef.current = new SpeechSynthesisUtterance(text);

        speechRef.current.rate = 0.85;
        speechRef.current.pitch = 1.0;
        speechRef.current.volume = 1.0;

        if (language) {
          speechRef.current.lang = language === "ur" ? "ur-PK" : language;
        }

        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = voices.filter(
          (voice) =>
            (language ? voice.lang.startsWith(language.split("-")[0]) : true) &&
            (voice.name.includes("Premium") ||
              voice.name.includes("Enhanced") ||
              voice.name.includes("Neural"))
        );

        if (preferredVoices.length > 0) {
          speechRef.current.voice = preferredVoices[0];
        }

        speechRef.current.onend = () => {
          speechEndedRef.current = true;
          setTimeout(() => {
            setIsSpeaking(false);
            setCurrentViseme(0);
          }, 300);
        };

        const endTimer = setTimeout(() => {
          if (isSpeaking) {
            speechEndedRef.current = true;
            setIsSpeaking(false);
          }
        }, speechDuration + 1500);

        const preEndCheck = setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            speechEndedRef.current = true;
            setIsSpeaking(false);
          }
        }, speechDuration + 500);

        visemeTimersRef.current.push(endTimer, preEndCheck);

        try {
          window.speechSynthesis.speak(speechRef.current);
        } catch (error) {
          console.error("Speech synthesis error:", error);
        }
      } else {
        const endTimer = setTimeout(() => {
          speechEndedRef.current = true;
          setIsSpeaking(false);
        }, speechDuration);

        visemeTimersRef.current.push(endTimer);
      }

      startContinuousVisemeAnimation();
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      speechEndedRef.current = true;
      setCurrentViseme(0);
    }

    return () => {
      clearAllTimers();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isSpeaking, text, language, customAudioUrl]);

  return { currentViseme };
};

// Main News Avatar Scene component
const NewsAvatarScene = ({
  text,
  isSpeaking,
  setIsSpeaking,
  language,
  customAudioUrl,
}) => {
  const { currentViseme } = useSpeechSynthesis(
    text,
    isSpeaking,
    setIsSpeaking,
    language,
    customAudioUrl
  );
  const controlsRef = useRef();

  // Set focus on face when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (controlsRef.current) {
        // Set target higher to focus on face
        controlsRef.current.target.set(0, 0.6, 0);
        controlsRef.current.update();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Canvas
        shadows
        // Adjusted camera position to focus on face
        camera={{ position: [0, 0.2, 1.5], fov: 100, near: 0.1, far: 1000 }}
      >
        {/* Improved lighting for better visibility */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.7}
          color="#b0c4de"
        />

        {/* Fill light from front for face visibility */}
        <pointLight position={[0, 1, 3]} intensity={0.5} color="#ffffff" />

        {/* Scene and Character */}
        <Suspense
          fallback={
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="#cccccc" wireframe />
            </mesh>
          }
        >
          <Center>
            <Avatar speaking={isSpeaking} currentViseme={currentViseme} />
          </Center>
        </Suspense>

        {/* Camera Controls - Modified to focus on face */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          maxDistance={2} // Reduced max distance to keep zoomed in
          minDistance={0.5} // Reduced min distance to allow closer zoom
          enablePan={false}
          minPolarAngle={Math.PI / 3} // Adjusted to limit downward view
          maxPolarAngle={Math.PI / 2.2} // Adjusted to limit upward view
          minAzimuthAngle={-Math.PI / 4} // Reduced side-to-side movement
          maxAzimuthAngle={Math.PI / 4} // Reduced side-to-side movement
          zoomSpeed={0.5}
          target={[0, 0.6, 0]} // Focus on face area
        />
      </Canvas>
    </>
  );
};

// Main LandingPage component
export default function LandingPage() {
  const [newsText, setNewsText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [audioUrl, setAudioUrl] = useState(null);

  // Preload the 3D model before rendering the page
  useGLTF.preload("https://models.readyplayer.me/681629408ab2ab92492f09bf.glb");

  // Effect to fetch news when category changes
  useEffect(() => {
    const fetchNews = async () => {
      // Don't fetch while speaking
      if (isSpeaking) return;

      setIsLoading(true);
      try {
        const newsContent = await NewsService.fetchNewsByCategory(
          selectedCategory
        );
        setNewsText(newsContent);
        setAudioUrl(null); // Reset audio URL when category changes
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsText(
          "We're experiencing technical difficulties. Please stand by."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  // Effect to handle language changes
  useEffect(() => {
    // Reset audio URL when language changes
    setAudioUrl(null);

    // If currently speaking, stop speaking when language changes
    if (isSpeaking) {
      setIsSpeaking(false);

      // Cancel any ongoing speech
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [language]);

  // Effect to prepare translated audio when broadcast is started
  useEffect(() => {
    const prepareAudio = async () => {
      if (isSpeaking && language !== "en" && !audioUrl) {
        try {
          setIsLoading(true);
          const result = await NewsVoiceService.getTranslatedNewsAudio(
            selectedCategory,
            language
          );

          if (result && result.audioUrl) {
            setAudioUrl(result.audioUrl);
          } else {
            console.error("No audio URL found in the translation service");
            // Optionally, set fallback audio or handle errors
          }
        } catch (error) {
          console.error("Error preparing translated audio:", error);
          setAudioUrl(null); // Fallback to default or browser speech synthesis
        } finally {
          setIsLoading(false);
        }
      }
    };

    prepareAudio();
  }, [isSpeaking, language, selectedCategory, audioUrl]);

  // Current category display
  const getCategoryLabel = () => {
    return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-newsroom bg-cover bg-center"></div>

      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
      </div>
      <NewsCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* News Category Dropdown */}
      <NewsCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* News desk platform for the avatar */}
      <div className="w-full max-w-3xl h-2/3 relative">
        {/* 3D Scene Container */}
        <div className="absolute inset-0">
          <NewsAvatarScene
            text={newsText}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
          />
        </div>
        {/* News headline overlay and category label */}
        {isSpeaking && (
          <div className="fixed top-0 left-0 right-0 z-50 text-center">
            <h1 className="text-2xl font-bold text-white bg-black bg-opacity-70 p-2 rounded-lg shadow-lg">
              {getCategoryLabel()} News
            </h1>
          </div>
        )}
      </div>

      {/* News controls */}
      <NewsControls
        text={newsText}
        setText={setNewsText}
        isSpeaking={isSpeaking}
        setIsSpeaking={setIsSpeaking}
        isLoading={isLoading}
      />
    </div>
  );
}
