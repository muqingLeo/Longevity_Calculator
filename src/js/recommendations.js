/**
 * Enhanced AI-powered recommendations generator for the Longevity Calculator
 * Generates personalized recommendations based on user inputs and calculation results
 * with adaptive prioritization and evidence-based suggestions
 */

/**
 * Generates personalized recommendations based on user inputs and calculation results
 * @param {Object} data - User input data
 * @param {Object} calculationResults - Results from biological age calculation
 * @returns {Array} - Array of recommendation objects with evidence rating
 */
function generateRecommendations(data, calculationResults) {
    const recommendations = [];
    const categoryScores = calculationResults.categoryScores;
    
    // === DIET RECOMMENDATIONS === [Keep existing recommendations]
    
    // === EXERCISE RECOMMENDATIONS === [Keep existing recommendations]
    
    // === LIFESTYLE RECOMMENDATIONS === [Keep existing recommendations]
    
    // === ENVIRONMENT RECOMMENDATIONS === [Keep existing recommendations]
    
    // === MEDICAL RECOMMENDATIONS === [Keep existing recommendations]
    
    // === NEW: MENTAL HEALTH RECOMMENDATIONS ===
    
    // Stress management recommendations
    if (data.stress === 'high' || data.stress === 'severe') {
        recommendations.push({
            category: 'Mental Health',
            text: 'Implement evidence-based stress reduction techniques such as deep breathing, meditation, yoga, or spending time in nature. Research shows chronic stress accelerates cellular aging through inflammation, oxidative stress, and telomere shortening.',
            priority: 'high',
            evidenceRating: 'strong',
            impact: 'significant',
            timeToEffect: 'short-term'
        });
    }
    
    // Anxiety recommendations
    if (data.anxiety === 'moderate' || data.anxiety === 'severe') {
        recommendations.push({
            category: 'Mental Health',
            text: 'Consider anxiety management strategies such as cognitive-behavioral techniques, mindfulness, and regular physical activity. Studies show that chronic anxiety increases inflammation markers associated with accelerated aging.',
            priority: 'high',
            evidenceRating: 'strong',
            impact: 'moderate',
            timeToEffect: 'medium-term'
        });
    }
    
    // Depression recommendations
    if (data.depression === 'moderate' || data.depression === 'severe') {
        recommendations.push({
            category: 'Mental Health',
            text: 'Seek professional support for depression management. Untreated depression is linked to increased biological aging through multiple pathways including inflammation, oxidative stress, and altered cellular function.',
            priority: 'high',
            evidenceRating: 'strong',
            impact: 'significant',
            timeToEffect: 'medium-term'
        });
    }
    
    // Mental health condition management
    if (data['mental-health-condition'] === 'unmanaged') {
        recommendations.push({
            category: 'Mental Health',
            text: 'Prioritize professional treatment for your mental health condition. Research shows well-managed mental health conditions have significantly less impact on biological aging compared to untreated conditions.',
            priority: 'high',
            evidenceRating: 'moderate',
            impact: 'significant',
            timeToEffect: 'medium-term'
        });
    }
    
    // Mindfulness recommendations
    if (data.mindfulness === 'none' || !data.mindfulness) {
        recommendations.push({
            category: 'Mental Health',
            text: 'Start a simple daily meditation practice for 5-10 minutes. Clinical studies demonstrate that regular meditation can reduce biological age by lowering stress hormones, improving immune function, and potentially slowing cellular aging.',
            priority: 'medium',
            evidenceRating: 'moderate',
            impact: 'moderate',
            timeToEffect: 'medium-term'
        });
    }
    
    // Sleep and mental health
    function shouldRecommendSleepImprovement(data) {
        const poorSleep = data.sleep === 'less' || data['sleep-quality'] === 'poor';
        const mentalHealthStress = data.stress === 'high' || data.anxiety === 'moderate' || data.anxiety === 'severe';
        return poorSleep && mentalHealthStress;
    }
    
    if (shouldRecommendSleepImprovement(data)) {
        recommendations.push({
            category: 'Mental Health',
            text: 'Prioritize improving your sleep through consistent sleep scheduling, creating a relaxing bedtime routine, and limiting screen time before bed. Poor sleep quality compounds mental health stressors and accelerates biological aging.',
            priority: 'high',
            evidenceRating: 'strong',
            impact: 'significant',
            timeToEffect: 'short-term'
        });
    }
    
    // Digital wellbeing
    if (data['screen-time'] === 'high' || data['screen-time'] === 'excessive') {
        recommendations.push({
            category: 'Mental Health',
            text: 'Implement regular digital detox periods and set boundaries around technology use. Excessive screen time is associated with increased stress, sleep disruption, and reduced mental wellbeing, all of which can accelerate aging.',
            priority: 'medium',
            evidenceRating: 'moderate',
            impact: 'moderate',
            timeToEffect: 'short-term'
        });
    }
    
    // === NEW: SOCIAL CONNECTION RECOMMENDATIONS ===
    
    // Social isolation recommendations
    if (data.social === 'isolated' || data.social === 'limited') {
        recommendations.push({
            category: 'Social Connection',
            text: 'Prioritize building stronger social connections through community activities, volunteering, classes, or reconnecting with friends and family. Research shows social isolation has health impacts comparable to smoking 15 cigarettes daily.',
            priority: 'high',
            evidenceRating: 'strong',
            impact: 'significant',
            timeToEffect: 'long-term'
        });
    }
    
    // Close relationships
    if (data['close-relationships'] === 'none' || data['close-relationships'] === 'few') {
        recommendations.push({
            category: 'Social Connection',
            text: 'Focus on developing deeper connections with a few key people rather than many superficial relationships. Studies show that quality of relationships has greater health benefits than quantity.',
            priority: 'medium',
            evidenceRating: 'moderate',
            impact: 'moderate',
            timeToEffect: 'long-term'
        });
    }
    
    // Community involvement
    if (data['community-involvement'] === 'none' && 
       (data.social === 'isolated' || data.social === 'limited')) {
        recommendations.push({
            category: 'Social Connection',
            text: 'Join a community group, class, or volunteer organization related to your interests. Community engagement provides purpose, social connection, and practical support—all factors that contribute to healthier aging.',
            priority: 'medium',
            evidenceRating: 'moderate',
            impact: 'moderate',
            timeToEffect: 'medium-term'
        });
    }
    
    // Digital vs. in-person connection
    if (data.social === 'limited' && data['screen-time'] === 'high') {
        recommendations.push({
            category: 'Social Connection',
            text: 'Balance digital communication with in-person social interaction. Research indicates that face-to-face connection provides greater health benefits than online-only social engagement.',
            priority: 'medium',
            evidenceRating: 'emerging',
            impact: 'moderate',
            timeToEffect: 'medium-term'
        });
    }
    
    // === ADAPTIVE RECOMMENDATION PRIORITIZATION ===
    
    // Find top impact factors for targeted recommendations
    // Sort factors by absolute impact to find biggest opportunities and risks
    const sortedFactors = [...calculationResults.factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    
    // Top negative factors (highest risks)
    const topNegativeFactors = sortedFactors.filter(factor => factor.impact > 0).slice(0, 3);
    
    // Top positive factors (highest benefits)
    const topPositiveFactors = sortedFactors.filter(factor => factor.impact < 0).slice(0, 2);
    
    if (topNegativeFactors.length > 0) {
        const factorNames = topNegativeFactors.map(factor => factor.name).join(', ');
        recommendations.push({
            category: 'Priority Focus Areas',
            text: `Your biggest opportunities for reducing biological age are: ${factorNames}. Focus on these areas first for maximum impact on your longevity.`,
            priority: 'high',
            evidenceRating: 'personalized',
            impact: 'significant',
            timeToEffect: 'varies'
        });
    }
    
    if (topPositiveFactors.length > 0) {
        const factorNames = topPositiveFactors.map(factor => factor.name).join(', ');
        recommendations.push({
            category: 'Strengths',
            text: `Continue maintaining your positive habits in: ${factorNames}. These factors are already significantly reducing your biological age.`,
            priority: 'medium',
            evidenceRating: 'personalized',
            impact: 'supportive',
            timeToEffect: 'ongoing'
        });
    }
    
    // Calculate age-specific recommendation focus
    if (calculationResults.chronologicalAge < 30) {
        // Younger users benefit most from preventative focus
        recommendations.push({
            category: 'Age-Specific Strategy',
            text: 'At your age, focus on prevention and establishing healthy habits. The habits formed now will compound over decades, making this a critical window for longevity planning.',
            priority: 'medium',
            evidenceRating: 'moderate',
            impact: 'long-term',
            timeToEffect: 'long-term'
        });
    } else if (calculationResults.chronologicalAge >= 60) {
        // Older users benefit from focus on maintenance and specific interventions
        recommendations.push({
            category: 'Age-Specific Strategy',
            text: 'At your age, prioritize maintaining muscle mass, cognitive function, and social connections. These factors become increasingly important for healthy aging after 60.',
            priority: 'medium',
            evidenceRating: 'strong',
            impact: 'significant',
            timeToEffect: 'medium-term'
        });
    }
    
    // === PERSONALIZATION ADJUSTMENTS ===
    
    // Create personalized lifestyle cluster based on pattern recognition
    const lifestylePattern = identifyLifestylePattern(data);
    
    if (lifestylePattern) {
        recommendations.push({
            category: 'Personalized Approach',
            text: lifestylePattern.recommendation,
            priority: 'medium',
            evidenceRating: 'moderate',
            impact: 'customized',
            timeToEffect: 'varies'
        });
    }
    
    // Sort recommendations by priority
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    recommendations.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Limit to top recommendations to avoid overwhelming (adaptive to calculation results)
    // If the person has more high-priority issues, show more recommendations
    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
    const recommendationLimit = Math.min(Math.max(5, highPriorityCount + 2), 8);
    
    return recommendations.slice(0, recommendationLimit);
}

/**
 * Identifies lifestyle patterns to provide more targeted recommendations
 * @param {Object} data - User input data
 * @returns {Object|null} - Identified pattern or null if no clear pattern
 */
function identifyLifestylePattern(data) {
    // Busy professional pattern
    if ((data.stress === 'high' || data.stress === 'severe') && 
        (data.exercise === 'occasional' || data.exercise === 'none') &&
        (data.sleep === 'less') &&
        (data['screen-time'] === 'high' || data['screen-time'] === 'excessive')) {
        
        return {
            pattern: 'busy-professional',
            recommendation: 'Your profile suggests a busy, high-stress lifestyle with limited time for self-care. Consider time-efficient strategies like high-intensity interval training, meal preparation, and scheduled downtime to maximize health benefits with minimal time investment.'
        };
    }
    
    // Socially isolated pattern
    if ((data.social === 'isolated') &&
        (data.stress === 'moderate' || data.stress === 'high') &&
        (data['mental-activity'] === 'low' || !data['mental-activity'])) {
        
        return {
            pattern: 'socially-isolated',
            recommendation: 'Your profile indicates social isolation combined with mental and physical health impacts. Consider starting with low-pressure social activities built around your interests, which can simultaneously address multiple health factors.'
        };
    }
    
    // Health-conscious but sedentary pattern
    if ((data['diet-quality'] === 'good' || data['diet-quality'] === 'excellent') &&
        (data.exercise === 'none' || data.exercise === 'occasional') &&
        (data['daily-movement'] === 'sedentary' || data['daily-movement'] === 'low')) {
        
        return {
            pattern: 'health-diet-sedentary',
            recommendation: 'You appear to prioritize nutrition but have limited physical activity. While your diet is beneficial, research shows that even excellent nutrition cannot fully compensate for insufficient movement. Consider movement snacks throughout the day.'
        };
    }
    
    // Physically active but mentally stressed
    if ((data.exercise === 'regular' || data.exercise === 'daily') &&
        (data.stress === 'high' || data.stress === 'severe') &&
        (data.mindfulness === 'none' || !data.mindfulness)) {
        
        return {
            pattern: 'active-but-stressed',
            recommendation: 'You maintain good physical activity but experience significant mental stress. Consider complementing your physical routine with mental wellness practices like mindfulness, which research shows can amplify the longevity benefits of exercise.'
        };
    }
    
    // No clear pattern identified
    return null;
}

// Export functions
// In a browser environment, attach to window
if (typeof window !== 'undefined') {
    window.generateRecommendations = generateRecommendations;
    window.identifyLifestylePattern = identifyLifestylePattern;
}

// For module environments, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateRecommendations,
        identifyLifestylePattern
    };
}