import { useState } from "react";
import { LuImage } from "react-icons/lu";

const EMOJI_LIST = [
  "💰", "💵", "💴", "💶", "💷", "💸", "🏦", "💳", "🏧", "💹",
  "📈", "📊", "🏪", "🛒", "🛍️", "🏬", "🏠", "🏡", "🚗", "✈️",
  "🍔", "🍕", "☕", "🍜", "🎮", "📱", "💻", "🎵", "📚", "💡",
  "🔌", "🌐", "💊", "🏥", "🎓", "✂️", "🛠️", "🔧", "📦", "🎁",
  "👔", "👟", "💼", "🎪", "⛽", "🚌", "🚂", "🚢", "🍽️", "🏋️",
  "💪", "🌴", "🏖️", "🗺️", "🎭", "🎬", "📝", "🔑", "📞", "🏗️",
];

const IconPicker = ({ icon, setIcon }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        className="icon-picker-wrap"
        onClick={() => setShowPicker((v) => !v)}
      >
        <div className="icon-preview">
          {icon ? (
            <span style={{ fontSize: 26 }}>{icon}</span>
          ) : (
            <LuImage size={24} color="var(--primary)" />
          )}
        </div>
        <span className="icon-picker-label">
          {icon ? "Change Icon" : "Pick Icon"}
        </span>
      </div>

      {showPicker && (
        <div className="emoji-picker-grid">
          {EMOJI_LIST.map((emoji) => (
            <div
              key={emoji}
              className={`emoji-option ${icon === emoji ? "selected" : ""}`}
              onClick={() => {
                setIcon(emoji);
                setShowPicker(false);
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
