pipeline {
    // Run this pipeline on any available Jenkins node
    agent any

    // Define environment variables used during the build
    environment {
        APP_NAME = 'skywatch-backend'
    }

    // Set up build tools (Jenkins must be configured to have these tools installed)
    tools {
        maven 'Maven 3.9' // The name of the Maven installation in Jenkins Global Tool Configuration
        jdk 'JDK 21'      // The name of the JDK 21 installation in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Backend - Test & Build') {
            steps {
                dir('backend') {
                    echo 'Running Maven Test and Package...'
                    sh 'mvn clean package' 
                }
            }
            // If tests fail, Jenkins will save the test results so you can view them in the UI
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Backend - Docker Image Build') {
            steps {
                dir('backend') {
                    echo 'Building Docker Image...'
                    sh "docker build -t ${APP_NAME}:latest ."
                }
            }
        }
    }
}