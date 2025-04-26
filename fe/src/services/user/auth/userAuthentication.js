import request from '../../../utils/request.js';

export class UserAuthenticationService {
  static login = (data) => {
    return request({
      url: 'users/login',
      method: 'post',
      Headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: data
    });
  };
  static signUp = (data) => {
    return request({
      url: 'users/register',
      method: 'post',
      Headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      data: data
    });
  };

  // static register = (data) => {
  //   return request({
  //     url: '/api/v1/user/register',
  //     method: 'post',
  //     Headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  //     data: data
  //   });
  // };
}
