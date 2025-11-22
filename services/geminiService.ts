import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LearningProfile, LearningStyleType, Lesson } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// --- Assessment Analysis ---

export const analyzeLearningStyle = async (
  age: number,
  answers: Record<number, string>
): Promise<LearningProfile> => {
  
  const prompt = `
    Analyze the learning style of a ${age}-year-old child based on these observations/answers:
    ${JSON.stringify(answers)}
    
    Determine the breakdown of Visual, Auditory, and Kinesthetic preferences.
    Return a JSON object with normalized scores (0-1), a primary style, and a summary.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      visual: { type: Type.NUMBER, description: "Score for visual learning (0.0 to 1.0)" },
      auditory: { type: Type.NUMBER, description: "Score for auditory learning (0.0 to 1.0)" },
      kinesthetic: { type: Type.NUMBER, description: "Score for kinesthetic learning (0.0 to 1.0)" },
      primaryStyle: { type: Type.STRING, enum: ["Visual", "Auditory", "Kinesthetic", "Mixed"] },
      summary: { type: Type.STRING, description: "A helpful 1-sentence summary for the parent." },
    },
    required: ["visual", "auditory", "kinesthetic", "primaryStyle", "summary"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an educational psychologist specializing in early childhood development."
      },
    });

    const result = JSON.parse(response.text || "{}");

    let styleEnum = LearningStyleType.MIXED;
    if (result.primaryStyle === 'Visual') styleEnum = LearningStyleType.VISUAL;
    if (result.primaryStyle === 'Auditory') styleEnum = LearningStyleType.AUDITORY;
    if (result.primaryStyle === 'Kinesthetic') styleEnum = LearningStyleType.KINESTHETIC;

    return {
      primaryStyle: styleEnum,
      scores: {
        visual: result.visual,
        auditory: result.auditory,
        kinesthetic: result.kinesthetic
      },
      summary: result.summary,
      lastAssessmentDate: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error analyzing style:", error);
    // Fallback
    return {
      primaryStyle: LearningStyleType.MIXED,
      scores: { visual: 0.33, auditory: 0.33, kinesthetic: 0.34 },
      summary: "Analysis failed, defaulting to mixed style.",
      lastAssessmentDate: new Date().toISOString()
    };
  }
};

// --- Lesson Generation ---

export const generateLesson = async (
  topic: string,
  childAge: number,
  profile: LearningProfile
): Promise<Omit<Lesson, 'id' | 'childId' | 'isCompleted' | 'createdAt'>> => {

  const prompt = `
    Create a short, engaging, interactive lesson plan for a ${childAge}-year-old child.
    Topic: "${topic}"
    
    Child's Learning Profile:
    - Primary Style: ${profile.primaryStyle}
    - Visual Score: ${profile.scores.visual}
    - Auditory Score: ${profile.scores.auditory}
    - Kinesthetic Score: ${profile.scores.kinesthetic}
    
    Requirements:
    1. Apply neuroscience principles: active recall, micro-learning (short segments), and scaffolding.
    2. Total duration should be appropriate for age (approx 10-15 mins).
    3. Include 3-5 distinct steps.
    4. At least one interactive activity and one quick quiz/check.
    5. Include parent tips for scaffolding.
    6. Types allowed: 'instruction', 'video' (suggest a search term), 'activity', 'quiz', 'break'.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      totalDuration: { type: Type.NUMBER, description: "Total minutes" },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["instruction", "video", "activity", "quiz", "break"] },
            content: { type: Type.STRING, description: "The core text content, question, or activity instruction." },
            durationMinutes: { type: Type.NUMBER },
            parentTips: { type: Type.STRING, description: "Advice for the parent to help the child." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Options if type is quiz" },
            correctAnswer: { type: Type.STRING, description: "Correct answer if type is quiz" }
          },
          required: ["id", "title", "type", "content", "durationMinutes"]
        }
      }
    },
    required: ["title", "description", "steps", "totalDuration"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert curriculum designer for early childhood education."
      },
    });

    return JSON.parse(response.text || "{}");

  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error("Failed to generate lesson content.");
  }
};
