/* eslint-disable */
// SECURITY NOTE: this public repo intentionally omits any AppSync API key.
// Re-run `amplify push && amplify pull` after backend auth changes so the
// generated output matches the Cognito-only configuration.

const awsmobile = {
    "aws_project_region": "us-east-1",
    "aws_cognito_identity_pool_id": "us-east-1:287c5ace-4b7e-4605-8d8e-ee267cafdd03",
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "us-east-1_TVbXakMph",
    "aws_user_pools_web_client_id": "1buke4r1a7g9hb3vrg1j4u0u6e",
    "oauth": {},
    "aws_cognito_username_attributes": [
        "EMAIL"
    ],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ],
    "aws_appsync_graphqlEndpoint": "https://q6pa4uu345ashio6gzdyoeck6a.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS"
};


export default awsmobile;
