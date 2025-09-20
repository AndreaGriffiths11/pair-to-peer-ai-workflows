# AI Analysis Service Setup

This document explains how to set up and use the GitHub models-powered analysis service for the Developer Experience Health Check.

## Prerequisites

1. **GitHub Token**: You need a GitHub token with access to GitHub Models
2. **Node.js**: Version 18+ required
3. **Internet Connection**: Required for GitHub Models API calls

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure GitHub Token

Set your GitHub token as an environment variable:

```bash
# Linux/macOS
export GITHUB_TOKEN="your_github_token_here"

# Windows (Command Prompt)
set GITHUB_TOKEN=your_github_token_here

# Windows (PowerShell)
$env:GITHUB_TOKEN="your_github_token_here"
```

### 3. Start the Analysis Service

```bash
npm start
```

The service will start on `http://localhost:3001` by default.

## Usage

### 1. Complete the Developer Experience Survey

Open `docs/developer-experience.html` in your browser and complete the survey including:
- 25 rating questions (1-5 scale)
- 4 open response questions
- 1 additional comments field

### 2. Generate AI Analysis

After completing the survey:
1. Click "View Results" to see your basic scores
2. Click "🔍 Generate AI Insights" to run the AI analysis
3. Wait for the analysis to complete (typically 10-30 seconds)

### 3. Review AI-Powered Insights

The AI analysis provides:
- **Sentiment Analysis**: Understanding the tone and sentiment of your written feedback
- **Pattern Recognition**: Identifying common themes and issues
- **Correlation Analysis**: How your written feedback relates to your numeric scores
- **Actionable Recommendations**: Specific suggestions based on both quantitative and qualitative data
- **Risk Assessment**: Identification of potential concerns or red flags

## AI Analysis Features

### Quantitative + Qualitative Integration

The analysis combines:
- **Scores** from 5 categories:
  - AI Integration (Questions 1-5)
  - Skill Balance (Questions 6-10)
  - Learning Velocity (Questions 11-15)
  - Quality Confidence (Questions 16-20)
  - Team Process (Questions 21-25)

- **Written Feedback** from:
  - AI Success Story
  - Biggest Frustration
  - High Impact Improvement
  - Relationship Change
  - Additional Comments

### AI Model Configuration

- **Model**: xai/grok-3-mini (via GitHub Models)
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Top-p**: 0.9 (focused response generation)

## Troubleshooting

### Common Issues

1. **"AI Analysis Unavailable" Error**
   - Ensure the analysis service is running (`npm start`)
   - Check that `GITHUB_TOKEN` is set correctly
   - Verify internet connectivity

2. **CORS Errors**
   - Make sure you're accessing the HTML file via a web server, not file://
   - The analysis service includes CORS headers for localhost

3. **Token Issues**
   - Ensure your GitHub token has access to GitHub Models
   - Check token permissions and expiration

### Network Configuration

If running on a different port, update the `analysisServiceUrl` in the HTML file:

```javascript
const analysisServiceUrl = 'http://localhost:YOUR_PORT/api/analyze';
```

## API Endpoints

### POST /api/analyze
Analyzes developer experience data using GitHub models.

**Request Body:**
```json
{
  "scores": {
    "1": 4,
    "2": 3,
    // ... questions 1-25
  },
  "openResponses": {
    "AI Success Story": "...",
    "Biggest Frustration": "...",
    "High Impact Improvement": "...",
    "Relationship Change": "...",
    "Additional Comments": "..."
  }
}
```

**Response:**
```json
{
  "categories": {
    "aiIntegration": 3.8,
    "skillBalance": 3.2,
    "learningVelocity": 4.1,
    "qualityConfidence": 3.9,
    "teamProcess": 3.5
  },
  "overallScore": 3.7,
  "aiInsights": "Detailed AI analysis text...",
  "riskFlags": ["Over-dependence risk: ..."],
  "recommendations": ["Continue current approach..."],
  "analysis": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "model": "xai/grok-3-mini",
    "responseComplete": true
  }
}
```

### GET /api/health
Health check endpoint to verify service status.

## Privacy and Security

- **Data Handling**: Survey responses are sent to GitHub Models for analysis
- **Storage**: No data is permanently stored by the analysis service
- **Tokens**: Keep your GitHub token secure and don't commit it to version control
- **Network**: Analysis requires internet access to GitHub Models API

## Contributing

To enhance the AI analysis:

1. Modify the analysis prompt in `analysis-service.js`
2. Adjust model parameters (temperature, top-p)
3. Add new analysis dimensions
4. Improve error handling and fallback responses

## License

This analysis service is part of the Pair to Peer AI Workflows project and follows the same MIT license.