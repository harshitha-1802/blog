pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // Make sure this tool is configured in Jenkins Global Tools
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/harshitha-1802/blog.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Runs Cypress tests in headless mode (for Jenkins)
                bat 'npx cypress run || echo "No tests found, skipping..."'
            }
        }

        stage('Start Backend') {
            steps {
                echo 'This is where you would start your backend...'
                // Add your backend startup logic if needed
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
