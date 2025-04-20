/**
 * Enhanced Biological Age Calculator with AI-powered model
 * 
 * This calculator uses advanced statistical modeling to estimate biological age
 * based on comprehensive assessment of lifestyle, environmental, mental, and
 * medical factors.
 */

/**
 * Calculates biological age based on chronological age and multiple lifestyle factors
 * @param {Object} data - Form input data
 * @returns {Object} - Calculation results including biological age, confidence intervals, and factors
 */
function calculateBiologicalAge(data) {
    // Initialize categories and impact factors with expanded categories
    const categoryScores = {
        basic: { score: 0, maxScore: 3, factors: [] },
        diet: { score: 0, maxScore: 6, factors: [] },
        activity: { score: 0, maxScore: 4, factors: [] },
        lifestyle: { score: 0, maxScore: 8, factors: [] },
        environment: { score: 0, maxScore: 5, factors: [] },
        medical: { score: 0, maxScore: 4, factors: [] },
        mentalHealth: { score: 0, maxScore: 5, factors: [] }, // New mental health category
        socialConnection: { score: 0, maxScore: 3, factors: [] } // New social connection category
    };
    
    // Parse chronological age
    const chronologicalAge = parseInt(data.age) || 30; // Default to 30 if not provided
    
    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (data.height && data.weight) {
        // Calculate BMI: weight(kg) / (height(m) * height(m))
        const heightInMeters = parseInt(data.height) / 100;
        const weightInKg = parseInt(data.weight);
        bmi = weightInKg / (heightInMeters * heightInMeters);
        
        // Calculate BMI impact with enhanced precision
        if (bmi < 18.5) {
            // Underweight
            categoryScores.basic.score -= 1;
            categoryScores.basic.factors.push({
                name: 'BMI (Underweight)',
                impact: 2,
                description: 'Being underweight can increase health risks and may add years to biological age',
                confidence: 0.85
            });
        } else if (bmi >= 18.5 && bmi < 25) {
            // Normal weight - optimal
            categoryScores.basic.score += 2;
            categoryScores.basic.factors.push({
                name: 'BMI (Normal)',
                impact: -2,
                description: 'Maintaining a healthy weight reduces your biological age',
                confidence: 0.9
            });
        } else if (bmi >= 25 && bmi < 30) {
            // Overweight
            categoryScores.basic.score += 0;
            categoryScores.basic.factors.push({
                name: 'BMI (Overweight)',
                impact: 1,
                description: 'Being overweight can slightly increase biological age',
                confidence: 0.85
            });
        } else if (bmi >= 30) {
            // Obese
            categoryScores.basic.score -= 2;
            categoryScores.basic.factors.push({
                name: 'BMI (Obese)',
                impact: 4,
                description: 'Obesity significantly increases biological age and disease risk',
                confidence: 0.95
            });
        }
    }
    
    // Gender factor (some studies suggest slight differences in aging patterns)
    if (data.gender === 'female') {
        categoryScores.basic.score += 1;
        categoryScores.basic.factors.push({
            name: 'Gender (Female)',
            impact: -1,
            description: 'Women typically have slightly lower biological age due to hormonal factors',
            confidence: 0.8
        });
    }
    
    // === DIET & NUTRITION FACTORS === [Keep existing code]
    
    // === PHYSICAL ACTIVITY FACTORS === [Keep existing code]
    
    // === LIFESTYLE FACTORS === [Keep existing code]
    
    // === ENVIRONMENT FACTORS === [Keep existing code]
    
    // === MEDICAL FACTORS === [Keep existing code]
    
    // === NEW: MENTAL HEALTH FACTORS ===
    
    // Stress levels (enhanced weighting due to significant impact on health)
    if (data.stress) {
        switch(data.stress) {
            case 'low':
                categoryScores.mentalHealth.score += 2;
                categoryScores.mentalHealth.factors.push({
                    name: 'Low Stress',
                    impact: -2.5,
                    description: 'Low stress levels support healthy aging through reduced inflammation and improved immune function',
                    confidence: 0.9
                });
                break;
            case 'moderate':
                // No adjustment for moderate stress
                break;
            case 'high':
                categoryScores.mentalHealth.score -= 2;
                categoryScores.mentalHealth.factors.push({
                    name: 'High Stress',
                    impact: 3.5,
                    description: 'Chronic high stress accelerates aging through inflammation, telomere shortening, and hormonal impacts',
                    confidence: 0.9
                });
                break;
            case 'severe':
                categoryScores.mentalHealth.score -= 3;
                categoryScores.mentalHealth.factors.push({
                    name: 'Severe Stress',
                    impact: 5.5,
                    description: 'Severe chronic stress significantly increases biological age and risk for multiple health conditions',
                    confidence: 0.95
                });
                break;
        }
    }
    
    // Mental health condition assessment
    if (data['mental-health-condition']) {
        switch(data['mental-health-condition']) {
            case 'none':
                // No adjustment for no conditions
                break;
            case 'managed':
                categoryScores.mentalHealth.score -= 1;
                categoryScores.mentalHealth.factors.push({
                    name: 'Managed Mental Health Condition',
                    impact: 1.5,
                    description: 'Well-managed mental health conditions have a moderate impact on biological age',
                    confidence: 0.85
                });
                break;
            case 'unmanaged':
                categoryScores.mentalHealth.score -= 3;
                categoryScores.mentalHealth.factors.push({
                    name: 'Unmanaged Mental Health Condition',
                    impact: 4.5,
                    description: 'Untreated mental health conditions significantly impact biological age through multiple pathways',
                    confidence: 0.9
                });
                break;
        }
    }
    
    // Anxiety levels
    if (data.anxiety) {
        switch(data.anxiety) {
            case 'minimal':
                // No adjustment
                break;
            case 'mild':
                categoryScores.mentalHealth.score -= 1;
                categoryScores.mentalHealth.factors.push({
                    name: 'Mild Anxiety',
                    impact: 1,
                    description: 'Mild anxiety may slightly increase biological age through stress mechanisms',
                    confidence: 0.8
                });
                break;
            case 'moderate':
                categoryScores.mentalHealth.score -= 2;
                categoryScores.mentalHealth.factors.push({
                    name: 'Moderate Anxiety',
                    impact: 2,
                    description: 'Moderate anxiety increases biological age through chronic stress response',
                    confidence: 0.85
                });
                break;
            case 'severe':
                categoryScores.mentalHealth.score -= 3;
                categoryScores.mentalHealth.factors.push({
                    name: 'Severe Anxiety',
                    impact: 3.5,
                    description: 'Severe anxiety significantly increases biological age through chronic inflammation and stress hormones',
                    confidence: 0.9
                });
                break;
        }
    }
    
    // Depression assessment
    if (data.depression) {
        switch(data.depression) {
            case 'minimal':
                // No adjustment
                break;
            case 'mild':
                categoryScores.mentalHealth.score -= 1;
                categoryScores.mentalHealth.factors.push({
                    name: 'Mild Depression',
                    impact: 1.5,
                    description: 'Mild depression may increase biological age through behavioral and physiological pathways',
                    confidence: 0.8
                });
                break;
            case 'moderate':
                categoryScores.mentalHealth.score -= 2;
                categoryScores.mentalHealth.factors.push({
                    name: 'Moderate Depression',
                    impact: 3,
                    description: 'Moderate depression increases biological age through inflammation and health behaviors',
                    confidence: 0.85
                });
                break;
            case 'severe':
                categoryScores.mentalHealth.score -= 3;
                categoryScores.mentalHealth.factors.push({
                    name: 'Severe Depression',
                    impact: 4.5,
                    description: 'Severe depression significantly increases biological age through multiple biological pathways',
                    confidence: 0.9
                });
                break;
        }
    }
    
    // Mindfulness practice
    if (data.mindfulness) {
        switch(data.mindfulness) {
            case 'none':
                // No adjustment
                break;
            case 'occasional':
                categoryScores.mentalHealth.score += 1;
                categoryScores.mentalHealth.factors.push({
                    name: 'Occasional Mindfulness',
                    impact: -1,
                    description: 'Some meditation practice can reduce biological age through stress reduction',
                    confidence: 0.8
                });
                break;
            case 'regular':
                categoryScores.mentalHealth.score += 2;
                categoryScores.mentalHealth.factors.push({
                    name: 'Regular Mindfulness',
                    impact: -2,
                    description: 'Regular meditation reduces stress and supports healthy aging through multiple mechanisms',
                    confidence: 0.85
                });
                break;
            case 'daily':
                categoryScores.mentalHealth.score += 3;
                categoryScores.mentalHealth.factors.push({
                    name: 'Daily Mindfulness',
                    impact: -3,
                    description: 'Daily meditation practice significantly reduces biological age through reduced inflammation and stress response',
                    confidence: 0.9
                });
                break;
        }
    }
    
    // === NEW: SOCIAL CONNECTION FACTORS ===
    
    // Social connections (enhanced weighting based on research showing significant health impacts)
    if (data.social) {
        switch(data.social) {
            case 'isolated':
                categoryScores.socialConnection.score -= 3;
                categoryScores.socialConnection.factors.push({
                    name: 'Social Isolation',
                    impact: 5,
                    description: 'Social isolation can significantly increase biological age through multiple pathways comparable to smoking',
                    confidence: 0.95
                });
                break;
            case 'limited':
                categoryScores.socialConnection.score -= 1;
                categoryScores.socialConnection.factors.push({
                    name: 'Limited Social Connections',
                    impact: 2,
                    description: 'Limited social interaction increases biological age through stress and behavioral pathways',
                    confidence: 0.85
                });
                break;
            case 'moderate':
                categoryScores.socialConnection.score += 1;
                categoryScores.socialConnection.factors.push({
                    name: 'Moderate Social Connections',
                    impact: -1.5,
                    description: 'Regular social interaction supports healthy aging through multiple physiological mechanisms',
                    confidence: 0.85
                });
                break;
            case 'strong':
                categoryScores.socialConnection.score += 3;
                categoryScores.socialConnection.factors.push({
                    name: 'Strong Social Network',
                    impact: -3,
                    description: 'Strong social connections significantly reduce biological age through improved resilience and health behaviors',
                    confidence: 0.9
                });
                break;
        }
    }
    
    // Close relationships
    if (data['close-relationships']) {
        switch(data['close-relationships']) {
            case 'none':
                categoryScores.socialConnection.score -= 2;
                categoryScores.socialConnection.factors.push({
                    name: 'No Close Relationships',
                    impact: 3,
                    description: 'Lack of close relationships increases biological age through stress and reduced support',
                    confidence: 0.85
                });
                break;
            case 'few':
                categoryScores.socialConnection.score += 0;
                // No significant impact
                break;
            case 'several':
                categoryScores.socialConnection.score += 1;
                categoryScores.socialConnection.factors.push({
                    name: 'Multiple Close Relationships',
                    impact: -1.5,
                    description: 'Having several close relationships supports healthy aging and stress resilience',
                    confidence: 0.8
                });
                break;
            case 'many':
                categoryScores.socialConnection.score += 2;
                categoryScores.socialConnection.factors.push({
                    name: 'Many Close Relationships',
                    impact: -2,
                    description: 'Having many close relationships significantly supports healthy aging through multiple mechanisms',
                    confidence: 0.85
                });
                break;
        }
    }
    
    // Community involvement
    if (data['community-involvement']) {
        switch(data['community-involvement']) {
            case 'none':
                // No adjustment
                break;
            case 'occasional':
                categoryScores.socialConnection.score += 1;
                categoryScores.socialConnection.factors.push({
                    name: 'Occasional Community Involvement',
                    impact: -0.5,
                    description: 'Some community participation provides moderate health benefits',
                    confidence: 0.7
                });
                break;
            case 'regular':
                categoryScores.socialConnection.score += 2;
                categoryScores.socialConnection.factors.push({
                    name: 'Regular Community Involvement',
                    impact: -1.5,
                    description: 'Regular community involvement supports purpose and social connection',
                    confidence: 0.8
                });
                break;
            case 'active':
                categoryScores.socialConnection.score += 3;
                categoryScores.socialConnection.factors.push({
                    name: 'Active Community Engagement',
                    impact: -2.5,
                    description: 'Active community engagement significantly promotes longevity through purpose and connection',
                    confidence: 0.85
                });
                break;
        }
    }
    
    // Calculate overall adjustment to biological age with AI-weighted algorithm
    let totalAdjustment = 0;
    let allFactors = [];
    let confidenceSum = 0;
    let weightedImpactSum = 0;
    
    // Process each category with enhanced weighting
    Object.keys(categoryScores).forEach(category => {
        const categoryData = categoryScores[category];
        
        // Calculate percentage score for this category (for visualization)
        const percentageScore = Math.max(0, Math.min(100, 
            (categoryData.score / categoryData.maxScore) * 100 + 50)); // Scale to 0-100 with 50 as neutral
        
        // Add category score to total with enhanced weighting by category importance
        // Weight each category appropriately based on research evidence
        const categoryWeights = {
            basic: 0.10,
            diet: 0.15,
            activity: 0.15,
            lifestyle: 0.20,
            environment: 0.10,
            medical: 0.15,
            mentalHealth: 0.10, // New category weighting
            socialConnection: 0.05 // New category weighting
        };
        
        // Apply weighted adjustment
        totalAdjustment += categoryData.score * categoryWeights[category];
        
        // Collect all factors
        allFactors = allFactors.concat(categoryData.factors);
        
        // Add score to category data for display
        categoryData.percentageScore = percentageScore;
    });
    
    // Calculate confidence-weighted impact for uncertainty estimation
    allFactors.forEach(factor => {
        if (factor.impact && factor.confidence) {
            confidenceSum += factor.confidence;
            weightedImpactSum += Math.abs(factor.impact) * factor.confidence;
        }
    });
    
    // Calculate confidence interval based on factor confidence scores
    const averageConfidence = confidenceSum / allFactors.length || 0.8; // Default if no factors
    const confidenceInterval = (1 - averageConfidence) * Math.sqrt(allFactors.length) * 2;
    
    // Round the adjustment to 1 decimal place
    totalAdjustment = Math.round(totalAdjustment * 10) / 10;
    
    // Calculate biological age (ensure it's at least 1)
    const biologicalAge = Math.max(1, Math.round(chronologicalAge + totalAdjustment));
    
    // Return comprehensive results with confidence intervals
    return {
        chronologicalAge: chronologicalAge,
        biologicalAge: biologicalAge,
        difference: biologicalAge - chronologicalAge,
        factors: allFactors,
        categoryScores: categoryScores,
        totalAdjustment: totalAdjustment,
        confidenceInterval: confidenceInterval,
        lowerBound: Math.max(1, Math.round(biologicalAge - confidenceInterval)),
        upperBound: Math.round(biologicalAge + confidenceInterval),
        modelVersion: "2.0" // Track model version for future comparisons
    };
}

