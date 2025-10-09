"use client";

import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { LuTag } from "react-icons/lu";
import { PiMapPinAreaLight } from "react-icons/pi";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";
import { placeApi } from "@/lib/place/placeApi";
import { checkinApi } from "@/lib/checkin/checkinApi";
import { AxiosError } from "axios";
import { HCMMapSVG } from "./HCMMapSVG";

type Status = "visited" | null;
interface Place {
  _id: string;
  name: string;
  address?: string;
  district?: string;
  ward?: { _id: string; name: string };
  location?: { coordinates: [number, number] };
  images?: string[];
}

export default function HCMMap() {
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<Place | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedPath, setSelectedPath] = useState<SVGPathElement | null>(null);

  const [regionStatus, setRegionStatus] = useState<
    Record<string, { status: Status; color: string }>
  >({});
  const [scale, setScale] = useState(1);

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<SVGSVGElement | null>(null);
  const router = useRouter();

  // random màu pastel
  const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 127 + 127);
    const g = Math.floor(Math.random() * 127 + 127);
    const b = Math.floor(Math.random() * 127 + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getColorByStatus = (
    statusObj: { status: Status; color: string } | undefined
  ) => {
    if (!statusObj) return "#D8D8D8";
    return statusObj.color;
  };

  const clampPopupPosition = (x: number, y: number) => {
    const padding = 20,
      popupWidth = 320,
      popupHeight = 220;
    const newX = Math.min(
      Math.max(x, padding),
      window.innerWidth - popupWidth - padding
    );
    const newY = Math.min(
      Math.max(y, padding),
      window.innerHeight - popupHeight - padding
    );
    return { x: newX, y: newY };
  };

  // ✅ normalize string
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/^(xa|phuong|thi tran)\s+/i, "")
      .trim()
      .toLowerCase();

  // gắn sự kiện hover, click cho path
  useEffect(() => {
    const paths = document.querySelectorAll<SVGPathElement>("svg path");

    paths.forEach((path) => {
      const title = path.getAttribute("data-title") || "unknown";
      const normTitle = normalize(title); // ✅ normalize để đồng bộ key
      const statusObj = regionStatus[normTitle];

      path.style.fill = getColorByStatus(statusObj);
      path.style.stroke = "#0c5feeff";
      path.style.strokeWidth = "0.5";
      path.style.transition = "fill 0.3s ease";

      path.onmouseenter = () => {
        setHoveredName(title);
        path.style.fill = getRandomPastelColor();
      };

      path.onmouseleave = () => {
        setHoveredName(null);
        setMousePos(null);
        path.style.fill = getColorByStatus(regionStatus[normTitle]);
      };

      path.onmousemove = (e) =>
        setMousePos({ x: e.clientX + 15, y: e.clientY + 15 });

      path.onclick = (e) => {
        setSelectedPath(path);
        setSelectedName(title);
        setPopupPos(clampPopupPosition(e.clientX, e.clientY));
      };
    });
  }, [regionStatus]);

  const handleVisited = async () => {
    if (!selectedName) return;
    try {
      const res = await placeApi.getAll();
      const { places } = res;

      const selectedNorm = normalize(selectedName);

      const matched: Place | undefined = places.find((p: any) => {
        if (typeof p.ward === "string")
          return normalize(p.ward).includes(selectedNorm);
        if (typeof p.ward === "object" && p.ward?.name)
          return normalize(p.ward.name).includes(selectedNorm);
        return false;
      });

      if (!matched) {
        console.warn("Không tìm thấy place cho:", selectedName);
        return;
      }
      setSelectedInfo(matched);
      await checkinApi.createCheckin(matched._id, {
        device: "Web App",
        note: `Check-in ${matched.name}`
      });

      setRegionStatus((prev) => ({
        ...prev,
        [selectedNorm]: {
          status: "visited",
          color: prev[selectedNorm]?.color || getRandomPastelColor(),
        },
      }));
      handleClosePopup();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Lỗi khi checkin:", error.response?.data || error.message);
      } else {
        console.error("Lỗi khi checkin:", error);
      }
    }
  };

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const checkins = await checkinApi.getUserCheckins();

        const statusMap: Record<string, { status: Status; color: string }> = {};
        checkins.forEach((c: any) => {
          const wardName =
            typeof c.placeId.ward === "object"
              ? c.placeId.ward.name
              : c.placeId.ward || c.placeId.name;

          const normWard = normalize(wardName);
          statusMap[normWard] = {
            status: "visited",
            color: getRandomPastelColor(),
          };
        });

        setRegionStatus(statusMap);
      } catch (error) {
        console.error("⚠️ Lỗi khi load checkins:", error);
      }
    };

    fetchCheckins();
  }, []);

  const handleExplore = () => {
    if (selectedPath && selectedName) {
      handleClosePopup();
      router.push("/user/destination");
    }
  };

  const handleClosePopup = () => {
    setSelectedName(null);
    setPopupPos(null);
    setSelectedPath(null);
    setSelectedInfo(null);
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetView = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-0 sm:px-4 mt-5 relative select-none">
      <div className="absolute -top-3 right-2 z-[9999] flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="shadow-md rounded p-2 hover:bg-gray-100"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="shadow-md rounded p-2 hover:bg-gray-100"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="shadow-md rounded p-2 hover:bg-gray-100"
        >
          ⟳
        </button>
      </div>
      <HCMMapSVG
        mapRef={mapRef}
        scale={scale}
        translate={translate}
        isDragging={isDragging}
      />
      {hoveredName && mousePos && (
        <div
          className="fixed bg-white border border-gray-300 rounded-md px-2 py-1 text-sm shadow-md pointer-events-none z-50 max-w-[200px]"
          style={{ top: mousePos.y, left: mousePos.x }}
        >
          {hoveredName}
        </div>
      )}
      {popupPos && selectedName && (
        <div
          className="fixed bg-white p-5 rounded-xl shadow-lg z-50 min-w-[270px] w-[90%] max-w-[320px]"
          style={{ left: popupPos.x, top: popupPos.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClosePopup}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            <FaTimes size={18} />
          </button>

          <div className="flex items-start gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md">
              <LuTag size={16} className="text-gray-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-base sm:text-lg">{selectedName}</h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                {selectedInfo?.district ||
                  selectedInfo?.ward?.name ||
                  "Không rõ khu vực"}
              </p>
            </div>
          </div>

          <div className="flex justify-around gap-8 mt-4">
            <button
              onClick={handleVisited}
              className="flex flex-col items-center text-sm sm:text-base text-blue-500"
            >
              <div className="flex items-center justify-center w-10 h-10">
                <LiaShoePrintsSolid
                  size={50}
                  className="text-blue-500"
                  stroke="currentColor"
                />
              </div>
              <span className="mt-1 font-medium">ĐÃ ĐI</span>
            </button>

            <button
              onClick={handleExplore}
              className="flex flex-col items-center text-sm sm:text-base text-blue-500"
            >
              <div className="flex items-center justify-center w-10 h-10">
                <PiMapPinAreaLight
                  size={55}
                  className="text-blue-500"
                  stroke="currentColor"
                />
              </div>
              <span className="mt-1 font-medium">KHÁM PHÁ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
