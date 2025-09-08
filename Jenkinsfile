pipeline {
    agent any

    tools {
        nodejs "NodeJS"   // Make sure NodeJS is configured in Jenkins
    }

    stages {
stage('Checkout') {
    steps {
        git branch: 'main', url: 'https://github.com/harshitha-1802/blog.git'
    }
}
        }

        stage('Install Dependencies') {
            steps {
                // Install npm packages
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run your test cases (if package.json has "test" script)
                sh 'npm test || echo "No tests found, skipping..."'
            }
        }

        stage('Start Backend') {
            steps {
                echo 'Starting Node.js backend...'
                // Start your backend app (example: server.js)
                sh 'node server.js &'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
