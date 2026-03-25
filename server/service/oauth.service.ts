// import axios from 'axios';

// // Add interface
// interface FacebookUserData {
//     id: string;
//     name: string;
//     email: string;
//     picture?: {
//         data: {
//             url: string;
//         };
//     };
// }

// interface OAuthUserData {
//     id: string;
//     name: string;
//     email: string;
//     avatarUrl?: string;
// }

// export class OAuthService {
//     // Facebook OAuth
//     static async verifyFacebookToken(accessToken: string): Promise<OAuthUserData> {
//         try {
//             const response = await axios.get<FacebookUserData>(
//                 `https://graph.facebook.com/v12.0/me`,
//                 {
//                     params: {
//                         access_token: accessToken,
//                         fields: 'id,name,email,picture'
//                     }
//                 }
//             );

//             return {
//                 id: response.data.id,
//                 name: response.data.name,
//                 email: response.data.email,
//                 avatarUrl: response.data.picture?.data?.url
//             };
//         } catch (error) {
//             throw new Error('Invalid Facebook token');
//         }
//     }

//     // Apple OAuth
//     static async verifyAppleToken(idToken: string): Promise<OAuthUserData> {
//         try {
//             // Note: Implement proper Apple JWT verification in production
//             return {
//                 id: 'apple_user_id',
//                 name: 'Apple User',
//                 email: 'user@apple.com'
//                 // avatarUrl is optional, Apple doesn't provide it by default
//             };
//         } catch (error) {
//             throw new Error('Invalid Apple token');
//         }
//     }
// }