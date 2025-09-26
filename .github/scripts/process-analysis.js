import fs from 'fs';

// GitHub Models API client for action
async function callGitHubModels(prompt, token) {
  const response = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in developer experience analysis. Provide concise, actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub Models API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Parse analysis data from environment variable
 */
function parseAnalysisData(dataString) {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    console.error("Failed to parse analysis data:", error);
    throw new Error("Invalid data format in analysis data");
  }
}

/**
 * Calculate category averages from scores
 */
function calculateAverage(scores, questionIds) {
  const values = questionIds.map(id => scores[id]).filter(v => v !== undefined && v !== null);
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Generate risk flags based on category scores
 */
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

/**
 * Generate insights based on data patterns
 */
function generateInsights(categories, openResponses) {
  const insights = [];

  if (categories.aiIntegration > 4.0) {
    insights.push("High AI integration indicates strong tool adoption");
  }
  if (categories.skillBalance < 3.0) {
    insights.push("Low skill balance suggests over-reliance on AI tools");
  }
  if (categories.learningVelocity > 4.0) {
    insights.push("Excellent learning velocity shows good knowledge transfer");
  }
  if (categories.qualityConfidence < 3.0) {
    insights.push("Quality confidence concerns need immediate attention");
  }

  // Analyze open responses
  const responses = Object.values(openResponses).filter(r => r && r.trim());
  if (responses.length > 0) {
    insights.push(`Received ${responses.length} detailed feedback responses`);

    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'love', 'helpful', 'fast', 'efficient'];
    const negativeWords = ['bad', 'poor', 'slow', 'difficult', 'confusing', 'frustrating'];

    let positiveCount = 0;
    let negativeCount = 0;

    responses.forEach(response => {
      const lower = response.toLowerCase();
      positiveWords.forEach(word => {
        if (lower.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (lower.includes(word)) negativeCount++;
      });
    });

    if (positiveCount > negativeCount) {
      insights.push("Overall positive sentiment in feedback");
    } else if (negativeCount > positiveCount) {
      insights.push("Concerns identified in qualitative feedback");
    }
  }

  return insights.join('. ') + '.';
}

/**
 * Generate recommendations based on overall score
 */
function generateRecommendations(overallScore, categories) {
  const recommendations = [];

  if (overallScore >= 4.0) {
    recommendations.push("Continue current approach and share successful practices");
    recommendations.push("Consider mentoring other teams in AI adoption");
  } else if (overallScore >= 3.0) {
    recommendations.push("Review specific low-scoring areas for targeted improvements");
    recommendations.push("Increase knowledge sharing activities within the team");
  } else if (overallScore >= 2.0) {
    recommendations.push("Implement immediate training and support programs");
    recommendations.push("Evaluate current tools and processes");
    recommendations.push("Provide one-on-one coaching for struggling team members");
  } else {
    recommendations.push("Halt AI adoption expansion until issues are resolved");
    recommendations.push("Launch comprehensive training program");
    recommendations.push("Consider tool replacement and leadership escalation");
  }

  // Add specific recommendations based on categories
  if (categories.skillBalance < 3.0) {
    recommendations.push("Focus on traditional coding skills to maintain balance");
  }
  if (categories.qualityConfidence < 3.0) {
    recommendations.push("Implement code review processes for AI-generated code");
  }

  return recommendations;
}

/**
 * Analyze developer experience data
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

  // Generate basic analysis components
  const riskFlags = generateRiskFlags(categories);
  const recommendations = generateRecommendations(overallScore, categories);

  // Try to get AI insights
  let insights = generateInsights(categories, openResponses);

  try {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const prompt = `Analyze this developer experience data:

Categories (1-5 scale):
- AI Integration: ${categories.aiIntegration.toFixed(1)}
- Skill Balance: ${categories.skillBalance.toFixed(1)}
- Learning Velocity: ${categories.learningVelocity.toFixed(1)}
- Quality Confidence: ${categories.qualityConfidence.toFixed(1)}
- Team Process: ${categories.teamProcess.toFixed(1)}

Feedback: ${Object.values(openResponses).join('. ')}

Provide 2-3 key insights about this team's AI adoption patterns.`;

      const aiInsights = await callGitHubModels(prompt, token);
      insights = aiInsights;
    }
  } catch (error) {
    console.log('AI analysis failed, using basic insights:', error.message);
  }

  return {
    categories,
    overallScore,
    insights,
    riskFlags,
    recommendations,
    analysis: {
      timestamp: new Date().toISOString(),
      responseComplete: true,
      participantCount: Object.keys(openResponses).length
    }
  };
}

/**
 * Main execution function
 */
async function main() {
  try {
    const analysisData = parseAnalysisData(process.env.ANALYSIS_DATA);
    console.log("Processing developer experience analysis...");

    const results = await analyzeDeveloperExperience(analysisData);

    // Write results to file
    fs.writeFileSync('analysis-results.json', JSON.stringify(results, null, 2));

    console.log("Analysis completed successfully:");
    console.log(`- Overall Score: ${results.overallScore.toFixed(2)}/5.0`);
    console.log(`- Risk Flags: ${results.riskFlags.length}`);
    console.log(`- Recommendations: ${results.recommendations.length}`);

    if (results.riskFlags.length > 0) {
      console.log("⚠️  Risk flags identified:");
      results.riskFlags.forEach(flag => console.log(`   - ${flag}`));
    }

  } catch (error) {
    console.error("Analysis failed:", error.message);

    // Create fallback results
    const fallbackResults = {
      error: error.message,
      timestamp: new Date().toISOString(),
      categories: {},
      overallScore: 0,
      insights: "Analysis failed due to data processing error",
      riskFlags: ["Analysis system error"],
      recommendations: ["Review survey data format and retry analysis"],
      analysis: {
        timestamp: new Date().toISOString(),
        responseComplete: false,
        error: error.message
      }
    };

    fs.writeFileSync('analysis-results.json', JSON.stringify(fallbackResults, null, 2));
    process.exit(1);
  }
}

main();