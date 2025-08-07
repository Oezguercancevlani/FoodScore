import { useMemo } from "react";
export default function FliegendeEmojis() {


    const emojis = ["🍪","🍔","🥘","🥜","🍏","🍎","🍌","🍫","🥦","🥪","🌮","🍿","🍉","🍟","🫛","🍙","🍣","🌯","🍛","🥒","🍅","🍬","🍭","🫐","🍰"]

const emojiElements = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const top = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = 3 + Math.random() * 5;

      if (top > 40 && top < 60) return null;

      return (
        <span
          key={index}
          style={{
            position: "absolute",
            top: `${top}%`,
            left: "-5%",
            fontSize: "2rem",
            animation: `fliegen ${duration}s linear ${delay}s infinite`,
          }}
        >
          {emoji}
        </span>
      );
    });
  }, []);

  return <>{emojiElements}</>;

}