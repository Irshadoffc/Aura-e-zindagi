import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FiX, FiShoppingBag, FiCreditCard } from "react-icons/fi";

export default function MobCards() {
  const [dismissedCards, setDismissedCards] = useState({});
  const [fadingCards, setFadingCards] = useState({});
  const [playing, setPlaying] = useState({});

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
    {
      type: "video",
      title: "Learn the basics of dropshipping",
      desc: "Get started with the fundamentals of dropshipping, including how dropshipping works, how to source profitable products, and more.",
      btn: "Watch video",
      link: "Learn more",
      video: "/videos/video.mp4",
    },
    {
      type: "video",
      title: "Watch how this founder pushed past uncertainty towards success",
      desc: "Marcus started with a simple idea, no design skills and blog doubts. Sound familiar? Learn how he overcome these challenges in his own words",
      btn: "Watch his story",
      video: "/videos/video.mp4",
    },
    {
      type: "task",
      title: "Get your first 10 sales",
      desc: "Consider the opportunities presented below to get more visitors to your website, build trust with your customers, and start making sales.",
      taskStatus: "0 of 6 tasks complete",
      taskLabel: "Drive traffic with Pinterest",
      btn: "Get started",
      image: "/images/card1.jpg",
    },
    {
      type: "task",
      title: "Improve your conversion rate",
      desc: "Increase the percentage of visitors who purchase something from your online store.",
      taskStatus: "0 of 4 tasks complete",
      taskLabel: "Automate your abandoned carts",
      btn: "Get started",
      image: "/images/card2.jpg",
    },
    {
      type: "image",
      title: "Boost conversion with a customized homepage",
      desc: "Use apps to design a homepage that grabs attention, engages visitors, and drives more sales while helping your business stand out",
      btn: "View app guide",
      image: "/images/card1.jpg",
    },
    {
      type: "image",
      title: "Increase visibility and conversion with apps",
      desc: "Give your new business a head start with apps that let you find new customers, increase brand loyalty, create marketing campaigns, and offer customer support.",
      btn: "View app guide",
      image: "/images/card2.jpg",
    },
    {
      type: "image",
      title: "Build trust with customers in person",
      desc: "Make connections and gather valuable feedback by selling at pop-ups or to friends and family with Point of Sale and Tap to Pay on iPhone.",
      btn: "Set up Point of Sale",
      image: "/images/card1.jpg",
    },
  ];

  return (
    <div className="block lg:hidden space-y-6">
      {/* ===== ACTION BUTTONS ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="text-gray-700" />
            <span className="text-sm font-medium text-gray-800">
              13 orders to fulfill
            </span>
          </div>
        </button>

        <div className="border-t border-gray-200" />

        <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-gray-700" />
            <span className="text-sm font-medium text-gray-800">
              12 payments to capture
            </span>
          </div>
        </button>
      </div>

      {/* ===== CARDS ===== */}
      <div className="space-y-4 mt-4">
        {cards.map((card, i) => {
          if (dismissedCards[i] === "removed") return null;

          if (dismissedCards[i] === "minimized") {
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md px-4 py-3 flex justify-between items-center gap-4 text-center"
              >
                <span className="text-gray-700 text-sm">
                  You&apos;ve dismissed this card.
                  <button
                    className="text-blue-600 font-semibold text-sm ml-2"
                    onClick={() => handleUndo(i)}
                  >
                    Undo
                  </button>
                </span>
                <button className="text-gray-700 font-semibold text-sm">
                  Leave feedback
                </button>
                <FiX
                  className="text-gray-500 cursor-pointer"
                  onClick={() => handleRemove(i)}
                />
              </div>
            );
          }


          return (
            <div
              key={i}
              className={`group bg-white rounded-xl shadow-md border border-gray-100 relative transition-all duration-300 ${fadingCards[i] ? "opacity-0 translate-y-2" : "opacity-100"
                }`}
            >
              <button
                onClick={() => handleDismiss(i)}
                className="absolute top-3 right-3 z-10 bg-gray-200 hover:bg-gray-300 rounded-md p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <FiX className="text-gray-600 w-4 h-4" />
              </button>

              {/* ===== VIDEO CARD ===== */}
              {card.type === "video" && (
                <>
                  {/* ✅ keep first card with video */}
                  {i === 0 ? (
                    <div className="flex flex-row items-stretch justify-between gap-4 p-4 md:p-6">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-base font-semibold mb-2">
                            {card.title}
                          </h2>
                          <p className="text-gray-800 text-sm mb-4">
                            {card.desc}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap mt-auto">
                          <button className="bg-white px-4 py-2 rounded-lg shadow-md text-xs border border-gray-200 font-semibold">
                            {card.btn}
                          </button>
                          {card.link && (
                            <a
                              href="#"
                              className="text-blue-600 text-xs font-semibold"
                            >
                              {card.link}
                            </a>
                          )}
                        </div>
                      </div>
                      {/* video on right */}
                      <div className="relative flex-shrink-0 overflow-hidden rounded-lg w-[160px] min-w-[140px] h-auto aspect-square">
                        {!playing[i] ? (
                          <div
                            className="relative w-full h-full cursor-pointer"
                            onClick={() => handlePlay(i)}
                          >
                            <video
                              src={card.video}
                              className="w-full h-full object-cover block"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="bg-black/50 rounded-full p-4">
                                <FaPlay className="text-white text-lg" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <video
                            src={card.video}
                            className="w-full h-full object-cover block"
                            controls
                            autoPlay
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    // ✅ For 2nd video card (index 1) → text only
                    <div className="flex flex-col gap-2 p-4 md:p-6">
                      <h2 className="text-base font-semibold mb-2">
                        {card.title}
                      </h2>
                      <p className="text-gray-800 text-sm mb-4">{card.desc}</p>
                      <button className="bg-white px-4 py-2 rounded-lg shadow-md text-xs border border-gray-200 font-semibold w-fit">
                        {card.btn}
                      </button>
                    </div>

                  )}
                </>
              )}

              {/* ===== TASK CARD ===== */}
              {card.type === "task" && (
                <div className="p-4 md:p-6">
                  <div className="flex flex-row items-start justify-between gap-4">
                    <div className="flex-1 flex flex-col justify-start">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 appearance-none rounded-full border-2 border-gray-400 checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">
                          {card.taskStatus}
                        </span>
                      </div>

                      <h2 className="text-base font-semibold mb-3">
                        {card.title}
                      </h2>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="relative flex-shrink-0 overflow-hidden rounded-lg w-[140px] sm:w-[220px] h-[140px] sm:h-[180px]">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="w-full mt-5 bg-gray-100 rounded-lg p-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        First Task:
                      </span>
                      <span className="text-sm">{card.taskLabel}</span>
                    </div>
                    <button className="bg-white border border-gray-200 text-sm font-semibold rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition">
                      {card.btn}
                    </button>
                  </div>
                </div>
              )}

              {/* ===== IMAGE CARD ===== */}
              {card.type === "image" && (
                <>
                  {/* ✅ For 5, 6, 7 (index 4, 5, 6): no image */}
                  {[4, 5, 6].includes(i) ? (
                    <div className="flex flex-col justify-start gap-3 p-4 md:p-6">
                      <h2 className="text-base font-semibold">{card.title}</h2>
                      <p className="text-gray-800 text-sm mb-2">{card.desc}</p>
                      <button className="bg-white px-4 py-2 rounded-lg shadow-md text-xs border border-gray-200 font-semibold w-fit">
                        {card.btn}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-between gap-4 p-4 md:p-6">
                      <div className="flex-1">
                        <h2 className="text-base font-semibold mb-2">
                          {card.title}
                        </h2>
                        <p className="text-gray-800 mb-4 text-sm">
                          {card.desc}
                        </p>
                        <button className="bg-white px-4 py-2 rounded-lg shadow-md text-xs border border-gray-200 font-semibold">
                          {card.btn}
                        </button>
                      </div>
                      <div className="relative flex-shrink-0 overflow-hidden rounded-lg w-[160px] h-[160px]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="block w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}