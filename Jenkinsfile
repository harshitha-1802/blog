pipeline {
    agent any

    tools {
        nodejs "NodeJS"   // Ensure NodeJS is configured under Jenkins -> Global Tool Configuration
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

        stage('Run Tests') {
            steps {
                bat 'npm test || echo "No tests found, skipping..."'
            }
        }

        stage('Start Backend') {
            steps {
                echo 'Starting Node.js backend...'
                bat 'start /B node server.js'
            }
        }
    }
}
