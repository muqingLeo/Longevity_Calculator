/**
 * Enhanced Biological Age Calculator
 * 
 * This calculator uses a comprehensive assessment of lifestyle, environmental,
 * and medical factors to estimate biological age based on scientific research.
 */

/**
 * Calculates biological age based on chronological age and multiple lifestyle factors
 * @param {Object} data - Form input data
 * @returns {Object} - Calculation results including biological age and factors
 */
function calculateBiologicalAge(data) {
    // Initialize categories and impact factors
    const categoryScores = {
        basic: { score: 0, maxScore: 3, factors: [] },
        diet: { score: 0, maxScore: 6, factors: [] },
        activity: { score: 0, maxScore: 4, factors: [] },
        lifestyle: { score: 0, maxScore: 8, factors: [] },
        environment: { score: 0, maxScore: 5, factors: [] },
        medical: { score: 0, maxScore: 4, factors: [] }
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
        
        // Calculate BMI impact
        if (bmi < 18.5) {
            // Underweight
            categoryScores.basic.score -= 1;
            categoryScores.basic.factors.push({
                name: 'BMI (Underweight)',
                impact: 2,
                description: 'Being underweight can increase health risks and may add years to biological age'
            });
        } else if (bmi >= 18.5 && bmi < 25) {
            // Normal weight - optimal
            categoryScores.basic.score += 2;
            categoryScores.basic.factors.push({
                name: 'BMI (Normal)',
                impact: -2,
                description: 'Maintaining a healthy weight reduces your biological age'
            });
        } else if (bmi >= 25 && bmi < 30) {
            // Overweight
            categoryScores.basic.score += 0;
            categoryScores.basic.factors.push({
                name: 'BMI (Overweight)',
                impact: 1,
                description: 'Being overweight can slightly increase biological age'
            });
        } else if (bmi >= 30) {
            // Obese
            categoryScores.basic.score -= 2;
            categoryScores.basic.factors.push({
                name: 'BMI (Obese)',
                impact: 4,
                description: 'Obesity significantly increases biological age and disease risk'
            });
        }
    }
    
    // Gender factor (some studies suggest slight differences in aging patterns)
    if (data.gender === 'female') {
        categoryScores.basic.score += 1;
        categoryScores.basic.factors.push({
            name: 'Gender (Female)',
            impact: -1,
            description: 'Women typically have slightly lower biological age due to hormonal factors'
        });
    }
    
    // === DIET & NUTRITION FACTORS ===
    
    // Diet type
    if (data['diet-type']) {
        switch(data['diet-type']) {
            case 'mediterranean':
                categoryScores.diet.score += 2;
                categoryScores.diet.factors.push({
                    name: 'Mediterranean Diet',
                    impact: -3,
                    description: 'Mediterranean diet is associated with longevity and reduced disease risk'
                });
                break;
            case 'vegetarian':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'Vegetarian Diet',
                    impact: -1,
                    description: 'Vegetarian diets may contribute to slightly lower biological age'
                });
                break;
            case 'vegan':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'Vegan Diet',
                    impact: -1,
                    description: 'Plant-based diets can reduce risk of several chronic diseases'
                });
                break;
            case 'paleo':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'Paleo Diet',
                    impact: -1,
                    description: 'Whole food based diets can improve certain health markers'
                });
                break;
            case 'carnivore':
                categoryScores.diet.score -= 1;
                categoryScores.diet.factors.push({
                    name: 'Carnivore Diet',
                    impact: 1,
                    description: 'Very high animal product consumption may increase certain health risks'
                });
                break;
        }
    }
    
    // Overall diet quality
    if (data['diet-quality']) {
        switch(data['diet-quality']) {
            case 'poor':
                categoryScores.diet.score -= 2;
                categoryScores.diet.factors.push({
                    name: 'Poor Diet Quality',
                    impact: 3,
                    description: 'Poor diet quality adds approximately 3 years to biological age'
                });
                break;
            case 'average':
                // No adjustment for average
                break;
            case 'good':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'Good Diet Quality',
                    impact: -2,
                    description: 'Good diet quality reduces biological age by approximately 2 years'
                });
                break;
            case 'excellent':
                categoryScores.diet.score += 2;
                categoryScores.diet.factors.push({
                    name: 'Excellent Diet Quality',
                    impact: -3,
                    description: 'Excellent diet quality significantly reduces biological age'
                });
                break;
        }
    }
    
    // Processed food consumption
    if (data['processed-food']) {
        switch(data['processed-food']) {
            case 'high':
                categoryScores.diet.score -= 2;
                categoryScores.diet.factors.push({
                    name: 'High Processed Food Intake',
                    impact: 2.5,
                    description: 'High processed food consumption accelerates aging and increases disease risk'
                });
                break;
            case 'moderate':
                categoryScores.diet.score -= 1;
                categoryScores.diet.factors.push({
                    name: 'Moderate Processed Food',
                    impact: 1,
                    description: 'Moderate processed food intake slightly increases biological age'
                });
                break;
            case 'low':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'Low Processed Food',
                    impact: -1,
                    description: 'Low processed food intake supports healthy aging'
                });
                break;
            case 'none':
                categoryScores.diet.score += 2;
                categoryScores.diet.factors.push({
                    name: 'No Processed Foods',
                    impact: -2,
                    description: 'Avoiding processed foods can significantly reduce biological age'
                });
                break;
        }
    }
    
    // Sugar intake
    if (data['sugar-intake']) {
        switch(data['sugar-intake']) {
            case 'high':
                categoryScores.diet.score -= 2;
                categoryScores.diet.factors.push({
                    name: 'High Sugar Intake',
                    impact: 2,
                    description: 'High sugar intake accelerates aging processes through glycation'
                });
                break;
            case 'moderate':
                categoryScores.diet.score -= 1;
                categoryScores.diet.factors.push({
                    name: 'Moderate Sugar Intake',
                    impact: 1,
                    description: 'Moderate sugar consumption slightly increases biological age'
                });
                break;
            case 'low':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'Low Sugar Intake',
                    impact: -1,
                    description: 'Limiting sugar helps reduce inflammation and supports healthy aging'
                });
                break;
            case 'none':
                categoryScores.diet.score += 2;
                categoryScores.diet.factors.push({
                    name: 'No Added Sugar',
                    impact: -2,
                    description: 'Avoiding added sugar helps prevent cellular damage and aging'
                });
                break;
        }
    }
    
    // Water consumption
    if (data['water-intake']) {
        switch(data['water-intake']) {
            case 'low':
                categoryScores.diet.score -= 1;
                categoryScores.diet.factors.push({
                    name: 'Low Water Intake',
                    impact: 1,
                    description: 'Insufficient hydration can accelerate aging processes'
                });
                break;
            case 'moderate':
                // No adjustment for moderate water intake
                break;
            case 'optimal':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'Optimal Water Intake',
                    impact: -1,
                    description: 'Proper hydration supports cellular function and healthy aging'
                });
                break;
            case 'high':
                categoryScores.diet.score += 1;
                categoryScores.diet.factors.push({
                    name: 'High Water Intake',
                    impact: -1,
                    description: 'Good hydration supports detoxification and cellular health'
                });
                break;
        }
    }
    
    // Intermittent fasting
    if (data.fasting === 'yes') {
        categoryScores.diet.score += 1;
        categoryScores.diet.factors.push({
            name: 'Intermittent Fasting',
            impact: -1.5,
            description: 'Intermittent fasting may trigger cellular repair mechanisms and slow aging'
        });
    }
    
    // === PHYSICAL ACTIVITY FACTORS ===
    
    // Exercise frequency
    if (data.exercise) {
        switch(data.exercise) {
            case 'none':
                categoryScores.activity.score -= 2;
                categoryScores.activity.factors.push({
                    name: 'No Exercise',
                    impact: 2,
                    description: 'Lack of exercise adds approximately 2 years to biological age'
                });
                break;
            case 'occasional':
                categoryScores.activity.score -= 1;
                categoryScores.activity.factors.push({
                    name: 'Occasional Exercise',
                    impact: -1,
                    description: 'Occasional exercise reduces biological age by approximately 1 year'
                });
                break;
            case 'regular':
                categoryScores.activity.score += 2;
                categoryScores.activity.factors.push({
                    name: 'Regular Exercise',
                    impact: -3,
                    description: 'Regular exercise can reduce biological age by 3-5 years'
                });
                break;
            case 'daily':
                categoryScores.activity.score += 2;
                categoryScores.activity.factors.push({
                    name: 'Daily Exercise',
                    impact: -4,
                    description: 'Daily exercise significantly reduces biological age'
                });
                break;
        }
    }
    
    // Exercise intensity
    if (data['exercise-intensity']) {
        switch(data['exercise-intensity']) {
            case 'high':
                if (data.exercise && data.exercise !== 'none') {
                    categoryScores.activity.score += 1;
                    categoryScores.activity.factors.push({
                        name: 'High Intensity Exercise',
                        impact: -1.5,
                        description: 'High intensity exercise can trigger additional longevity benefits'
                    });
                }
                break;
            case 'varied':
                if (data.exercise && data.exercise !== 'none') {
                    categoryScores.activity.score += 2;
                    categoryScores.activity.factors.push({
                        name: 'Varied Exercise Intensity',
                        impact: -2,
                        description: 'Mixed intensity training provides comprehensive benefits'
                    });
                }
                break;
        }
    }
    
    // Strength training
    if (data['strength-training']) {
        switch(data['strength-training']) {
            case 'none':
                // No adjustment
                break;
            case 'occasional':
                categoryScores.activity.score += 1;
                categoryScores.activity.factors.push({
                    name: 'Occasional Strength Training',
                    impact: -1,
                    description: 'Some strength training helps maintain muscle mass and metabolic health'
                });
                break;
            case 'regular':
                categoryScores.activity.score += 2;
                categoryScores.activity.factors.push({
                    name: 'Regular Strength Training',
                    impact: -2,
                    description: 'Regular strength training significantly reduces biological age'
                });
                break;
            case 'frequent':
                categoryScores.activity.score += 2;
                categoryScores.activity.factors.push({
                    name: 'Frequent Strength Training',
                    impact: -2.5,
                    description: 'Frequent strength training helps preserve muscle and bone density'
                });
                break;
        }
    }
    
    // Daily movement (non-exercise)
    if (data['daily-movement']) {
        switch(data['daily-movement']) {
            case 'sedentary':
                categoryScores.activity.score -= 2;
                categoryScores.activity.factors.push({
                    name: 'Sedentary Lifestyle',
                    impact: 2,
                    description: 'Prolonged sitting accelerates aging regardless of exercise'
                });
                break;
            case 'low':
                categoryScores.activity.score -= 1;
                categoryScores.activity.factors.push({
                    name: 'Low Daily Movement',
                    impact: 1,
                    description: 'Limited daily movement slightly increases biological age'
                });
                break;
            case 'moderate':
                categoryScores.activity.score += 1;
                categoryScores.activity.factors.push({
                    name: 'Moderate Daily Movement',
                    impact: -1,
                    description: 'Regular walking and standing throughout the day supports healthy aging'
                });
                break;
            case 'high':
                categoryScores.activity.score += 2;
                categoryScores.activity.factors.push({
                    name: 'High Daily Movement',
                    impact: -2,
                    description: 'Frequent movement throughout the day significantly reduces biological age'
                });
                break;
        }
    }
    
    // === LIFESTYLE FACTORS ===
    
    // Smoking
    if (data.smoker) {
        switch(data.smoker) {
            case 'yes':
                categoryScores.lifestyle.score -= 5;
                categoryScores.lifestyle.factors.push({
                    name: 'Current Smoker',
                    impact: 10,
                    description: 'Smoking adds approximately 10 years to biological age'
                });
                break;
            case 'former':
                categoryScores.lifestyle.score -= 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Former Smoker',
                    impact: 2,
                    description: 'Former smoking history adds approximately 2 years to biological age'
                });
                break;
        }
    }
    
    // Alcohol consumption
    if (data.alcohol) {
        switch(data.alcohol) {
            case 'none':
                categoryScores.lifestyle.score += 1;
                categoryScores.lifestyle.factors.push({
                    name: 'No Alcohol',
                    impact: -1,
                    description: 'Avoiding alcohol can reduce biological age'
                });
                break;
            case 'light':
                // No adjustment for light drinking
                break;
            case 'moderate':
                categoryScores.lifestyle.score -= 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Moderate Alcohol',
                    impact: 1,
                    description: 'Moderate alcohol may slightly increase biological age'
                });
                break;
            case 'heavy':
                categoryScores.lifestyle.score -= 3;
                categoryScores.lifestyle.factors.push({
                    name: 'Heavy Alcohol Consumption',
                    impact: 5,
                    description: 'Heavy alcohol consumption significantly increases biological age'
                });
                break;
            case 'excessive':
                categoryScores.lifestyle.score -= 4;
                categoryScores.lifestyle.factors.push({
                    name: 'Excessive Alcohol',
                    impact: 7,
                    description: 'Excessive alcohol consumption substantially accelerates aging'
                });
                break;
        }
    }
    
    // Sleep duration
    if (data.sleep) {
        switch(data.sleep) {
            case 'less':
                categoryScores.lifestyle.score -= 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Insufficient Sleep',
                    impact: 3,
                    description: 'Less than 6 hours of sleep adds approximately 3 years to biological age'
                });
                break;
            case 'optimal':
                categoryScores.lifestyle.score += 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Optimal Sleep',
                    impact: -2,
                    description: 'Optimal sleep duration reduces biological age by approximately 2 years'
                });
                break;
            case 'more':
                categoryScores.lifestyle.score -= 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Excessive Sleep',
                    impact: 1,
                    description: 'Excessive sleep may slightly increase biological age'
                });
                break;
        }
    }
    
    // Sleep quality
    if (data['sleep-quality']) {
        switch(data['sleep-quality']) {
            case 'poor':
                categoryScores.lifestyle.score -= 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Poor Sleep Quality',
                    impact: 2,
                    description: 'Poor sleep quality accelerates cellular aging processes'
                });
                break;
            case 'average':
                // No adjustment for average sleep quality
                break;
            case 'good':
                categoryScores.lifestyle.score += 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Good Sleep Quality',
                    impact: -1,
                    description: 'Good sleep quality supports cellular repair and healthy aging'
                });
                break;
        }
    }
    
    // Stress levels
    if (data.stress) {
        switch(data.stress) {
            case 'low':
                categoryScores.lifestyle.score += 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Low Stress',
                    impact: -2,
                    description: 'Low stress levels support healthy aging and cellular function'
                });
                break;
            case 'moderate':
                // No adjustment for moderate stress
                break;
            case 'high':
                categoryScores.lifestyle.score -= 2;
                categoryScores.lifestyle.factors.push({
                    name: 'High Stress',
                    impact: 3,
                    description: 'Chronic high stress accelerates aging through inflammation and hormonal impacts'
                });
                break;
            case 'severe':
                categoryScores.lifestyle.score -= 3;
                categoryScores.lifestyle.factors.push({
                    name: 'Severe Stress',
                    impact: 5,
                    description: 'Severe chronic stress significantly increases biological age'
                });
                break;
        }
    }
    
    // Social connections
    if (data.social) {
        switch(data.social) {
            case 'isolated':
                categoryScores.lifestyle.score -= 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Social Isolation',
                    impact: 4,
                    description: 'Social isolation can significantly increase biological age'
                });
                break;
            case 'limited':
                categoryScores.lifestyle.score -= 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Limited Social Connections',
                    impact: 1,
                    description: 'Limited social interaction slightly increases biological age'
                });
                break;
            case 'moderate':
                categoryScores.lifestyle.score += 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Moderate Social Connections',
                    impact: -1,
                    description: 'Regular social interaction supports healthy aging'
                });
                break;
            case 'strong':
                categoryScores.lifestyle.score += 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Strong Social Network',
                    impact: -2.5,
                    description: 'Strong social connections significantly reduce biological age'
                });
                break;
        }
    }
    
    // Mental stimulation
    if (data['mental-activity']) {
        switch(data['mental-activity']) {
            case 'low':
                categoryScores.lifestyle.score -= 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Low Mental Stimulation',
                    impact: 1.5,
                    description: 'Limited mental challenges may increase cognitive aging'
                });
                break;
            case 'moderate':
                categoryScores.lifestyle.score += 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Moderate Mental Stimulation',
                    impact: -1,
                    description: 'Regular mental challenges support cognitive health'
                });
                break;
            case 'high':
                categoryScores.lifestyle.score += 2;
                categoryScores.lifestyle.factors.push({
                    name: 'High Mental Stimulation',
                    impact: -2,
                    description: 'Frequent learning and mental challenges reduce cognitive aging'
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
                categoryScores.lifestyle.score += 1;
                categoryScores.lifestyle.factors.push({
                    name: 'Occasional Mindfulness',
                    impact: -0.5,
                    description: 'Some meditation practice can slightly reduce biological age'
                });
                break;
            case 'regular':
                categoryScores.lifestyle.score += 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Regular Mindfulness',
                    impact: -1.5,
                    description: 'Regular meditation reduces stress and supports healthy aging'
                });
                break;
            case 'daily':
                categoryScores.lifestyle.score += 2;
                categoryScores.lifestyle.factors.push({
                    name: 'Daily Mindfulness',
                    impact: -2,
                    description: 'Daily meditation practice significantly reduces biological age'
                });
                break;
        }
    }
    
    // === ENVIRONMENTAL FACTORS ===
    
    // Outdoor time
    if (data['outdoor-time']) {
        switch(data['outdoor-time']) {
            case 'minimal':
                categoryScores.environment.score -= 1;
                categoryScores.environment.factors.push({
                    name: 'Minimal Outdoor Time',
                    impact: 1,
                    description: 'Limited time outdoors may increase biological age'
                });
                break;
            case 'moderate':
                // No adjustment for moderate outdoor time
                break;
            case 'significant':
                categoryScores.environment.score += 1;
                categoryScores.environment.factors.push({
                    name: 'Significant Outdoor Time',
                    impact: -1,
                    description: 'Regular time outdoors supports vitamin D levels and circadian rhythm'
                });
                break;
            case 'extensive':
                categoryScores.environment.score += 2;
                categoryScores.environment.factors.push({
                    name: 'Extensive Outdoor Time',
                    impact: -1.5,
                    description: 'Extensive time outdoors promotes overall health'
                });
                break;
        }
    }
    
    // Nature exposure
    if (data['nature-exposure']) {
        switch(data['nature-exposure']) {
            case 'rare':
                categoryScores.environment.score -= 1;
                categoryScores.environment.factors.push({
                    name: 'Rare Nature Exposure',
                    impact: 1,
                    description: 'Limited nature contact may increase stress and biological age'
                });
                break;
            case 'occasional':
                // No adjustment for occasional nature exposure
                break;
            case 'frequent':
                categoryScores.environment.score += 1;
                categoryScores.environment.factors.push({
                    name: 'Frequent Nature Exposure',
                    impact: -1,
                    description: 'Regular nature exposure reduces stress and supports health'
                });
                break;
            case 'immersive':
                categoryScores.environment.score += 2;
                categoryScores.environment.factors.push({
                    name: 'Immersive Nature Exposure',
                    impact: -2,
                    description: 'Living in natural settings significantly reduces biological age'
                });
                break;
        }
    }
    
    // Sun exposure
    if (data['sun-exposure']) {
        switch(data['sun-exposure']) {
            case 'minimal':
                categoryScores.environment.score -= 1;
                categoryScores.environment.factors.push({
                    name: 'Minimal Sun Exposure',
                    impact: 1,
                    description: 'Insufficient sun exposure may lead to vitamin D deficiency'
                });
                break;
            case 'moderate-protected':
                categoryScores.environment.score += 1;
                categoryScores.environment.factors.push({
                    name: 'Moderate Sun with Protection',
                    impact: -1,
                    description: 'Balanced sun exposure with protection optimizes vitamin D while preventing damage'
                });
                break;
            case 'moderate-unprotected':
                // No net adjustment - benefits of vitamin D vs damage from UV
                break;
            case 'high-protected':
                categoryScores.environment.score += 1;
                categoryScores.environment.factors.push({
                    name: 'High Sun Exposure with Protection',
                    impact: -1,
                    description: 'Regular sun exposure with protection balances benefits and risks'
                });
                break;
            case 'high-unprotected':
                categoryScores.environment.score -= 1;
                categoryScores.environment.factors.push({
                    name: 'High Sun Exposure without Protection',
                    impact: 2,
                    description: 'Excessive unprotected sun exposure accelerates skin aging'
                });
                break;
        }
    }
    
    // Air quality
    if (data['air-quality']) {
        switch(data['air-quality']) {
            case 'poor':
                categoryScores.environment.score -= 2;
                categoryScores.environment.factors.push({
                    name: 'Poor Air Quality',
                    impact: 3,
                    description: 'Poor air quality significantly increases oxidative stress and aging'
                });
                break;
            case 'moderate':
                categoryScores.environment.score -= 1;
                categoryScores.environment.factors.push({
                    name: 'Moderate Air Quality',
                    impact: 1,
                    description: 'Moderate air pollution can slightly increase biological age'
                });
                break;
            case 'good':
                categoryScores.environment.score += 1;
                categoryScores.environment.factors.push({
                    name: 'Good Air Quality',
                    impact: -1,
                    description: 'Clean air reduces respiratory stress and supports healthy aging'
                });
                break;
            case 'excellent':
                categoryScores.environment.score += 2;
                categoryScores.environment.factors.push({
                    name: 'Excellent Air Quality',
                    impact: -2,
                    description: 'Pristine air quality significantly reduces biological age'
                });
                break;
        }
    }
    
    // Screen time
    if (data['screen-time']) {
        switch(data['screen-time']) {
            case 'low':
                categoryScores.environment.score += 1;
                categoryScores.environment.factors.push({
                    name: 'Low Screen Time',
                    impact: -1,
                    description: 'Limited screen exposure supports healthy sleep and reduces eye strain'
                });
                break;
            case 'moderate':
                // No adjustment for moderate screen time
                break;
            case 'high':
                categoryScores.environment.score -= 1;
                categoryScores.environment.factors.push({
                    name: 'High Screen Time',
                    impact: 1,
                    description: 'Extended screen time may disrupt sleep and increase strain'
                });
                break;
            case 'excessive':
                categoryScores.environment.score -= 2;
                categoryScores.environment.factors.push({
                    name: 'Excessive Screen Time',
                    impact: 2,
                    description: 'Excessive screen exposure disrupts circadian rhythm and may accelerate aging'
                });
                break;
        }
    }
    
    // Blue light protection
    if (data['blue-light'] === 'yes') {
        categoryScores.environment.score += 1;
        categoryScores.environment.factors.push({
            name: 'Blue Light Protection',
            impact: -0.5,
            description: 'Using blue light protection helps maintain healthy sleep cycles'
        });
    }
    
    // === MEDICAL FACTORS ===
    
    // Chronic conditions
    const conditions = Array.isArray(data.conditions) ? data.conditions : [];
    if (conditions.length > 0) {
        // Each condition adds approximately 1-3 years to biological age
        const conditionImpact = Math.min(6, conditions.length * 1.5); // Cap the impact at 6 years
        categoryScores.medical.score -= Math.min(3, conditions.length); // Cap the score impact
        categoryScores.medical.factors.push({
            name: 'Chronic Health Conditions',
            impact: conditionImpact,
            description: `Having ${conditions.length} chronic conditions increases biological age`
        });
    }
    
    // Medication use
    if (data.medications) {
        switch(data.medications) {
            case 'one':
                categoryScores.medical.score -= 1;
                categoryScores.medical.factors.push({
                    name: 'Regular Medication Use',
                    impact: 1,
                    description: 'Regular medication use may slightly increase biological age'
                });
                break;
            case 'few':
                categoryScores.medical.score -= 1;
                categoryScores.medical.factors.push({
                    name: 'Multiple Medications',
                    impact: 2,
                    description: 'Using multiple medications may increase biological age'
                });
                break;
            case 'multiple':
                categoryScores.medical.score -= 2;
                categoryScores.medical.factors.push({
                    name: 'Many Medications',
                    impact: 3,
                    description: 'Taking numerous medications can significantly increase biological age'
                });
                break;
        }
    }
    
    // Family longevity
    if (data['family-longevity']) {
        switch(data['family-longevity']) {
            case 'short':
                categoryScores.medical.score -= 1;
                categoryScores.medical.factors.push({
                    name: 'Short Family Longevity',
                    impact: 2,
                    description: 'Family history of shorter lifespan may indicate genetic factors'
                });
                break;
            case 'average':
                // No adjustment for average family longevity
                break;
            case 'long':
                categoryScores.medical.score += 2;
                categoryScores.medical.factors.push({
                    name: 'Long Family Longevity',
                    impact: -3,
                    description: 'Family history of longevity suggests favorable genetic factors'
                });
                break;
        }
    }
    
    // Regular checkups
    if (data.checkups) {
        switch(data.checkups) {
            case 'never':
                categoryScores.medical.score -= 1;
                categoryScores.medical.factors.push({
                    name: 'No Regular Checkups',
                    impact: 1,
                    description: 'Lack of preventive care may allow health issues to progress'
                });
                break;
            case 'regular':
                categoryScores.medical.score += 1;
                categoryScores.medical.factors.push({
                    name: 'Regular Checkups',
                    impact: -1,
                    description: 'Regular preventive care supports early intervention'
                });
                break;
            case 'comprehensive':
                categoryScores.medical.score += 2;
                categoryScores.medical.factors.push({
                    name: 'Comprehensive Health Monitoring',
                    impact: -2,
                    description: 'Detailed health tracking allows for optimal intervention'
                });
                break;
        }
    }
    
    // Supplements
    if (data.supplements) {
        switch(data.supplements) {
            case 'basic':
                // No significant adjustment for basic supplementation
                break;
            case 'moderate':
                categoryScores.medical.score += 1;
                categoryScores.medical.factors.push({
                    name: 'Targeted Supplementation',
                    impact: -1,
                    description: 'Strategic supplement use may address specific deficiencies'
                });
                break;
            case 'extensive':
                categoryScores.medical.score += 1;
                categoryScores.medical.factors.push({
                    name: 'Comprehensive Supplementation',
                    impact: -1.5,
                    description: 'Comprehensive supplement regimen may support cellular health'
                });
                break;
        }
    }
    
    // Calculate overall adjustment to biological age
    let totalAdjustment = 0;
    let allFactors = [];
    
    // Process each category
    Object.keys(categoryScores).forEach(category => {
        const categoryData = categoryScores[category];
        
        // Calculate percentage score for this category (for visualization)
        const percentageScore = Math.max(0, Math.min(100, 
            (categoryData.score / categoryData.maxScore) * 100 + 50)); // Scale to 0-100 with 50 as neutral
        
        // Add category score to total
        // Weight each category appropriately
        const categoryWeights = {
            basic: 0.1,
            diet: 0.2,
            activity: 0.2,
            lifestyle: 0.25,
            environment: 0.1,
            medical: 0.15
        };
        
        // Apply weighted adjustment
        totalAdjustment += categoryData.score * categoryWeights[category];
        
        // Collect all factors
        allFactors = allFactors.concat(categoryData.factors);
        
        // Add score to category data for display
        categoryData.percentageScore = percentageScore;
    });
    
    // Round the adjustment to 1 decimal place
    totalAdjustment = Math.round(totalAdjustment * 10) / 10;
    
    // Calculate biological age (ensure it's at least 1)
    const biologicalAge = Math.max(1, Math.round(chronologicalAge + totalAdjustment));
    
    // Return comprehensive results
    return {
        chronologicalAge: chronologicalAge,
        biologicalAge: biologicalAge,
        difference: biologicalAge - chronologicalAge,
        factors: allFactors,
        categoryScores: categoryScores,
        totalAdjustment: totalAdjustment
    };
}