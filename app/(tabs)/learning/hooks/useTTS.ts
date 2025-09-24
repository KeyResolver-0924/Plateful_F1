import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface TTSOptions {
  language: string;
  pitch: number;
  rate: number;
  voice?: string;
}

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);

  // TTS Configuration for children
  const defaultTTSOptions: TTSOptions = {
    language: 'en-US',
    pitch: 1.2, // Higher pitch for children
    rate: 0.7, // Slower rate for better comprehension
  };

  // Get available voices and set preferred voice
  useEffect(() => {
    const getVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        setAvailableVoices(voices);
      } catch (error) {
        console.warn('Could not get available voices:', error);
      }
    };
    getVoices();
  }, []);

  // Get TTS options with dynamic voice detection
  const getTTSOptions = useCallback((): TTSOptions => {
    if (Platform.OS === 'ios') {
      // Try to find a child-friendly voice on iOS
      const preferredVoice = availableVoices.find(v => 
        v.language === 'en-US' && 
        (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Alex'))
      );
      
      return {
        ...defaultTTSOptions,
        voice: preferredVoice?.identifier || undefined,
      };
    } else if (Platform.OS === 'android') {
      // Try to find a female voice on Android
      const preferredVoice = availableVoices.find(v => 
        v.language === 'en-US' && 
        (v.name.includes('female') || v.name.includes('en-us-x-sfg'))
      );
      
      return {
        ...defaultTTSOptions,
        voice: preferredVoice?.identifier || undefined,
      };
    }
    
    return defaultTTSOptions;
  }, [availableVoices]);

  const speakText = useCallback(async (text: string, isQuestion: boolean = false) => {
    if (!ttsEnabled) return;
    
    if (isSpeaking) {
      await Speech.stop();
    }
    
    setIsSpeaking(true);
    setCurrentSpeakingText(text);
    
    try {
      // Add context for questions to make them more engaging for children
      let speechText = text;
      if (isQuestion) {
        speechText = `Question: ${text}`;
      }
      
      const ttsOptions = getTTSOptions();
      await Speech.speak(speechText, ttsOptions);
    } catch (error) {
      console.error('TTS Error:', error);
      // Fallback: try without voice specification
      try {
        await Speech.speak(text, { 
          language: 'en-US', 
          pitch: 1.2, 
          rate: 0.7 
        });
      } catch (fallbackError) {
        console.error('TTS Fallback Error:', fallbackError);
      }
    } finally {
      setIsSpeaking(false);
      setCurrentSpeakingText('');
    }
  }, [ttsEnabled, isSpeaking, getTTSOptions]);

  const stopSpeaking = useCallback(async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
      setCurrentSpeakingText('');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }, []);

  const toggleTTS = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setTtsEnabled(!ttsEnabled);
  }, [isSpeaking, ttsEnabled, stopSpeaking]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return {
    speakText,
    stopSpeaking,
    toggleTTS,
    isSpeaking,
    currentSpeakingText,
    ttsEnabled,
  };
}
