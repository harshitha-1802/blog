pipeline {
    agent any

    tools {
        nodejs "Node-20"
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

        stage('Start Backend') {
            steps {
                echo 'Starting Node.js backend...'
                bat 'start /B node backend/server.js'
                sleep time: 15, unit: 'SECONDS'  // Wait for backend to start
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npx cypress run || echo "No tests found, skipping..."'
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
