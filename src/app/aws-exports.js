const awsconfig = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_DvGHEr6Ck",
      userPoolClientId: "2u8briecd2kns33cvdsf7go9ei",
      authenticationFlowType: "USER_PASSWORD_AUTH",
      mandatorySignIn: true,
      loginWith: {
        username: true,
        email: false,
        phone: false
      }
    }
  }
};

export default awsconfig;
