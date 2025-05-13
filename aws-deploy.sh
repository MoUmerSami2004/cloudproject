#!/bin/bash

# AWS Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="transport-dashboard"
ECS_CLUSTER="transport-dashboard-cluster"
ECS_SERVICE="transport-dashboard-service"
ECS_TASK_DEFINITION="transport-dashboard-task"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR repository if it doesn't exist
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION || aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION

# Build and tag the image
docker build -t $ECR_REPOSITORY ./frontend
docker tag $ECR_REPOSITORY:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Push the image to ECR
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Create ECS cluster if it doesn't exist
aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION || aws ecs create-cluster --cluster-name $ECS_CLUSTER --region $AWS_REGION

# Create task definition
cat > task-definition.json << EOF
{
    "family": "$ECS_TASK_DEFINITION",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "containerDefinitions": [
        {
            "name": "frontend",
            "image": "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest",
            "portMappings": [
                {
                    "containerPort": 3000,
                    "protocol": "tcp"
                }
            ],
            "essential": true,
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/$ECS_TASK_DEFINITION",
                    "awslogs-region": "$AWS_REGION",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}
EOF

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json --region $AWS_REGION

# Create security group if it doesn't exist
SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --filters Name=group-name,Values=transport-dashboard-sg --query 'SecurityGroups[0].GroupId' --output text --region $AWS_REGION)
if [ "$SECURITY_GROUP_ID" == "None" ]; then
    SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name transport-dashboard-sg --description "Security group for transport dashboard" --region $AWS_REGION --query 'GroupId' --output text)
    aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 3000 --cidr 0.0.0.0/0 --region $AWS_REGION
fi

# Create service
aws ecs create-service \
    --cluster $ECS_CLUSTER \
    --service-name $ECS_SERVICE \
    --task-definition $ECS_TASK_DEFINITION \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$(aws ec2 describe-subnets --filters Name=default-for-az,Values=true --query 'Subnets[0].SubnetId' --output text --region $AWS_REGION)],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
    --region $AWS_REGION

echo "Deployment completed! Your application should be available at the public IP of the Fargate task." 