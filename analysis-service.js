import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// GitHub Models configuration
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "xai/grok-3-mini";

if (!token) {
  console.error("GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

const client = ModelClient(
  endpoint,
  new AzureKeyCredential(token),
);

/**
 * Analyze developer experience data using GitHub models
 * @param {Object} data - Survey data containing scores and open responses
 * @returns {Object} Analysis results
 */
async function analyzeDeveloperExperience(data) {
  const { scores, openResponses } = data;
  
  // Calculate category averages
  const categories = {
    aiIntegration: calculateAverage(scores, [1, 2, 3, 4, 5]),
    skillBalance: calculateAverage(scores, [6, 7, 8, 9, 10]),
    learningVelocity: calculateAverage(scores, [11, 12, 13, 14, 15]),
    qualityConfidence: calculateAverage(scores, [16, 17, 18, 19, 20]),
    teamProcess: calculateAverage(scores, [21, 22, 23, 24, 25])
  };
  
  const overallScore = Object.values(categories).reduce((sum, score) => sum + score, 0) / 5;
  
  // Prepare context for AI analysis
  const analysisContext = `
Developer Experience Health Check Analysis:

QUANTITATIVE SCORES:
- AI Integration: ${categories.aiIntegration.toFixed(1)}/5.0
- Skill Balance: ${categories.skillBalance.toFixed(1)}/5.0  
- Learning Velocity: ${categories.learningVelocity.toFixed(1)}/5.0
- Quality Confidence: ${categories.qualityConfidence.toFixed(1)}/5.0
- Team Process: ${categories.teamProcess.toFixed(1)}/5.0
- Overall Score: ${overallScore.toFixed(1)}/5.0

QUALITATIVE FEEDBACK:
${Object.entries(openResponses).map(([question, answer]) => 
  `${question}: ${answer || 'No response provided'}`
).join('\n')}

Please analyze this developer experience data and provide:
1. Sentiment analysis of the qualitative feedback
2. Key patterns and themes identified
3. Correlation between scores and written feedback
4. Specific actionable recommendations
5. Risk indicators and areas of concern
6. Positive highlights and success patterns
`;

  try {
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { 
            role: "system", 
            content: "You are an expert in developer experience and team dynamics. Analyze the provided survey data to generate actionable insights that combine quantitative scores with qualitative feedback patterns. Focus on practical recommendations and identifying both risks and opportunities." 
          },
          { 
            role: "user", 
            content: analysisContext 
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        model: model
      }
    });

    if (isUnexpected(response)) {
      throw new Error(`AI Analysis failed: ${response.body.error}`);
    }

    const aiInsights = response.body.choices[0].message.content;
    
    // Generate risk flags
    const riskFlags = generateRiskFlags(categories);
    
    return {
      categories,
      overallScore,
      aiInsights,
      riskFlags,
      recommendations: generateBasicRecommendations(overallScore),
      analysis: {
        timestamp: new Date().toISOString(),
        model: model,
        responseComplete: true
      }
    };
    
  } catch (error) {
    console.error("AI Analysis Error:", error);
    
    // Fallback to basic analysis if AI fails
    return {
      categories,
      overallScore,
      aiInsights: "AI analysis temporarily unavailable. Basic scoring analysis provided.",
      riskFlags: generateRiskFlags(categories),
      recommendations: generateBasicRecommendations(overallScore),
      analysis: {
        timestamp: new Date().toISOString(),
        model: "fallback",
        responseComplete: false,
        error: error.message
      }
    };
  }
}

function calculateAverage(scores, questionIds) {
  const values = questionIds.map(id => scores[id]).filter(v => v !== undefined && v !== null);
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function generateRiskFlags(categories) {
  const flags = [];
  
  if (categories.aiIntegration > 4.0 && categories.skillBalance < 3.0) {
    flags.push("Over-dependence risk: High AI integration but low skill balance");
  }
  
  if (categories.qualityConfidence < 3.0) {
    flags.push("Security/quality risk: Low confidence in AI-generated code quality");
  }
  
  if (categories.learningVelocity < 2.5) {
    flags.push("Skill development stagnation: Very low learning velocity");
  }
  
  if (categories.teamProcess < 2.5) {
    flags.push("Team collaboration issues: Poor AI workflow integration");
  }
  
  return flags;
}

function generateBasicRecommendations(overallScore) {
  if (overallScore >= 4.0) {
    return [
      "Continue current approach and share successful practices",
      "Consider mentoring other teams in AI adoption"
    ];
  } else if (overallScore >= 3.0) {
    return [
      "Review specific low-scoring areas for targeted improvements",
      "Increase knowledge sharing activities within the team"
    ];
  } else if (overallScore >= 2.0) {
    return [
      "Implement immediate training and support programs",
      "Evaluate current tools and processes",
      "Provide one-on-one coaching for struggling team members"
    ];
  } else {
    return [
      "Halt AI adoption expansion until issues are resolved",
      "Launch comprehensive training program",
      "Consider tool replacement and leadership escalation"
    ];
  }
}

// API endpoint for analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const analysis = await analyzeDeveloperExperience(req.body);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis endpoint error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    model: model
  });
});

// Start server
app.listen(port, () => {
  console.log(`Developer Experience Analysis Service running on port ${port}`);
  console.log(`Using model: ${model}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

export { analyzeDeveloperExperience };