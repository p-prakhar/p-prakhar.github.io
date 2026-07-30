---
name: "Land Cover Mapping with Meter-Resolution Satellite Imagery"
order: 70
tools:
  - Python
  - Deep learning
  - MA-UNet
  - Siamese networks
  - Remote sensing
repository_url: "https://github.com/p-prakhar/remote_sensing_DL"
description: >-
  A deep-learning course project exploring unsupervised domain adaptation for
  high-resolution land-cover mapping with new losses, augmentation, and image
  patching.
---

# Unsupervised Domain Adaptation for Land Cover Mapping

## Overview
This research *enhances land cover mapping* using satellite imagery through **unsupervised domain adaptation**, addressing the challenge of limited labeled data in target regions.

Original research can be found [here](https://arxiv.org/abs/2209.00727)

## Problem Statement
- Land cover mapping is crucial but labeling data for every region is resource-intensive
- Need to transfer knowledge from labeled *(source)* to unlabeled *(target)* datasets effectively

## Approach

### 1. Dataset
- Utilized portion of **"Five-Billion-Pixels"** dataset
- High-resolution satellite images with *24 land cover categories*

### 2. Model Architecture
- **U-Net** based architecture for semantic segmentation

### 3. Unsupervised Domain Adaptation
- *Siamese network* with two branches (source and target domains)
- Adapts model to unlabeled target data

### 4. Dynamic Pseudo-Labeling
- Gradually increases pseudo-labeled target pixels over training epochs

### 5. Key Improvements
- Advanced loss functions (**Dice Loss**, **Combined Focal-Dice Loss**)
- Extended data augmentation techniques
- Patching strategy for high-resolution images

## Results
- Tested by training on one city (source) and predicting on different cities (target)
- *Promising results* on small subsets, especially with new loss functions and data augmentation

## Goal
Develop an **effective, adaptable method** for land cover mapping across different geographical regions with limited labeled data.



The [project code](https://github.com/p-prakhar/remote_sensing_DL) and
experiment details are available on GitHub.