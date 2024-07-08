---
name: "Land Cover Mapping with Meter-Resolution Satellite Imagery"
tools: [Research, Deep Learning, Python, MA-UNet, Saimese Network, Remote Sensing]
description: This DL course project attepmts improvements on land cover mapping using satellite imagery through unsupervised domain adaptation. Key enhancements include advanced loss functions, extended data augmentation, and a patching strategy for high-resolution images.
style: fill
color: info
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



> The project's code and detailed results are available on GitHub. 

<p class="text-center">
{% include elements/button.html link="https://github.com/p-prakhar/remote_sensing_DL" text="View Project" %}
</p>