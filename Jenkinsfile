properties([pipelineTriggers([githubPush()])])

pipeline {
  agent {
    node {
      label 'draupnir'
    }
  }

  stages {
    stage('Build') {
      steps {
        sh '''
          npm ci --only=production
          
          npm run build -- --configuration=production
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          sudo rm -rf /var/www/books/*
          sudo cp -r dist/books-frontend/* /var/www/books/
          
          sudo nginx -t
          sudo nginx -s reload
        '''
      }
    }
  }
}