import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { fetchContents, fetchSchedulesData } from "../store/contentSlice";

export default function Schedule() {
  const router = useRouter();
  const dispatch = useDispatch();
  const contents = useSelector((state) => state.content.items);
  const contentStatus = useSelector((state) => state.content.status);

  const schedulesRedux = useSelector((state) => state.content.schedules);
  const schedulesStatus = useSelector((state) => state.content.schedulesStatus);

  const [schedules, setSchedules] = useState([]);

  // Drag to scroll states
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragged, setDragged] = useState(false); // to prevent accidental clicks when dragging

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragged(true);
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    if (contentStatus === "idle") {
      dispatch(fetchContents());
    }
  }, [contentStatus, dispatch]);

  useEffect(() => {
    if (schedulesStatus === "idle") {
      dispatch(fetchSchedulesData());
    }
  }, [schedulesStatus, dispatch]);

  // Fitur Polling: Refresh jadwal setiap 5 detik agar otomatis update (Real-time ala Polling)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchSchedulesData());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      try {
        const rawSchedules = schedulesRedux || [];
        const rawContents = contents || [];

        // Build 7 days starting from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

        const newSchedules = Array.from({ length: 7 }, (_, idx) => {
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + idx);
          const dayName = dayNames[targetDate.getDay()];
          const dStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;

          // Find schedule for this date
          const sched = rawSchedules.find((s) => {
            if (!s.start_datetime) return false;
            const evDate = new Date(s.start_datetime);
            const evDStr = `${evDate.getFullYear()}-${String(evDate.getMonth() + 1).padStart(2, "0")}-${String(evDate.getDate()).padStart(2, "0")}`;
            return evDStr === dStr;
          });

          if (sched) {
            const content = rawContents.find((c) => c.id === sched.content_id);
            const catId = content?.category_id;
            let catPath = "";
            if (catId === 1) catPath = "berita";
            else if (catId === 2) catPath = "film";
            else if (catId === 3) catPath = "musik";

            const label =
              catId === 1 ? "Berita" : catId === 2 ? "Film" : "Musik";
            return {
              day: dayName,
              image: content?.thumbnail || "",
              label,
              title: content?.title || "Unknown",
              hasContent: true,
              url: catPath ? `/${catPath}/${content.id}` : null,
            };
          }

          // Placeholder
          return {
            day: dayName,
            image: "",
            label: "Belum Ada",
            title: "Tidak Ada Jadwal",
            hasContent: false,
          };
        });

        setSchedules(newSchedules);
      } catch (err) {
        console.error("Gagal mengambil jadwal:", err);
      }
    }

    if (
      (contentStatus === "succeeded" || contentStatus === "failed") &&
      (schedulesStatus === "succeeded" || schedulesStatus === "failed")
    ) {
      fetchData();
    }
  }, [contents, contentStatus, schedulesRedux, schedulesStatus]);

  if (schedules.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#0B0F19",
          padding: "60px 20px",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "3px solid rgba(168, 85, 247, 0.3)",
            borderTopColor: "#A855F7",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px 50px",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "40px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                margin: "0 0 5px 0",
                background: "linear-gradient(90deg, #FFFFFF, #A855F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Jadwal Mingguan
            </h2>
            <p style={{ color: "#9CA3AF", margin: 0, fontSize: "14px" }}>
              Jangan lewatkan konten hiburan favorit Anda setiap harinya.
            </p>
          </div>
        </div>

        {/* Scroll wrapper */}
        <div style={{ position: "relative" }}>
          {/* Left Arrow */}
          <button
            onClick={() => {
              if (scrollRef.current) {
                const cardWidth =
                  scrollRef.current.children[0]?.offsetWidth || 220;
                scrollRef.current.scrollBy({
                  left: -(cardWidth + 24),
                  behavior: "smooth",
                });
              }
            }}
            style={{
              position: "absolute",
              left: "-20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#1F2937",
              color: "white",
              border: "2px solid #374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#A855F7";
              e.currentTarget.style.borderColor = "#A855F7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1F2937";
              e.currentTarget.style.borderColor = "#374151";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div
            id="schedule-scroll-container"
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              paddingBottom: "20px",
              paddingTop: "10px",
              scrollbarWidth: "none", // Hide scrollbar for drag-to-scroll
              msOverflowStyle: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {schedules.map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  if (dragged) {
                    e.preventDefault();
                    return;
                  }
                  if (item.hasContent && item.url) {
                    router.push(item.url);
                  }
                }}
                style={{
                  backgroundColor: "#111827",
                  borderRadius: "16px",
                  overflow: "hidden",
                  /* Show exactly 3 cards: (100% - 2 gaps of 24px) / 3 = 33.333% - 16px */
                  minWidth: "calc(33.333% - 16px)",
                  width: "calc(33.333% - 16px)",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid #1F2937",
                  boxShadow: "none",
                  cursor:
                    item.hasContent && !isDragging ? "pointer" : "inherit",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "translateY(0) scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (item.hasContent) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#A855F7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.hasContent) {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.borderColor = "#1F2937";
                  }
                }}
              >
                {/* Day Header */}
                <div
                  style={{
                    padding: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #1F2937",
                  }}
                >
                  <span
                    style={{
                      color: "#F3F4F6",
                      fontSize: "18px",
                      fontWeight: "800",
                    }}
                  >
                    {item.day}
                  </span>
                </div>

                {/* Content Area */}
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {item.hasContent ? (
                    <>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "9/16",
                          maxHeight: "400px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          marginBottom: "15px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          style={{
                            display: "none",
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #1e1e1e 0%, #3a3a3a 100%)",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ color: "#666", fontSize: "14px" }}>
                            No Image
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: "auto" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            backgroundColor: "rgba(168, 85, 247, 0.1)",
                            color: "#C084FC",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                          }}
                        >
                          {item.label}
                        </span>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: "bold",
                            color: "#F9FAFB",
                            lineHeight: "1.4",
                          }}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "radial-gradient(circle at center, #1F2937 0%, transparent 70%)",
                        borderRadius: "12px",
                        padding: "20px 10px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#374151",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <p
                        style={{
                          color: "#6B7280",
                          margin: 0,
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        Belum Ada Jadwal
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
            #schedule-scroll-container::-webkit-scrollbar {
              display: none;
            }
          `,
            }}
          />

          {/* Right Arrow */}
          <button
            onClick={() => {
              if (scrollRef.current) {
                const cardWidth =
                  scrollRef.current.children[0]?.offsetWidth || 220;
                scrollRef.current.scrollBy({
                  left: cardWidth + 24,
                  behavior: "smooth",
                });
              }
            }}
            style={{
              position: "absolute",
              right: "-20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#1F2937",
              color: "white",
              border: "2px solid #374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#A855F7";
              e.currentTarget.style.borderColor = "#A855F7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1F2937";
              e.currentTarget.style.borderColor = "#374151";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
