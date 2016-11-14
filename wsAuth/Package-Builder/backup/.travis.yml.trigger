# .travis.yml for Kitura Swift Packages

sudo: true

# whitelist
branches:
  only:
    - master
    - develop

before_install:
  - git submodule update --init --remote --merge --recursive

script:
  - echo "About to trigger build for the Kitura repository..."
  - cd Kitura-Build && ./kitura-build-trigger.sh $TRAVIS_BRANCH $TRAVIS_TOKEN
  - echo "Request to build Kitura sent!"
