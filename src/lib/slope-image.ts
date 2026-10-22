import { practiceScore, summarize, type SlopeReport } from "./slope";

/** Draw a results image entirely on the student's device. No remote capture service. */
export async function createSlopeResultsImage(
  report: SlopeReport,
): Promise<Blob> {
  const score = summarize(report.problems);
  if (!report.finished || practiceScore(report.problems) < 6)
    throw new Error(
      "Submit a score of at least 6/10 before saving a results image.",
    );
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error(
      "This browser cannot create a results image. Take a screenshot of your completion page instead.",
    );
  ctx.font = "bold 48px sans-serif";
  const name = `${report.student.firstName} ${report.student.lastName}`;
  // Wrap even long, unbroken names so the original name is never truncated.
  const lines: string[] = [];
  let line = "";
  for (const character of Array.from(name)) {
    if (ctx.measureText(line + character).width > 1060 && line) {
      lines.push(line);
      line = "";
    }
    line += character;
  }
  if (line) lines.push(line);
  const top = Math.max(390, 290 + lines.length * 59);
  canvas.height = Math.max(1000, top + 530);
  ctx.fillStyle = "#fbf6ec";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#16334c";
  ctx.fillRect(0, 0, 1200, 115);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText("MacIntodd · Slope practice", 64, 73);
  ctx.fillStyle = "#17633c";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(score.completed ? "GOAL COMPLETED" : "PRACTICE SUBMITTED EARLY", 64, 177);
  ctx.fillStyle = "#16334c";
  ctx.font = "bold 48px sans-serif";
  lines.forEach((text, i) => ctx.fillText(text, 64, 255 + i * 59));
  ctx.font = "30px sans-serif";
  ctx.fillText(`Class hour ${report.student.hour}`, 64, top);
  ctx.fillStyle = "#d3dce0";
  ctx.fillRect(64, top + 25, 1072, 2);
  const metrics = [
    ["Score", `${practiceScore(report.problems)}/10`, `${score.correct} correct answers total`],
    ["Best streak", String(score.bestStreak), "Goal: at least 5 in a row"],
    [
      "First-try correct",
      String(score.firstTry),
      `${score.retryCorrect} correct on a retry`,
    ],
  ];
  metrics.forEach(([label, value, detail], i) => {
    const x = 64 + i * 365;
    ctx.fillStyle = "#49616d";
    ctx.font = "24px sans-serif";
    ctx.fillText(label, x, top + 87);
    ctx.fillStyle = "#176977";
    ctx.font = "bold 78px sans-serif";
    ctx.fillText(value, x, top + 177);
    ctx.fillStyle = "#49616d";
    ctx.font = "21px sans-serif";
    ctx.fillText(detail, x, top + 222);
  });
  ctx.fillStyle = "#16334c";
  ctx.font = "26px sans-serif";
  ctx.fillText(
    `${report.problems.length} graphs · ${score.attempts} submitted answers`,
    64,
    top + 290,
  );
  ctx.font = "23px sans-serif";
  ctx.fillText(
    `Submitted: ${new Date(report.finishedAt).toLocaleString()}`,
    64,
    top + 337,
  );
  ctx.fillStyle = "#49616d";
  ctx.font = "20px sans-serif";
  ctx.fillText(
    `Practice session: ${report.id.slice(0, 8)}`,
    64,
    canvas.height - 122,
  );
  ctx.fillText(
    "Attach this image to your Google Classroom assignment, then tap Turn in.",
    64,
    canvas.height - 76,
  );
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new Error(
                "Image creation failed. Take a screenshot of your completion page instead.",
              ),
            ),
      "image/png",
    ),
  );
}
