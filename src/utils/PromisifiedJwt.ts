import { sign, verify } from 'jsonwebtoken';

export const asyncVerify = (token: string, secret: string, options?: any) =>
  new Promise((resolve, reject) => {
    verify(token, secret, options, (errors, decodedPayload) => {
      if (errors) {
        reject(errors);
      }
      resolve(decodedPayload);
    });
  });

export const asyncSign = (payload: any, secret: string, options?: any) =>
  new Promise((resolve, reject) => {
    sign(payload, secret, options, (errors, encodedPayload) => {
      if (errors) {
        reject(errors);
      }
      resolve(encodedPayload);
    });
  });
