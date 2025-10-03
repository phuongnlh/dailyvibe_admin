import { useEffect, useRef } from "react";

export function useTingSound() {
  const tingRef = useRef<{ play: () => void } | null>(null);

  useEffect(() => {
    tingRef.current = {
      play: () => {
        try {
          const AudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContextClass();

          if (audioContext.state === "suspended") {
            audioContext.resume();
          }

          // Gain chung cho cả ting
          const gainNode = audioContext.createGain();
          gainNode.connect(audioContext.destination);

          // Giảm âm dần để không bị cắt đột ngột
          gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.4
          );

          // Oscillator 1: cao (ting)
          const osc1 = audioContext.createOscillator();
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(3500, audioContext.currentTime);
          osc1.connect(gainNode);

          // Oscillator 2: thấp hơn 1 chút (tạo cảm giác dày hơn)
          const osc2 = audioContext.createOscillator();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(1500, audioContext.currentTime);
          osc2.connect(gainNode);

          // Start cả 2 oscillator gần như cùng lúc
          osc1.start(audioContext.currentTime);
          osc2.start(audioContext.currentTime);

          // Stop sau 0.2s
          osc1.stop(audioContext.currentTime + 0.2);
          osc2.stop(audioContext.currentTime + 0.2);

          osc2.onended = () => {
            audioContext.close();
          };
        } catch (e) {
          console.warn("Ting error:", e);
        }
      },
    };

    return () => {
      tingRef.current = null;
    };
  }, []);

  return tingRef;
}