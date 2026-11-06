# ☁️ Kanak Digifex
### Container Orchestration with Kubernetes on AWS

**Deploying and managing a Node.js application using Docker, Kubernetes, and AWS Cloud Services.**

![AWS](https://img.shields.io/badge/Cloud-AWS-orange?logo=amazonaws)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?logo=kubernetes)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=nodedotjs)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)
![Status](https://img.shields.io/badge/Status-Deployed-success)

</div>

---

## 📌 Project Overview

Kanak Digifex is a cloud deployment project that demonstrates how to containerize, deploy, and manage a web application using **Docker and Kubernetes on Amazon Web Services (AWS)**.

The Node.js application is containerized using Docker and stored in Amazon Elastic Container Registry (ECR). It is deployed on Amazon Elastic Kubernetes Service (EKS), where Kubernetes manages the application workloads.

An AWS Application Load Balancer (ALB) provides public access to the application, while Amazon RDS for MySQL provides managed database services within the private network.

The project demonstrates practical implementation of cloud networking, containerization, Kubernetes orchestration, load balancing, database connectivity, and AWS infrastructure management.

## 🏗️ AWS Architecture

### Application Traffic Flow

```text
                    INTERNET
                        |
                        |
                 Website Visitors
                        |
                        v
             Application Load Balancer
                    (HTTP :80)
                        |
                        v
              Kubernetes Ingress
                        |
                        v
                Kubernetes Service
                    (Port 2000)
                        |
             +----------+----------+
             |                     |
             v                     v
        Application Pod       Application Pod
        (Node.js / Express)   (Node.js / Express)
             |                     |
             +----------+----------+
                        |
                        v
                Amazon RDS MySQL
                   (Port 3306)


              AWS CLOUD INFRASTRUCTURE
              ========================

              Amazon VPC (10.0.0.0/16)

              PUBLIC SUBNETS
              - Application Load Balancer
              - Internet Gateway
              - NAT Gateway

              PRIVATE SUBNETS
              - EKS Worker Nodes
              - Kubernetes Workloads
              - Amazon RDS Database

              CONTAINER IMAGE MANAGEMENT
              - Amazon ECR
              - Docker Image
```

### Architecture Explanation

1. **Amazon VPC:** Provides an isolated network environment for the project.
2. **Public Subnets:** Host internet-facing infrastructure such as the Application Load Balancer.
3. **Private Subnets:** Host application workloads and the RDS database.
4. **Internet Gateway:** Provides internet connectivity to public subnet resources.
5. **NAT Gateway:** Allows private subnet resources to access external services when required.
6. **Amazon EKS:** Provides the managed Kubernetes control plane.
7. **EKS Managed Node Group:** Provides compute resources for Kubernetes workloads.
8. **Amazon ECR:** Stores the Docker container image.
9. **AWS Load Balancer Controller:** Connects Kubernetes Ingress resources with AWS load balancing.
10. **Application Load Balancer:** Receives public HTTP requests and forwards traffic to the application.
11. **Amazon RDS:** Hosts the MySQL database used by the application.

## 🛠️ Technologies & AWS Services

| Technology / Service | Purpose |
|---|---|
| AWS VPC | Network isolation |
| Public & Private Subnets | Network segmentation |
| Internet Gateway | Public internet connectivity |
| NAT Gateway | Outbound connectivity for private resources |
| Amazon EKS | Kubernetes cluster management |
| EKS Managed Node Group | Kubernetes worker compute |
| Docker | Application containerization |
| Amazon ECR | Docker image storage |
| Kubernetes | Container orchestration |
| Kubernetes Deployment | Application pod management |
| Kubernetes Service | Internal application networking |
| Kubernetes Ingress | HTTP traffic routing |
| AWS Load Balancer Controller | ALB integration with Kubernetes |
| Application Load Balancer | Public application access |
| Amazon RDS MySQL | Managed relational database |
| AWS IAM | Identity and access management |
| GitHub Actions | Continuous integration checks |
| Node.js & Express.js | Backend application |
| EJS | Application view rendering |

## ☸️ Kubernetes Implementation

The application is deployed on Amazon EKS using Kubernetes resources.

| Kubernetes Resource | Name | Responsibility |
|---|---|---|
| Deployment | `kanak-digifex-app` | Manages application pods |
| Service | `kanak-digifex-service` | Exposes application internally |
| Secret | `kanak-db-secret` | Stores database connection configuration |
| Ingress | `kanak-digifex-ingress` | Routes incoming HTTP traffic |

### Application Networking

- Application container port: `2000`
- Kubernetes Service type: `ClusterIP`
- ALB listener port: `80`
- Database port: `3306`
- Ingress class: `alb`
- ALB scheme: `internet-facing`
- ALB target type: `ip`

## 🗄️ Database Integration

The application uses Amazon RDS for MySQL as its managed database service.

Database configuration:

- Database engine: MySQL
- Database name: `kanak_digifex`
- Database connectivity: Private VPC networking
- Application-to-database communication: TCP port `3306`
- Database configuration: Kubernetes Secret

The original application database was migrated from an SQL backup into Amazon RDS.

The database tables were verified, the Kubernetes Secret was updated with the correct database configuration, and the application deployment was restarted.

**Result:** The application successfully connected to Amazon RDS and the website became accessible.

## 🚀 Deployment Workflow

The following workflow was implemented during the project:

1. Created the AWS VPC and configured public and private subnets.
2. Configured Internet Gateway, NAT Gateway, and route tables.
3. Created the Amazon EKS cluster.
4. Configured the EKS managed node group.
5. Configured required EKS networking add-ons.
6. Containerized the Node.js application using Docker.
7. Created an Amazon ECR repository.
8. Built and pushed the Docker image to Amazon ECR.
9. Configured IAM permissions and the EKS OIDC provider.
10. Installed the AWS Load Balancer Controller.
11. Created Kubernetes Deployment, Service, Secret, and Ingress resources.
12. Created Amazon RDS for MySQL.
13. Migrated the application database into RDS.
14. Configured private database connectivity.
15. Updated the Kubernetes database Secret.
16. Restarted the application deployment.
17. Verified successful website access through the public Application Load Balancer.

## 🌐 Deployment Information

| Configuration | Value |
|---|---|
| AWS Region | `ap-south-1` (Mumbai) |
| EKS Cluster | `project-eks-cluster` |
| EKS Node Group | `eks-note-group` |
| ECR Repository | `kanak-digifex-app` |
| Docker Image Version | `2.0` |
| Kubernetes Deployment | `kanak-digifex-app` |
| Kubernetes Service | `kanak-digifex-service` |
| Kubernetes Ingress | `kanak-digifex-ingress` |
| RDS Instance | `project-database` |
| Database | `kanak_digifex` |

### Live Application

The application was successfully deployed and verified through the AWS Application Load Balancer.

**[🌐 Open Kanak Digifex Website](http://k8s-default-kanakdig-2c368c08d2-1982443665.ap-south-1.elb.amazonaws.com/)**

*Note: This is an AWS-generated HTTP endpoint. It may change if the load balancer is recreated.*

## 🔄 Continuous Integration

GitHub Actions is configured to perform basic CI checks whenever code is pushed to or a pull request targets the `main` branch.

The workflow performs:

- Repository checkout.
- Node.js 20 setup.
- Dependency installation using `npm ci`.
- JavaScript syntax validation.

**Note:** The current workflow performs code validation only. Docker image publishing and automatic EKS deployment are not configured in this workflow.

## 📂 Project Structure

```text
Container-Orchestration-with-Kubernetes-using-AWS/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── architecture/
│   └── aws-eks-architecture.html
│
├── public/
│   └── Application static assets
│
├── routes/
│   └── Application routes
│
├── views/
│   └── EJS templates
│
├── connection.js
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 🎯 Project Outcomes

- Successfully containerized a Node.js application using Docker.
- Deployed the application on Amazon EKS.
- Managed container images using Amazon ECR.
- Implemented Kubernetes Deployment, Service, and Ingress resources.
- Integrated Kubernetes with AWS Application Load Balancer.
- Configured AWS VPC networking with public and private subnets.
- Deployed Amazon RDS for MySQL.
- Migrated an existing application database into RDS.
- Established private database connectivity between EKS workloads and RDS.
- Configured AWS IAM permissions and the AWS Load Balancer Controller.
- Implemented GitHub Actions for basic CI validation.
- Successfully verified public website accessibility.

## 🔐 Security Considerations

- Amazon RDS is configured without public accessibility.
- Database connectivity is restricted through security group rules.
- Database configuration is supplied through Kubernetes Secrets.
- Credentials and sensitive configuration should never be committed to GitHub.
- Production deployments should use HTTPS, managed secret storage, secure session storage, and regularly rotated credentials.

## 📚 Key Concepts Learned

`AWS Cloud` · `Amazon EKS` · `Kubernetes` · `Docker` · `Amazon ECR` · `VPC Networking` · `IAM` · `Ingress` · `Application Load Balancer` · `Amazon RDS` · `MySQL` · `GitHub Actions` · `Container Orchestration`

---

<div align="center">

### Built as a hands-on AWS Cloud & Kubernetes project.

**Containerization | Orchestration | Networking | Database Integration | Cloud Deployment**

</div>
