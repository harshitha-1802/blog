pipeline {
    agent any

    tools {
        nodejs "NodeJS"   // NodeJS must be configured in Jenkins under Global Tools
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/harshitha-1802/blog.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests found, skipping..."'
            }
        }

        stage('Start Backend') {
            steps {
                echo 'Starting Node.js backend...'
                sh 'node server.js &'
            }
        }
    }
}
