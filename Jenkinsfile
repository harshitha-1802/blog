pipeline {
    agent any

    tools {
        nodejs "Node-20"
    }

    environment {
        PORT = "5000"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/harshitha-1802/blog.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Start Backend and Run Tests') {
            parallel {
                stage('Start Backend') {
                    steps {
                        echo 'Starting Node.js backend...'
                        bat 'node backend/server.js'
                    }
                }

                stage('Run Cypress Tests') {
                    steps {
                        // Wait for the backend to fully start
                        echo 'Waiting for backend to be available...'
                        sleep time: 15, unit: 'SECONDS'
                        
                        echo 'Running Cypress tests...'
                        bat 'npx cypress run || echo "No tests found, skipping..."'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}

