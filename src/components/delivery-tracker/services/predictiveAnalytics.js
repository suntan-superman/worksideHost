import * as tf from "@tensorflow/tfjs";

class PredictiveAnalytics {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.trainingInProgress = false;
  }

  async initialize() {
    try {
      // Try to load pre-trained model
      this.model = await tf.loadLayersModel('/models/delivery-prediction.json');
      this.isModelLoaded = true;
    } catch {
      // Create new model if no pre-trained model exists
      await this.createModel();
    }
  }

  async createModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 12, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mse']
    });

    this.isModelLoaded = true;
  }

  async predictDeliveryTime(features) {
    if (!this.isModelLoaded) {
      await this.initialize();
    }

    const tensor = tf.tensor2d([this.normalizeFeatures(features)]);
    const prediction = await this.model.predict(tensor).data();
    tensor.dispose();

    return Math.round(prediction[0]);
  }

  normalizeFeatures(features) {
    // Normalize input features based on historical data ranges
    return [
      features.distance / 100, // Normalize distance
      features.traffic / 10,   // Traffic score
      features.timeOfDay / 24, // Hour of day
      features.dayOfWeek / 7,  // Day of week
      features.weather / 5,    // Weather condition score
      features.vehicleLoad / 100 // Vehicle load percentage
    ];
  }

  async trainModel(historicalData) {
    if (this.trainingInProgress) return;
    this.trainingInProgress = true;

    try {
      const { features, labels } = this.prepareTrainingData(historicalData);
      
      await this.model.fit(features, labels, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
          }
        }
      });

      // Save trained model
      await this.model.save('localstorage://delivery-prediction');
    } finally {
      this.trainingInProgress = false;
    }
  }

  prepareTrainingData(historicalData) {
    const features = [];
    const labels = [];

    historicalData.forEach(record => {
      features.push(this.normalizeFeatures(record.conditions));
      labels.push(record.actualDeliveryTime / 60); // Convert to hours
    });

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor1d(labels)
    };
  }
}

export const predictiveAnalytics = new PredictiveAnalytics(); 