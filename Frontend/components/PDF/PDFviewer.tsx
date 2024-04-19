"use client";
import React, { useEffect, useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { Document, Page, pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
interface PDFViewerProps {
  fileBase64?: string;
  setReadDocComplete: (readDoc: boolean) => void;
  lectureUrl: string;
}

const PDFViewer = (props: PDFViewerProps) => {
  const { fileBase64, setReadDocComplete, lectureUrl } = props;
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(fileBase64, "fileBase64");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (currentPage === numPages) {
      setReadDocComplete(true);
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [lectureUrl]);

  return (
    <div className="h-[500px] flex-between flex-col bg-slate-500 custom-scrollbar overflow-y-scroll ">
      <div>
        <Document
          file={{ url: `data:application/pdf;base64,${fileBase64}` }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            height={400}
            width={600}
            pageNumber={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className={`py-8 my-8`}
          />
        </Document>
      </div>
      <div className="flex items-center justify-center sticky bottom-0 gap-3 bg-slate-200 py-1 px-1 rounded-lg">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`rounded-full px-1 py-1 transform rotate-180 ${
            currentPage === 1 ? "bg-orange-100" : "bg-orange-500"
          }`}
        >
          <MdNavigateNext />
        </button>
        <div className="text-sm">Trang: {currentPage}</div>
        <button
          className={`rounded-full px-1 py-1  ${
            currentPage === numPages ? "bg-orange-100" : "bg-orange-500"
          }`}
          onClick={goToNextPage}
          disabled={currentPage === numPages}
        >
          <MdNavigateNext />
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
