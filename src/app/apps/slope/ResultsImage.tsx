"use client";
import { useEffect, useState } from "react";
import type { SlopeReport } from "@/lib/slope";
import { createSlopeResultsImage } from "@/lib/slope-image";

export default function ResultsImage({ report }: { report: SlopeReport }) {
  const [image, setImage] = useState<{ url: string; blob: Blob } | null>(null);
  const [message, setMessage] = useState(
    "Preparing your results image on this device…",
  );
  useEffect(() => {
    let cancelled = false,
      url: string | undefined;
    createSlopeResultsImage(report)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setImage({ url, blob });
        setMessage(
          "Save this image, then attach it to your Google Classroom assignment and tap Turn in.",
        );
      })
      .catch((error) => {
        if (!cancelled)
          setMessage(
            error instanceof Error
              ? error.message
              : "Take a screenshot of the completion page instead.",
          );
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [report]);
  async function share() {
    if (!image) return;
    const file = new File(
      [image.blob],
      `slope-results-${report.id.slice(0, 8)}.png`,
      { type: "image/png" },
    );
    if (!navigator.canShare?.({ files: [file] })) {
      setMessage(
        "Use Save results image, or touch and hold the image below to save it. Then attach it in Classroom.",
      );
      return;
    }
    try {
      await navigator.share({ files: [file], title: "Slope practice results" });
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        setMessage(
          "Use Save results image or take a screenshot of this page instead.",
        );
    }
  }
  return (
    <div className="slope-result-image">
      <p role="status">{message}</p>
      {image && (
        <>
          <div className="slope-actions">
            <a
              className="slope-primary"
              href={image.url}
              download={`slope-results-${report.id.slice(0, 8)}.png`}
            >
              Save results image
            </a>
            <button type="button" onClick={() => void share()}>
              Share image…
            </button>
          </div>
          {/* The preview is a local blob URL; it never requests a remote image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={`Completed slope practice results for ${report.student.firstName} ${report.student.lastName}, class hour ${report.student.hour}`}
            width={1200}
            height={1000}
          />
        </>
      )}
      <p className="slope-small">
        On an iPad, you can also touch and hold the image to save it, or take a
        screenshot. Save or submit your image before leaving this page.
      </p>
    </div>
  );
}
