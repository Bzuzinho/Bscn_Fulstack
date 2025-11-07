// Ambient/patch declarations to silence missing type errors for some packages
// Add more declarations here when other modules report missing types.

declare module "@uppy/core" {
  const whatever: any;
  export default whatever;
  export type UploadResult = any;
}

declare module "@uppy/react/dashboard-modal" {
  const DashboardModal: any;
  export default DashboardModal;
}

declare module "@uppy/aws-s3" {
  const AwsS3: any;
  export default AwsS3;
}

declare module "openid-client/passport" {
  const passportThing: any;
  export default passportThing;
  export type VerifyFunction = any;
  export const Strategy: any;
}

declare module "bcryptjs" {
  const bcrypt: any;
  export default bcrypt;
}

// Fallback for other packages lacking types
declare module "@uppy/react/*" {
  const x: any;
  export default x;
}

