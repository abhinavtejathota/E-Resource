pipeline {
    agent any

    tools {
        nodejs "NodeJS" // must match the name in Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/abhinavtejathota/E-Resource.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test -- --watchAll=false --passWithNoTests'
            }
        }
    }
}
post {
    always {
        cleanWs()
    }
}
