""" This file will be used for generating trial sequences """

import numpy as np
import matplotlib.pyplot as plt
import logging
import json

def _normRand(min, max, samples=1, mean=0, sd=1) -> np.ndarray:
  """
  Generate a number from a normal distribution specified by parameters
  :param min: minimum value
  :param max: maximum value
  :param samples: number of samples
  :param mean: mean of distribution
  :param sd: standard deviation of distribution
  :return: array containing values
  """
  gen = np.zeros((samples))
  for i in range(samples):
    gen[i] = np.round(np.random.normal(loc=mean, scale=sd))
  return np.clip(gen, min, max)

def _dump(path: str, data: dict):
  """
  Dump the data values to a JSON file
  :param path: path to the JSON file, includes .json exension
  :param data: data (as dictionary) to encode into the file
  :return: None
  """
  with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
  # Set the logging level
  logging.getLogger().setLevel(logging.INFO)

  # Reset the seed
  np.random.seed(seed=123)

  # Generate a set of normally distributed random integers
  gen = _normRand(
    min=3,
    max=7,
    samples=250,
    mean=5.0,
    sd=np.math.sqrt(2.0)
  )

  # Log the mean and SD
  logging.info('n: %d', gen.size)
  logging.info('Mean: %f', np.mean(gen))
  logging.info('Standard deviation: %f', np.std(gen))

  # Show the plot
  if (logging.getLogger().level == logging.DEBUG):
    plt.hist(gen)
    plt.show()

  # Dump the data to the trial JSON file
  # Get the first random number:
  data = {
    'num': gen[0]
  }
  _dump('./trials.json', data)
