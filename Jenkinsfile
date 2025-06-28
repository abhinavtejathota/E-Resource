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
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }
    }
}
