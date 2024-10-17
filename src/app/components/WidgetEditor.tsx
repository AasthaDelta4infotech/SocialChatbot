"use client";
import { useCallback } from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const WidgetEditor = () => {
  const [bgColor, setBgColor] = useState("#3CC62A");
  const [messages, setMessages] = useState("");
  const [newMessage, setNewMessage] = useState("Hi");
  const [hasImageBackground, setHasImageBackground] = useState(false);
  const [logoUrl, setLogoUrl] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
  );
  const [ctaUrl, setCtaUrl] = useState("https://www.google.co.in/");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const generateScript = useCallback(() => {
    const escapedMessages = messages.replace(/\n/g, "\\n").replace(/'/g, "\\'");
    const hasMessages = messages.trim() !== "";

    const script = `
    (() => {
      const s = document.createElement('style');
      s.textContent = \`
        .w{position:fixed;bottom:20px;right:20px;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:flex-end}
        .b{width:60px;height:60px;border-radius:50%;background:${bgColor};cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,.1);display:flex;align-items:center;justify-content:center;overflow:hidden;transition:transform 0.3s ease}
        .b:hover{animation:wobble 0.3s ease-in-out}
        .b img{width:100%;height:100%;object-fit:cover}
        ${
          hasMessages
            ? ".m{background:#fff;color:#000;padding:8px 12px;margin-bottom:8px;border-radius:18px;box-shadow:0 2px 5px rgba(0,0,0,.1);max-width:220px;word-wrap:break-word}"
            : ""
        }
        .t{position:absolute;top:-40px;left:50%;transform:translateX(-50%);background-color:#333;color:white;padding:5px 10px;border-radius:4px;font-size:12px;opacity:0;transition:opacity 0.3s ease;pointer-events:none;white-space:nowrap}
        .b:hover .t{opacity:1}
        @keyframes wobble {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
      \`;
      document.head.appendChild(s);

      const c = document.createElement('div');
      c.className = 'w';

      ${
        hasMessages
          ? `
      '${escapedMessages}'.split('\\n').forEach(m => {
        const d = document.createElement('div');
        d.className = 'm';
        d.textContent = m.trim();
        c.appendChild(d);
      });
      `
          : ""
      }

      const b = document.createElement('div');
      b.className = 'b';
      b.innerHTML = '<img src="${logoUrl}" alt="Chat">';
      b.onclick = () => window.open('${ctaUrl}', '_blank');
      c.appendChild(b);

      document.body.appendChild(c);

      c.style.opacity = '0';
      c.style.transform = 'translateY(20px)';
      setTimeout(() => {
        c.style.transition = 'opacity .3s,transform .3s';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, 100);
    })();
    `;
    setGeneratedScript(script);
  }, [bgColor, messages, logoUrl, ctaUrl]);

  useEffect(() => {
    if (ctaUrl) {
      generateScript();
    }
  }, [ctaUrl, generateScript]);

  const addMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prevMessages) =>
        prevMessages ? `${prevMessages}\n${newMessage}` : newMessage
      );

      setNewMessage("");
    } else {
      alert("Please enter a message");
    }
  };

  const handleChatbotBubbleClick = () => {
    if (ctaUrl) {
      window.open(ctaUrl, "_blank");
    } else {
      alert("Please enter a CTA URL");
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const hasBackground =
      img.naturalWidth === img.width && img.naturalHeight === img.height;
    setHasImageBackground(hasBackground);
  };

  return (
    <div className="flex w-full justify-between items-center gap-5 py-3">
      <div className="flex flex-col justify-center items-start gap-5 min-w-[50vw] px-10 min-h-[47vh]">
        <div>
          <label>
            Background Color:
            <input
              className="w-[100%] focus:outline-none rounded-md h-10"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              aria-label="Background Color"
            />
          </label>
          <br />
        </div>
        <div className="w-full">
          <label>
            Messages:
            <div className="flex gap-4 justify-center items-center">
              <input
                className="w-[100%] my-2 bg-slate-400 focus:outline-none rounded-md p-2 h-10"
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter a message"
              />
              <button
                className="bg-blue-500 text-white font-bold w-14 text-2xl h-12 flex justify-center items-center  rounded"
                onClick={addMessage}
              >
                +
              </button>
            </div>
          </label>

          <br />
        </div>
        <div className="w-full">
          <label>
            Logo URL:{" "}
            <input
              className="w-[100%] my-2 bg-slate-400 focus:outline-none rounded-md p-2 h-10"
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </label>
          <br />
        </div>
        <div className="w-full">
          <label>
            CTA URL:{" "}
            <input
              className="w-[100%] my-2 bg-slate-400 focus:outline-none rounded-md p-2 h-10"
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
            />
          </label>
          <br />
        </div>

        {ctaUrl && (
          <div>
            <h3>Generated Script:</h3>
            <textarea
              className="w-[40vw] bg-slate-400 focus:outline-none rounded-md p-2"
              rows={15}
              cols={50}
              id="generatedScript"
              defaultValue={generatedScript}
              readOnly
            ></textarea>
          </div>
        )}
      </div>

      <div className="fixed bottom-64 right-10  flex justify-end items-end flex-col">
        {messages &&
          messages.split("\n").map((msg, index) => (
            <div
              key={index}
              className="bg-white shadow-xl shadow-black/20 w-fit p-2 text-black rounded-md my-2 cursor-pointer"
            >
              {msg.trim()}
            </div>
          ))}
      </div>

      <motion.div
        className="fixed bottom-44 right-10 btn"
        whileHover={{ scale: 1.1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.button
          style={{
            backgroundColor: hasImageBackground ? "transparent" : bgColor,
          }}
          className="w-16 h-16 rounded-full shadow-xl shadow-black/60 flex items-center justify-center overflow-hidden"
          onClick={handleChatbotBubbleClick}
          animate={{
            rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Image
            src={logoUrl}
            alt="LOGO"
            className="object-cover "
            onLoad={handleImageLoad}
            width={100}
            height={100}
          />
        </motion.button>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2  text-white text-xs py-1 px-2 rounded whitespace-nowrap"
          ></motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WidgetEditor;
