const DEFAULT_COST = 1;

function getRequiredCredits(modelName, inputs = {}) {
  const numImages = Number(inputs.num_images) || 1;
  const resolution = inputs.resolution || '1k';
  const mode = inputs.generation_mode || inputs.mode || 'balanced';

  switch (modelName) {
    case 'tryon-max':
    case 'tryon-v1.6': {
      const creditMap = {
        balanced: { '1k': 2, '2k': 3, '4k': 4 },
        quality: { '1k': 3, '2k': 4, '4k': 5 },
      };
      const base = creditMap[mode]?.[resolution] || 2;
      const modelCount = Array.isArray(inputs.model_image)
        ? inputs.model_image.length
        : inputs.model_image ? 1 : 1;
      return base * numImages * modelCount;
    }
    case 'product-to-model':
      return 5 * numImages;
    case 'face-to-model':
    case 'model-create':
      return 3 * numImages;
    case 'model-swap':
      return 4;
    case 'edit': {
      const creditMap = {
        performance: { '1k': 1, '2k': 2, '4k': 3 },
        balanced: { '1k': 2, '2k': 3, '4k': 4 },
        quality: { '1k': 3, '2k': 4, '4k': 5 },
      };
      return (creditMap[mode]?.[resolution] || 1) * numImages;
    }
    case 'reframe':
    case 'background-remove':
      return 1;
    case 'image-to-video': {
      const duration = Number(inputs.duration) || 5;
      const videoMap = {
        5: { '720p': 6, '1080p': 8 },
        10: { '720p': 10, '1080p': 14 },
      };
      return videoMap[duration]?.[resolution] || 6;
    }
    default:
      return DEFAULT_COST;
  }
}

module.exports = { getRequiredCredits };
