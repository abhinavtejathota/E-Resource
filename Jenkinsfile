pipeline {
    agent any

    tools {
        nodejs "NodeJS" // Name of the NodeJS tool you configured in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/abhinavtejathota/E-Resource.git'
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
                bat 'npm test -- --watchAll=false'
            }
        }
    }
}
