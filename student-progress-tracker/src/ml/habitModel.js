// src/ml/habitModel.js

import * as tf from '@tensorflow/tfjs';

let model = null;

export function createModel() {
  model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [5],
      units: 8,
      activation: 'relu',
    })
  );

  model.add(
    tf.layers.dense({
      units: 1,
      activation: 'sigmoid',
    })
  );

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export async function trainModel(xs, ys) {
  if (!model) createModel();

  const xTensor = tf.tensor2d(xs);
  const yTensor = tf.tensor2d(ys, [ys.length, 1]);

  await model.fit(xTensor, yTensor, {
    epochs: 30,
    batchSize: 8,
    shuffle: true,
  });

  xTensor.dispose();
  yTensor.dispose();
}

export function predictTomorrow(features) {
  if (!model) return 0.5;

  const input = tf.tensor2d([features]);
  const prediction = model.predict(input);
  const value = prediction.dataSync()[0];

  input.dispose();
  prediction.dispose();

  return value;
}
