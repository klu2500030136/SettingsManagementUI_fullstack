const { pipeline } = require('@xenova/transformers');

class EmbeddingService {
  constructor() {
    this.extractor = null;
    this.initPromise = this.init();
  }

  async init() {
    if (!this.extractor) {
      // Load the Xenova/all-MiniLM-L6-v2 model
      this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
  }

  /**
   * Generates a 384-dimensional embedding for the given text.
   * @param {string} text - The text to embed.
   * @returns {Promise<number[]>} - The vector representation.
   */
  async generateEmbedding(text) {
    await this.initPromise;
    const output = await this.extractor(text, { pooling: 'mean', normalize: true });
    // Convert Float32Array to standard JS array
    return Array.from(output.data);
  }
}

module.exports = new EmbeddingService();
