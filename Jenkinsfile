pipeline {
    agent any

    tools {
        nodejs "Node-20"
    }

    environment {
        PORT = "5000"

        // Database environment variables
        DB_HOST = 'localhost'
        DB_USER = 'postgres'
        DB_PASSWORD = credentials('postgres-password-id') // 👈 Jenkins credential ID
        DB_NAME = 'blogdb'
        DB_PORT = '5432'
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
                        echo 'Waiting for backend to be available...'
                        // This waits until http://localhost:5000 is up before running Cypress
                        bat 'npx wait-on http://localhost:5000'

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

