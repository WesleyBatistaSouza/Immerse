import { CloudRain, Waves, Wind, Flame, Coffee, Moon } from "lucide-react";

const sounds = [
  {
    id: "chuva",
    name: "Chuva Suave",
    icon: CloudRain,
    url: "https://www.soundjay.com/nature/rain-01.mp3",
  },
  {
    id: "mar",
    name: "Ondas do Mar",
    icon: Waves,
    url: "https://www.soundjay.com/nature/ocean-wave-1.mp3",
  },
  {
    id: "vento",
    name: "Vento na Floresta",
    icon: Wind,
    url: "https://www.soundjay.com/nature/wind-blowing-01.mp3",
  },
  {
    id: "fogo",
    name: "Lareira Estalando",
    icon: Flame,
    url: "https://www.soundjay.com/fire/fireplace-01.mp3",
  },
  {
    id: "cafe",
    name: "Café Lo-fi Ambiente",
    icon: Coffee,
    url: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  },
  {
    id: "noite",
    name: "Noite com Grilos",
    icon: Moon,
    url: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
  },
];

export default sounds;