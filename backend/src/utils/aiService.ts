// AI Service for Risk Assessment
// This is a simplified implementation. In production, integrate with actual LLM APIs

export interface RiskAssessmentRequest {
    title: string;
    description: string;
    amount: number;
    category: string;
    userId?: string;
}

export interface RiskAssessmentResult {
    riskScore: number; // 0-100
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendation: string;
}

const categoryRiskWeights: Record<string, number> = {
    travel: 30,
    equipment: 40,
    software: 20,
    service: 35,
    other: 50,
};

const amountThresholds = {
    low: 1000,
    medium: 5000,
    high: 10000,
    critical: 50000,
};

export async function assessRisk(
    request: RiskAssessmentRequest
): Promise<RiskAssessmentResult> {
    let riskScore = 0;
    const factors: string[] = [];

    // Category-based risk
    const categoryRisk = categoryRiskWeights[request.category] || 50;
    riskScore += categoryRisk * 0.4;

    // Amount-based risk
    if (request.amount > amountThresholds.critical) {
        riskScore += 40;
        factors.push('Amount exceeds critical threshold');
    } else if (request.amount > amountThresholds.high) {
        riskScore += 30;
        factors.push('Amount exceeds high threshold');
    } else if (request.amount > amountThresholds.medium) {
        riskScore += 20;
        factors.push('Amount exceeds medium threshold');
    } else if (request.amount > amountThresholds.low) {
        riskScore += 10;
        factors.push('Amount exceeds low threshold');
    }

    // Text analysis - simple keyword matching
    const riskKeywords = [
        'urgent',
        'emergency',
        'critical',
        'confidential',
        'specialized',
    ];
    const lowRiskKeywords = ['routine', 'standard', 'regular', 'approved'];

    const lowerDesc = request.description.toLowerCase();
    const lowerTitle = request.title.toLowerCase();
    const combinedText = `${lowerTitle} ${lowerDesc}`;

    for (const keyword of riskKeywords) {
        if (combinedText.includes(keyword)) {
            riskScore += 10;
            factors.push(`Found risk keyword: "${keyword}"`);
        }
    }

    for (const keyword of lowRiskKeywords) {
        if (combinedText.includes(keyword)) {
            riskScore -= 5;
            factors.push(`Found low-risk keyword: "${keyword}"`);
        }
    }

    // Normalize score
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 75) {
        riskLevel = 'critical';
    } else if (riskScore >= 50) {
        riskLevel = 'high';
    } else if (riskScore >= 25) {
        riskLevel = 'medium';
    } else {
        riskLevel = 'low';
    }

    // Generate recommendation
    let recommendation = '';
    if (riskLevel === 'critical') {
        recommendation = 'Requires executive approval and multiple reviews';
    } else if (riskLevel === 'high') {
        recommendation = 'Requires manager review';
    } else if (riskLevel === 'medium') {
        recommendation = 'Can be approved by manager';
    } else {
        recommendation = 'Eligible for auto-approval';
    }

    return {
        riskScore: Math.round(riskScore),
        riskLevel,
        factors,
        recommendation,
    };
}

export async function checkAutoApprovalEligibility(
    request: RiskAssessmentRequest
): Promise<boolean> {
    const assessment = await assessRisk(request);

    // Auto-approve only low-risk requests below $1000
    return (
        assessment.riskLevel === 'low' && request.amount < amountThresholds.low
    );
}

// Simulated LLM API call (for future integration)
export async function callLLMAPI(prompt: string): Promise<string> {
    // This is a placeholder for actual LLM API integration
    // In production, you would call OpenAI, Claude, or similar APIs
    console.log('LLM API called with prompt:', prompt);
    return 'This is a simulated LLM response';
}
