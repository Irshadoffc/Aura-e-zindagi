import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FiX, FiShoppingBag, FiCreditCard } from "react-icons/fi";

export default function Cards() {
  const [dismissedCards, setDismissedCards] = useState({});
  const [fadingCards, setFadingCards] = useState({});
  const [playing, setPlaying] = useState({}); // Track which videos are playing

  const handleDismiss = (i) => {
    setFadingCards((prev) => ({ ...prev, [i]: true }));

    setTimeout(() => {
      setDismissedCards((prev) => ({ ...prev, [i]: "minimized" }));
      setFadingCards((prev) => {
        const updated = { ...prev };
        delete updated[i];
        return updated;
      });
    }, 300);
  };

  const handleUndo = (i) => {
    setDismissedCards((prev) => {
      const updated = { ...prev };
      delete updated[i];
      return updated;
    });
  };

  const handleRemove = (i) => {
    setDismissedCards((prev) => ({ ...prev, [i]: "removed" }));
  };

  const handlePlay = (i) => {
    setPlaying((prev) => ({ ...prev, [i]: true }));
  };

  const cards = [



  ];

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md font-semibold text-sm md:text-base justify-center sm:justify-start">
          <FiShoppingBag className="text-gray-800" />
          <span>13 orders to fulfill</span>
        </button>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md font-semibold text-sm md:text-base justify-center sm:justify-start">
          <FiCreditCard className="text-gray-800" />
          <span>12 payments to capture</span>
        </button>
      </div> */}
      {/* Cards-info */}
      {cards.map((card, i) => {
        if (dismissedCards[i] === "removed") return null;

        if (dismissedCards[i] === "minimized") {
          return (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md px-4 py-3 flex justify-between items-center transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">
                  You&apos;ve dismissed this card.
                </span>
                <button
                  className="text-blue-600 font-semibold text-sm"
                  onClick={() => handleUndo(i)}
                >
                  Undo
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-700 font-semibold text-sm">
                  Leave feedback
                </button>
                <FiX
                  className="text-gray-500 cursor-pointer"
                  onClick={() => handleRemove(i)}
                />
              </div>
            </div>
          );
        }

        return (
          <div
            key={i}
            className={`group bg-white rounded-xl shadow-md relative transition-all duration-300 ${fadingCards[i] ? "opacity-0 translate-y-2" : "opacity-100"
              }`}
          >
            {/* Cross Button */}
            <button
              onClick={() => handleDismiss(i)}
              className="absolute top-3 right-3 z-10 bg-gray-200 hover:bg-gray-300 rounded-md p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <FiX className="text-gray-600 w-4 h-4" />
            </button>

            {card.type === "video" ? (
              // VIDEO CARD
              <div className="flex flex-col lg:flex-row justify-between items-stretch relative">
                {/* Text */}
                <div className="flex-1 p-4 lg:p-6">
                  <h2 className="text-base lg:text-lg font-semibold mb-2">{card.title}</h2>
                  <p className="text-gray-800 text-sm lg:text-base mb-4 lg:mb-6">{card.desc}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {card.btn && (
                      <button className="bg-white px-4 py-2 rounded-lg shadow-md text-xs lg:text-sm border border-gray-200 font-semibold">
                        {card.btn}
                      </button>
                    )}
                    {card.link && (
                      <a href="#" className="text-blue-600 text-xs lg:text-sm font-semibold">
                        {card.link}
                      </a>
                    )}
                  </div>
                </div>

                {/* Video */}
                <div className="relative flex-shrink-0 overflow-hidden rounded-b-lg lg:rounded-r-lg w-full lg:w-[220px] xl:w-[260px] 2xl:w-[320px] h-[180px] lg:h-auto">
                  {!playing[i] ? (
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => handlePlay(i)}
                    >
                      <video
                        src={card.video}
                        className="block w-full h-full object-cover"
                        muted
                      />
                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="bg-black/50 rounded-full p-4 lg:p-5">
                          <FaPlay className="text-white text-lg lg:text-xl" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <video
                      src={card.video}
                      className="block w-full h-full object-cover"
                      controls
                      autoPlay
                    />
                  )}
                </div>
              </div>
            ) : card.type === "task" ? (
              // TASK CARD
              <div className="w-full p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 appearance-none rounded-full border-2 border-gray-400 checked:bg-blue-600 checked:border-blue-600 cursor-pointer transition-all"
                      />
                      <span className="text-sm text-gray-600">{card.taskStatus}</span>
                    </div>
                    <h2 className="text-base lg:text-lg font-semibold mb-3">{card.title}</h2>
                    <p className="text-gray-800 text-sm lg:text-base">{card.desc}</p>
                  </div>

                  {/* Responsive Image */}
                  <div className="relative flex-shrink-0 overflow-hidden rounded-lg w-full lg:w-[200px] xl:w-[240px] 2xl:w-[280px] h-[120px] lg:h-[140px] self-center">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="block w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="w-full mt-4 flex items-center shadow-md rounded-lg bg-gray-100 overflow-hidden">
                  <div className="flex-1 flex items-center gap-2 px-4 lg:px-5 py-3">
                    <span className="font-semibold text-sm lg:text-base">First Task:</span>
                    <span className="text-sm lg:text-base">{card.taskLabel}</span>
                  </div>
                  <button className="bg-white text-black px-4 py-1 rounded-lg shadow-md mr-3 text-xs lg:text-sm border border-gray-200 font-semibold">
                    {card.btn}
                  </button>
                </div>
              </div>
            ) : (
              // IMAGE CARD
              <div className="flex flex-col lg:flex-row justify-between p-4 lg:p-6 gap-4">
                <div className="flex-1">
                  <h2 className="text-base lg:text-lg font-semibold mb-2">{card.title}</h2>
                  <p className="text-gray-800 mb-4 lg:mb-6 text-sm lg:text-base">{card.desc}</p>
                  {card.btn && (
                    <button className="bg-white px-4 py-2 rounded-lg shadow-md text-xs lg:text-sm border border-gray-200 font-semibold">
                      {card.btn}
                    </button>
                  )}
                </div>
                <div className="relative flex-shrink-0 overflow-hidden rounded-lg w-full lg:w-[220px] xl:w-[260px] 2xl:w-[320px] h-[160px] lg:h-[180px]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="block w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

        );
      })}



    </div>


  );
}