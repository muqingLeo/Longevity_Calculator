/**
 * Enhanced recommendations generator for the Longevity Calculator
 * Generates personalized recommendations based on user inputs and calculation results
 */

/**
 * Generates personalized recommendations based on user inputs and calculation results
 * @param {Object} data - User input data
 * @param {Object} calculationResults - Results from biological age calculation
 * @returns {Array} - Array of recommendation objects
 */
function generateRecommendations(data, calculationResults) {
    const recommendations = [];
    const categoryScores = calculationResults.categoryScores;
    
    // === DIET RECOMMENDATIONS ===
    
    // Diet quality recommendations
    if (data['diet-quality'] === 'poor' || data['diet-quality'] === 'average') {
        recommendations.push({
            category: 'Diet',
            text: 'Improve your diet quality by increasing whole foods like vegetables, fruits, whole grains, lean proteins, and healthy fats while reducing ultra-processed foods. Research shows that a Mediterranean-style diet is particularly beneficial for longevity.',
            priority: 'high'
        });
    }
    
    // Processed food recommendations
    if (data['processed-food'] === 'high' || data['processed-food'] === 'moderate') {
        recommendations.push({
            category: 'Diet',
            text: 'Reduce consumption of ultra-processed foods that contain artificial ingredients, preservatives, and refined carbohydrates. These foods have been linked to increased inflammation and accelerated aging.',
            priority: 'high'
        });
    }
    
    // Sugar intake recommendations
    if (data['sugar-intake'] === 'high' || data['sugar-intake'] === 'moderate') {
        recommendations.push({
            category: 'Diet',
            text: 'Limit added sugar intake to reduce advanced glycation end products (AGEs) that contribute to cellular aging and inflammation. Try replacing sugary foods with fruit or using natural sweeteners in moderation.',
            priority: 'high'
        });
    }
    
    // Water consumption recommendations
    if (data['water-intake'] === 'low') {
        recommendations.push({
            category: 'Diet',
            text: 'Increase daily water consumption to at least 2 liters (8 cups) per day. Proper hydration supports cellular function, metabolism, and detoxification processes important for longevity.',
            priority: 'medium'
        });
    }
    
    // Intermittent fasting recommendation
    if (data.fasting === 'no' && categoryScores.diet.score < categoryScores.diet.maxScore / 2) {
        recommendations.push({
            category: 'Diet',
            text: 'Consider trying intermittent fasting (such as a 16:8 or 14:10 eating pattern) which may trigger cellular repair processes that support longevity. Start gradually and consult a healthcare provider if you have any medical conditions.',
            priority: 'medium'
        });
    }
    
    // === EXERCISE RECOMMENDATIONS ===
    
    // Exercise frequency recommendations
    if (data.exercise === 'none') {
        recommendations.push({
            category: 'Exercise',
            text: 'Start with light physical activity such as walking 30 minutes daily. Even modest increases in activity can have significant health benefits and reduce biological age.',
            priority: 'high'
        });
    } else if (data.exercise === 'occasional') {
        recommendations.push({
            category: 'Exercise',
            text: 'Increase exercise frequency to 3-5 times per week for optimal benefits. Aim for at least 150 minutes of moderate-intensity activity weekly as recommended by health guidelines.',
            priority: 'medium'
        });
    }
    
    // Strength training recommendations
    if (data['strength-training'] === 'none' || !data['strength-training']) {
        recommendations.push({
            category: 'Exercise',
            text: 'Add resistance/strength training to your routine 2-3 times weekly. Strength training helps preserve muscle mass, supports metabolism, and has been linked to increased longevity.',
            priority: 'high'
        });
    }
    
    // Daily movement recommendations
    if (data['daily-movement'] === 'sedentary' || data['daily-movement'] === 'low') {
        recommendations.push({
            category: 'Exercise',
            text: 'Increase non-exercise movement throughout the day by taking short walking breaks, using a standing desk, taking stairs, or stretching. Reducing sitting time is critical for health regardless of exercise habits.',
            priority: 'high'
        });
    }
    
    // === LIFESTYLE RECOMMENDATIONS ===
    
    // Smoking recommendations
    if (data.smoker === 'yes') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Quitting smoking is the single most effective way to reduce your biological age. Within just one year of quitting, your risk of heart disease drops significantly. Consider NRT (nicotine replacement therapy) or talk to your doctor about cessation programs.',
            priority: 'high'
        });
    }
    
    // Alcohol recommendations
    if (data.alcohol === 'heavy' || data.alcohol === 'excessive') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Reduce alcohol consumption to no more than 7 drinks per week. Excessive alcohol accelerates aging through inflammation, nutritional deficiencies, and oxidative stress.',
            priority: 'high'
        });
    }
    
    // Sleep recommendations
    if (data.sleep === 'less') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Prioritize getting 7-9 hours of sleep nightly. Insufficient sleep significantly accelerates biological aging. Establish a consistent sleep schedule and create a relaxing bedtime routine.',
            priority: 'high'
        });
    } else if (data.sleep === 'more') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Consistent oversleeping may indicate underlying health issues. Aim for 7-9 hours of quality sleep rather than extended sleep periods. Consult a healthcare provider if you consistently need more than 9 hours to feel rested.',
            priority: 'medium'
        });
    }
    
    // Sleep quality recommendations
    if (data['sleep-quality'] === 'poor') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Improve sleep quality by: limiting caffeine after noon, avoiding screens 1-2 hours before bed, keeping your bedroom cool and dark, and maintaining a consistent sleep schedule. Consider a sleep tracking app for insights.',
            priority: 'high'
        });
    }
    
    // Stress management recommendations
    if (data.stress === 'high' || data.stress === 'severe') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Implement stress reduction techniques such as deep breathing, meditation, yoga, or spending time in nature. Chronic stress accelerates cellular aging through inflammation and telomere shortening.',
            priority: 'high'
        });
    }
    
    // Social connections recommendations
    if (data.social === 'isolated' || data.social === 'limited') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Build stronger social connections through community activities, volunteering, classes, or reaching out to friends and family. Social isolation has been shown to increase biological age comparable to smoking.',
            priority: 'high'
        });
    }
    
    // Mental stimulation recommendations
    if (data['mental-activity'] === 'low') {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Engage in regular mental challenges such as learning new skills, puzzles, reading, or creative pursuits. Cognitive stimulation creates new neural pathways and may slow cognitive aging.',
            priority: 'medium'
        });
    }
    
    // Mindfulness recommendations
    if (data.mindfulness === 'none' || !data.mindfulness) {
        recommendations.push({
            category: 'Lifestyle',
            text: 'Start a simple meditation practice for 5-10 minutes daily. Research shows meditation can reduce biological age by lowering stress, improving immune function, and potentially slowing cellular aging.',
            priority: 'medium'
        });
    }
    
    // === ENVIRONMENT RECOMMENDATIONS ===
    
    // Outdoor time recommendations
    if (data['outdoor-time'] === 'minimal') {
        recommendations.push({
            category: 'Environment',
            text: 'Increase daily outdoor time to at least 30 minutes. Natural light exposure helps regulate circadian rhythm, improves mood, and supports vitamin D production, all contributing to healthier aging.',
            priority: 'medium'
        });
    }
    
    // Nature exposure recommendations
    if (data['nature-exposure'] === 'rare') {
        recommendations.push({
            category: 'Environment',
            text: 'Visit natural settings like parks, forests, or waterfront areas weekly. Studies show that nature exposure reduces stress hormones, blood pressure, and inflammation while improving mood.',
            priority: 'medium'
        });
    }
    
    // Sun exposure recommendations
    if (data['sun-exposure'] === 'minimal') {
        recommendations.push({
            category: 'Environment',
            text: 'Get moderate sun exposure (15-30 minutes daily depending on skin type) while avoiding peak UV hours. Balanced sun exposure supports vitamin D production which is vital for immune function and longevity.',
            priority: 'medium'
        });
    } else if (data['sun-exposure'] === 'high-unprotected' || data['sun-exposure'] === 'moderate-unprotected') {
        recommendations.push({
            category: 'Environment',
            text: 'Use appropriate sun protection (SPF 30+ sunscreen, protective clothing, hats) when outdoors for extended periods. Excessive UV exposure accelerates skin aging and increases cancer risk.',
            priority: 'high'
        });
    }
    
    // Air quality recommendations
    if (data['air-quality'] === 'poor' || data['air-quality'] === 'moderate') {
        recommendations.push({
            category: 'Environment',
            text: 'Mitigate air pollution exposure by using air purifiers indoors, avoiding outdoor activity during high pollution days, and incorporating houseplants. Air pollution significantly accelerates aging through oxidative stress.',
            priority: 'high'
        });
    }
    
    // Screen time recommendations
    if (data['screen-time'] === 'high' || data['screen-time'] === 'excessive') {
        recommendations.push({
            category: 'Environment',
            text: 'Reduce screen time, especially in the evening. Take regular breaks using the 20-20-20 rule (every 20 minutes, look at something 20 feet away for 20 seconds) and use blue light filters after sunset.',
            priority: 'medium'
        });
    }
    
    // === MEDICAL RECOMMENDATIONS ===
    
    // Chronic conditions recommendations
    const conditions = Array.isArray(data.conditions) ? data.conditions : [];
    if (conditions.length > 0) {
        recommendations.push({
            category: 'Medical',
            text: 'Work with healthcare providers to optimally manage existing health conditions. Well-controlled chronic conditions have significantly less impact on biological age than poorly managed ones.',
            priority: 'high'
        });
    }
    
    // Regular checkups recommendations
    if (data.checkups === 'never' || data.checkups === 'occasional' || !data.checkups) {
        recommendations.push({
            category: 'Medical',
            text: 'Schedule regular health checkups and age-appropriate screenings. Early detection and intervention can significantly reduce the impact of many health conditions on biological age.',
            priority: 'high'
        });
    }
    
    // Medications
    if (data.medications === 'multiple' || data.medications === 'few') {
        recommendations.push({
            category: 'Medical',
            text: 'Review medications with your healthcare provider periodically to ensure they\'re all necessary and optimally prescribed. Polypharmacy (taking multiple medications) can have cumulative effects on aging.',
            priority: 'medium'
        });
    }
    
    // === GENERAL RECOMMENDATIONS ===
    
    // Top factors by impact
    // Find the top 3 most impactful factors (positive or negative)
    const sortedFactors = [...calculationResults.factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    const topNegativeFactors = sortedFactors.filter(factor => factor.impact > 0).slice(0, 3);
    
    if (topNegativeFactors.length > 0) {
        const factorNames = topNegativeFactors.map(factor => factor.name).join(', ');
        recommendations.push({
            category: 'Focus Areas',
            text: `Your biggest opportunities for reducing biological age are: ${factorNames}. Focus on these areas first for maximum impact on your longevity.`,
            priority: 'high'
        });
    }
    
    // Sort recommendations by priority
    recommendations.sort((a, b) => {
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Limit to top 7 recommendations to avoid overwhelming
    return recommendations.slice(0, 7);
}