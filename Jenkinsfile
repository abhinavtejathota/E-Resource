pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/abhinavtejathota/E-Resource.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Running build step...'
                // Add actual build commands here, e.g., npm install, mvn clean install, etc.
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your testing commands here
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the project...'
                // Add deploy steps here
            }
        }
    }
}
