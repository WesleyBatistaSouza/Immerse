/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Reader({ book, onProgressUpdate }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(book?.currentPage || 1);
  const [scale, setScale] = useState(1.05);
  const [autoPlay, setAutoPlay] = useState(false);

  const autoTimer = useRef(null);
  const touchStartX = useRef(0);

  if (!book) {
    return <div className="p-20 text-white">Nenhum livro selecionado.</div>;
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber((prev) => {
      const next = prev + offset;

      if (next < 1) return 1;
      if (numPages && next > numPages) return numPages;

      return next;
    });
  };

  /*
  ==========================
  SAVE PROGRESS
  ==========================
  */
  useEffect(() => {
    if (numPages && onProgressUpdate) {
      onProgressUpdate(book.id, pageNumber, numPages);
    }
  }, [pageNumber, numPages]);

  /*
  ==========================
  KEYBOARD CONTROL
  ==========================
  */
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowRight":
          changePage(1);
          break;
        case "ArrowLeft":
          changePage(-1);
          break;
        case "ArrowUp":
          setScale((s) => Math.min(2, s + 0.1));
          break;
        case "ArrowDown":
          setScale((s) => Math.max(0.7, s - 0.1));
          break;
        case " ":
          e.preventDefault();
          setAutoPlay((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [numPages]);

  /*
  ==========================
  MOBILE SWIPE
  ==========================
  */
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].screenX;
    const diff = touchStartX.current - endX;

    if (diff > 50) changePage(1);
    if (diff < -50) changePage(-1);
  };

  /*
  ==========================
  AUTO LEITURA INTELIGENTE
  média ~45s por página literária
  ==========================
  */
  useEffect(() => {
    if (autoPlay && numPages) {
      autoTimer.current = setInterval(() => {
        setPageNumber((prev) => {
          if (prev >= numPages) {
            setAutoPlay(false);
            clearInterval(autoTimer.current);
            return prev;
          }
          return prev + 1;
        });
      }, 45000);
    }

    return () => clearInterval(autoTimer.current);
  }, [autoPlay, numPages]);

  const progress = numPages ? (pageNumber / numPages) * 100 : 0;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col items-center w-full min-h-screen pb-20 overflow-y-auto bg-[#0f1115]"
    >
      <div className="sticky top-4 z-50 flex items-center gap-3 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/5 mb-8">
        <button
          disabled={pageNumber <= 1}
          onClick={() => changePage(-1)}
          className="p-2 hover:bg-white/10 rounded-xl disabled:opacity-20 text-white"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-xs font-bold min-w-[90px] text-center text-white">
          {pageNumber} / {numPages || "--"}
        </span>

        <button
          disabled={pageNumber >= numPages}
          onClick={() => changePage(1)}
          className="p-2 hover:bg-white/10 rounded-xl disabled:opacity-20 text-white"
        >
          <ChevronRight size={20} />
        </button>

        <div className="h-6 w-px bg-white/10" />

        <button
          onClick={() => setScale((s) => Math.max(0.7, s - 0.1))}
          className="p-2 hover:bg-white/10 rounded-xl text-white"
        >
          <ZoomOut size={18} />
        </button>

        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="p-2 hover:bg-white/10 rounded-xl text-white"
        >
          <ZoomIn size={18} />
        </button>

        <div className="h-6 w-px bg-white/10" />

        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`p-2 rounded-xl text-white ${autoPlay ? "bg-blue-600" : "hover:bg-white/10"}`}
        >
          {autoPlay ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      <div className="w-[300px] md:w-[500px] h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="shadow-2xl bg-white rounded-sm overflow-hidden">
        <Document
          file={book.fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="p-20 text-black">Abrindo livro...</div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}