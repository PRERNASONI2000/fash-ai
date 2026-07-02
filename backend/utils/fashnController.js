// utils/fashnController.js //Generic Fashn Controller
const Fashn = require('fashn');
const Generation = require('../models/Generation');

// Fashn Client Initialize करो
const fashnClient = new Fashn({ apiKey: process.env.FASHN_API_KEY });

// ये Function हर Model के लिए common है
const handleGeneration = async (req, res) => {
  try {
    const { model_name } = req.params;
    const userId = req.user?.id; // middleware से आएगा (auth वाला)
    const inputs = req.body;

    // 1. Inputs Validate करो (हर Model के लिए अलग)
    const validationError = validateInputs(model_name, inputs);
    if (validationError) {
      return res.status(400).json({ error: true, message: validationError });
    }

    // 2. Database में Entry बनाओ - Status: pending
    const generation = await Generation.create({
      userId: userId || null, // Guest users के लिए null
      model_name,
      inputs: new Map(Object.entries(inputs)), // Object को Map में convert करो
      status: 'pending'
    });

    // 3. Fashn API Call करो (SDK के साथ - automatically polling)
    const response = await fashnClient.predictions.subscribe({
      model_name: model_name,
      inputs: inputs, // सीधे inputs object पास करो
    });

    // 4. Response Check करो
    if (response.status !== 'completed') {
      // Update status to failed
      await Generation.findByIdAndUpdate(generation._id, {
        status: 'failed',
        error_message: response.error?.message || 'Generation failed',
        completed_at: Date.now()
      });

      return res.status(400).json({
        error: true,
        message: response.error?.message || 'Generation failed'
      });
    }

    // 5. Success - Update database with output
    const outputUrl = response.output?.[0] || null;
    const creditsUsed = calculateCredits(model_name, inputs); // अपना logic लगाओ

    await Generation.findByIdAndUpdate(generation._id, {
      output: outputUrl,
      status: 'completed',
      credits_used: creditsUsed,
      completed_at: Date.now()
    });

    // 6. Frontend को response भेजो
    return res.json({
      success: true,
      output: outputUrl,
      generation_id: generation._id,
      credits_used: creditsUsed
    });

  } catch (error) {
    console.error('Fashn Generation Error:', error);
    return res.status(500).json({
      error: true,
      message: 'Internal server error during generation'
    });
  }
};

// ये Function हर Model के लिए inputs validate करेगा
function validateInputs(model_name, inputs) {
  const requiredFields = {
    'tryon-max': ['model_image', 'garment_image'],
    'tryon-v1.6': ['model_image', 'garment_image'],
    'product-to-model': ['product_image'],
    'face-to-model': ['face_image'],
    'model-create': ['prompt'],
    'model-swap': ['model_image', 'swap_image'],
    'edit': ['image', 'prompt'],
    'reframe': ['image'],
    'image-to-video': ['image'],
    'background-remove': ['image']
  };

  const required = requiredFields[model_name];
  if (!required) return 'Invalid model name';

  for (const field of required) {
    if (!inputs[field]) {
      return `Missing required field: ${field} for ${model_name}`;
    }
  }

  return null; // No error
}

// ये Function credits calculate करेगा (optional)
function calculateCredits(model_name, inputs) {
  // Fashn API documentation के अनुसार credits calculate करो
  // Example: 1-5 credits per image depending on resolution
  return 1; // Default, adjust करो
}

module.exports = { handleGeneration };