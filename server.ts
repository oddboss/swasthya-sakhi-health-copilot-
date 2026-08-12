import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Copilot for Health" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { userMessage, chatHistory, profile, timeline, healthMetrics } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "User message is required." });
    }

    const ai = getGeminiClient();

    // Process Health Metrics and Historical Baseline Comparison
    let metricsSummaryText = "No health metrics provided.";
    let latestMetric: any = null;
    let avgHR = 72;
    let avgRestingHR = 65;
    let avgTemp = "98.6";
    let peakHR = 88;
    let peakTemp = "100.2";

    if (healthMetrics && Array.isArray(healthMetrics) && healthMetrics.length > 0) {
      const sorted = [...healthMetrics].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      latestMetric = sorted[sorted.length - 1];
      const historical = sorted.length > 1 ? sorted.slice(0, sorted.length - 1) : sorted;
      const count = historical.length;

      avgHR = Math.round(historical.reduce((acc, m) => acc + (m.heartRate || 70), 0) / count);
      avgRestingHR = Math.round(historical.reduce((acc, m) => acc + (m.restingHeartRate || 65), 0) / count);
      avgTemp = (historical.reduce((acc, m) => acc + (m.temperature || 98.6), 0) / count).toFixed(1);
      const avgSystolic = Math.round(historical.reduce((acc, m) => acc + (m.systolic || 120), 0) / count);
      const avgDiastolic = Math.round(historical.reduce((acc, m) => acc + (m.diastolic || 80), 0) / count);
      const avgReadiness = Math.round(historical.reduce((acc, m) => acc + (m.readinessScore || 80), 0) / count);

      peakHR = Math.max(...sorted.map((m) => m.heartRate || 0));
      const peakHRPoint = sorted.find((m) => m.heartRate === peakHR);
      peakTemp = Math.max(...sorted.map((m) => m.temperature || 0)).toFixed(1);
      const peakTempPoint = sorted.find((m) => m.temperature === parseFloat(peakTemp));

      const hrDiff = latestMetric.heartRate - avgHR;
      const hrDiffStr = hrDiff === 0 ? "matches historical average" : `${Math.abs(hrDiff)} bpm ${hrDiff < 0 ? 'lower' : 'higher'} than average`;

      const tempDiff = +(latestMetric.temperature - parseFloat(avgTemp)).toFixed(1);
      const tempDiffStr = tempDiff === 0 ? "matches historical baseline" : `${Math.abs(tempDiff)}°F ${tempDiff < 0 ? 'lower' : 'higher'} than average`;

      metricsSummaryText = `
Current / Today's Recorded Vitals (${latestMetric.date}):
- Heart Rate: ${latestMetric.heartRate} bpm (Resting HR: ${latestMetric.restingHeartRate} bpm)
- Body Temperature: ${latestMetric.temperature} °F
- Blood Pressure: ${latestMetric.systolic}/${latestMetric.diastolic} mmHg
- SpO2 Oxygen Saturation: ${latestMetric.spO2}%
- Overall Readiness Score: ${latestMetric.readinessScore}%

Historical Baseline Comparison (${count} prior records):
- Historical Average Heart Rate: ${avgHR} bpm (Current is ${hrDiffStr})
- Historical Average Resting HR: ${avgRestingHR} bpm
- Historical Average Body Temperature: ${avgTemp} °F (Current is ${tempDiffStr})
- Historical Average Blood Pressure: ${avgSystolic}/${avgDiastolic} mmHg
- Historical Average Readiness Score: ${avgReadiness}%
- Peak Recorded Heart Rate: ${peakHR} bpm (recorded on ${peakHRPoint?.date || 'past record'})
- Peak Recorded Temperature: ${peakTemp} °F (recorded on ${peakTempPoint?.date || 'past record'})
`;
    }

    // Construct system instructions emphasizing safety, tone, and medical guardrails
    const systemInstruction = `
You are "Copilot for Health", an empathetic, supportive, and clear personal health companion.
Your primary role is to help users understand their symptoms, answer health-related questions in plain language, track symptom context, compare health metrics against historical baselines, and guide them on when to consult a healthcare professional.

CRITICAL MEDICAL & HEALTH METRICS INSTRUCTIONS:
1. YOU ARE NOT A DOCTOR AND CANNOT DIAGNOSE. Always use non-definitive language ("This could be related to...", "Common reasons might include..."). Never say "You have X".
2. ALWAYS assign an accurate risk level based on standard medical triage logic:
   - "low": Minor issues, wellness queries, check-ins, or normal health metric queries ("Low concern").
   - "monitor": Moderate symptoms, mild fever, elevated heart rate, early cold symptoms ("Monitor").
   - "see_doctor": Severe or persistent pain, high fever (>101°F), sudden neurological symptoms, shortness of breath ("See a doctor soon").
3. EMERGENCY SYMPTOMS: If the user reports emergency red flags (e.g., severe chest pain, sudden numbness, severe difficulty breathing), set isEmergency to true.
4. PERSONALIZATION, TIMELINE & HEALTH METRICS COMPARISON:
   - Profile provided: ${profile ? JSON.stringify(profile) : "None"}.
   - Timeline provided: ${timeline ? JSON.stringify(timeline) : "None"}.
   - Vitals & Historical Metrics Data:
${metricsSummaryText}

   - WHEN USER ASKS "How am I doing today?", "How are my vitals?", OR ASKS FOR A HEALTH STATUS/WELLNESS SUMMARY:
     a) Compare current heart rate (${latestMetric?.heartRate || 67} bpm) and current body temperature (${latestMetric?.temperature || 98.3}°F) directly against their historical baselines (${avgHR} bpm / ${avgTemp}°F) and peak values (${peakHR} bpm / ${peakTemp}°F).
     b) Clearly highlight specific numerical differences and trends (e.g., "Your heart rate is currently ${latestMetric?.heartRate || 67} bpm, which is ${Math.abs((latestMetric?.heartRate || 67) - avgHR)} bpm lower than your historical average of ${avgHR} bpm, and significantly down from your peak of ${peakHR} bpm on ${peakHR || 'Aug 08'}...").
     c) Mention their body temperature (${latestMetric?.temperature || 98.3}°F) and blood pressure/readiness score (${latestMetric?.readinessScore || 95}%).
     d) Provide a clear, encouraging summary insight on their overall health and readiness for today, along with 2 actionable wellness tips (e.g., stay hydrated, light stretch).
5. TONE: Calm, compassionate, reassuring, highly accessible, avoiding scary medical jargon unless clearly explained.
`;

    // Format conversation context for Gemini
    let conversationPrompt = "";
    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      conversationPrompt += "Recent Conversation History:\n";
      chatHistory.slice(-6).forEach((msg: any) => {
        const role = msg.sender === "user" ? "User" : "Copilot";
        conversationPrompt += `${role}: ${msg.text}\n`;
      });
      conversationPrompt += "\n";
    }

    conversationPrompt += `Current User Message: "${userMessage}"`;

    const configPayload = {
      contents: conversationPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: {
              type: Type.STRING,
              description: "Must be 'low', 'monitor', or 'see_doctor'",
            },
            riskLabel: {
              type: Type.STRING,
              description: "Readable tag: 'Low concern', 'Monitor', or 'See a doctor soon'",
            },
            explanation: {
              type: Type.STRING,
              description: "Empathetic, clear explanation in plain language.",
            },
            possibleCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Non-definitive potential causes to discuss with a provider.",
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable, simple next steps or self-care monitoring tips.",
            },
            symptomDetected: {
              type: Type.STRING,
              description: "Name of symptom detected in this query if any (e.g. 'Frontal Headache', 'Sore Throat'), or null.",
            },
            timelineReferenceNote: {
              type: Type.STRING,
              description: "Note connecting current message to past session memory if applicable, or null.",
            },
            isEmergency: {
              type: Type.BOOLEAN,
              description: "True if red-flag symptoms require immediate emergency evaluation.",
            },
            emergencyWarning: {
              type: Type.STRING,
              description: "Emergency instruction if isEmergency is true, otherwise null.",
            },
          },
          required: [
            "riskLevel",
            "riskLabel",
            "explanation",
            "possibleCauses",
            "nextSteps",
            "isEmergency",
          ],
        },
      },
    };

    // Retry loop across multiple model aliases to handle transient 503 high-demand errors
    const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.1-pro-preview"];
    let responseText: string | null = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      if (responseText) break;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const resObj = await ai.models.generateContent({
            model: modelName,
            ...configPayload,
          });
          if (resObj && resObj.text) {
            responseText = resObj.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[Gemini API] Attempt ${attempt} failed with model ${modelName}:`, err?.message || err);
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
        }
      }
    }

    let parsedData: any;
    if (responseText) {
      parsedData = JSON.parse(responseText);
    } else {
      console.error("All Gemini API models failed. Returning friendly fallback response.", lastError);
      parsedData = {
        riskLevel: "monitor",
        riskLabel: "Service Busy",
        explanation:
          "Our AI health analysis model is currently experiencing high demand. Please try re-sending your question in a moment. In the meantime, monitor your symptoms closely, rest, and stay hydrated.",
        possibleCauses: [
          "High AI model traffic spike",
          "Temporary service congestion",
        ],
        nextSteps: [
          "Send your message again in a few seconds.",
          "If you feel severe pain or difficulty breathing, contact emergency services immediately.",
        ],
        symptomDetected: null,
        timelineReferenceNote: null,
        isEmergency: false,
        emergencyWarning: null,
      };
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate health guidance. Please try again.",
    });
  }
});

async function startServer() {
  // Vite middleware for development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Copilot for Health server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
