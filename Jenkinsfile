properties([pipelineTriggers([githubPush()])])

pipeline {
  agent {
    node {
      label 'draupnir'
    }
  }

  environment {
    FRONTEND_IMAGE_NAME = "books-frontend"
  }

  stages {
    stage('Build') {
      steps {
        script {
          env.GIT_SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()

          sh '''
            echo "Building ${FRONTEND_IMAGE_NAME}:${GIT_SHA}"
            
            docker run --rm \
              -v $PWD:/app \
              -w /app \
              node:24.15.0-alpine \
              sh -c "npm ci && npm run build -- --configuration=production"

            docker run --rm \
              -v /var/www/books:/target \
              -v $PWD/dist/books-frontend:/source \
              alpine \
              sh -c "rm -rf /target/* && cp -r /source/* /target/"
          '''
        }
      }
    }
  }
}