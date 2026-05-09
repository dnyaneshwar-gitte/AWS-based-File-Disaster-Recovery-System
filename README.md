🚀 AWS Disaster Recovery System

📌 Overview

This project demonstrates a cloud-based Disaster Recovery (DR) solution using AWS S3 with cross-region backup. It ensures data durability, availability, and recovery by replicating files from a primary region to a secondary region.

The system is designed to simulate real-world disaster recovery scenarios, protecting data against:

Accidental deletion
Data corruption
Regional outages
System failures

🎯 Objective

The goal of this project is to:

Build a reliable and scalable backup & recovery system
Ensure data redundancy across regions
Enable quick recovery in case of failure
Optimize storage using lifecycle policies
Demonstrate real-world AWS DR architecture

🏗️ Architecture

Primary Region: Mumbai (ap-south-1)
Backup Region: US East (us-east-1)

        User / Application
                |
                v
     Primary S3 Bucket (Mumbai)
                |
        Cross-Region Replication
                |
                v
     Backup S3 Bucket (US East)
     
🛠️ AWS Services Used
Amazon S3 – Object storage
S3 Versioning – Protect from accidental deletion
S3 Lifecycle Policies – Cost optimization
Cross-Region Replication (CRR) – Backup across regions
IAM Roles & Policies – Secure access control
AWS CLI – Automation and testing

⚙️ Prerequisites
AWS Account
AWS CLI configured (aws configure)
Basic knowledge of S3 and IAM
Required permissions:
S3 Full Access
IAM Role creation

🚧 Step-by-Step Implementation
1️⃣ Create Primary S3 Bucket (Mumbai)

aws s3 mb s3://dr-primary-bucket --region ap-south-1

2️⃣ Create Backup S3 Bucket (US East)

aws s3 mb s3://dr-backup-bucket --region us-east-1

3️⃣ Enable Versioning (Important)

aws s3api put-bucket-versioning \
  --bucket dr-primary-bucket \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-versioning \
  --bucket dr-backup-bucket \
  --versioning-configuration Status=Enabled
  
4️⃣ Configure Lifecycle Policy (Cost Optimization)

Create a file lifecycle.json:

{
  "Rules": [
    {
      "ID": "MoveToIAAndGlacier",
      "Status": "Enabled",
      "Filter": {},
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}

Apply:

aws s3api put-bucket-lifecycle-configuration \
  --bucket dr-primary-bucket \
  --lifecycle-configuration file://lifecycle.json
  
5️⃣ Configure Cross-Region Replication (CRR)

Step 1: Create IAM Role for replication
Allow S3 to replicate objects from primary to backup bucket
Step 2: Attach policy to allow:
Read from primary bucket
Write to backup bucket
Step 3: Enable replication in S3 console or CLI

Replication flow:

Primary Bucket (Mumbai)
        ↓
Backup Bucket (US East)
🧪 Testing the System
Upload file

aws s3 cp test.txt s3://dr-primary-bucket/

Verify in Primary Bucket

aws s3 ls s3://dr-primary-bucket/

Verify Replication in Backup Bucket

aws s3 ls s3://dr-backup-bucket/

Simulate Disaster Recovery
Delete file from primary bucket
Recover from backup bucket

aws s3 cp s3://dr-backup-bucket/test.txt .

🔐 Security Features
IAM role-based access control
No public bucket access
Versioning enabled for recovery
Controlled replication permissions

📊 Key Features
✅ Cross-region backup (Mumbai → US East)
✅ Automatic replication
✅ Data durability and redundancy
✅ Lifecycle-based cost optimization
✅ Versioning for recovery
✅ Real-world DR simulation
