import os
import sys
import json
import logging
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity

# Suppress TensorFlow logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')

# Load pre-trained VGG16 model
vgg16_model = VGG16(weights='imagenet', include_top=False)

# Function to extract features from an image using VGG16 model
def extract_features(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    features = vgg16_model.predict(img, verbose=0)  # Suppress progress bar
    features = features.flatten()
    return features

# Function to calculate cosine similarity between two feature vectors
def calculate_similarity(query_features, dataset_features):
    similarity_scores = cosine_similarity(query_features.reshape(1, -1), dataset_features)
    return similarity_scores.flatten()

if __name__ == '__main__':
    
    query_image_path = sys.argv[1]

    dataset_dir = os.path.join(os.path.dirname(query_image_path), '../', 'dataset')

    # Extract features from the query image
    query_features = extract_features(query_image_path)

    dataset_features = []
    similar_images = []


    # Iterate through the dataset folder to extract features from each image
    for filename in os.listdir(dataset_dir):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            img_path = os.path.join(dataset_dir, filename)
            similar_images.append(filename)  # Append just the filename
            features = extract_features(img_path)
            dataset_features.append(features)

    dataset_features = np.array(dataset_features)

    # Calculate similarity scores
    similarity_scores = calculate_similarity(query_features, dataset_features)
    sorted_indices = np.argsort(similarity_scores)[::-1]  # Sort in descending order

    top_results = [similar_images[i] for i in sorted_indices[:3]]  # Retrieve top 3 similar images

    # Output the results as JSON
    results = {'query_image': os.path.basename(query_image_path), 'similar_images': top_results}
    print((results))