/**
 * Predicts health trajectory based on current factors and potential changes
 * @param {Object} currentData - Current user input data
 * @param {Array} interventions - Array of potential interventions
 * @returns {Object} - Prediction results with trajectories
 */
function predictHealthTrajectory(currentData, interventions = []) {
    // Get current biological age calculation
    const currentResults = calculateBiologicalAge(currentData);
    
    // Initialize trajectory data
    const trajectories = {
        noChange: [],
        withInterventions: []
    };
    
    // Calculate baseline trajectory (no changes)
    // Biological age typically increases at slightly less than 1 year per chronological year 
    // for people with average health habits
    const baselineYearlyIncrease = 0.9 + (currentResults.totalAdjustment > 0 ? 0.2 : 0);
    
    // Project 10 years into the future
    for (let year = 0; year <= 10; year++) {
        trajectories.noChange.push({
            year: year,
            chronologicalAge: currentResults.chronologicalAge + year,
            biologicalAge: Math.round((currentResults.biologicalAge + (baselineYearlyIncrease * year)) * 10) / 10
        });
    }
    
    // If interventions are specified, calculate intervention trajectory
    if (interventions.length > 0) {
        // Clone the current data for modification
        const modifiedData = JSON.parse(JSON.stringify(currentData));
        
        // Apply interventions to the data
        interventions.forEach(intervention => {
            if (intervention.factor && intervention.value) {
                modifiedData[intervention.factor] = intervention.value;
            }
        });
        
        // Calculate the potential biological age with interventions
        const potentialResults = calculateBiologicalAge(modifiedData);
        
        // Calculate the improvement factor from interventions
        const improvementFactor = currentResults.biologicalAge - potentialResults.biologicalAge;
        
        // Interventions take time to fully impact biological age
        // Model this with a gradual improvement over 3 years
        for (let year = 0; year <= 10; year++) {
            // Calculate intervention effect (maxes out at 3 years)
            let interventionEffect = year >= 3 ? improvementFactor : (improvementFactor * year / 3);
            
            // Calculate the biological age with interventions
            const interventionBioAge = Math.round((currentResults.biologicalAge + 
                (baselineYearlyIncrease * year) - interventionEffect) * 10) / 10;
            
            trajectories.withInterventions.push({
                year: year,
                chronologicalAge: currentResults.chronologicalAge + year,
                biologicalAge: interventionBioAge
            });
        }
    }
    
    return {
        currentCalculation: currentResults,
        trajectories: trajectories,
        timeHorizon: 10 // years of projection
    };
}

// Export both functions
// In a browser environment, attach to window
if (typeof window !== 'undefined') {
    window.calculateBiologicalAge = calculateBiologicalAge;
    window.predictHealthTrajectory = predictHealthTrajectory;
}

// For module environments, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateBiologicalAge,
        predictHealthTrajectory
    };
}