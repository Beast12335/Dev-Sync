import { useState, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const VoiceRecorder = ({ boardId }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { token } = useAuthStore();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob,"audio.webm");
      formData.append("boardId", boardId);

      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND}/api/voice/transcribe`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert(`🗣️ Transcribed: "${res.data.text}"`);
      } catch (err) {
        alert("❌ Transcription failed.");
      }
    };

    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="absolute bottom-4 left-4 z-50 bg-white p-3 rounded-xl shadow">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 text-white rounded ${recording ? "bg-red-500" : "bg-green-600"}`}
      >
        🎙️ {recording ? "Stop" : "Record"} Voice Note
      </button>
    </div>
  );
};

export default VoiceRecorder;