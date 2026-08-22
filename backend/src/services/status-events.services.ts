import type { Response } from "express";

const analysisSubscribers = new Map<string, Set<Response>>();

export function subscribeToAnalysisStatus(analysisId: string, res: Response) {
  if (!analysisSubscribers.has(analysisId)) {
    analysisSubscribers.set(analysisId, new Set());
  }

  const subscribers = analysisSubscribers.get(analysisId)!;
  subscribers.add(res);

  return () => unsubscribeFromAnalysisStatus(analysisId, res);
}

export function unsubscribeFromAnalysisStatus(
  analysisId: string,
  res: Response,
) {
  const subscribers = analysisSubscribers.get(analysisId);

  if (!subscribers) {
    return;
  }

  subscribers.delete(res);

  if (subscribers.size === 0) {
    analysisSubscribers.delete(analysisId);
  }
}

export function emitAnalysisStatusUpdate(
  analysisId: string,
  status: string,
) {
  const subscribers = analysisSubscribers.get(analysisId);

  if (!subscribers || subscribers.size === 0) {
    return;
  }

  const payload = JSON.stringify({
    analysisId,
    status,
    timestamp: Date.now(),
  });

  for (const res of subscribers) {
    if (res.writableEnded) {
      subscribers.delete(res);
      continue;
    }

    try {
      res.write(`event: status\ndata: ${payload}\n\n`);
    } catch {
      subscribers.delete(res);
    }
  }

  if (subscribers.size === 0) {
    analysisSubscribers.delete(analysisId);
  }
}
