## Building Instructions

### Prerequisites

Before proceeding with the build process, please ensure that you have the following prerequisites installed: - yarn

Additionally, make sure to pull the source code repository.

### Modify environment

Before executing the source code, make sure the following environment variables are set:

- `REACT_APP_CLIENT_GOOGLE_API_KEY`: Client id google for login provider
- `REACT_APP_METADATA_HOST`: Endpoint of Metadata server
- `REACT_APP_FIREBASE_API_KEY`: Firebase config
- `REACT_APP_FIREBASE_APP_ID`: Firebase config

### Build Docker image

1. Pull the source code repository using Git.
2. Navigate to the root directory of the project.
3. Run command
   - yarn
   - yarn build
